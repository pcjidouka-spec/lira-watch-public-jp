import { ProviderRanking, TradingSpread } from '@/types';

/**
 * spreads.json の 1 通貨ペア分を provider_id で引けるマップにする。
 *
 * master_history の provider_id はアンダースコアなし表記のことがあるため、
 * 既存の providers_config と同じ正規化をかけた別名も登録する。
 * ただし正規 ID を後から上書きしない（別業者の値が混ざるのを防ぐ）。
 */
export function buildSpreadMap(payload: any, currencyPair: string): Map<string, TradingSpread> {
  const map = new Map<string, TradingSpread>();
  const entries = payload?.pairs?.[currencyPair];
  if (!entries) return map;

  Object.entries(entries).forEach(([providerId, value]) => {
    map.set(providerId, value as TradingSpread);
  });

  Object.entries(entries).forEach(([providerId, value]) => {
    const normalized = providerId.replace(/_/g, '');
    if (normalized !== providerId && !map.has(normalized)) {
      map.set(normalized, value as TradingSpread);
    }
  });

  return map;
}

/** ranking に trading_spread を付けた新しい配列を返す。元の配列は変更しない。 */
export function attachSpreads(
  rankings: ProviderRanking[],
  spreadMap: Map<string, TradingSpread>,
): ProviderRanking[] {
  return rankings.map((r) => {
    const spread = spreadMap.get(r.provider_id);
    return spread ? { ...r, trading_spread: spread } : { ...r };
  });
}
