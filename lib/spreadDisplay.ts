import { TradingSpread } from '@/types';

/**
 * 取引スプレッド（Ask-Bid）のセル表示文字列を返す。
 *
 * 専用の「スプレッド」列に入れるため、値だけを返す（見出しが項目名を担う）。
 * 未対応業者（trading_spread が undefined）は null を返し、セルは空になる。
 * 取得失敗（mode: 'unavailable'）は「—」を出す。空欄にすると
 * 「スプレッドが狭いから無表示」と誤読されるため、未対応と区別する。
 */
export function formatTradingSpread(spread?: TradingSpread): string | null {
  if (!spread) return null;

  if (spread.mode === 'variable') return '変動';
  // 公式が開示していない社。変動スプレッド制とは別物なので文言を分ける
  if (spread.mode === 'undisclosed') return '非公開';
  if (spread.mode === 'unavailable') return '—';

  if (spread.spread == null) return '—';

  const unit = spread.unit ?? '';
  const condition = spread.condition ? `(${spread.condition})` : '';
  // 各社は 1.0pips / 0.2銭 のように小数第1位まで公表する。
  // 整数に丸めて 1pips と出すと公表表記から離れるので、最低1桁は残す。
  const value = Number.isInteger(spread.spread) ? spread.spread.toFixed(1) : String(spread.spread);
  return `${value}${unit}${condition}`;
}
