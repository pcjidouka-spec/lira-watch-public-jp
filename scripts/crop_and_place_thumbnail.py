import os
import sys
import re
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTICLES_PATH = os.path.join(BASE_DIR, "data", "articles.ts")
IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")

TARGET_WIDTH = 640
TARGET_HEIGHT = 160
FONT_PATH = "C:\\Windows\\Fonts\\meiryob.ttc"  # Using Meiryo Bold for Japanese

def process_thumbnail(input_path, output_path):
    img = Image.open(input_path).convert("RGB")
    
    # AI generated images are usually 1:1. We want to auto-crop them to 4:3
    w, h = img.size
    
    # Target 4:3 ratio
    target_h = int(w * 3 / 4)
    
    if h > target_h:
        # It's taller than 4:3, so we crop the center
        top = (h - target_h) // 2
        bottom = top + target_h
        img = img.crop((0, top, w, bottom))
    
    img.save(output_path, quality=95)
    print(f"Successfully processed and saved 4:3 thumbnail to {output_path}")

def get_article_details(article_id):
    # This is still used by the main block to verify article existence, 
    # even if we don't use title/subtitle for overlay anymore.
    with open(ARTICLES_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    return article_id in content

def inject_to_articles(article_id, img_rel_path):
    with open(ARTICLES_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(
        r"\{\s*"
        r"id:\s*'([^']+)',\s*"
        r"title:\s*'([^']+)',\s*"
        r"date:\s*'([^']+)',"
        r"(.*?)"
        r"content:\s*`(.*?)`,\s*"
        r"\}", 
        re.DOTALL
    )

    def replacer(match):
        current_id = match.group(1)
        if current_id != article_id:
            return match.group(0)
            
        article_title = match.group(2)
        article_date = match.group(3)
        article_props = match.group(4)
        article_content = match.group(5)
        
        # Check if thumbnail already exists in the props
        if "thumbnail:" not in article_props:
            article_props = f"\n    thumbnail: '{img_rel_path}'," + article_props
        else:
            # Update existing thumbnail path if needed
            article_props = re.sub(r"thumbnail:\s*'[^']+'", f"thumbnail: '{img_rel_path}'", article_props)
        
        return f"{{\n    id: '{current_id}',\n    title: '{article_title}',\n    date: '{article_date}',{article_props}content: `{article_content}`,\n  }}"

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
    
    if get_article_details(article_id):
        process_thumbnail(input_image, output_path)
        inject_to_articles(article_id, rel_path)
    else:
        print(f"Error: Article ID '{article_id}' not found in articles.ts.")
        sys.exit(1)
