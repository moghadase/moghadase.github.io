# Spec — افزودن بلاگ و پنل انتشار به moghadase.github.io

> نسخهٔ ۲ — بازنگری‌شده بعد از ممیزی ریپو.
> تغییرات نسبت به نسخهٔ ۱: افزودن فاز ۰ و فاز ۱.۵، انتقال workflow دیپلوی از فاز ۴ به فاز ۱،
> تثبیت محل assets، اصلاح قواعد Sveltia، افزودن allowlist کاربر در Worker.

---

## وضعیت فعلی (تأییدشده با ممیزی)

- ریپو: `moghadase/moghadase.github.io` — منتشر شده روی GitHub Pages از **ریشهٔ برنچ `main`**
- سایت: HTML/CSS/JS دست‌نویس و استاتیک
- صفحات موجود: `index.html`, `pages/story.html`, `pages/now.html`, `pages/talks.html`, `pages/cv.html`
- دارایی‌ها روی ریشه: `styles.css` (۵۲KB)، `site.js`، `images/`، `uploads/`، `screenshots/`
- `sitemap.xml` و `robots.txt` دستی روی ریشه
- بلاگ ندارد
- **صفحات یکسان نیستند** — تفاوت‌ها در `docs/AUDIT.md` مستند شده است
- **هیچ `<footer>` در سایت وجود ندارد** — فقط `index.html` یک `div.footer-meta` داخل سکشن Contact دارد
- `styles.css` هیچ واحد `rem` ندارد؛ سایزبندی کاملاً `px` + `clamp()` + `vw` است

## هدف نهایی

1. سایت بدون هیچ تغییر ظاهری روی Eleventy مهاجرت کند
2. هدر و فوتر واقعی و مشترک در همهٔ صفحات (تغییر ظاهری عمدی، در فاز جدا)
3. بخش بلاگ با تمپلت واحد
4. **دسته‌بندی‌های قابل‌تعریف توسط خود کاربر** (نه لیست ثابت در کد) + صفحهٔ آرشیو برای هر دسته
5. پنل `/admin` برای انتشار توسط کاربر غیربرنامه‌نویس
6. کنترل کامل سئو در هر صفحه: عنوان صفحه (H1) و عنوان سئو جدا، توضیحات، index/noindex
7. **هر المان HTML یک کلاس CSS اختصاصی داشته باشد** تا بعداً بدون دست‌زدن به تمپلت استایل داده شود

## اصول غیرقابل‌مذاکره

- **`main` دست‌نخورده می‌ماند تا لحظهٔ مرج فاز ۱.**
  تا وقتی GitHub Pages مستقیم از ریشهٔ `main` سرو می‌کند، `main` عملاً همان وب‌سایت زنده است. هر فایلی که روی `main` باشد یک فایل **منتشرشدهٔ عمومی** است — از جمله همین اسپک و `docs/`.
  پس تا لحظهٔ مرج فاز ۱ و سوییچ Pages به GitHub Actions، **هیچ کامیتی روی `main` نمی‌رود.**
  - فاز ۰ مرج نمی‌شود؛ روی برنچ می‌ماند
  - فاز ۱ از روی `phase-0-setup` برنچ می‌خورد، نه از `main`
  - فاز ۱.۵ پشت سر فاز ۱ برنچ می‌خورد
  - اولین باری که `main` تکان می‌خورد، مرج فاز ۱ است — همان لحظه که Pages به Actions سوییچ می‌کند و از آن به بعد فقط `_site/` منتشر می‌شود. آن موقع `docs/` و اسپک خودبه‌خود از خروجی بیرون می‌مانند و هیچ‌وقت عمومی نمی‌شوند.
  - **در `robots.txt` نام فایل خصوصی ننویس.** `robots.txt` خودش عمومی است؛ نوشتن `Disallow: /BLOG-PANEL-SPEC.md` یعنی اعلام عمومی این‌که آن فایل وجود دارد — دقیقاً برعکس هدف.
  - مزیت جانبی: تا آن لحظه سایت زنده صددرصد دست‌نخورده است و هیچ ریسکی ندارد
- هر فاز = یک برنچ جدا + یک PR. بین فازها متوقف شو و منتظر تأیید بمان.
  استثنا: فاز ۰ و ۱ در یک PR واحد از `phase-1-eleventy` به `main` می‌روند. فاز ۱.۵ به بعد PR جدا.
- ظاهر سایت در فاز ۱ **نباید ذره‌ای** تغییر کند. تغییر ظاهری فقط در فاز ۱.۵ به بعد.
- هیچ توکن، کلید، یا secret نباید در کد یا در مرورگر باشد.
- محتوای سایت انگلیسی است. رابط پنل انگلیسی، ولی `hint` فیلدها فارسی.
- هیچ dependency غیرضروری اضافه نکن. هیچ CSS framework اضافه نکن.
- **دارایی‌های فعلی جابه‌جا نمی‌شوند.** URLهای عمومی نباید بشکنند.

## نقشهٔ فازها

| فاز | محتوا | تغییر ظاهری؟ |
|---|---|---|
| ۰ | نصب Node LTS، `.gitignore`، استثنای OneDrive، `docs/DEV.md` | ندارد |
| ۱ | Eleventy + GitHub Actions deploy | **ندارد — صفر پیکسل** |
| ۱.۵ | هدر و فوتر واقعی و مشترک | **دارد — عمدی** |
| ۲ | مدل محتوا، دسته‌ها، سئو، CSS بلاگ | دارد (بخش جدید) |
| ۳ | Sveltia CMS + local backend برای تست | ندارد |
| ۴ | Cloudflare Worker + allowlist + مستندات | ندارد |

---

# فاز ۰ — آماده‌سازی محیط

**خروجی:** محیط توسعه آمادهٔ اجرای Eleventy است. هیچ فایلی از سایت تغییر نکرده.

## کارها

1. **نصب Node LTS** (نسخهٔ ۲۲ یا بالاتر). Eleventy 3.x حداقل Node 18 می‌خواهد.
   بعد از نصب، `node -v` و `npm -v` باید در PowerShell جواب بدهند.
2. **بررسی دسترسی push**: git user فعلی `mojtabasedaghatk` است ولی ریپو زیر اکانت `moghadase` است.
   با `git push --dry-run` چک کن که این اکانت دسترسی push دارد.
   **اگر ندارد، متوقف شو و گزارش بده** — قبل از فاز ۱ باید حل شود.
3. **`.gitignore`** بساز با حداقل این محتوا:
   ```
   node_modules/
   _site/
   .cache/
   ```
4. **`docs/DEV.md`** بنویس شامل:
   - پیش‌نیازها (Node LTS، نسخهٔ دقیق)
   - دستورهای توسعهٔ لوکال
   - **بخش OneDrive**: ریپو داخل `OneDrive\Documents\GitHub` است. `node_modules/` ده‌ها هزار فایل کوچک دارد و OneDrive موقع `npm install` قفل فایل و کندی می‌سازد.
     ⚠️ **تصحیح نسبت به فرض اولیه:** OneDrive هیچ گزینهٔ رسمی برای استثنا کردن یک *پوشه* ندارد. `Choose folders` یک selective **download** است و نسخهٔ لوکال را پاک می‌کند؛ `Exclude files from being added` فقط با پسوند کار می‌کند؛ `Always keep on this device` هم جلوی آپلود را نمی‌گیرد. تنها روش قابل‌اتکا **junction** است، چون OneDrive از junction عبور نمی‌کند. مراحل دقیق در `docs/DEV.md`.

## معیار پذیرش فاز ۰

- `node -v` و `npm -v` جواب می‌دهند
- نتیجهٔ `git push --dry-run` گزارش شود
- `.gitignore` و `docs/DEV.md` وجود دارند
- **هیچ فایل موجود سایت تغییر نکرده باشد** — `git diff` روی فایل‌های HTML/CSS/JS خالی باشد

---

# فاز ۱ — مهاجرت به Eleventy + دیپلوی، بدون تغییر ظاهری

**خروجی:** سایت دقیقاً همان است، ولی از یک قالب ساخته می‌شود و از طریق GitHub Actions دیپلوی می‌شود.

## کارها

1. `npm init` و نصب `@11ty/eleventy` (نسخهٔ پایدار فعلی، نسخه pin شود) به‌عنوان devDependency
2. ساختار زیر:

```
src/
  _includes/
    base.njk          ← اسکلت مشترک: <head>، ناوبری
  _data/
    site.json         ← url, title, author, description, lang
  index.njk
  pages/
    story.njk
    now.njk
    talks.njk
    cv.njk
.github/workflows/deploy.yml
eleventy.config.js
```

3. بخش‌های تکراری (`<head>`، منوی بالا) در `base.njk` جمع شوند. متغیرهای `title`، `description`، `permalink` از front matter هر صفحه بیایند.
4. مسیر خروجی `_site/` (در فاز ۰ به `.gitignore` اضافه شده)
5. **permalinkها باید دقیقاً مثل قبل بمانند** — `/pages/story.html` همان `/pages/story.html` بماند، نه `/pages/story/`. لینک‌های موجود نباید بشکنند.

## ۱.۱ دارایی‌ها — سر جای خودشان می‌مانند

**تصمیم قطعی: هیچ دارایی جابه‌جا نمی‌شود.** دلیل: `uploads/Updated_CV_Moghadaseh_Ahmadi.pdf` یک URL عمومی است که احتمالاً در لینکدین و ایمیل‌ها لینک شده. شکستنش هزینهٔ واقعی دارد و هیچ سودی ندارد.

- `styles.css`, `site.js`, `images/`, `uploads/`, `screenshots/` روی **ریشهٔ ریپو** می‌مانند و با passthrough copy به `_site/` کپی می‌شوند
- تصاویر جدید بلاگ می‌روند در `images/blog/`
- `blog.css` و `layout.css` (فازهای بعد) هم **کنار `styles.css` روی ریشه** ساخته می‌شوند، نه در `src/assets/`
- در نتیجه در `config.yml` فاز ۳: `media_folder: images/blog` و `public_folder: /images/blog`
- **`BLOG-PANEL-SPEC.md` و `docs/` نباید در passthrough copy باشند.** چون طبق قاعدهٔ «`main` دست‌نخورده» این فایل‌ها هرگز روی `main` نرفته‌اند، تا امروز عمومی نشده‌اند. از لحظهٔ مرج فاز ۱ فقط `_site/` منتشر می‌شود، پس باید مطمئن شویم در خروجی نیستند. در معیار پذیرش چک شود.

## ۱.۲ حفظ دقیق تفاوت‌های فعلی

`base.njk` باید پارامتریک باشد و تفاوت‌های امروز را **عیناً** بازتولید کند. مرجع کامل: `docs/AUDIT.md`. خلاصهٔ چیزهایی که باید با شرط/متغیر حفظ شوند:

- `<body style="font-size: 8px">` روی `index` در برابر `<body class="subpage">` روی بقیه
- منوی موبایل ۸ آیتمی در `index` در برابر ۶ آیتمی در صفحات داخلی (شامل صفت `data-close`)
- لینک‌های نسبی: `pages/story.html` از ریشه در برابر `../index.html#about` از صفحات داخلی
- `class="is-here"` روی آیتم فعال منوی دسکتاپ در صفحات داخلی؛ در `index` هیچ آیتمی `is-here` ندارد
- `<main id="top">` روی `index` در برابر `<main>` روی بقیه
- `href` برند: `#top` روی `index` در برابر `../index.html` روی بقیه
- تگ‌های فقط-index در `<head>`: `google-site-verification` و `apple-touch-icon`
- اسکریپت inline اضافهٔ `pages/cv.html` (دکمهٔ print)

**در این فاز فوتر مشترک نساز.** `div.footer-meta` فقط در `index` بماند، دقیقاً همان‌جا که هست.

## ۱.۳ دیپلوی — ترتیب اجرا برای جلوگیری از قطعی سایت

GitHub Pages الان از ریشهٔ برنچ `main` سرو می‌کند. اگر بدون workflow مرج کنیم، سایت ۴۰۴ می‌دهد.

`.github/workflows/deploy.yml`:
- trigger: `push` روی `main` + `pull_request` + `workflow_dispatch`
- `npm ci && npx @11ty/eleventy`
- کش npm فعال
- انتشار `_site/` روی GitHub Pages
- **اگر بیلد fail شد، دیپلوی انجام نشود**
- روی pull_request فقط جاب **build** اجرا شود، نه deploy

ترتیب اجرا:

1. workflow را در همان برنچ فاز ۱ بساز، با `workflow_dispatch` فعال
2. قبل از مرج، جاب build روی PR اجرا شود و سبز باشد
3. مالک ریپو `Settings → Pages → Source = GitHub Actions` را ست می‌کند
4. مرج
5. بلافاصله چک می‌کنیم سایت بالاست

**در توضیحات PR باید راه برگشت نوشته شود:** revert کردن کامیت مرج + برگرداندن `Settings → Pages → Source` به `Deploy from a branch / main / root`.

## معیار پذیرش فاز ۱

- `npx @11ty/eleventy --serve` بالا می‌آید
- هر پنج صفحه با همان آدرس قبلی باز می‌شوند

### ۱. تگ `google-site-verification`

`base.njk` در همین فاز ساخته می‌شود، نه فاز ۱.۵ — پس این تگ همین حالا باید شرطی و درست منتقل شود.

- [ ] وجودش در `_site/index.html` صریحاً چک شود و در گزارش نوشته شود
- [ ] فقط در `index.html` باشد (یکسان‌سازی کار فاز ۱.۵ است)

اگر گم شود، تأیید مالکیت Search Console می‌شکند و هیچ خطای مرئی هم نمی‌دهد.

### ۲. تست دود جاوااسکریپت

`site.js` تم‌ها، سوییچ dark/light، منوی موبایل و `#year` را می‌گرداند و همهٔ این‌ها به attribute و id هایی وابسته‌اند که موقع بازچینش `base.njk` ممکن است جابه‌جا شوند.

بعد از بیلد، **هر چهار رفتار روی هر پنج صفحه** تست شود، نه فقط `index`:

- [ ] سه تم (albatross / rose / mono)
- [ ] سوییچ dark/light
- [ ] منوی موبایل (باز و بسته شدن، و `data-close`)
- [ ] `#year`

**اگر چیزی نیاز به تغییر در `site.js` داشت، متوقف شو و گزارش بده — در فاز ۱ نباید به `site.js` دست بخورد.**

### ۳. اسکریپت دیف

- [ ] اسکریپت دیف نرمالایزشده (whitespace-insensitive) به‌عنوان **یک فایل ماندگار در `scripts/`** نوشته شود، نه یک دستور یک‌بارمصرف. در فاز ۱.۵ دوباره لازم است تا ببینیم چه چیزی عمداً تغییر کرده.
- [ ] خروجی: **اختلاف معنادار صفر**

### ۴. بازتولید عین‌به‌عین

`data-close`، `is-here`، منوی ۸ در برابر ۶ آیتمی و لینک‌های `../` در فاز ۱ **عیناً بازتولید می‌شوند، نه اصلاح.** اصلاحشان کار فاز ۱.۵ است.

### بقیه
- `styles.css`, `site.js`, `images/portrait.jpg`, `uploads/Updated_CV_Moghadaseh_Ahmadi.pdf` روی همان URLهای قبلی در دسترس‌اند
- `_site/BLOG-PANEL-SPEC.md` و `_site/docs/` وجود **ندارند**
- جاب build روی PR سبز است
- در گزارش نهایی لیست فایل‌های خروجی و آدرسشان را بنویس

---

# فاز ۱.۵ — هدر و فوتر واقعی و مشترک

**خروجی:** همهٔ صفحات یک هدر و یک فوتر یکسان دارند. **این فاز عمداً ظاهر را تغییر می‌دهد.**

دلیل جدا بودن از فاز ۱: فاز ۱ یک ریفکتور است و معیار پذیرشش «هیچ پیکسلی تغییر نکند». اگر همان PR ظاهر را هم عوض کند، دیگر نمی‌شود فهمید تفاوت‌ها از ریفکتور آمده یا از طراحی جدید.

## ۱.۵.۱ هدر یکپارچه

- همهٔ لینک‌ها **مطلق** (`/pages/story.html`) نه نسبی — تا `../` از بین برود
- منوی موبایل و دسکتاپ از **یک منبع داده** بیایند: `src/_data/nav.json`
- آیتم فعال کلاس `--active` بگیرد (جایگزین `is-here` فعلی؛ اگر `styles.css` به `is-here` وابسته است، هر دو کلاس داده شود یا CSS به‌روز شود — تصمیم را گزارش کن)
- **`google-site-verification` باید در `base.njk` بماند و در همهٔ صفحات رندر شود.** این تگ تأیید Search Console است — اگر گم شود تأیید مالکیت سایت می‌شکند.
- تفاوت منوی ۸ آیتمی `index` و ۶ آیتمی صفحات داخلی از بین می‌رود. لینک‌های anchor مخصوص صفحهٔ اصلی (`#research`, `#experience`) باید به `/#research` تبدیل شوند تا از همهٔ صفحات کار کنند.

## ۱.۵.۲ فوتر مشترک

ساختار کلاسی الزامی:

```
.site-footer
  .site-footer__inner
    .site-footer__brand
      .site-footer__name
      .site-footer__tagline
    .site-footer__nav
      .site-footer__nav-title
      .site-footer__nav-list      a: .site-footer__nav-link
    .site-footer__contact
      .site-footer__contact-title
      .site-footer__email
      .site-footer__linkedin
      .site-footer__location
    .site-footer__bottom
      .site-footer__copyright
      .site-footer__credit
```

- محتوای `div.footer-meta` فعلی در `index.html` به این فوتر منتقل شود و **از سکشن Contact حذف شود**
- سال کپی‌رایت داینامیک باشد، نه ثابت. (`site.js` خطوط ۸۶–۸۹ همین حالا `#year` را داینامیک پر می‌کند — همان مکانیزم حفظ شود.)
- CSS فوتر در فایل جدید `layout.css` روی ریشه — **نه در `blog.css`**، چون به بلاگ ربطی ندارد
- `layout.css` در `base.njk` بعد از `styles.css` لود شود

## ۱.۵.۳ چیزی که در این فاز دست نمی‌زنیم

`style="font-size: 8px"` روی body در `index.html` **دست نخورده باقی می‌ماند.** جداگانه بررسی می‌شود.

## معیار پذیرش فاز ۱.۵

عمومی:

- هر پنج صفحه هدر و فوتر یکسان دارند
- هیچ لینک `../` در خروجی نمانده باشد
- `google-site-verification` در خروجی **هر پنج صفحه** حاضر است
- `sitemap.xml` و `robots.txt` هنوز درست کار می‌کنند
- هیچ لینک شکسته‌ای نیست (یک چک لینک ساده روی `_site/` اجرا کن)
- اسکرین‌شات قبل/بعد در PR

چهار مورد مشخص که در ممیزی پیدا شدند و باید صریحاً تیک بخورند:

- [ ] **`data-close`** — بعد از یکسان‌سازی منو، روی موبایل واقعی تست شود که کلیک روی هر آیتم، منو را می‌بندد. اگر منوی صفحات داخلی هم anchor گرفت، `data-close` باید به آن‌ها هم برسد. (وابستگی: `site.js:78`)
- [ ] **`is-here`** — قبل از تعویض با `--active`، در `styles.css` جستجو شود. **اگر استایل دارد، اسمش را عوض نکن؛ همان `is-here` بماند.** هماهنگی با کد موجود مهم‌تر از خوش‌نامی کلاس است.
- [ ] **`#year`** — مکانیزم `site.js` حفظ شود. عنصر `#year` داخل `.site-footer__copyright` برود. **جاوااسکریپت را بازنویسی نکن.** (وابستگی: `site.js:86-89`)
- [ ] **`cv.html`** — `base.njk` یک بلاک اختیاری `{% block pageScripts %}` داشته باشد و هندلر `printBtn` داخل آن برود، نه در اسکریپت مشترک.

`screenshots/` دست نخورد — ممکن است جایی خارج از ریپو لینک شده باشد.

---

# فاز ۲ — مدل محتوا: پست، دسته‌بندی، سئو

**خروجی:** با ساختن دستی فایل‌های `.md`، پست‌ها و صفحات دستهٔ کامل روی سایت ظاهر می‌شوند.

## ۲.۱ کالکشن دسته‌بندی‌ها

دسته‌ها **داده هستند نه کد** — کاربر باید بتواند دستهٔ جدید بسازد بدون تغییر در تمپلت.

مسیر: `src/categories/*.md`

```yaml
---
name:        string   # الزامی — نام نمایشی، مثلا "Clinical practice"
slug:        string   # الزامی — a-z 0-9 و خط تیره
description: string   # اختیاری — متن معرفی بالای صفحهٔ دسته
seoTitle:    string   # اختیاری
seoDesc:     string   # اختیاری
order:       number   # اختیاری — ترتیب نمایش در منو/فیلترها
noindex:     boolean  # پیش‌فرض false
---
```

- صفحهٔ آرشیو هر دسته در `/blog/category/{slug}/`
- دسته‌ای که هیچ پست منتشرشده‌ای ندارد، صفحه‌اش ساخته شود ولی `noindex` بخورد و در sitemap نیاید
- اگر پستی به دسته‌ای اشاره کند که وجود ندارد، **بیلد باید با خطای واضح fail شود** (نه سکوت)

## ۲.۲ کالکشن پست‌ها

مسیر: `src/posts/*.md` — permalink: `/blog/{{ slug }}/`

```yaml
---
title:       string   # الزامی — این H1 صفحه است
seoTitle:    string   # اختیاری — محتوای تگ <title>؛ اگر خالی بود از title پر شود
slug:        string   # الزامی — ^[a-z0-9-]+$
description: string   # الزامی — meta description، ۵۰ تا ۱۶۰ کاراکتر
date:        date     # الزامی — فرمت YYYY-MM-DD
updated:     date     # اختیاری — فرمت YYYY-MM-DD
category:    string   # الزامی — slug یکی از دسته‌ها
takeaways:   [string] # اختیاری — نکات کلیدی، بالای پست
cover:       string   # اختیاری
coverAlt:    string   # اگر cover هست الزامی
coverCaption: string  # اختیاری
references:  [object] # اختیاری — { title, authors, year, url }
tags:        [string] # اختیاری
noindex:     boolean  # پیش‌فرض false
draft:       boolean  # پیش‌فرض true
---
```

### قواعد مهم

- **`title` و `seoTitle` دو چیز جدا هستند.** `title` روی صفحه به‌عنوان H1 رندر می‌شود. `seoTitle` فقط داخل `<title>` می‌رود. اگر `seoTitle` خالی بود، از `title` استفاده کن.
- الگوی تگ title: `{{ seoTitle or title }} — Moghadaseh Ahmadi`. اگر طول نهایی از ۶۰ کاراکتر بیشتر شد، در لاگ بیلد **هشدار** بده (نه خطا).
- اگر `description` خارج از بازهٔ ۵۰–۱۶۰ کاراکتر بود، هشدار بده.
- `draft: true` → در بیلد production ساخته نشود، در حالت لوکال دیده شود.
- `noindex: true` → صفحه ساخته شود، `<meta name="robots" content="noindex, follow">` بگیرد، و **از sitemap و فید RSS حذف شود.**
- این منطق noindex باید در `base.njk` عمومی باشد تا **هر صفحه‌ای** — نه فقط پست‌ها — بتواند از آن استفاده کند.
- **زمان مطالعه (`.post__readtime`) = ۲۰۰ کلمه در دقیقه.** این عدد به‌صورت یک ثابت نام‌دار در بالای `eleventy.config.js` تعریف شود، نه هاردکد وسط فیلتر.

## ۲.۳ صفحات و تمپلت‌ها

| مسیر | تمپلت | توضیح |
|---|---|---|
| `/blog/` | `blog.njk` | لیست همهٔ پست‌ها، نزولی بر اساس تاریخ، با نوار فیلتر دسته‌ها، **صفحه‌بندی `size: 12`** |
| `/blog/page/{n}/` | همان | صفحات بعدی صفحه‌بندی |
| `/blog/{slug}/` | `_includes/post.njk` | صفحهٔ پست |
| `/blog/category/{slug}/` | `_includes/category.njk` | آرشیو یک دسته |
| `/feed.xml` | پلاگین `@11ty/eleventy-plugin-rss` | فقط پست‌های منتشرشده و index-شده |
| `/sitemap.xml` | تولید خودکار | همهٔ صفحات و پست‌های غیر draft و غیر noindex |
| `/robots.txt` | تولید از تمپلت | با ارجاع به sitemap، و `Disallow: /admin/` |

- **`sitemap.xml` و `robots.txt` دستی که الان روی ریشهٔ ریپو هستند باید در این فاز حذف شوند** و جایشان را نسخهٔ تولیدشدهٔ Eleventy بگیرد. اگر هر دو بمانند تداخل می‌شود.
- صفحه‌بندی `/blog/` همین حالا اضافه شود، حتی اگر پست کم است — retrofit کردنش بعداً روی permalinkها دردسر دارد.
- لینک «Blog» به `src/_data/nav.json` اضافه شود (هدر مشترک از فاز ۱.۵ خودش هر دو منو را می‌سازد)
- تمپلت‌ها باید با استایل فعلی سایت هم‌خوان باشند، **نه یک تم جدید**

## ۲.۴ کلاس‌های CSS — الزامی

**قاعدهٔ اصلی: هیچ استایلی نباید به سلکتور تگ (`h2`, `p`, `ul`) وابسته باشد. هر المانی که رندر می‌شود باید کلاس داشته باشد.**

نام‌گذاری: BEM با پیشوند بلوک. فقط حروف کوچک و خط تیره.

### صفحهٔ پست — `post.njk`

```
.post
  .post__header
    .post__breadcrumb        a: .post__breadcrumb-link
    .post__category          a: .post__category-link
    .post__title             (h1)
    .post__meta
      .post__date
      .post__updated
      .post__readtime
  .post__cover
    .post__cover-img
    .post__cover-caption
  .post__takeaways
    .post__takeaways-title
    .post__takeaways-list    li: .post__takeaways-item
  .post__body                ← خروجی markdown، کلاس‌های prose در ۲.۵
  .post__references
    .post__references-title
    .post__references-list   li: .post__references-item
      .post__reference-title
      .post__reference-authors
      .post__reference-year
      .post__reference-link
  .post__tags                a: .post__tag
  .post__footer
    .post__back-link
```

### لیست بلاگ — `blog.njk`

```
.blog-list
  .blog-list__header
    .blog-list__title
    .blog-list__intro
  .blog-list__filters        a: .blog-list__filter  (فعال: .blog-list__filter--active)
  .blog-list__grid
    .blog-card
      .blog-card__link
      .blog-card__cover      img: .blog-card__cover-img
      .blog-card__category
      .blog-card__title
      .blog-card__desc
      .blog-card__meta
        .blog-card__date
        .blog-card__readtime
  .blog-list__empty          ← وقتی هیچ پستی نیست
  .blog-list__pagination
    .blog-list__pagination-prev
    .blog-list__pagination-next
    .blog-list__pagination-list   a: .blog-list__pagination-link
                                  (فعال: .blog-list__pagination-link--active)
```

### صفحهٔ دسته — `category.njk`

```
.category-page
  .category-page__header
    .category-page__eyebrow
    .category-page__title    (h1)
    .category-page__desc
    .category-page__count
  .category-page__grid       ← از همان .blog-card بالا استفاده کن، تکرار نکن
  .category-page__empty
```

### قواعد

- کلاس‌های موجود سایت را بازنویسی نکن؛ این‌ها همه جدید و مستقل‌اند
- CSS جدید در فایل مجزای `blog.css` **روی ریشهٔ ریپو** باشد (کنار `styles.css`)، نه داخل CSS اصلی و نه در `src/assets/`
- در ابتدای `blog.css` یک کامنت با نقشهٔ کامل کلاس‌ها بگذار
- استایل اولیه را حداقلی بنویس — فقط چیدمان کارآمد. قرار است بعداً خودم استایل بدهم.
- **توجه:** `styles.css` دو سلکتور تگ سراسری دارد — `a { text-decoration: none }` و `img { display: block }`. این‌ها روی محتوای بلاگ هم اثر می‌گذارند. در `blog.css` باید آندرلاین لینک‌های داخل متن (`.prose__link`) عمداً برگردانده شود.
### `.prose` موجود در برابر `.prose__*` جدید — تصمیم گرفته شده

یک بلوک `.prose` از قبل در `styles.css` وجود دارد (`.prose p`, `.prose h2`, `.prose ul`, `.prose hr`, `.prose strong`, `.prose em` — ۱۱ قاعده) که در `story.html` و `now.html` استفاده می‌شود.

**تصمیم: مستقل نوشته شود. `.post__body` از بلوک `.prose` موجود ارث نمی‌برد.**

دلیل: بلوک `.prose` فعلی با سلکتور تگ کار می‌کند (`.prose p`, `.prose h2`) و این دقیقاً همان چیزی است که در اصول پروژه ممنوع شده. اگر `.post__body` را به آن وصل کنیم، قاعده از روز اول نقض می‌شود و هر تغییر در استایل پست، ریسک دست‌زدن به `story.html` و `now.html` را هم دارد.

ولی ظاهر باید یکسان باشد. پس:

1. مقادیر بلوک `.prose` موجود را بخوان و **عیناً** به‌عنوان نقطهٔ شروع در `blog.css` روی کلاس‌های `.prose__*` بنویس. یعنی `.prose p` چه فاصله و اندازه‌ای دارد، همان برای `.prose__p`.
2. **`styles.css` را دست نزن.** حتی برای مرتب‌کردن. بلوک `.prose` قدیمی همان‌جا سر جایش می‌ماند.
3. در ابتدای `blog.css` کامنت بگذار که این مقادیر از کجا کپی شده‌اند (شمارهٔ خط `styles.css`)، تا بعداً معلوم باشد.

این یعنی موقتاً دو تعریف از یک چیز داریم. پذیرفته شده — گزینهٔ دیگر یعنی دست‌زدن به CSS دو صفحهٔ لایو در فازی که موضوعش این نیست. یکسان‌سازی در بخش «بعداً» ثبت شده.

## ۲.۵ کلاس روی خروجی markdown

خروجی markdown هم باید کلاس‌دار باشد. renderer rules مربوط به markdown-it را در `eleventy.config.js` طوری تنظیم کن که:

| تگ | کلاس |
|---|---|
| h2 … h6 | `.prose__h2` … `.prose__h6` |
| p | `.prose__p` |
| ul / ol | `.prose__ul` / `.prose__ol` |
| li | `.prose__li` |
| a | `.prose__link` |
| blockquote | `.prose__quote` |
| img | `.prose__img` |
| code (inline) | `.prose__code` |
| pre | `.prose__pre` |
| table / th / td | `.prose__table` / `.prose__th` / `.prose__td` |
| hr | `.prose__hr` |

> `figure` / `figcaption` عمداً حذف شدند: markdown-it به‌صورت پیش‌فرض این تگ‌ها را تولید نمی‌کند و افزودن پلاگین خلاف اصل «dependency غیرضروری نه» است. کپشن تصویر کاور در سطح تمپلت (`.post__cover-caption`) موجود است.

همچنین:

- به همهٔ `h2`–`h4` یک `id` خودکار (slugified) بده تا لینک‌دادن به بخش‌ها ممکن باشد
- لینک‌های خارجی: `target="_blank" rel="noopener"` بگیرند و کلاس `.prose__link--external`

## ۲.۶ سئوی خودکار در `base.njk`

- `<title>`, `<meta name="description">`, `<link rel="canonical">`
- Open Graph + Twitter card (با `cover` اگر بود، وگرنه تصویر پیش‌فرض سایت)
- `<meta name="robots">` بر اساس `noindex`
- JSON-LD: `Person` در صفحهٔ اصلی، `BlogPosting` در پست‌ها (شامل `author`, `datePublished`, `dateModified`, `image`, `articleSection` = نام دسته)، `CollectionPage` در صفحات دسته
- breadcrumb JSON-LD در پست‌ها: Home → Blog → دسته → پست

## معیار پذیرش فاز ۲

- دو دسته و سه پست نمونه بساز؛ هر سه در `/blog/`، در دستهٔ درست، و در sitemap دیده شوند
- یک پست با `draft: true` و یک پست با `noindex: true` بساز و بررسی کن:
  - draft در خروجی production نیست
  - noindex هست ولی متاتگ دارد و در sitemap و feed نیست
- پستی با `category` نامعتبر بساز و مطمئن شو بیلد fail می‌شود
- صفحه‌بندی: با بیش از ۱۲ پست نمونه چک کن `/blog/page/2/` ساخته می‌شود و لینک‌های prev/next درست‌اند
- `sitemap.xml` و `robots.txt` دستی حذف شده‌اند و نسخهٔ تولیدشده جایشان است
- **خروجی JSON-LD یک پست را به‌صورت آمادهٔ کپی در گزارش بگذار** تا دستی در validator.schema.org تست شود
- **چک نهایی:** در خروجی `_site/blog/*/index.html` هیچ تگ محتوایی بدون `class` نباشد. یک اسکریپت کوچک برای این بررسی بنویس (با whitelist برای `html`, `head`, `meta`, `link`, `title`, `script`, `br`, `svg` و فرزندانش) و نتیجه را گزارش کن.

انتقال مقادیر `.prose` (بند ۲.۴):

- [ ] بعد از کپی مقادیر `.prose` به `.prose__*`، **هر ۱۶ قاعده** منتقل شده باشند، نه فقط بلوک اصلی — شامل قاعده‌های داخل media query. جدول کامل با ستون media query در `docs/AUDIT.md` بخش ۱۰.
- [ ] یک پست نمونه با `lead-para` روی عرض موبایل (۳۷۵px) و دسکتاپ کنار `story.html` مقایسه شود

---

# فاز ۳ — پنل انتشار

**خروجی:** `/admin` باز می‌شود، فرم کامل دارد، و **با local backend قابل تست است**. لاگین production هنوز کار نمی‌کند (فاز ۴).

## کارها

1. **Sveltia CMS** را اضافه کن (نه Decap/Netlify CMS — نگهداری نمی‌شود).
   `src/admin/index.html` که اسکریپت Sveltia را از CDN لود می‌کند.
2. مسیر `src/admin/` بدون پردازش Eleventy کپی شود (passthrough copy)
3. `/admin` نباید ایندکس شود: `Disallow` در robots.txt و `<meta name="robots" content="noindex">`
4. **local backend را فعال کن** تا این فاز واقعاً قابل تست باشد.
   بدون backend، Sveltia فقط صفحهٔ لاگین نشان می‌دهد و کالکشن‌ها دیده نمی‌شوند.
   - `local_backend: true` در `config.yml` (فقط وقتی روی localhost هستیم فعال شود)
   - دستور اجرای proxy server در `docs/DEV.md` مستند شود

## `src/admin/config.yml`

```yaml
backend:
  name: github
  repo: moghadase/moghadase.github.io
  branch: main
  base_url: <آدرس Worker در فاز ۴>

local_backend: true          # فقط روی localhost اثر دارد

media_folder: images/blog
public_folder: /images/blog

collections:
  # ---------- دسته‌بندی‌ها ----------
  - name: categories
    label: Categories
    label_singular: Category
    folder: src/categories
    create: true
    delete: true
    slug: "{{fields.slug}}"
    summary: "{{name}}"
    fields:
      - { name: name, label: Name, widget: string }
      - { name: slug, label: URL slug, widget: string,
          pattern: ['^[a-z0-9-]+$', 'فقط حروف کوچک انگلیسی، عدد و خط تیره'],
          hint: "در آدرس صفحهٔ دسته ظاهر می‌شود: /blog/category/…" }
      - { name: description, label: Description, widget: text, required: false,
          hint: "متن معرفی بالای صفحهٔ دسته" }
      - { name: seoTitle, label: SEO title, widget: string, required: false,
          hint: "اگر خالی بماند از Name استفاده می‌شود" }
      - { name: seoDesc, label: SEO description, widget: text, required: false }
      - { name: order, label: Sort order, widget: number, required: false, default: 0 }
      - { name: noindex, label: Hide from Google, widget: boolean, default: false }

  # ---------- پست‌ها ----------
  - name: posts
    label: Blog posts
    label_singular: Post
    folder: src/posts
    create: true
    delete: true
    slug: "{{fields.slug}}"
    summary: "{{title}}  ·  {{category}}"
    sortable_fields: [date, title]
    view_groups:
      - { label: Category, field: category }
    fields:
      - { name: title, label: Page title (H1), widget: string,
          hint: "این عنوان به‌صورت تیتر اصلی روی صفحه دیده می‌شود" }

      - { name: seoTitle, label: SEO title, widget: string, required: false,
          hint: "عنوانی که در نتایج گوگل دیده می‌شود. خالی بگذارید تا از Page title استفاده شود. زیر ۶۰ کاراکتر" }

      - { name: slug, label: URL slug, widget: string,
          pattern: ['^[a-z0-9-]+$', 'فقط حروف کوچک انگلیسی، عدد و خط تیره'],
          hint: "آدرس نهایی: /blog/…" }

      - { name: description, label: SEO description, widget: text,
          hint: "بین ۵۰ تا ۱۶۰ کاراکتر — متنی که زیر عنوان در گوگل نمایش داده می‌شود" }

      - { name: category, label: Category, widget: relation,
          collection: categories,
          search_fields: [name],
          display_fields: [name],
          value_field: slug,
          hint: "اگر دستهٔ موردنظر نیست، اول از بخش Categories بسازید" }

      - { name: date, label: Publish date, widget: datetime,
          format: 'YYYY-MM-DD', date_format: 'YYYY-MM-DD', time_format: false }
      - { name: updated, label: Last updated, widget: datetime, required: false,
          format: 'YYYY-MM-DD', date_format: 'YYYY-MM-DD', time_format: false }

      - { name: takeaways, label: Key takeaways, widget: list, required: false,
          field: { name: point, label: Point, widget: string },
          hint: "چند جملهٔ کوتاه که بالای مطلب نمایش داده می‌شود" }

      - { name: cover, label: Cover image, widget: image, required: false }
      - { name: coverAlt, label: Cover alt text, widget: string, required: false,
          hint: "توضیح تصویر برای موتور جستجو و افراد کم‌بینا" }
      - { name: coverCaption, label: Cover caption, widget: string, required: false }

      - name: references
        label: References
        widget: list
        required: false
        label_singular: Reference
        summary: "{{fields.title}}"
        fields:
          - { name: title, label: Title, widget: string }
          - { name: authors, label: Authors, widget: string, required: false }
          - { name: year, label: Year, widget: number, required: false,
              value_type: int, min: 1900, max: 2100 }
          - { name: url, label: DOI or link, widget: string, required: false }

      - { name: tags, label: Tags, widget: list, required: false }

      - { name: noindex, label: Hide from Google, widget: boolean, default: false,
          hint: "صفحه ساخته می‌شود ولی به گوگل می‌گوییم ایندکسش نکند" }

      - { name: draft, label: Draft, widget: boolean, default: true,
          hint: "تا وقتی روشن است، مطلب روی سایت منتشر نمی‌شود" }

      - name: body
        label: Content
        widget: markdown
        buttons: [bold, italic, strikethrough, code, link,
                  heading-two, heading-three, heading-four,
                  bulleted-list, numbered-list, quote]
        modes: [rich_text]
        editor_components: [image]
        hint: "برای تیترهای داخل متن از Heading 2 به بعد استفاده کنید — Heading 1 عنوان صفحه است"
```

### نکات پیاده‌سازی

- **`slug: "{{fields.slug}}"` عمدی است** (نه `{{slug}}`). با `{{slug}}` نام فایل از روی `title` ساخته می‌شود و با URL نمی‌خواند. نام فایل و URL باید همیشه یکی باشند.
- **فرمت تاریخ صریح است.** بدون `format`، خروجی widget با پارس تاریخ Eleventy مشکل می‌دهد.
- `heading-one` عمداً از `buttons` حذف شده تا صفحه دو H1 نگیرد. این را تغییر نده.
  در Sveltia همهٔ block typeها زیر یک منوی کشویی هستند نه دکمهٔ جدا، ولی `buttons` همچنان مقدارهای `heading-one` تا `heading-six` را می‌پذیرد.
  **اگر حذف `heading-one` جواب نداد، گزارش بده و متوقف شو — خودت راه‌حل جایگزین انتخاب نکن.**
- `modes: [rich_text]` عمدی است — حالت خام markdown برای کاربر غیرفنی گیج‌کننده است.
- `relation` باعث می‌شود لیست دسته‌ها همیشه از روی کالکشن categories خوانده شود، پس کاربر می‌تواند خودش دستهٔ جدید بسازد.
- **قبل از پیاده‌سازی، این آپشن‌ها را با داکیومنت فعلی Sveltia تطبیق بده** و هر ناسازگاری را گزارش کن: `modes`, `editor_components`, `view_groups`, `sortable_fields`, `buttons`, `pattern`, `local_backend`.

## معیار پذیرش فاز ۳

- با local backend، `/admin` بالا می‌آید و هر دو کالکشن دیده می‌شوند
- در فرم پست، فیلد Category دسته‌های ساخته‌شده را نشان می‌دهد
- ولیدیشن slug کار می‌کند (ورودی با فاصله رد شود)
- ادیتور متن منوی block type دارد ولی گزینهٔ Heading 1 در آن نیست
- یک پست از پنل ساخته شود و فایل `.md` تولیدشده **نامش با `slug` یکی باشد** و تاریخش `YYYY-MM-DD` باشد
- `/admin` در robots.txt `Disallow` شده و متاتگ noindex دارد

---

# فاز ۴ — لاگین (GitHub OAuth) و allowlist

**خروجی:** فقط دو اکانت مشخص می‌توانند وارد پنل شوند و پست منتشر کنند.

> workflow دیپلوی در فاز ۱ ساخته شده و اینجا تکرار نمی‌شود.

## کارها

1. یک **Cloudflare Worker** به‌عنوان OAuth proxy
   (endpointهای `/auth` و `/callback` سازگار با پروتکل Netlify CMS)
   - `CLIENT_ID` و `CLIENT_SECRET` فقط به‌صورت Worker secret — نه در کد، نه در ریپو
   - فقط origin سایت خودمان مجاز باشد

2. **allowlist کاربر — الزامی.**
   `ALLOWED_DOMAINS` در `sveltia-cms-auth` این کار را **نمی‌کند** — آن فقط origin سایت را چک می‌کند، نه کاربر را. پس:
   - بعد از تبادل توکن، Worker باید `GET https://api.github.com/user` را صدا بزند
   - فیلد `login` را با allowlist مقایسه کند
   - allowlist از متغیر محیطی Worker به نام `ALLOWED_USERS` بیاید، جدا شده با کاما
   - **allowlist را در کد ننویس**
   - اگر کاربر در لیست نبود، توکن را برنگردان و یک خطای واضح و قابل‌فهم بده

3. `docs/SETUP.md` — راهنمای گام‌به‌گام **برای کسی که برنامه‌نویس نیست**:
   - ساخت OAuth App در تنظیمات گیت‌هاب و مقادیر دقیقی که باید وارد شود
   - دیپلوی Worker و ست کردن سه secret/متغیر: `CLIENT_ID`, `CLIENT_SECRET`, `ALLOWED_USERS`
   - ثبت `base_url` در `config.yml`
   - دعوت مقدسه به‌عنوان collaborator با دسترسی write

4. `docs/HOWTO-fa.md` — راهنمای فارسی و ساده برای مقدسه:
   - چطور وارد پنل شوم
   - چطور یک دسته بسازم
   - چطور یک پست بنویسم و منتشر کنم
   - تفاوت Page title و SEO title
   - Draft و noindex یعنی چه
   - چرا انتشار یک دقیقه طول می‌کشد

### تقسیم کار

- **Claude:** کد Worker، `config.yml`، مستندات
- **کاربر (مجتبی):** ساخت اکانت/OAuth App، دیپلوی Worker، وارد کردن secretها
  Claude هیچ credentialی وارد نمی‌کند.

## معیار پذیرش

- ورود از یک مرورگر incognito با اکانت مجاز تست شود
- یک اکانت گیت‌هاب خارج از `ALLOWED_USERS` **در همان مرحلهٔ لاگین** رد شود و پیام واضح بگیرد
- یک دسته و یک پست از پنل ساخته شود و ظرف ۲ دقیقه روی سایت بیاید

---

# بعداً (الان انجام نده)

## بدهی فنی که آگاهانه پذیرفته‌ایم

- **بررسی و احتمالاً حذف `font-size: 8px` از body صفحهٔ اصلی.**
  در فاز ۱ و ۱.۵ دست نمی‌خورد. بعد از فاز ۴ سراغش می‌رویم.
  روش اندازه‌گیری قطعی (نه استدلال) در `docs/AUDIT.md` بخش ۹ نوشته شده: `getComputedStyle(el).fontSize` روی همهٔ المان‌های متنی، یک بار با و یک بار بدون آن خط، و دیف گرفتن. اگر لیست خالی بود، خط بی‌اثر است.
  دادهٔ مرتبط: `styles.css` هیچ `rem` ندارد؛ ۶۷ اعلان `em` دارد که ۵۳ تای آن `letter-spacing` است.

- **یکسان‌سازی prose: مهاجرت `story.html` و `now.html` به کلاس‌های `.prose__*` و حذف بلوک `.prose` قدیمی از `styles.css`.**
  تا آن موقع دو تعریف از یک چیز داریم (بند ۲.۴). این آگاهانه پذیرفته شده تا در فاز ۲ به CSS دو صفحهٔ لایو دست نزنیم.

## قابلیت‌های جدید

- جستجوی داخل بلاگ (Pagefind)
- صفحات آرشیو بر اساس تگ
- خبرنامه
- دامنهٔ اختصاصی به‌جای `github.io`
- نسخهٔ فارسی سایت
