// 記事ページの og:image に出す画像。
//
// ★にほんブログ村は記事画像を OGP (og:image) から取り、対応は JPEG・GIF・PNG だけ (WebP は取れない)。
//   出典: blogmura-help.muragon.com/entry/156.html
//   記事のサムネイルは WebP なので、og:image には public/images/og/ に置いた同じ名前の JPEG の写しを出す。
//   写しは scripts/make_og_jpeg.py が作る (サムネイルを作り直したら流す。WebP より古い写しは作り直す)。
//   ページの中に見せる画像は WebP のまま (軽さを変えない)。
// ★写しが無いときは既定の画像の JPEG に落とす (存在しない URL を og:image に出さない)。
// ★RSS (scripts/generate-rss.js) の画像は WebP のまま。ブログ村は og:image から取る (同じヘルプ)。

export const SITE_URL = 'https://www.lira-watch.sbs';

/** サムネイルが無い記事・写しが無い記事の og:image (既定の画像の JPEG の写し)。 */
export const DEFAULT_OG_IMAGE = '/images/og/An_anime-style_Japanese_otaku_person_looking_at_a_-1757952948058.jpg';

/** サムネイルのパス (例 `/images/foo_60.webp`) から og:image のパスを返す。
 *  写しの名前はファイル名だけで決める (scripts/make_og_jpeg.py と同じ決まり)。 */
export function ogImagePath(thumbnail?: string): string {
  if (!thumbnail) return DEFAULT_OG_IMAGE;
  const m = /^\/images\/(?:.*\/)?([^/]+)\.webp$/i.exec(thumbnail);
  if (m) return `/images/og/${m[1]}.jpg`;
  return thumbnail;
}

/** og:image の URL。exists は public の下のパス (`/images/...`) が実在するかを返す (ビルド時に fs で渡す)。 */
export function ogImageUrl(thumbnail: string | undefined, exists: (publicPath: string) => boolean): string {
  const path = ogImagePath(thumbnail);
  return SITE_URL + (exists(path) ? path : DEFAULT_OG_IMAGE);
}
