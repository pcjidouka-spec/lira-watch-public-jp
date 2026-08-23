import { TradingSpread } from '@/types';

/** セル表示用に分解した取引スプレッド。列を 2 行に分けて出す。 */
export interface TradingSpreadParts {
  /** 1 行目。'1.4銭' / '変動' / '非公開' / '—' */
  value: string;
  /** 2 行目。'(9-3時)' のように括弧付き。条件が無ければ undefined */
  condition?: string;
}

/**
 * 取引スプレッド（Ask-Bid）を「値」と「適用条件」に分けて返す。
 *
 * 専用の「スプレッド」列に入れるため、値だけを返す（見出しが項目名を担う）。
 * 条件を 2 行目に分けることで列幅を詰められる。
 * 未対応業者（trading_spread が undefined）は null。呼び出し側が「—」を出す。
 */
export function formatTradingSpreadParts(spread?: TradingSpread): TradingSpreadParts | null {
  if (!spread) return null;

  if (spread.mode === 'variable') return { value: '変動' };
  // 公式が開示していない社。変動スプレッド制とは別物なので文言を分ける
  if (spread.mode === 'undisclosed') return { value: '非公開' };
  if (spread.mode === 'unavailable') return { value: '—' };
  if (spread.spread == null) return { value: '—' };

  const unit = spread.unit ?? '';
  // 各社は 1.0pips / 0.2銭 のように小数第1位まで公表する。
  // 整数に丸めて 1pips と出すと公表表記から離れるので、最低1桁は残す。
  const num = Number.isInteger(spread.spread) ? spread.spread.toFixed(1) : String(spread.spread);
  return {
    value: `${num}${unit}`,
    condition: spread.condition ? `(${spread.condition})` : undefined,
  };
}

/** 1 行に連結した表示文字列。 */
export function formatTradingSpread(spread?: TradingSpread): string | null {
  const parts = formatTradingSpreadParts(spread);
  if (!parts) return null;
  return parts.value + (parts.condition ?? '');
}

/**
 * スプレッドの数値の根拠 (各社の公表ページ) の URL。
 *
 * 数値を出しているものだけリンクする。「変動」「非公開」「—」は
 * こちらの表示であって各社が公表した数値ではないので張らない。
 * URL は http/https のみ受け付ける (JSON は生成物だが、表示側でも弾く)。
 */
export function tradingSpreadSourceUrl(spread?: TradingSpread): string | null {
  if (!spread || spread.mode !== 'fixed' || spread.spread == null) return null;

  const source = spread.source;
  if (!source) return null;
  return /^https?:\/\//i.test(source) ? source : null;
}
