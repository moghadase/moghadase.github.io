# ممیزی HTML موجود — پیش از مهاجرت به Eleventy

تاریخ ممیزی: ۲۰۲۶-۰۸-۰۴
کامیت مرجع: `e0501a6` (SEO First Steps)

**چرا این فایل وجود دارد:** فاز ۱ یک ریفکتور خالص است و باید خروجی‌اش با HTML فعلی بایت‌به‌بایت (منهای whitespace) یکی باشد. برای این کار `base.njk` باید تفاوت‌های زیر را با شرط/متغیر بازتولید کند. بعد در فاز ۱.۵ عمداً بخشی از همین تفاوت‌ها را از بین می‌بریم — این فایل مرجع آن است که بدانیم دقیقاً چه چیزی را عمداً یکسان کرده‌ایم.

ستون «سرنوشت در فاز ۱.۵» تصمیم است، نه مشاهده.

---

## ۱. فایل‌ها

| فایل | خطوط | بایت | permalink هدف |
|---|---|---|---|
| `index.html` | ۵۹۴ | ۲۴٬۶۸۱ | `/` |
| `pages/story.html` | ۲۱۵ | ۹٬۷۶۳ | `/pages/story.html` |
| `pages/now.html` | ۲۴۴ | ۱۱٬۱۰۵ | `/pages/now.html` |
| `pages/talks.html` | ۱۸۱ | ۷٬۹۲۳ | `/pages/talks.html` |
| `pages/cv.html` | ۳۰۵ | ۱۴٬۱۹۳ | `/pages/cv.html` |

---

## ۲. تفاوت‌های `<head>`

| مورد | `index.html` | `pages/*.html` | سرنوشت در فاز ۱.۵ |
|---|---|---|---|
| `<html lang data-theme data-mode>` | یکسان | یکسان | بدون تغییر |
| `charset` / `viewport` | یکسان | یکسان | بدون تغییر |
| `<title>` | per-page | per-page | از front matter |
| `meta description` | per-page | per-page | از front matter |
| `meta theme-color` | دارد | دارد | مشترک در `base.njk` |
| **`google-site-verification`** | **دارد** (خط ۱۰) | **ندارد** | ⚠️ **در همهٔ صفحات رندر شود** |
| `link rel=icon` | `images/portrait.jpg` | `../images/portrait.jpg` | مسیر مطلق `/images/portrait.jpg` |
| **`apple-touch-icon`** | **دارد** (خط ۱۳) | **ندارد** | در همهٔ صفحات |
| `preconnect` × ۲ + Google Fonts | یکسان | یکسان | مشترک |
| `link rel=stylesheet` | `styles.css` | `../styles.css` | مسیر مطلق `/styles.css` |
| `layout.css` | — | — | **جدید**، بعد از `styles.css` |

> `google-site-verification` تگ تأیید مالکیت Search Console است. اگر در فاز ۱ گم شود، تأیید سایت می‌شکند و هیچ خطای مرئی هم نمی‌دهد.

---

## ۳. تگ `<body>` و `<main>`

| مورد | `index.html` | `pages/*.html` | سرنوشت در فاز ۱.۵ |
|---|---|---|---|
| تگ body | `<body style="font-size: 8px">` | `<body class="subpage">` | **دست نزن** (مسئلهٔ باز) |
| تگ main | `<main id="top">` | `<main>` | یکسان‌سازی — `id="top"` همه‌جا |

`styles.css:150` مقدار `body { font-size: 16px }` را می‌دهد؛ استایل inline در `index.html` آن را override می‌کند. تحلیل تأثیر در بخش ۷.

---

## ۴. ناوبری دسکتاپ (`nav.nav-links`)

هر پنج صفحه ۶ آیتم دارند و ترتیبشان یکی است. تفاوت فقط در مسیر لینک و کلاس فعال:

| آیتم | `index.html` | `pages/*.html` |
|---|---|---|
| ۰۱ About | `#about` | `../index.html#about` |
| ۰۲ Story | `pages/story.html` | `story.html` |
| ۰۳ Journey | `pages/now.html` | `now.html` |
| ۰۴ Talks | `pages/talks.html` | `talks.html` |
| ۰۵ CV | `pages/cv.html` | `cv.html` |
| ۰۶ Contact | `#contact` | `../index.html#contact` |
| کلاس فعال | **هیچ آیتمی `is-here` ندارد** | آیتم صفحهٔ جاری `class="is-here"` می‌گیرد |

**سرنوشت در فاز ۱.۵:** همهٔ لینک‌ها مطلق (`/pages/story.html`, `/#about`)، منبع واحد `src/_data/nav.json`، کلاس فعال `--active`.

> ⚠️ قبل از حذف `is-here` باید چک شود که `styles.css` به آن وابسته است یا نه. اگر هست، یا هر دو کلاس داده شود یا CSS به‌روز شود.

---

## ۵. منوی موبایل (`div.mobile-menu`) — بزرگ‌ترین تفاوت

### `index.html` — ۸ آیتم

| # | متن | href | `data-close` |
|---|---|---|---|
| ۰۱ | About | `#about` | ✅ |
| ۰۲ | Story · Porotezsaz | `pages/story.html` | — |
| ۰۳ | Journey | `pages/now.html` | — |
| ۰۴ | Talks & Speaking | `pages/talks.html` | — |
| ۰۵ | CV | `pages/cv.html` | — |
| ۰۶ | **Research** | `#research` | ✅ |
| ۰۷ | **Experience** | `#experience` | ✅ |
| ۰۸ | Contact | `#contact` | ✅ |

### `pages/*.html` — ۶ آیتم

| # | متن | href |
|---|---|---|
| ۰۱ | About | `../index.html#about` |
| ۰۲ | Story · Porotezsaz | `story.html` |
| ۰۳ | Journey | `now.html` |
| ۰۴ | Talks & Speaking | `talks.html` |
| ۰۵ | CV | `cv.html` |
| ۰۶ | Contact | `../index.html#contact` |

نکات:
- `Research` و `Experience` فقط در منوی صفحهٔ اصلی‌اند چون anchorهای داخل همان صفحه‌اند
- صفت `data-close` فقط روی لینک‌های anchor صفحهٔ اصلی است. `site.js:78` از آن برای بستن منو بعد از کلیک استفاده می‌کند
- **هیچ آیتم منوی موبایل در هیچ صفحه‌ای کلاس فعال ندارد**

**سرنوشت در فاز ۱.۵:** منوی یکسان در همهٔ صفحات. `#research` و `#experience` به `/#research` و `/#experience` تبدیل شوند تا از هر صفحه‌ای کار کنند. `data-close` روی هر لینکی که به همان صفحه اشاره می‌کند بماند.

---

## ۶. برند، فوتر و اسکریپت‌ها

| مورد | `index.html` | `pages/*.html` | سرنوشت در فاز ۱.۵ |
|---|---|---|---|
| `a.brand` href | `#top` | `../index.html` | `/` |
| `theme-dots` + `mode-toggle` + `nav-burger` | یکسان | یکسان | مشترک |
| **فوتر** | فقط `div.wrap.footer-meta` داخل سکشن Contact (خط ۵۸۱) با استایل inline `padding-left:0;padding-right:0` | **هیچ فوتری ندارد** | `.site-footer` مشترک؛ `footer-meta` منتقل و از سکشن Contact حذف شود |
| `#year` | فقط در `index.html:582` | ندارد | در `.site-footer__copyright`. `site.js:86-89` همین حالا داینامیک پرش می‌کند |
| `<script src>` | `site.js` | `../site.js` | `/site.js` |
| اسکریپت inline اضافه | ندارد | **فقط `cv.html:298-302`** — هندلر `printBtn` | همان‌جا بماند (per-page script block) |

---

## ۷. سکشن‌های اختصاصی هر صفحه

| صفحه | اولین سکشن | `.prose` | `read-next` |
|---|---|---|---|
| `index.html` | `.hero` | ندارد | ندارد |
| `pages/story.html` | `.page-hero` | ✅ | ✅ |
| `pages/now.html` | `.page-hero` | ✅ | ✅ |
| `pages/talks.html` | `.page-hero` | ندارد | ✅ |
| `pages/cv.html` | `.cv-page` | ندارد | ندارد |

این‌ها محتوای اختصاصی‌اند و در فاز ۱ عیناً داخل بلوک `content` هر تمپلت می‌روند.

---

## ۸. دارایی‌ها و URLهای عمومی

همهٔ مسیرهای محلی که در HTML ارجاع داده شده‌اند:

```
styles.css                              ← از index و (با ../) از صفحات داخلی
site.js                                 ← همینطور
images/portrait.jpg                     ← icon + apple-touch-icon + <img> در hero
uploads/Updated_CV_Moghadaseh_Ahmadi.pdf ← از cv.html خط ۷۴
```

`screenshots/` (سه فایل PNG) **در هیچ HTML/CSS/JS ارجاع داده نشده** — وزن مرده، ولی در فاز ۱ دست نمی‌زنیم.

**قاعدهٔ فاز ۱:** همهٔ این‌ها با passthrough copy روی همان URL باقی می‌مانند. `uploads/Updated_CV_Moghadaseh_Ahmadi.pdf` احتمالاً در لینکدین و ایمیل‌ها لینک شده — شکستنش هزینهٔ واقعی دارد.

---

## ۹. آمار CSS — پشتوانهٔ تصمیم دربارهٔ `font-size: 8px`

`styles.css` — ۵۲٬۶۲۷ بایت:

| واحد | تعداد اعلان |
|---|---|
| `px` | ۴۶۷ |
| `clamp()` | ۴۱ |
| `vw` / `vh` | ۴۲ |
| `em` | **۶۷** |
| **`rem`** | **۰** |

### تفکیک ۶۷ اعلان `em`

| ویژگی | تعداد | تفسیر |
|---|---|---|
| `letter-spacing` | **۵۳** | نسبت به font-size خودِ المان حساب می‌شود، نه body |
| `margin` (کوتاه) | ۵ | خطوط ۱۴۸۸، ۱۵۱۵، ۱۵۲۹، ۱۵۵۳، ۱۵۶۳ — همه داخل بلوک `.prose` |
| `padding-right` | ۲ | خطوط ۲۱۸، ۴۱۳ — اصلاح بصری کوچک |
| `margin-right` | ۲ | خطوط ۲۱۹، ۴۱۴ — جفت همان بالایی، مقدار منفی |
| `margin-bottom` | ۱ | خط ۱۴۹۸ — `.prose .lead-para` |
| `font-size` | ۱ | خط ۱۵۰۱ — `.prose .lead-para::first-letter { font-size: 3.1em }` |

### تحلیل

**صفر `rem`.** این مهم است: `rem` به `html` نگاه می‌کند و `font-size` روی `body` هیچ اثری رویش ندارد. چون اصلاً `rem` وجود ندارد، این مسیر تأثیر منتفی است.

**۵۳ تا از ۶۷ اعلان `em` روی `letter-spacing` هستند** و همهٔ آن‌ها روی المان‌هایی‌اند که `font-size` خودشان با `px` یا `clamp()` صریحاً ست شده. یعنی به `font-size` بدنه زنجیر نمی‌شوند.

**۱۰ اعلان `margin`/`padding` باقی‌مانده** هم عمدتاً داخل بلوک `.prose` هستند که فرزندانش (`p`, `h2`, `ul`) font-size صریح `clamp()` دارند.

**نتیجهٔ اولیه:** `font-size: 8px` روی body احتمالاً تأثیر بصری بسیار محدودی دارد و فقط روی المان‌هایی اثر می‌گذارد که font-size خودشان را ست نکرده‌اند و مستقیم از body ارث می‌برند.

**ولی حذفش بی‌ریسک نیست** و باید جداگانه اندازه‌گیری شود، نه با استدلال. روش پیشنهادی برای موقعی که خواستیم تصمیم بگیریم:

1. یک اسکریپت روی صفحهٔ لایو اجرا کن که `getComputedStyle(el).fontSize` همهٔ المان‌های دارای متن را جمع کند
2. همان را با `font-size: 8px` حذف‌شده تکرار کن
3. لیست المان‌هایی که سایزشان عوض شد را بگیر

اگر لیست خالی بود، خط بی‌اثر است و می‌شود حذفش کرد. اگر خالی نبود، دقیقاً می‌دانیم کجا را باید اصلاح کنیم.

---

## ۱۰. سلکتورهای تگ سراسری — مرتبط با قاعدهٔ «همه‌چیز کلاس داشته باشد»

فقط **۲** سلکتور تگ سراسری در کل `styles.css`:

```css
a   { color: inherit; text-decoration: none; }   /* خط ۱۶۰ */
img { max-width: 100%; display: block; }         /* خط ۱۶۱ */
```

خبر خوب برای قاعدهٔ ۲.۴ اسپک. ولی دو پیامد برای بلاگ:

- `a { text-decoration: none }` روی لینک‌های داخل متن پست هم اثر می‌گذارد → در `blog.css` باید آندرلاین `.prose__link` عمداً برگردانده شود
- `img { display: block }` روی تصاویر داخل متن اثر می‌گذارد → موقع استایل `.prose__img` حواسمان باشد

### بلوک `.prose` موجود

`styles.css` مجموعاً ۱۶ قاعدهٔ `.prose` دارد (خطوط ۱۴۷۷–۱۵۵۳ + یکی در media query خط ۲۰۱۸)، که ۱۱ تای آن‌ها سلکتور نزولی تگ‌اند:

```
.prose p    .prose h2    .prose ul    .prose hr    .prose strong    .prose em    .prose b
```

استفاده‌شده در `pages/story.html` و `pages/now.html`.

این‌ها سلکتور نزولی تگ هستند و با روح قاعدهٔ ۲.۴ نمی‌خوانند، ولی چون در صفحات موجودند دست‌نخورده می‌مانند.

**تصمیم (گرفته شد):** `.post__body` از این بلوک ارث نمی‌برد. کلاس‌های `.prose__*` در `blog.css` مستقل نوشته می‌شوند، ولی **مقادیرشان عیناً از همین بلوک کپی می‌شود** تا ظاهر یکسان بماند. `styles.css` دست نمی‌خورد.

نتیجه: موقتاً دو تعریف از یک چیز داریم. آگاهانه پذیرفته شده، و یکسان‌سازی (مهاجرت `story.html` و `now.html` به `.prose__*` + حذف بلوک قدیمی) در بخش «بعداً» اسپک ثبت شده.

خطوط مرجع برای کپی مقادیر — کل ۱۶ قاعده. ستون آخر عمداً هست تا در فاز ۲ سهواً از قلم نیفتد:

| # | قاعده | خط در `styles.css` | داخل media query؟ |
|---|---|---|---|
| ۱ | `.prose` | ۱۴۷۷ | — |
| ۲ | `.prose > *` | ۱۴۸۱ | — |
| ۳ | `.prose p` | ۱۴۸۲ | — |
| ۴ | `.prose p .soft` | ۱۴۹۱ | — |
| ۵ | `.prose strong, .prose b` | ۱۴۹۲ | — |
| ۶ | `.prose em` | ۱۴۹۳ | — |
| ۷ | `.prose .lead-para` | ۱۴۹۴ | — |
| ۸ | `.prose .lead-para::first-letter` | ۱۵۰۰ | — |
| ۹ | `.prose h2` | ۱۵۰۸ | — |
| ۱۰ | `.prose h2 .grad` | ۱۵۱۸ | — |
| ۱۱ | `.prose h2 + p` | ۱۵۲۵ | — |
| ۱۲ | `.prose ul` | ۱۵۲۶ | — |
| ۱۳ | `.prose ul li` | ۱۵۳۴ | — |
| ۱۴ | `.prose ul li::before` | ۱۵۴۲ | — |
| ۱۵ | `.prose hr` | ۱۵۴۹ | — |
| ۱۶ | `.prose .lead-para::first-letter` | ۲۰۱۸ | ✅ **بله** |

⚠️ قاعدهٔ ۱۶ داخل media query است و مقدار قاعدهٔ ۸ را روی صفحهٔ کوچک override می‌کند (`font-size: 3.1em` → `2.6em`). اگر فقط بلوک اصلی (۱۴۷۷–۱۵۵۳) کپی شود، دسکتاپ درست درمی‌آید و موبایل ساکت خراب می‌شود — و چون فقط اندازهٔ حرف اول پاراگراف است، تا وقتی کسی روی موبایل باز نکند دیده نمی‌شود.

این در معیار پذیرش فاز ۲ اسپک به‌صورت دو آیتم چک‌باکس ثبت شده.
