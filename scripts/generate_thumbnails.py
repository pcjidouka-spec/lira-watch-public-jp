import os
import re
from PIL import Image, ImageDraw, ImageFont

# Path configurations
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTICLES_PATH = os.path.join(BASE_DIR, "data", "articles.ts")
IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")
FONT_PATH = "C:\\Windows\\Fonts\\meiryob.ttc"  # Using Meiryo Bold for Japanese

def create_thumbnail(id_str, title, subtitle=""):
    img_path = os.path.join(IMAGES_DIR, f"{id_str}_60.png")
    
    # 640x160 canvas
    width, height = 640, 160
    
    # Background - dark sleek gradient-like (solid for simplicity with Pillow)
    img = Image.new("RGB", (width, height), color="#1e293b")
    draw = ImageDraw.Draw(img)
    
    # Add a border / accent line
    draw.rectangle([0, 0, width-1, height-1], outline="#3b82f6", width=4)
    draw.rectangle([0, 0, 10, height-1], fill="#3b82f6") # Left accent bar
    
    # Load fonts
    try:
        font_title = ImageFont.truetype(FONT_PATH, 28)
        font_sub = ImageFont.truetype(FONT_PATH, 16)
    except IOError:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
    
    # Text wrapping for title
    max_chars = 22
    if len(title) > max_chars:
        title = title[:max_chars] + "..."
        
    # Draw Lira Watch Brand
    draw.text((25, 15), "LIRA-WATCH.SBS", fill="#9ca3af", font=font_sub)
    
    # Draw title
    draw.text((25, 50), title, fill="#ffffff", font=font_title)
    
    # Draw subtitle (summary)
    if not subtitle:
        subtitle = "トルコリラ・為替 最新情報まとめ"
        
    if len(subtitle) > 35:
        subtitle = subtitle[:35] + "..."
    draw.text((25, 100), subtitle, fill="#cbd5e1", font=font_sub)
    
    # Save the image
    img.save(img_path)
    return f"/images/{id_str}_60.png"

def process_articles():
    with open(ARTICLES_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # We match each article block
    # A block starts with { and ends with },
    # but since it's nested, we'll parse it using regex smartly.
    # Searching for: id: '...', \n title: '...', \n date: '...', \n [thumbnail: '...', \n]? content: `...`
    
    pattern = re.compile(
        r"\{\s*"
        r"id:\s*'([^']+)',\s*"
        r"title:\s*'([^']+)',\s*"
        r"date:\s*'([^']+)',\s*"
        r"(?:thumbnail:\s*'[^']+',\s*)?"
        r"content:\s*`(.*?)`,\s*"
        r"\}", 
        re.DOTALL
    )

    def replacer(match):
        article_full = match.group(0)
        article_id = match.group(1)
        article_title = match.group(2)
        article_date = match.group(3)
        article_content = match.group(4)
        
        has_thumbnail_prop = "thumbnail:" in article_full
        
        if not has_thumbnail_prop:
            print(f"Generating thumbnail for {article_id}...")
            
            # Extract a sensible subtitle from the first <p class="intro">
            subtitle = ""
            intro_match = re.search(r'<p class="intro">(.*?)</p>', article_content, re.DOTALL)
            if intro_match:
                # remove html tags
                raw_text = re.sub(r'<[^>]+>', '', intro_match.group(1)).strip()
                subtitle = raw_text.replace('\n', '')[:40]
                
            # Create image
            img_rel_path = create_thumbnail(article_id, article_title, subtitle)
            
            # Insert thumbnail property
            # Find the date line and insert after it
            new_block = re.sub(
                r"(date:\s*'[^']+',)",
                rf"\1\n    thumbnail: '{img_rel_path}',",
                article_full,
                count=1
            )
            
            # Update content string to include the <img> tag after <p class="intro">
            # If no intro, just prepend it
            img_html = f"""
      <div style="text-align: center; margin: 24px 0;">
        <img src="{img_rel_path}" alt="{article_title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
      </div>"""
            
            if "</p>" in new_block:
                # We find the first </p> and insert after it
                # Specifically matching <p class="intro"> if possible
                if '<p class="intro">' in new_block:
                    # split and insert
                    parts = new_block.split('</p>', 1)
                    if len(parts) == 2:
                        new_block = parts[0] + '</p>' + img_html + parts[1]
                else:
                    parts = new_block.split('</p>', 1)
                    if len(parts) == 2:
                        new_block = parts[0] + '</p>' + img_html + parts[1]
            else:
                # No <p> found, just insert at start of content
                new_block = new_block.replace("content: `", f"content: `{img_html}\n", 1)
                
            return new_block
            
        else:
            return article_full

    new_content = pattern.sub(replacer, content)

    if new_content != content:
        with open(ARTICLES_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Updated articles.ts successfully.")
    else:
        print("No articles missing thumbnails were found.")

if __name__ == "__main__":
    process_articles()
