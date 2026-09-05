import os

cinema_path = r"r:\Redsan Digitals Pvt. Ltd\website data\website\home\redsan-cinematic-reveal.html"
index_path = r"r:\Redsan Digitals Pvt. Ltd\website data\website\index.html"

with open(cinema_path, "r", encoding="utf-8") as f:
    cinema_content = f.read()

# Extract CSS exactly from the last <style> tag
style_blocks = cinema_content.split('<style>')
cinema_css = style_blocks[-1].split('</style>')[0].strip()
cinema_css = cinema_css.replace("html,body{ margin:0; padding:0; background:#000; }", "")

# Extract HTML exactly
html_start = cinema_content.find('<div id="rsd-cinema">')
html_end = cinema_content.find('<!-- PREVIEW-ONLY')
cinema_html = cinema_content[html_start:html_end].strip()
cinema_html = cinema_html.replace('<div id="rsd-cinema">', '<div id="rsd-cinema" style="z-index: 99999;">')

# Prepare JS
cinema_js = """
<script>
document.addEventListener("DOMContentLoaded", function() {
  const cinema = document.getElementById("rsd-cinema");
  const isMobile = window.innerWidth <= 880;
  
  if (cinema) {
    if (isMobile) {
      // Skip cinematic reveal on mobile instantly
      cinema.style.display = "none";
    } else {
      // Lock scroll while sequence plays
      document.body.style.overflow = "hidden";
      window.scrollTo(0,0);
      
      // The sequence is ~6.5s long
      setTimeout(function() {
        cinema.style.transition = "opacity 0.8s ease";
        cinema.style.opacity = "0";
        cinema.style.pointerEvents = "none";
        
        // Unlock scroll
        document.body.style.overflow = "";
        
        setTimeout(function() {
          cinema.style.display = "none";
        }, 800);
      }, 6500);
    }
  }
});
</script>
"""

with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

# 1. Inject CSS right before </style>
style_end = index_content.find('</style>')
if style_end != -1:
    index_content = index_content[:style_end] + "\n/* --- CINEMATIC REVEAL --- */\n" + cinema_css + "\n" + index_content[style_end:]

# 2. Inject HTML right after <body>
body_start = index_content.find('<body>') + len('<body>')
if body_start != -1:
    index_content = index_content[:body_start] + "\n" + cinema_html + "\n" + index_content[body_start:]
else:
    print("Failed to find <body>")

# 3. Inject JS before </body>
body_end = index_content.rfind('</body>')
if body_end != -1:
    index_content = index_content[:body_end] + cinema_js + "\n" + index_content[body_end:]

with open(index_path, "w", encoding="utf-8") as f:
    f.write(index_content)

print("Successfully injected cinematic reveal cleanly!")
