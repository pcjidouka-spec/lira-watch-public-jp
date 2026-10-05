/**
 * 通貨強弱グラフ (/strength) に載っている通貨の一覧と、その日本語名。
 *
 * ページの説明文の「N通貨」と通貨名の列挙は、ここで public/data/strength.json から作る。
 * 以前は数と名前を手で書いていたので、通貨を足すたびに直し漏れが出た
 * (英ポンド追加の直後に「10通貨」が残った。2026-09-29)。
 */

export const CURRENCY_LABELS: Record<string, string> = {
  JPY: '日本円',
  USD: '米ドル',
  TRY: 'トルコリラ',
  MXN: 'メキシコペソ',
  ZAR: '南アフリカランド',
  HUF: 'ハンガリーフォリント',
  PLN: 'ポーランドズロチ',
  AUD: '豪ドル',
  EUR: 'ユーロ',
  CHF: 'スイスフラン',
  GBP: '英ポンド',
  CHFTRY_S: 'CHF/TRY 売り（フラン売り・リラ買い）',
  CHFTRY_B: 'CHF/TRY 買い（フラン買い・リラ売り）',
  USDTRY_S: 'USD/TRY 売り（ドル売り・リラ買い）',
};

// 参照系列 (破線) の説明。表示中の系列だけから組み立てる (2026-10-06)。
// ★以前は CHF/TRY 専用の文が固定で、USD/TRY 売りが加わると「1万フラン」と
//   書いたまま別の線が出ていた。
const CHFTRY_REFERENCE_NOTE =
  '破線の「CHF/TRY売」「CHF/TRY買」は通貨ではなくポジションです。どちらも' +
  '1万フラン相当を、レバレッジ1倍で持ち続けた場合を表しています。' +
  '「売」はフランを売ってトルコリラを買う組み合わせで、円で調達するかわりに' +
  'スイスフランで調達してリラを買うとどうなるかを見る線です。「買」はその逆' +
  '（フランを買ってリラを売る）になります。' +
  '売と買は正反対の建玉ですが、線が上下対称にならないのは、それぞれ' +
  'スワップが最も有利な会社を選んでいるうえ、売買それぞれに会社の' +
  'スプレッドが乗るためです。';

const USDTRY_REFERENCE_NOTE =
  '破線の「USD/TRY売」も通貨ではなくポジションです。1万ドル相当を、レバレッジ1倍で' +
  '持ち続けた場合を表しています。ドルを売ってトルコリラを買う組み合わせで、' +
  '円で調達するかわりに米ドルで調達してリラを買うとどうなるかを見る線です。';

/** どの参照系列にも共通する説明。strong は太字で出す部分 */
export const REFERENCE_NOTE_COMMON = {
  strong: '平均を1.0に揃える計算には入れておらず、平均で割ってもいません',
  rest:
    '。これらの線は円の動きで損益が変わらない建玉なので、起点を1.0にしたそのままの' +
    '損益を出しています。通貨の線どうしではなく、1.0の水平線（＝円で持った場合）' +
    'と比べて読んでください。',
} as const;

/** 表示中の参照系列に対応する説明の段落 (共通部分は REFERENCE_NOTE_COMMON)。参照系列が無ければ空 */
export function referenceNotes(refs: readonly string[]): string[] {
  const notes: string[] = [];
  if (refs.includes('CHFTRY_S') || refs.includes('CHFTRY_B')) notes.push(CHFTRY_REFERENCE_NOTE);
  if (refs.includes('USDTRY_S')) notes.push(USDTRY_REFERENCE_NOTE);
  return notes;
}

type StrengthCurrencySource = {
  base: string;
  periods: Record<string, { series: Record<string, unknown>; references?: string[] }>;
};

/**
 * どれかの期間に描かれている通貨のコード (参照系列を除く)。基準通貨は最後。
 *
 * ★期間ごとの和集合であって、「最も多いタブの顔ぶれ」とは限らない。
 *   起点日に値が無い通貨はそのタブから外れるので、1w に A だけ・1m に B だけ
 *   ということが起こりうる (2026-09-29 独立レビュー)。そのため説明文では
 *   「最大N通貨」と書かず、「N通貨 (期間によっては表示されない通貨がある)」と書く。
 *   数と名前の列挙はどちらもこの和集合から作るので、互いに食い違わない。
 */
export function strengthCurrencies(data: StrengthCurrencySource): string[] {
  const refs = new Set<string>();
  for (const p of Object.values(data.periods)) {
    for (const r of p.references ?? []) refs.add(r);
  }
  const seen: string[] = [];
  for (const p of Object.values(data.periods)) {
    for (const code of Object.keys(p.series)) {
      if (!refs.has(code) && code !== data.base && !seen.includes(code)) seen.push(code);
    }
  }
  return [...seen, data.base];
}

export function strengthCurrencyNames(codes: string[]): string[] {
  return codes.map((c) => CURRENCY_LABELS[c] ?? c);
}
