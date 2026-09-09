# RedSan Agent Rules & CMS Workflows

## Automated Blog CMS Pipeline
Whenever the user supplies a blog draft, article text, or instructs to publish a new blog post, act as RedSan's automated CMS and update all of the following in a single workflow:
1. **URL**: Lowercase kebab-case path `blog/<slug>/index.html` with canonical trailing slash.
2. **Canonical**: Absolute `<link rel="canonical" href="https://redsan.in/blog/<slug>/">`.
3. **Breadcrumb**: Visible semantic `<nav aria-label="Breadcrumb" class="post-breadcrumbs">` in hero + `@type: "BreadcrumbList"` JSON-LD schema.
4. **Article Schema**: Full Schema.org `BlogPosting` or `Article` in JSON-LD with title, description, image, author, publisher, and datePublished/dateModified.
5. **Sitemap**: Auto-append or update `<loc>`, `<lastmod>`, `<priority>`, and `<image:image>` in `sitemap.xml`.
6. **Open Graph & Twitter**: Synchronized social meta cards (`og:title`, `og:description`, `og:image`, `og:type="article"`, `twitter:card="summary_large_image"`).
7. **RSS/Feeds**: Prepend entry to `feed.xml` with RFC 822 pubDate, description, category, enclosure, and link RSS in `<head>`.
8. **Internal Category Association**: Add or update card in `blog/index.html` with relevant `data-category` topic and location classes, update related posts, and feature in `#blog` on `index.html`.

## Canonical Blog Post Architecture Specification
Every article under `blog/<slug>/index.html` MUST follow this identical structure:
1. **Head & Metadata**:
   - Explicit `<title>` and canonical link with trailing slash.
   - Open Graph + Twitter cards linking to the article's dedicated WebP image in `/assets/`.
   - RSS (`/feed.xml`) and Sitemap (`/sitemap.xml`) link tags.
   - Comprehensive `@graph` JSON-LD schema with `BreadcrumbList`, `BlogPosting`, and `FAQPage` (if FAQs exist).
2. **No Canvas Background on Post Pages**:
   - Single blog posts must NOT include `<canvas id="space-bg-canvas"></canvas>` or Three.js (`space-bg.js`) to avoid canvas overlay bugs.
3. **Hero Section (`.post-hero`)**:
   - Semantic visible breadcrumb nav `<nav aria-label="Breadcrumb" class="post-breadcrumbs">` with links to `/` (Home) and `/blog/` (The RedSan Journal).
   - Back link `<a href="/blog/" class="back">← Back to The RedSan Journal</a>`.
   - Category tag `.tag`, H1 headline, and author byline with avatar, author name, date, and reading time.
4. **Post Body (`.post-body`)**:
   - Dedicated featured media frame:
     ```html
     <figure class="featured-media-frame">
       <span class="crosshair tl"></span><span class="crosshair br"></span>
       <img src="/assets/<image-slug>.webp" alt="..." class="featured-media-img" width="1264" height="848" loading="eager" decoding="async">
       <figcaption class="featured-media-caption">
         <span>Field Analysis: ...</span>
         <span style="color:#F00000;">RedSan Journal</span>
       </figcaption>
     </figure>
     ```
   - Quick Answer callout with crimson accent line for AI search snippet indexing.
   - Clean H2 and H3 content hierarchy with zero em-dashes (`—`).
   - Authoritative citations box (using colons `:` instead of em-dashes).
   - FAQ block with `.faq-card` elements matching `FAQPage` schema.
5. **Share Bar (`.post-share`)**: WhatsApp & LinkedIn share links.
6. **Related Posts (`.related`)**:
   - Section label: `Keep Reading The Journal`.
   - Grid `.mag-grid` containing 2-3 `.mag-card` elements with clear image frames, crosshairs, and flair badges.
7. **Final CTA & Footer**:
   - `.final-cta` pointing to `/contact/`.
   - Global 4-column RedSan agency footer.
8. **Scripts**: ONLY `<script src="/blog/blog.js"></script>`.

## Card Framing Standards (Home, Blog Hero/Trending, Related Posts)
- All editorial cards (`.mag-card`, `.trending-card`, `.hero-main-card`) must present images in a clearly visible, non-distorted frame:
  - **Frame Dimensions**: `position: relative; width: 100%; aspect-ratio: 16 / 10; min-height: 180px; background: #0d0d10; overflow: hidden;`.
  - **Image**: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;`.
  - **Accents**: Reticle crosshairs (`.crosshair.tl`, `.crosshair.br` with `z-index: 2;`) and `.flair` badge with `z-index: 2;`.
  - **Hover**: Smooth zoom `.mag-card:hover .mag-cover img { transform: scale(1.05); }`.
- **STRICT EXCEPTION / CONSTRAINT**:
  - **DO NOT MODIFY Instagram Cards on Blog Page**: All `.ig-post-card` articles inside `#blogGrid` on `blog/index.html` must remain strictly untouched.

## Design Constraints
- Always preserve the strict 5-hex color palette: `#F8F8F8`, `#EEEEEE`, `#F00000`, `#CC0000`, `#111111`.
- Always specify explicit `width`, `height`, `loading="lazy"`, and `decoding="async"` on all images to prevent Cumulative Layout Shift (CLS).
- Never use em-dashes (`—`) anywhere in blog post content.
