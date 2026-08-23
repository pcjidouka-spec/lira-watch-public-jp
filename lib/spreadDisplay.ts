import { TradingSpread } from '@/types';

/**
 * 取引スプレッド（Ask-Bid）の表示文字列を返す。
 *
 * 未対応業者（trading_spread が undefined）は null を返し、呼び出し側は何も描画しない。
 * 取得失敗（mode: 'unavailable'）は「—」を出す。空欄にすると
 * 「スプレッドが安いから無表示」と誤読されるため。
 */
export function formatTradingSpread(spread?: TradingSpread): string | null {
  if (!spread) return null;

  if (spread.mode === 'variable') return 'スプレッド 変動';
  // 公式が開示していない社。変動スプレッド制とは別物なので文言を分ける
  if (spread.mode === 'undisclosed') return 'スプレッド 非公開';
  if (spread.mode === 'unavailable') return 'スプレッド —';

  if (spread.spread == null) return 'スプレッド —';

  const unit = spread.unit ?? '';
  const condition = spread.condition ? `(${spread.condition})` : '';
  // 各社は 1.0pips / 0.2銭 のように小数第1位まで公表する。
  // 整数に丸めて 1pips と出すと公表表記から離れるので、最低1桁は残す。
  const value = Number.isInteger(spread.spread) ? spread.spread.toFixed(1) : String(spread.spread);
  return `スプレッド ${value}${unit}${condition}`;
}
