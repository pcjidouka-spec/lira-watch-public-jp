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
};

type StrengthCurrencySource = {
  base: string;
  periods: Record<string, { series: Record<string, unknown>; references?: string[] }>;
};

/**
 * どれかの期間に描かれている通貨のコード (参照系列を除く)。基準通貨は最後。
 *
 * ★期間ごとに母集団が違う (履歴の短い通貨は長期タブで「データ不足」になる) ので、
 *   和集合 = 最も多いタブの顔ぶれになる。説明文では「最大N通貨」と書く。
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
