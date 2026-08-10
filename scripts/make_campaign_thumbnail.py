# -*- coding: utf-8 -*-
"""キャンペーン記事サムネ生成 (1200x900 / 4:3)

m2j-try-swap-campaign-202608 で確立したフラット組版スタイル。
AI 生成画像を使う旧スタイルと違い、毎月同じ見た目を決定論的に再現できる。

使い方: 下の CONFIG を書き換えて `py scripts/make_campaign_thumbnail.py`
出力先は public/images/<article_id>_60.png。
記事側では thumbnail_text を設定しないこと (文字が二重に乗る)。
"""
import os
from PIL import Image, ImageDraw, ImageFont

CONFIG = {
    "article_id": "triauto-campaign-20260810",
    "brand": "トライオートFX",       # 上部ピル
    "line1": "トルコリラ/円",         # 見出し1行目
    "line2": "スワップ",              # 見出し2行目
    "rate": "50%",                    # 赤の特大数値
    "rate_suffix": " 増額",
    "box_label": "実質 ",             # 下部ボックス
    "box_value": "36.3",
    "box_unit": " 円 / 1万通貨・1日",
    "period": "2026年8月10日 〜 8月31日",
}

W, H = 1200, 900
CREAM = (253, 246, 236)
NAVY = (26, 46, 74)
RED = (222, 63, 55)
GREEN = (30, 138, 76)
ORANGE = (232, 122, 32)
GRAY = (122, 130, 140)
CIRCLE = (243, 233, 219)

FONT_PATH = r"C:\Windows\Fonts\BIZ-UDGothicB.ttc"


def f(size):
    return ImageFont.truetype(FONT_PATH, size, index=0)


def main(cfg):
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)

    def center(text, font, y, fill):
        x0, y0, x1, _ = d.textbbox((0, 0), text, font=font)
        d.text(((W - (x1 - x0)) / 2 - x0, y - y0), text, font=font, fill=fill)

    # 装飾円 + 上下バー
    d.ellipse([1010, 60, 1330, 380], fill=CIRCLE)
    d.ellipse([-140, 640, 160, 940], fill=CIRCLE)
    d.rectangle([0, 0, W, 22], fill=NAVY)
    d.rectangle([0, H - 22, W, H], fill=ORANGE)

    # 業者名ピル
    pf = f(40)
    x0, y0, x1, y1 = d.textbbox((0, 0), cfg["brand"], font=pf)
    tw, th = x1 - x0, y1 - y0
    px, py = (W - tw) / 2, 90
    d.rounded_rectangle([px - 44, py - 24, px + tw + 44, py + th + 24], radius=44, fill=NAVY)
    d.text((px - x0, py - y0), cfg["brand"], font=pf, fill=CREAM)

    # 見出し
    big = f(112)
    center(cfg["line1"], big, 200, NAVY)
    center(cfg["line2"], big, 325, NAVY)

    # 増額率
    nf, sf = f(150), f(104)
    n0, m0, n1, _ = d.textbbox((0, 0), cfg["rate"], font=nf)
    s0, t0, s1, _ = d.textbbox((0, 0), cfg["rate_suffix"], font=sf)
    sx = (W - ((n1 - n0) + (s1 - s0))) / 2
    d.text((sx - n0, 455 - m0), cfg["rate"], font=nf, fill=RED)
    d.text((sx + (n1 - n0) - s0, 495 - t0), cfg["rate_suffix"], font=sf, fill=RED)

    # 実質スワップのボックス
    bx0, by0, bx1, by1 = 150, 630, W - 150, 762
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=18, fill=(255, 255, 255), outline=GREEN, width=5)
    lf, vf = f(44), f(66)
    parts = [(cfg["box_label"], lf, GRAY), (cfg["box_value"], vf, GREEN), (cfg["box_unit"], lf, GRAY)]
    widths = [d.textbbox((0, 0), t, font=fo)[2] - d.textbbox((0, 0), t, font=fo)[0] for t, fo, _ in parts]
    cx = (W - sum(widths)) / 2
    mid = (by0 + by1) / 2
    for (t, fo, col), w in zip(parts, widths):
        a, b, _, e = d.textbbox((0, 0), t, font=fo)
        d.text((cx - a, mid - (e - b) / 2 - b), t, font=fo, fill=col)
        cx += w

    center(cfg["period"], f(42), 800, GRAY)

    out = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "public", "images", cfg["article_id"] + "_60.png",
    )
    img.save(out, optimize=True)
    print("saved", out, os.path.getsize(out), img.size)


if __name__ == "__main__":
    main(CONFIG)
