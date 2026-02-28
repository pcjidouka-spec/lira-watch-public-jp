import os
import sys
import re
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTICLES_PATH = os.path.join(BASE_DIR, "data", "articles.ts")
IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")

TARGET_WIDTH = 640
TARGET_HEIGHT = 160
FONT_PATH = "C:\\Windows\\Fonts\\meiryob.ttc"  # Using Meiryo Bold for Japanese

def crop_and_resize(input_path, output_path, title="", subtitle=""):
    img = Image.open(input_path).convert("RGBA")
    
    # Calculate target aspect ratio
    target_aspect = TARGET_WIDTH / TARGET_HEIGHT
    img_aspect = img.width / img.height
    
    # Resize and crop to fill 640x160
    if img_aspect > target_aspect:
        # Image is wider than needed, crop sides
        new_height = TARGET_HEIGHT
        new_width = int(new_height * img_aspect)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        left = (img.width - TARGET_WIDTH) // 2
        top = 0
        right = left + TARGET_WIDTH
        bottom = TARGET_HEIGHT
    else:
        # Image is taller than needed, crop top/bottom
        new_width = TARGET_WIDTH
        new_height = int(new_width / img_aspect)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        left = 0
        top = (img.height - TARGET_HEIGHT) // 2
        right = TARGET_WIDTH
        bottom = top + TARGET_HEIGHT
        
    img = img.crop((left, top, right, bottom))
    
    # Save image (converting to RGB to drop alpha for JPEG/PNG uniformity if needed)
    img = img.convert("RGB")
    img.save(output_path, quality=90)
    print(f"Successfully cropped and saved to {output_path}")

def get_article_details(article_id):
    with open(ARTICLES_PATH, "r", encoding="utf-8") as f:
        content = f.read()

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
    
    for match in pattern.finditer(content):
        if match.group(1) == article_id:
            title = match.group(2)
            article_content = match.group(4)
            
            subtitle = ""
            intro_match = re.search(r'<p class="intro">(.*?)</p>', article_content, re.DOTALL)
            if intro_match:
                raw_text = re.sub(r'<[^>]+>', '', intro_match.group(1)).strip()
                subtitle = raw_text.replace('\n', '')[:40]
                
            return title, subtitle
            
    return "", ""

def inject_to_articles(article_id, img_rel_path):
    with open(ARTICLES_PATH, "r", encoding="utf-8") as f:
        content = f.read()

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
        current_id = match.group(1)
        if current_id != article_id:
            return match.group(0)
            
        article_full = match.group(0)
        article_title = match.group(2)
        
        # Check if thumbnail already exists in the block
        has_thumbnail_prop = "thumbnail:" in article_full
        
        # if missing property, inject it
        if not has_thumbnail_prop:
            article_full = re.sub(
                r"(date:\s*'[^']+',)",
                rf"\1\n    thumbnail: '{img_rel_path}',",
                article_full,
                count=1
            )
            
        # Optional: update content string to prepend <img> tag if it's not already there
        # but since we are replacing old thumbnails or injecting anew:
        img_html = f'<div style="text-align: center; margin: 24px 0;">\n        <img src="{img_rel_path}" alt="{article_title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />\n      </div>'
        
        # We want to replace the old generated img if it exists
        replaced_full, count = re.subn(
            r'<div style="text-align: center; margin: 24px 0;">\s*<img src="/images/[A-Za-z0-9_-]+\.png" alt="[^"]+" style="[^"]+" />\s*</div>',
            img_html,
            article_full,
            count=1
        )
        article_full = replaced_full
        
        # If sub failed (no previous image), inject after <p class="intro">
        if count == 0 and img_html not in article_full:
            if '</p>' in article_full:
                parts = article_full.split('</p>', 1)
                article_full = parts[0] + '</p>\n\n      ' + img_html + parts[1]
            else:
                article_full = article_full.replace("content: `", f"content: `\n      {img_html}\n", 1)
                    
        return article_full

    new_content = pattern.sub(replacer, content)

    if new_content != content:
        with open(ARTICLES_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Injected {img_rel_path} into articles.ts successfully.")
    else:
        print("No changes needed or article not found in articles.ts.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python crop_and_place_thumbnail.py <input_image_path> <article_id>")
        sys.exit(1)
        
    input_image = sys.argv[1]
    article_id = sys.argv[2]
    
    if not os.path.exists(input_image):
        print(f"Error: Could not find input image at {input_image}")
        sys.exit(1)
        
    output_filename = f"{article_id}_60.png"
    output_path = os.path.join(IMAGES_DIR, output_filename)
    rel_path = f"/images/{output_filename}"
    
    title, subtitle = get_article_details(article_id)
    crop_and_resize(input_image, output_path, title, subtitle)
    inject_to_articles(article_id, rel_path)
