# راهنمای توسعهٔ لوکال

مخاطب: کسی که می‌خواهد این ریپو را روی یک ماشین جدید راه بیندازد.
برای راهنمای انتشار محتوا (مخصوص مقدسه) به `docs/HOWTO-fa.md` مراجعه کن — در فاز ۴ ساخته می‌شود.

---

## پیش‌نیازها

| ابزار | نسخهٔ حداقل | نسخهٔ تست‌شده |
|---|---|---|
| Node.js | ۱۸ | **۲۴.۱۹.۰ (LTS)** |
| npm | — | **۱۱.۱۷.۰** |
| Git | — | ۲.۵۴.۰ |

Eleventy 3.x حداقل Node 18 می‌خواهد. `engines` در `package.json` همین را الزام می‌کند.

### نصب Node روی ویندوز

```powershell
winget install --id OpenJS.NodeJS.LTS --exact --source winget
```

نصب‌کننده درخواست دسترسی administrator می‌کند.

> ⚠️ **بعد از نصب، ترمینال فعلی هنوز `node` را نمی‌شناسد.** نصب‌کننده `PATH` را در سطح سیستم عوض می‌کند ولی پروسه‌های باز آن را نمی‌بینند. یک ترمینال جدید باز کن.
>
> برای چک کردن در همان ترمینال بدون بستنش:
> ```powershell
> $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
> ```

بررسی:

```powershell
node -v
npm -v
```

---

## راه‌اندازی ریپو

```bash
git clone https://github.com/moghadase/moghadase.github.io.git
cd moghadase.github.io
npm ci
```

تنها dependency پروژه `@11ty/eleventy` است (devDependency). هیچ CSS framework یا کتابخانهٔ سمت‌کاربری نداریم.

### بررسی دسترسی push

قبل از هر کاری مطمئن شو اکانت گیت‌هابت روی این ریپو دسترسی نوشتن دارد:

```bash
git push --dry-run origin main
```

هیچ چیزی را واقعاً push نمی‌کند. اگر خروجی مثل `e0501a6..0186ecf main -> main` بود یعنی دسترسی هست. اگر `403` یا `Permission denied` گرفتی، اکانت باید collaborator شود.

---

## دستورهای توسعه

```bash
npm run serve
```

سرور توسعه روی `http://localhost:8080` با live reload.

```bash
npm run build
```

بیلد یک‌باره در `_site/`.

```bash
npm run diff
```

خروجی `_site/` را با HTML سایت روی برنچ `main` مقایسه می‌کند و اختلاف معنادار را گزارش می‌دهد. اگر همه‌چیز یکی بود exit code صفر است، وگرنه ۱.

مقایسه با یک کامیت مشخص:

```bash
node scripts/diff-output.mjs --ref e0501a6
```

### اسکریپت دیف چه چیزی را نادیده می‌گیرد

در حالت پیش‌فرض: تورفتگی، شکست خط، خط خالی، کامنت‌ها، و فاصلهٔ صرفاً whitespace بین تگ‌ها. همچنین character reference ها decode می‌شوند، یعنی `&` و `&amp;` برابر شمرده می‌شوند.

بقیهٔ چیزها — ترتیب تگ‌ها، صفت‌ها، مقدار صفت‌ها و متن — باید عیناً یکی باشند.

### حالت حساس به فاصله

```bash
node scripts/diff-output.mjs --whitespace
```

«بی‌تفاوت به whitespace» برای HTML کاملاً درست نیست. **بین دو المان inline یا inline-block، یک رشته فاصله به یک space رندرشده تبدیل می‌شود که عرض واقعی اشغال می‌کند.** اگر حذفش کنی دو المان به هم می‌چسبند، اگر اضافه کنی از هم فاصله می‌گیرند. حالت پیش‌فرض این را نمی‌بیند چون گره‌های متنی صرفاً whitespace را دور می‌ریزد.

`styles.css` نوزده سلکتور با display از نوع inline دارد که شش‌تایشان داخل هدرند:

```
.brand    .brand-name    .brand-name em    .theme-dots    .theme-dots span    .nav-burger
```

یعنی دقیقاً همان ناحیه‌ای که یک ریفکتور قالب جابه‌جا می‌کند.

`--whitespace` این اطلاعات را نگه می‌دارد. **هر وقت ساختار تمپلت جابه‌جا شد — نه فقط محتوایش — این حالت را هم اجرا کن.**

**در فاز ۱ ابزار اثبات است** (باید صفر اختلاف بدهد). **در فاز ۱.۵ ابزار مرور** — آن‌جا هدر و فوتر عمداً عوض می‌شوند و این اسکریپت فهرست خوانای همان تغییرات عمدی را می‌دهد.

---

## ⚠️ OneDrive — مهم

این ریپو داخل `C:\Users\<user>\OneDrive\Documents\GitHub\` است.

**مشکل:** `node_modules/` ده‌ها هزار فایل کوچک دارد. OneDrive سعی می‌کند همه را آپلود کند. نتیجه:

- `npm install` و `npm ci` چند برابر کندتر می‌شوند
- OneDrive گاهی فایلی را حین نوشتن قفل می‌کند و نصب با خطای `EPERM` یا `EBUSY` می‌شکند
- فضای ابری بی‌دلیل پر می‌شود
- همین مشکل به شکل خفیف‌تر برای `_site/` و `.cache/` هم هست، ولی چون آن‌ها چند صد فایل‌اند قابل تحمل است

`node_modules/` و `_site/` و `.cache/` در `.gitignore` هستند — **ولی `.gitignore` هیچ ربطی به OneDrive ندارد.** گیت آن‌ها را نادیده می‌گیرد، OneDrive همچنان سینکشان می‌کند.

### روش قابل‌اتکا: junction

**OneDrive هیچ گزینهٔ رسمی برای استثنا کردن یک پوشه ندارد.** آنچه در تنظیمات هست این‌ها هستند و هیچ‌کدام کار ما را نمی‌کنند:

- `Settings → Account → Choose folders` — این selective **download** است. اگر تیک پوشه‌ای را برداری، نسخهٔ لوکالش پاک می‌شود. برای `node_modules` که فقط لوکال لازم داریم بدتر است.
- `Settings → Sync and backup → Advanced settings → Exclude files from being added` — فقط بر اساس **پسوند** فایل کار می‌کند (`*.pst` و مانند آن)، نه نام پوشه.
- `Always keep on this device` / `Free up space` — فقط تعیین می‌کند فایل لوکال نگه داشته شود یا نه. جلوی آپلود را نمی‌گیرد.

راهی که واقعاً جواب می‌دهد: **OneDrive از junction (پیوند دایرکتوری) عبور نمی‌کند.** پس `node_modules` را بیرون از OneDrive بساز و داخل ریپو فقط یک junction به آن بگذار.

در PowerShell، وقتی `node_modules` هنوز ساخته نشده:

```powershell
$repo  = "C:\Users\<user>\OneDrive\Documents\GitHub\moghadase.github.io"
$store = "C:\dev\node_modules-store\moghadase.github.io"

New-Item -ItemType Directory -Force -Path $store
cmd /c mklink /J "$repo\node_modules" "$store"
```

> **اول بدون administrator امتحان کن.** `mklink /J` یک junction می‌سازد و برخلاف `mklink /D` (symbolic link) معمولاً به دسترسی administrator نیاز ندارد. فقط اگر خطای دسترسی گرفتی، PowerShell را as administrator باز کن و دوباره اجرا کن.

اگر `node_modules` از قبل ساخته شده، اول حذفش کن:

```powershell
Remove-Item -Recurse -Force "$repo\node_modules"
```

بعد از این، `npm install` بدون این‌که بفهمد، فایل‌ها را در `C:\dev\` می‌نویسد و OneDrive اصلاً آن‌ها را نمی‌بیند.

> ⚠️ **junction شکننده است.** اگر ریپو جابه‌جا، تغییرنام، یا دوباره clone شد، junction از بین می‌رود یا به مسیر اشتباه اشاره می‌کند. در آن صورت باید دوباره ساخته شود. اگر یک روز `npm install` بی‌دلیل کند شد یا OneDrive شروع کرد به آپلود ده‌ها هزار فایل، اولین چیزی که باید چک کنی همین است:
>
> ```powershell
> cmd /c dir /AL "$repo"
> ```
>
> اگر `node_modules` در خروجی به‌عنوان `<JUNCTION>` نبود، یعنی شکسته و باید از نو بسازیش.

### اگر junction نمی‌خواهی

قابل قبول است. Eleventy dependency سنگینی ندارد و کندی سینک آزاردهنده است ولی کار را متوقف نمی‌کند. فقط بدان که خطاهای `EPERM`/`EBUSY` وسط `npm install` احتمالاً از OneDrive‌اند نه از npm — کافی است سینک را موقتاً pause کنی و دوباره امتحان کنی.

### ریپو را جای دیگری کلون کردی؟

اگر بیرون از OneDrive کلون شد، **هیچ‌کدام از این کارها لازم نیست.** این بخش فقط برای همان یک ماشین است. این فایل دقیقاً به همین دلیل نوشته شده که یادمان بماند چرا آن junction آن‌جاست.

---

## ساختار پوشه‌ها

وضعیت بعد از فاز ۱:

```
.
├── src/                        ← ورودی Eleventy
│   ├── _includes/base.njk      ← اسکلت مشترک همهٔ صفحات
│   ├── _data/site.json         ← url, title, author, lang, کد Search Console
│   ├── index.njk               ← permalink: /index.html
│   └── pages/
│       ├── story.njk           ← permalink: /pages/story.html
│       ├── now.njk
│       ├── talks.njk
│       └── cv.njk
├── eleventy.config.mjs
├── scripts/diff-output.mjs     ← مقایسهٔ خروجی با یک ref گیت
├── .github/workflows/deploy.yml
│
│   ── دارایی‌ها روی ریشه می‌مانند، چون URL عمومی‌شان نباید بشکند ──
├── styles.css
├── site.js
├── images/
├── uploads/                    ← لینک عمومی CV
├── screenshots/                ← در هیچ صفحه‌ای استفاده نشده؛ دست نخورده
├── robots.txt
├── sitemap.xml                 ← فاز ۲: با نسخهٔ تولیدشده جایگزین می‌شود
│
├── package.json
├── .gitignore
├── BLOG-PANEL-SPEC.md          ← اسپک پروژه
└── docs/
    ├── AUDIT.md                ← ممیزی HTML قبل از مهاجرت
    └── DEV.md                  ← همین فایل
```

`_site/` خروجی بیلد است و در `.gitignore`. هیچ‌وقت کامیت نمی‌شود.

### چرا `eleventy.config.mjs` و نه `.js`

فایل با سینتکس ESM نوشته شده. پسوند `.mjs` یعنی لازم نیست `"type": "module"` را به `package.json` اضافه کنیم — و `site.js` که در مرورگر اجرا می‌شود از این تصمیم اثر نمی‌گیرد.

دلیل این‌که دارایی‌ها روی ریشه می‌مانند و به `src/assets/` منتقل نمی‌شوند: `uploads/Updated_CV_Moghadaseh_Ahmadi.pdf` یک URL عمومی است که احتمالاً در لینکدین و ایمیل‌ها لینک شده. جزئیات در `BLOG-PANEL-SPEC.md` بند ۱.۱.

---

## ⚠️ قاعدهٔ برنچ — `main` دست نمی‌خورد

تا پایان فاز ۱، GitHub Pages مستقیم از **ریشهٔ برنچ `main`** سرو می‌کند. یعنی `main` عملاً همان وب‌سایت زنده است و هر فایلی که رویش کامیت شود بلافاصله عمومی می‌شود — از جمله همین فایل و `BLOG-PANEL-SPEC.md`.

**پس تا لحظهٔ مرج فاز ۱، هیچ کامیتی روی `main` نمی‌رود.**

- کار هر فاز روی برنچ خودش می‌ماند
- فاز ۱ از روی `phase-0-setup` برنچ می‌خورد، نه از `main`
- برنچ‌های غیر از `main` توسط Pages سرو نمی‌شوند، پس push کردنشان چیزی را عمومی نمی‌کند
- اولین باری که `main` تکان می‌خورد، مرج فاز ۱ است

بعد از آن، دیپلوی از طریق GitHub Actions انجام می‌شود و فقط محتوای `_site/` منتشر می‌شود. چون `docs/` و اسپک در passthrough copy نیستند، خودبه‌خود از خروجی بیرون می‌مانند.

> در `robots.txt` نام فایل خصوصی ننویس. `robots.txt` خودش عمومی است؛ `Disallow: /BLOG-PANEL-SPEC.md` یعنی اعلام عمومی این‌که آن فایل وجود دارد.
