// 記事ページの og:image に出す画像のパス。
//
// ★にほんブログ村は記事画像を OGP (og:image) から取り、対応は JPEG・GIF・PNG だけ (WebP は取れない)。
//   出典: blogmura-help.muragon.com/entry/156.html
//   記事のサムネイルは WebP なので、og:image には public/images/og/ に置いた同じ名前の JPEG の写しを出す。
//   写しは scripts/make_og_jpeg.py が作る (サムネイルを作る 2 つのスクリプトも、作るたびに呼ぶ)。
//   ページの中に見せる画像は WebP のまま (軽さを変えない)。

/** サムネイルが無い記事の og:image (既定の画像の JPEG の写し)。 */
export const DEFAULT_OG_IMAGE = '/images/og/An_anime-style_Japanese_otaku_person_looking_at_a_-1757952948058.jpg';

/** サムネイルのパス (例 `/images/foo_60.webp`) から og:image のパスを返す。 */
export function ogImagePath(thumbnail?: string): string {
  if (!thumbnail) return DEFAULT_OG_IMAGE;
  const m = /^\/images\/(.+)\.webp$/i.exec(thumbnail);
  if (m) return `/images/og/${m[1]}.jpg`;
  return thumbnail;
}
