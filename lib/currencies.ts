/**
 * 通貨ペア定義の唯一の正本 (2026-09-11 新設)。
 *
 * ここを直すだけでタブ・ラベル・注記・クロスペア判定がすべて追随する。
 * 以前は index.tsx の中に同じ通貨名が 6 箇所 (useSwapData / CurrencyTab の
 * union / dataMap / currencyLabelMap / activeNoteText / isJpyGroup) と
 * ボタンブロック 4 箇所に散っており、通貨を 1 つ足すたびに 10 箇所直していた。
 *
 * ★published は「ランキング表のタブに出すか」。データ取得や集計とは無関係。
 *   公開ゲート (docs/superpowers/specs/2026-09-11-eurjpy-chfjpy-phase2-design.md §5-2):
 *     その通貨で取得に成功している業者のうち 2/3 以上が 14 日窓に 7 日以上の
 *     データを持つこと。かつ該当業者が 6 社以上あること。
 *   ★EUR/JPY と CHF/JPY は 2026-09-11 時点で未達 (EUR 5 社 / CHF 4 社)。
 *     日次で全社が 14 日窓に 7 日たまる 2026-09-19 頃に true にする。
 *     ★true にする前に必ずゲートを実測し直すこと。日付で決め打ちしない。
 */

export type CurrencyGroup = 'emerging' | 'developed' | 'cross';

export interface CurrencyDef {
  /** master_history と同じ表記。dataProcessor の判定キーでもある */
  code: string;
  /** タブと見出しに出す短い名前 */
  label: string;
  group: CurrencyGroup;
  /** ランキング表のタブに出すか。false でもデータ層には存在する */
  published: boolean;
  /** 表の下に出す注記。単位や符号が他と違う通貨だけ持つ */
  note?: string;
  /**
   * タブが選択状態のときの背景色。
   * ★既存の見た目を変えないため、index.tsx に直書きされていた色を
   *   そのまま移した。EUR/JPY と CHF/JPY だけ新規で、通貨強弱グラフ
   *   (components/StrengthChart.tsx の COLORS) と同じ色を使う。
   */
  color: string;
}

export const GROUP_LABELS: Record<CurrencyGroup, string> = {
  emerging: '新興国通貨',
  developed: '先進国通貨',
  cross: 'クロス通貨',
};

/** 群の表示順。タブの並びはこの順に従う */
export const GROUP_ORDER: readonly CurrencyGroup[] = ['emerging', 'developed', 'cross'];

const HUF_NOTE =
  '※ HUF/JPY は 10万通貨単位あたりの値です。1万通貨単位で掲載している会社の値は 10万通貨単位に換算して比較しています。';

const CROSS_NOTE =
  '※ クロスペアは各社が円換算した 1万通貨単位あたりの値です。GBP/USDなど金利差が小さい通貨ペアでは、各社のスワップポリシーやマージンにより値や符号が異なる場合があります。';

const CHFTRY_NOTE =
  '※ CHF/TRY は各社が円換算した 1万通貨単位あたりの値です。スイスとトルコの金利差が非常に大きいため、買い（フラン買い・リラ売り）は各社ともマイナス、売り（フラン売り・リラ買い）はプラスになります。';

// ★CHF/JPY は買がマイナス・売がプラス。他の対円通貨と符号が逆なので注記する。
// 並び順は降順のまま (-5 が -94 より上) で、表示は生値。
// 決定の経緯: 上記 spec §5-3。
const CHFJPY_NOTE =
  '※ CHF/JPY はスイスの金利が日本より低いため、買い（フラン買い・円売り）は各社ともマイナス、売り（フラン売り・円買い）はプラスになります。数値は各社の公表値をそのまま表示しています。';

export const CURRENCIES: readonly CurrencyDef[] = [
  // --- 新興国通貨 ---
  { code: 'TRY/JPY', label: 'トルコリラ', group: 'emerging', published: true, color: '#3b82f6' },
  { code: 'MXN/JPY', label: 'メキシコペソ', group: 'emerging', published: true, color: '#10b981' },
  { code: 'HUF/JPY', label: 'ハンガリーフォリント', group: 'emerging', published: true, note: HUF_NOTE, color: '#ec4899' },
  { code: 'ZAR/JPY', label: '南アフリカランド', group: 'emerging', published: true, color: '#f59e0b' },
  { code: 'PLN/JPY', label: 'ポーランドズロチ', group: 'emerging', published: true, color: '#0ea5e9' },
  // --- 先進国通貨 ---
  // ★AUD/JPY は新興国通貨から先進国通貨へ移した (ユーザー承認済み)。
  { code: 'USD/JPY', label: '米ドル円', group: 'developed', published: true, color: '#f59e0b' },
  { code: 'AUD/JPY', label: '豪ドル', group: 'developed', published: true, color: '#14b8a6' },
  { code: 'EUR/JPY', label: 'ユーロ', group: 'developed', published: false, color: '#a3e635' },
  { code: 'CHF/JPY', label: 'スイスフラン', group: 'developed', published: false, note: CHFJPY_NOTE, color: '#f472b6' },
  // --- クロス通貨 ---
  { code: 'EUR/USD', label: 'EUR/USD', group: 'cross', published: true, note: CROSS_NOTE, color: '#8b5cf6' },
  { code: 'GBP/USD', label: 'GBP/USD', group: 'cross', published: true, note: CROSS_NOTE, color: '#ef4444' },
  { code: 'CHF/TRY', label: 'スイスフラン/トルコリラ', group: 'cross', published: true, note: CHFTRY_NOTE, color: '#0d9488' },
];

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

/** タブに出す通貨 (published のみ)。群の指定がなければ全群。 */
export function publishedCurrencies(group?: CurrencyGroup): CurrencyDef[] {
  return CURRENCIES.filter((c) => c.published && (group === undefined || c.group === group));
}

export function currencyDef(code: string): CurrencyDef | undefined {
  return BY_CODE.get(code);
}

export function labelOf(code: string): string {
  return BY_CODE.get(code)?.label ?? code;
}

export function noteOf(code: string): string | undefined {
  return BY_CODE.get(code)?.note;
}

export function groupOf(code: string): CurrencyGroup | undefined {
  return BY_CODE.get(code)?.group;
}

/**
 * クロスペアのコード一覧。
 * ★published は見ない。表示の有無と、ペアの性質 (円建てでない) は別の話。
 *   dataProcessor の 0 の扱いなどは未公開の通貨にも効いている必要がある。
 */
export const CROSS_PAIR_CODES: readonly string[] = CURRENCIES.filter(
  (c) => c.group === 'cross'
).map((c) => c.code);
