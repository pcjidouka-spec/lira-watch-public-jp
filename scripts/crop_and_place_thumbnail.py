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

    # --- Draw Text Overlay ---
    overlay = Image.new('RGBA', (TARGET_WIDTH, TARGET_HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    # Gradient overlay from left
    for x in range(TARGET_WIDTH):
        alpha = int(200 * (1 - x / (TARGET_WIDTH * 0.8)))
        if alpha < 0: alpha = 0
        overlay_draw.line([(x, 0), (x, TARGET_HEIGHT)], fill=(0, 0, 0, alpha))
    
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype(FONT_PATH, 28)
        subtitle_font = ImageFont.truetype(FONT_PATH, 16)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # --- Helper for text wrapping ---
    def wrap_text(text, font, max_width):
        lines = []
        words = list(text) # Since it's Japanese, chars are better than words for wrapping
        current_line = ""
        for char in words:
            test_line = current_line + char
            w = draw.textlength(test_line, font=font)
            if w <= max_width:
                current_line = test_line
            else:
                lines.append(current_line)
                current_line = char
        lines.append(current_line)
        return lines

    # Wrap and Draw Title
    title_max_width = TARGET_WIDTH * 0.8
    title_lines = wrap_text(title, title_font, title_max_width)
    
    # Only allow 2 lines for title, truncate if more
    if len(title_lines) > 2:
        title_lines = title_lines[:2]
        title_lines[1] = title_lines[1][:len(title_lines[1])-1] + "..."

    y_offset = 30
    for line in title_lines:
        draw.text((20, y_offset), line, font=title_font, fill=(255, 255, 255, 255))
        y_offset += 35
    
    # Draw Subtitle (adjust based on title height)
    if len(subtitle) > 40:
        subtitle = subtitle[:37] + "..."
    draw.text((20, y_offset + 5), subtitle, font=subtitle_font, fill=(200, 200, 200, 255))
    
    # Save image (converting to RGB to drop alpha for JPEG/PNG uniformity if needed)
    img = img.convert("RGB")
    img.save(output_path, quality=90)
    print(f"Successfully cropped, labeled, and saved to {output_path}")

def get_article_details(article_id):
    with open(ARTICLES_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(
        r"\{\s*"
        r"id:\s*'([^']+)',\s*"
        r"title:\s*'([^']+)',\s*"
        r"date:\s*'([^']+)',.*?"
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
        
        img_html = f'<div style="text-align: center; margin: 24px 0;">\n        <img src="{img_rel_path}" alt="{article_title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />\n      </div>'
        
        # Replace or inject img in content
        if '<div style="text-align: center; margin: 24px 0;">' in article_content and 'img src="/images/' in article_content:
             article_content = re.sub(
                r'<div style="text-align: center; margin: 24px 0;">\s*<img src="/images/[A-Za-z0-9_-]+\.png" alt="[^"]+" style="[^"]+" />\s*</div>',
                img_html,
                article_content,
                count=1
            )
        elif img_html not in article_content:
            if '</p>' in article_content:
                parts = article_content.split('</p>', 1)
                article_content = parts[0] + '</p>\n\n      ' + img_html + parts[1]
            else:
                article_content = "\n      " + img_html + article_content
                    
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
    
    title, subtitle = get_article_details(article_id)
    crop_and_resize(input_image, output_path, title, subtitle)
    inject_to_articles(article_id, rel_path)
