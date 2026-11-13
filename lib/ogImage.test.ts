import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ogImagePath, DEFAULT_OG_IMAGE } from './ogImage';
import { articles } from '../data/articles';

// ★にほんブログ村は記事画像を OGP (og:image) から取り、対応は JPEG・GIF・PNG だけ (WebP は取れない)。
//   出典: blogmura-help.muragon.com/entry/156.html。記事の画像は WebP なので、og:image には JPEG の写しを出す。

const PUBLIC = join(__dirname, '..', 'public');

function isJpeg(path: string): boolean {
  const b = readFileSync(path);
  return b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
}

describe('ogImagePath', () => {
  it('WebP のサムネイルは /images/og/ の同じ名前の JPEG に向ける', () => {
    expect(ogImagePath('/images/gaitame-swap-campaign-202611_60.webp')).toBe(
      '/images/og/gaitame-swap-campaign-202611_60.jpg',
    );
  });

  it('サムネイルが無い記事は、既定の画像の JPEG に向ける', () => {
    expect(ogImagePath(undefined)).toBe(DEFAULT_OG_IMAGE);
    expect(DEFAULT_OG_IMAGE.endsWith('.jpg')).toBe(true);
  });

  it('JPEG・PNG・GIF のサムネイルはそのまま使う', () => {
    expect(ogImagePath('/images/a.png')).toBe('/images/a.png');
    expect(ogImagePath('/images/a.jpg')).toBe('/images/a.jpg');
    expect(ogImagePath('/images/a.gif')).toBe('/images/a.gif');
  });
});

describe('記事ごとの og:image の実物', () => {
  // ★新しい記事でサムネイルの JPEG を作り忘れると、ここが赤になる (scripts/make_og_jpeg.py で作る)
  const targets = [
    ...articles.map((a) => ({ id: a.id, path: ogImagePath(a.thumbnail) })),
    { id: '(default)', path: DEFAULT_OG_IMAGE },
  ];

  it.each(targets)('$id の og:image は public の下に実在する JPEG', ({ path }) => {
    expect(path.startsWith('/images/')).toBe(true);
    const file = join(PUBLIC, ...path.split('/').filter(Boolean));
    expect(existsSync(file)).toBe(true);
    expect(isJpeg(file)).toBe(true);
  });
});
