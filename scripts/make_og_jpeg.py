# -*- coding: utf-8 -*-
"""記事サムネイル (WebP) の JPEG の写しを public/images/og/ に作る。

★にほんブログ村は記事画像を OGP (og:image) から取り、対応は JPEG・GIF・PNG だけ (WebP は取れない)。
  出典: blogmura-help.muragon.com/entry/156.html
  記事ページの og:image は lib/ogImage.ts がこの写しに向ける。ページの中に見せる画像は WebP のまま。

使い方:
  py scripts/make_og_jpeg.py           # data/articles.ts のサムネイルと既定の画像のうち、写しが無いもの・
                                       # WebP より古いもの (サムネイルを作り直した) を作る
  py scripts/make_og_jpeg.py --force   # すべて作り直す
★サムネイルを作ったり作り直したりしたら、どの道具で作ったかによらずこれを流す。
サムネイルを作る 2 つのスクリプト (make_campaign_thumbnail.py・crop_and_place_thumbnail.py) は、
WebP を保存したあとに save_og_jpeg を呼ぶ。作り忘れは lib/ogImage.test.ts が赤で知らせる。
"""
import os
import re
import sys

from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")
OG_DIR = os.path.join(IMAGES_DIR, "og")
ARTICLES_PATH = os.path.join(BASE_DIR, "data", "articles.ts")
# lib/ogImage.ts の DEFAULT_OG_IMAGE の元 (サムネイルが無い記事の og:image)
DEFAULT_WEBP = "An_anime-style_Japanese_otaku_person_looking_at_a_-1757952948058.webp"


def save_og_jpeg(webp_path, force=True):
    """WebP の画像から public/images/og/<同じ名前>.jpg を作り、そのパスを返す。"""
    stem = os.path.splitext(os.path.basename(webp_path))[0]
    out = os.path.join(OG_DIR, stem + ".jpg")
    if not force and os.path.exists(out):
        return out
    os.makedirs(OG_DIR, exist_ok=True)
    with Image.open(webp_path) as img:
        img = img.convert("RGB")
        if img.width > 1200:
            img = img.resize((1200, round(img.height * 1200 / img.width)), Image.LANCZOS)
        img.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    print("og jpeg", out, os.path.getsize(out))
    return out


def thumbnails():
    with open(ARTICLES_PATH, encoding="utf-8") as f:
        text = f.read()
    # lib/ogImage.ts と同じ決まり: /images/ の下の .webp (大文字小文字を区別しない)。写しの名前はファイル名だけ
    names = [m.group(1) for m in re.finditer(r"thumbnail:\s*['\"]/images/([^'\"]+\.webp)['\"]", text, re.I)]
    return sorted(set(names + [DEFAULT_WEBP]))


def is_stale(src, out):
    """写しが無いか、元の WebP より古い (サムネイルを作り直した) なら True。"""
    return not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(src)


def main(argv):
    force = "--force" in argv
    made = 0
    for name in thumbnails():
        src = os.path.join(IMAGES_DIR, *name.split("/"))
        if not os.path.exists(src):
            print("MISSING", src)
            continue
        stem = os.path.splitext(os.path.basename(name))[0]
        if force or is_stale(src, os.path.join(OG_DIR, stem + ".jpg")):
            save_og_jpeg(src)
            made += 1
    print("made", made)


if __name__ == "__main__":
    main(sys.argv[1:])
