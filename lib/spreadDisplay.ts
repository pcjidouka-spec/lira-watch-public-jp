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
  if (spread.mode === 'unavailable') return 'スプレッド —';

  if (spread.spread == null) return 'スプレッド —';

  const unit = spread.unit ?? '';
  const condition = spread.condition ? `(${spread.condition})` : '';
  return `スプレッド ${spread.spread}${unit}${condition}`;
}
