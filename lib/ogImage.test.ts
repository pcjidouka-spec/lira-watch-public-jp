import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ogImagePath, ogImageUrl, DEFAULT_OG_IMAGE, SITE_URL } from './ogImage';
import { articles } from '../data/articles';

// ★にほんブログ村は記事画像を OGP (og:image) から取り、対応は JPEG・GIF・PNG だけ (WebP は取れない)。
//   出典: blogmura-help.muragon.com/entry/156.html。記事の画像は WebP なので、og:image には JPEG の写しを出す。

const PUBLIC = join(__dirname, '..', 'public');
const toFile = (p: string) => join(PUBLIC, ...p.split('/').filter(Boolean));

/** ブログ村が取れる形式 (JPEG・PNG・GIF) かを先頭のバイトで見る。 */
function isAcceptedImage(path: string): boolean {
  const b = readFileSync(path);
  const jpeg = b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const gif = b.length > 6 && ['GIF87a', 'GIF89a'].includes(b.subarray(0, 6).toString('ascii'));
  return jpeg || png || gif;
}

describe('ogImagePath', () => {
  it('WebP のサムネイルは /images/og/ の同じ名前の JPEG に向ける', () => {
    expect(ogImagePath('/images/gaitame-swap-campaign-202611_60.webp')).toBe(
      '/images/og/gaitame-swap-campaign-202611_60.jpg',
    );
  });

  it('写しの名前はファイル名だけで決める (scripts/make_og_jpeg.py と同じ)', () => {
    expect(ogImagePath('/images/sub/foo_60.WEBP')).toBe('/images/og/foo_60.jpg');
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

describe('ogImageUrl', () => {
  it('写しがあれば、サイトの URL の下の写しを返す', () => {
    expect(ogImageUrl('/images/foo_60.webp', () => true)).toBe(`${SITE_URL}/images/og/foo_60.jpg`);
  });

  it('★写しが無ければ既定の画像に落とす (存在しない URL を出さない)', () => {
    const seen: string[] = [];
    const url = ogImageUrl('/images/foo_60.webp', (p) => {
      seen.push(p);
      return p === DEFAULT_OG_IMAGE;
    });
    expect(url).toBe(SITE_URL + DEFAULT_OG_IMAGE);
    expect(seen[0]).toBe('/images/og/foo_60.jpg');
  });

  it('ブログ村の決まり: 画像はブログのトップの URL の下 (サブドメイン不可)', () => {
    expect(ogImageUrl(undefined, () => true).startsWith('https://www.lira-watch.sbs/images/')).toBe(true);
  });
});

describe('記事ごとの og:image の実物', () => {
  // ★新しい記事で写しを作り忘れると、ここが赤になる (scripts/make_og_jpeg.py で作る)。
  //   本番で作り忘れたまま出ても、ogImageUrl が既定の画像に落とすので壊れた URL は出ない
  const targets = [
    ...articles.map((a) => ({ id: a.id, path: ogImagePath(a.thumbnail) })),
    { id: '(default)', path: DEFAULT_OG_IMAGE },
  ];

  it.each(targets)('$id の og:image は public の下に実在する JPEG・PNG・GIF', ({ path }) => {
    expect(path.startsWith('/images/')).toBe(true);
    const file = toFile(path);
    expect(existsSync(file)).toBe(true);
    expect(isAcceptedImage(file)).toBe(true);
  });
});
