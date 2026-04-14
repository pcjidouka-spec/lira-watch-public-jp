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

def process_thumbnail(input_path, output_path, text_lines=None):
    img = Image.open(input_path).convert("RGB")

    # AI generated images are usually 1:1. We want to pad them to 4:3 instead of cropping
    # to avoid losing text at the top or bottom.
    w, h = img.size

    target_aspect = 4 / 3
    current_aspect = w / h

    if current_aspect < target_aspect:
        new_w = int(h * target_aspect)
        new_h = h
        new_img = Image.new("RGB", (new_w, new_h), (255, 255, 255))
        offset_x = (new_w - w) // 2
        new_img.paste(img, (offset_x, 0))
        img = new_img
    elif current_aspect > target_aspect:
        new_w = w
        new_h = int(w / target_aspect)
        new_img = Image.new("RGB", (new_w, new_h), (255, 255, 255))
        offset_y = (new_h - h) // 2
        new_img.paste(img, (0, offset_y))
        img = new_img

    # Overlay text if provided
    if text_lines:
        img = overlay_text(img, text_lines)

    img.save(output_path, quality=95)
    print(f"Successfully processed thumbnail to {output_path}")


def overlay_text(img, text_lines):
    """Overlay text on image with semi-transparent background band (zabuton)."""
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = img.size

    # Font size: 10-15% of image height
    main_font_size = max(48, int(h * 0.08))
    sub_font_size = max(36, int(h * 0.06))

    try:
        main_font = ImageFont.truetype(FONT_PATH, main_font_size)
        sub_font = ImageFont.truetype(FONT_PATH, sub_font_size)
    except (OSError, IOError):
        print("Warning: Meiryo Bold not found, using default font")
        main_font = ImageFont.load_default()
        sub_font = main_font

    fonts = [main_font] + [sub_font] * (len(text_lines) - 1)

    # Calculate total text height
    line_spacing = 12
    total_height = 0
    line_sizes = []
    for i, line in enumerate(text_lines):
        bbox = draw.textbbox((0, 0), line, font=fonts[i])
        lw, lh = bbox[2] - bbox[0], bbox[3] - bbox[1]
        line_sizes.append((lw, lh))
        total_height += lh + (line_spacing if i < len(text_lines) - 1 else 0)

    # Draw semi-transparent background band (zabuton) at bottom
    padding = 20
    band_top = h - total_height - padding * 2
    draw.rectangle(
        [(0, band_top), (w, h)],
        fill=(0, 0, 0, 180)
    )

    # Draw text with stroke (outline) for readability
    y = band_top + padding
    for i, line in enumerate(text_lines):
        lw = line_sizes[i][0]
        x = (w - lw) // 2  # Center horizontally
        # Stroke (outline)
        draw.text((x, y), line, font=fonts[i], fill=(255, 255, 255, 255),
                  stroke_width=3, stroke_fill=(0, 0, 0, 255))
        y += line_sizes[i][1] + line_spacing

    return img.convert("RGB")

def get_article_details(article_id):
    """Check article exists and return thumbnail_text lines if available."""
    with open(ARTICLES_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    if article_id not in content:
        return None
    # Extract thumbnail_text
    pattern = re.search(
        r"id:\s*'" + re.escape(article_id) + r"'.*?thumbnail_text:\s*'([^']*)'",
        content, re.DOTALL
    )
    if pattern:
        raw = pattern.group(1)
        lines = raw.replace("\\n", "\n").split("\n")
        return [l.strip() for l in lines if l.strip()]
    return []

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
    
    text_lines = get_article_details(article_id)
    if text_lines is not None:
        process_thumbnail(input_image, output_path, text_lines=text_lines or None)
        inject_to_articles(article_id, rel_path)
    else:
        print(f"Error: Article ID '{article_id}' not found in articles.ts.")
        sys.exit(1)
