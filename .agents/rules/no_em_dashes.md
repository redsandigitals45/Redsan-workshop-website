---
description: Universal rule prohibiting the use of em-dashes (—) across all website content
globs: ["**/*.html", "**/*.md", "**/*.xml", "**/*.txt", "**/*.js"]
---

# Universal Prohibition: Never Use Em-Dashes (`—`) Anywhere

Under NO circumstances should em-dashes (`—` or `&mdash;`) be written, inserted, or generated in any content for this website.

## Scope of Rule
This applies universally across the entire project codebase:
- Home page (`index.html`)
- All blog posts (`blog/**/index.html`)
- Blog index (`blog/index.html`)
- All regional & service landing pages (`seo-agency/`, `performance-marketing/`, `digital-marketing-agency-*/`, etc.)
- Metadata (`<title>`, `<meta name="description">`, Open Graph `og:description`, Twitter cards)
- Feeds and sitemaps (`feed.xml`, `sitemap.xml`, `llms.txt`, `llms-full.txt`)
- Structured data (JSON-LD schemas)
- All marketing, technical, and commercial copy

## Approved Replacements
When drafting, editing, or updating content, use these alternatives instead:
1. **Spaced Hyphen**: Use ` - ` (hyphen with spaces on both sides).
2. **Colon**: Use `:` for introducing explanations, lists, or clauses.
3. **Punctuation**: Use parentheses `(...)`, commas, or separate sentences with periods.
4. **Natural Rephrasing**: Structure the sentence so that em-dash parentheticals are not needed.

## Verification
Before finalizing or committing any content edits, always scan the modified files to verify zero em-dash characters (`—`) exist.
