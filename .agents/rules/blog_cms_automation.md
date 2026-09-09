---
description: Automated Static CMS workflow for publishing new blog posts on RedSan
globs: ["blog/**/*", "sitemap.xml", "feed.xml", "index.html"]
---

# RedSan Blog CMS Automation Workflow

Whenever the user provides a blog draft, article text, or instructs to publish a new blog post, you MUST act as the full automated CMS and execute this 8-point publishing pipeline without needing separate prompting:

### 1. URL Architecture
- Create clean, SEO-optimized, lowercase kebab-case directory:
  `blog/<slug>/index.html`
- Ensure trailing slash standard: `https://redsan.in/blog/<slug>/`

### 2. Canonical Tag
- Set self-referencing absolute canonical URL:
  `<link rel="canonical" href="https://redsan.in/blog/<slug>/">`

### 3. Breadcrumb Navigation & Schema
- **Visible Breadcrumb in Post Hero:**
  `<nav aria-label="Breadcrumb" class="post-breadcrumbs">...` linking `Home (/)` → `Blog (/blog/)` → Current Title.
- **BreadcrumbList Schema:**
  Include a structured `@type: "BreadcrumbList"` inside the JSON-LD `@graph` with 1-based positions.

### 4. Article Schema (JSON-LD)
- Add comprehensive `BlogPosting` or `Article` schema inside `@graph` including:
  - `headline` ($\le$ 60 chars)
  - `description` ($\le$ 155 chars)
  - `image` (Absolute URL to WebP asset)
  - `author` (Organization: "RedSan Growth Editorial", `url: "https://redsan.in/"`)
  - `publisher` (Organization: "RedSan Digitals Pvt. Ltd.", logo object)
  - `datePublished`, `dateModified` (ISO format YYYY-MM-DD)
  - `mainEntityOfPage` (Canonical post URL)
- Add `FAQPage` schema if the article features an FAQ section.

### 5. Sitemap (`sitemap.xml`)
- Automatically add or update the article entry in `/sitemap.xml` with:
  - `<loc>https://redsan.in/blog/<slug>/</loc>`
  - `<lastmod>YYYY-MM-DD</lastmod>` (current date)
  - `<changefreq>monthly</changefreq>`
  - `<priority>0.85</priority>`
  - `<image:image>` with `<image:loc>`, `<image:title>`, `<image:caption>`

### 6. Open Graph & Social Cards
- In `<head>`:
  - `<meta property="og:title" ...>`
  - `<meta property="og:description" ...>`
  - `<meta property="og:url" ...>`
  - `<meta property="og:type" content="article">`
  - `<meta property="og:image" ...>`
  - `<meta name="twitter:card" content="summary_large_image">`
  - `<meta name="twitter:title" ...>`
  - `<meta name="twitter:description" ...>`
  - `<meta name="twitter:image" ...>`

### 7. RSS Feed (`feed.xml`)
- Auto-prepend the new post into `/feed.xml` under `<channel>` with:
  - `<title>`, `<link>`, `<guid>`, `<description>`, `<category>`, `<pubDate>` (RFC 822), and `<enclosure>`
- Ensure `<link rel="alternate" type="application/rss+xml" title="The RedSan Journal RSS Feed" href="/feed.xml">` is present in the post's `<head>`.

### 8. Internal Category Association & Archive Updates
- **Blog Archive (`blog/index.html`):**
  - Add a post card with accurate `data-category="<topic> <regional-hub>"` (e.g. `guides dehradun delhi`) so category filtering works immediately.
  - If it's a primary/trending story, update the hero trending card with the post's WebP image and excerpt.
- **Home Page (`index.html`):**
  - Update the "From the Blog" teaser section (`#blog .blog-grid`) with the post card, explicit image dimensions, and smooth hover effects.
- **Strict Color Palette:**
  Always maintain the 5-hex styling palette: `#F8F8F8`, `#EEEEEE`, `#F00000`, `#CC0000`, `#111111`.
