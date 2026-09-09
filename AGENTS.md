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

## Design Constraints
- Always preserve the strict 5-hex color palette: `#F8F8F8`, `#EEEEEE`, `#F00000`, `#CC0000`, `#111111`.
- Always specify explicit `width`, `height`, `loading="lazy"`, and `decoding="async"` on all images to prevent Cumulative Layout Shift (CLS).
