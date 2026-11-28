/**
 * 通貨強弱グラフの線の色と、凡例に出す短いコード。
 * 期間のタブ (StrengthChart) と本日タブ (StrengthToday) で同じ色にするため、ここに 1 つだけ置く。
 */

// 黒地で見分けがつく彩度の高い色。期間を切り替えても線の色は変えない。
export const COLORS: Record<string, string> = {
  JPY: '#ffffff',
  USD: '#22d3ee',
  TRY: '#ff4d4f',
  MXN: '#ffd400',
  ZAR: '#4ade80',
  HUF: '#a78bfa',
  PLN: '#fb923c',
  AUD: '#14b8a6',
  // EUR/CHF (2026-09-11 追加)。色相環の空きに置いた。既存 10 系列の色相は
  // 27/50/142/173/187/199/258/291/359 (+ 白) で、50-142 と 291-359 が空く。
  // EUR = ライム (色相 82)・CHF = ピンク (色相 330)。どちらも最近傍まで
  // 29 度以上あり、既存で最も近い USD-AUD の 14 度より余裕がある。
  EUR: '#a3e635',
  CHF: '#f472b6',
  // GBP (2026-09-29 追加)。色相 約 225。最近傍 (199 / 258) からどちらも 25 度以上離れる。
  GBP: '#4f7cff',
  // CNH (2026-10-09 追加)。色相 273。最近傍 (HUF 255 / CHFTRY_S 292) から 18 度以上離れる。
  CNH: '#a242f0',
  CHFTRY_S: '#e879f9',
  CHFTRY_B: '#38bdf8',
  // USD/TRY 売り (2026-10-06 追加)。色相 120。最近傍 (EUR 82 / 142) から 20 度以上離れる。
  USDTRY_S: '#5fd35f',
  // USD/CHF 買い (2026-11-13 に USD/TRY 売りと並べて追加)。色相 158。最近傍 (ZAR 142 / AUD 173) から
  // 15 度以上離れる (既存で最も近い USD-AUD の 14 度より狭くしない)。参照系列は破線なので実線の通貨とも分かれる。
  USDCHF_B: '#34d399',
};

// 凡例に出す短いコード。通貨は3文字コードのままでよいが、参照系列は
// 内部コード (CHFTRY_S) をそのまま出すと読めないので置き換える。
export const DISPLAY_CODES: Record<string, string> = {
  CHFTRY_S: 'CHF/TRY売',
  CHFTRY_B: 'CHF/TRY買',
  USDTRY_S: 'USD/TRY売',
  USDCHF_B: 'USD/CHF買',
};
