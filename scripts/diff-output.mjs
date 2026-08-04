#!/usr/bin/env node
/**
 * diff-output.mjs — compare the built site against a git reference.
 *
 * Phase 1 needs proof that moving to Eleventy changed nothing. Phase 1.5 needs
 * the opposite: a readable list of what changed on purpose. Same tool, both jobs.
 *
 *   node scripts/diff-output.mjs                 # compare _site/ against main
 *   node scripts/diff-output.mjs --ref e0501a6   # ...against a specific commit
 *   node scripts/diff-output.mjs --context 5     # more surrounding tokens
 *   node scripts/diff-output.mjs --max 200       # more differences per file
 *
 * Exit code 0 when every page matches, 1 otherwise — so CI can gate on it.
 *
 * What "matches" means here: identical after normalising the things that carry
 * no meaning in HTML. Indentation, line breaks and blank lines are collapsed,
 * comments are dropped, and character references are decoded so that a bare "&"
 * and "&amp;" compare equal. Everything else — tag order, attributes, attribute
 * values, text — must be identical.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const siteDir = join(repoRoot, "_site");

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const ref = flag("ref", "main");
const context = Number(flag("context", 2));
const maxPerFile = Number(flag("max", 40));

/* ------------------------------------------------------------------ *
 * Normalisation
 * ------------------------------------------------------------------ */

// &nbsp; is deliberately absent: it is meaningful whitespace, and decoding it
// would let the whitespace collapse below eat it.
const NAMED = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  "#39": "'",
  "#x27": "'",
};

function decodeEntities(s) {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (whole, body) => {
    const key = body.toLowerCase();
    if (key in NAMED) return NAMED[key];
    if (key.startsWith("#x")) return String.fromCodePoint(parseInt(key.slice(2), 16));
    if (key.startsWith("#")) return String.fromCodePoint(parseInt(key.slice(1), 10));
    return whole; // unknown entity: leave it alone so a real difference still shows
  });
}

/**
 * Split a document into a list of comparable tokens: one per tag, one per run
 * of text. Whitespace is collapsed, comments removed, entities decoded.
 */
function tokenize(html) {
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, "");
  const tokens = [];

  // Tags and text, in document order.
  const re = /<[^>]*>|[^<]+/g;
  let m;
  while ((m = re.exec(withoutComments)) !== null) {
    const raw = m[0];
    if (raw.startsWith("<")) {
      // Collapse whitespace inside the tag, but keep attribute values intact.
      const tag = raw.replace(/\s+/g, " ").replace(/\s*\/?>$/, (end) => end.trim());
      tokens.push(decodeEntities(tag));
    } else {
      const text = decodeEntities(raw).replace(/\s+/g, " ").trim();
      if (text) tokens.push(text);
    }
  }
  return tokens;
}

/* ------------------------------------------------------------------ *
 * Diff (plain LCS over the token lists)
 * ------------------------------------------------------------------ */

function diffTokens(a, b) {
  const n = a.length;
  const m = b.length;

  // Trim the common head and tail first; on a matching page this leaves nothing
  // to do and keeps the LCS table small on the pages that do differ.
  let head = 0;
  while (head < n && head < m && a[head] === b[head]) head++;
  let tail = 0;
  while (tail < n - head && tail < m - head && a[n - 1 - tail] === b[m - 1 - tail]) tail++;

  const aMid = a.slice(head, n - tail);
  const bMid = b.slice(head, m - tail);
  if (aMid.length === 0 && bMid.length === 0) return [];

  const rows = aMid.length + 1;
  const cols = bMid.length + 1;
  const table = Array.from({ length: rows }, () => new Uint32Array(cols));
  for (let i = aMid.length - 1; i >= 0; i--) {
    for (let j = bMid.length - 1; j >= 0; j--) {
      table[i][j] =
        aMid[i] === bMid[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const changes = [];
  let i = 0;
  let j = 0;
  while (i < aMid.length && j < bMid.length) {
    if (aMid[i] === bMid[j]) {
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      changes.push({ kind: "removed", token: aMid[i], at: head + i });
      i++;
    } else {
      changes.push({ kind: "added", token: bMid[j], at: head + j });
      j++;
    }
  }
  while (i < aMid.length) changes.push({ kind: "removed", token: aMid[i], at: head + i++ });
  while (j < bMid.length) changes.push({ kind: "added", token: bMid[j], at: head + j++ });

  return changes;
}

/* ------------------------------------------------------------------ *
 * Files
 * ------------------------------------------------------------------ */

function htmlFilesUnder(dir) {
  const out = [];
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".html")) out.push(full);
    }
  };
  walk(dir);
  return out.sort();
}

function fileAtRef(gitPath) {
  try {
    return execFileSync("git", ["show", `${ref}:${gitPath}`], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

let built;
try {
  built = htmlFilesUnder(siteDir);
} catch {
  console.error(`No _site/ directory. Run the build first:\n  npx @11ty/eleventy`);
  process.exit(2);
}

console.log(`Comparing _site/ against ${ref}\n`);

let filesCompared = 0;
let filesMissing = 0;
let filesDiffering = 0;
let totalChanges = 0;

for (const builtPath of built) {
  const rel = relative(siteDir, builtPath).split(sep).join("/");
  const original = fileAtRef(rel);

  if (original === null) {
    console.log(`? ${rel}`);
    console.log(`    not present at ${ref} — new file, nothing to compare\n`);
    filesMissing++;
    continue;
  }

  filesCompared++;
  const oldTokens = tokenize(original);
  const newTokens = tokenize(readFileSync(builtPath, "utf8"));
  const changes = diffTokens(oldTokens, newTokens);

  if (changes.length === 0) {
    console.log(`OK ${rel}  (${newTokens.length} tokens, identical)`);
    continue;
  }

  filesDiffering++;
  totalChanges += changes.length;
  console.log(`DIFF ${rel}  (${changes.length} difference${changes.length === 1 ? "" : "s"})`);

  for (const change of changes.slice(0, maxPerFile)) {
    const source = change.kind === "removed" ? oldTokens : newTokens;
    const before = source.slice(Math.max(0, change.at - context), change.at);
    const marker = change.kind === "removed" ? "-" : "+";
    if (context > 0 && before.length) {
      console.log(`      ...${before.join(" ").slice(-90)}`);
    }
    console.log(`    ${marker} ${change.token}`);
  }
  if (changes.length > maxPerFile) {
    console.log(`    ... ${changes.length - maxPerFile} more (raise --max to see them)`);
  }
  console.log();
}

console.log(
  `\n${filesCompared} compared · ${filesCompared - filesDiffering} identical · ` +
    `${filesDiffering} differing · ${filesMissing} new`
);

if (filesDiffering > 0) {
  console.log(`${totalChanges} token difference${totalChanges === 1 ? "" : "s"} total`);
  process.exit(1);
}
console.log("No meaningful differences.");
