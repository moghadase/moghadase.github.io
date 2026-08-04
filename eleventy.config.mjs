/**
 * Eleventy config — phase 1.
 *
 * Goal of this phase: identical output, built from a shared template.
 * Two rules drive everything here:
 *
 *  1. Assets keep their current public URLs. styles.css, site.js, images/ and
 *     uploads/ live at the repo root and are copied through untouched, because
 *     uploads/Updated_CV_Moghadaseh_Ahmadi.pdf is linked from outside the repo.
 *     See BLOG-PANEL-SPEC.md §1.1.
 *
 *  2. Permalinks do not change. /pages/story.html stays /pages/story.html,
 *     not /pages/story/. Each page declares its own permalink in front matter.
 *
 * BLOG-PANEL-SPEC.md and docs/ are deliberately NOT passed through — nothing
 * outside _site/ gets published once Pages switches to GitHub Actions.
 */
export default function (eleventyConfig) {
  // Root-level assets, kept at their existing public URLs.
  eleventyConfig.addPassthroughCopy({ "styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "site.js": "site.js" });
  eleventyConfig.addPassthroughCopy({ images: "images" });
  eleventyConfig.addPassthroughCopy({ uploads: "uploads" });
  eleventyConfig.addPassthroughCopy({ screenshots: "screenshots" });

  // Hand-written SEO files. Phase 2 replaces these with generated versions.
  eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "sitemap.xml": "sitemap.xml" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
