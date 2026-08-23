import { describe, expect, it } from 'vitest';
import { attachSpreads, buildSpreadMap } from './spreadJoin';
import { ProviderRanking } from '@/types';

const PAYLOAD = {
  generated_at: '2026-08-23',
  pairs: {
    'TRY/JPY': {
      gmo_click: { spread: 1.4, unit: '銭', mode: 'fixed', condition: '9-3時' },
      saxo: { mode: 'variable' },
      dmm: { mode: 'unavailable' },
    },
  },
};

const ranking = (provider_id: string): ProviderRanking => ({
  provider_id, name: provider_id, swap_buy: 1, swap_sell: -1, latest_date: '2026-08-22',
});

describe('buildSpreadMap', () => {
  it('アンダースコアなしの ID でも引ける', () => {
    const map = buildSpreadMap(PAYLOAD, 'TRY/JPY');
    expect(map.get('gmo_click')?.spread).toBe(1.4);
    expect(map.get('gmoclick')?.spread).toBe(1.4);
  });

  it('正規化で衝突する ID は正規 ID を優先し、別業者を上書きしない', () => {
    const payload = {
      generated_at: '2026-08-23',
      pairs: { 'TRY/JPY': {
        gmo_click: { spread: 1.4, unit: '銭', mode: 'fixed' },
        gmoclick: { spread: 9.9, unit: '銭', mode: 'fixed' },
      } },
    };
    const map = buildSpreadMap(payload, 'TRY/JPY');
    expect(map.get('gmo_click')?.spread).toBe(1.4);
    expect(map.get('gmoclick')?.spread).toBe(9.9);
  });

  it('variable と unavailable も引ける', () => {
    const map = buildSpreadMap(PAYLOAD, 'TRY/JPY');
    expect(map.get('saxo')?.mode).toBe('variable');
    expect(map.get('dmm')?.mode).toBe('unavailable');
  });

  it('未知の通貨ペアは空のマップ', () => {
    expect(buildSpreadMap(PAYLOAD, 'ZAR/JPY').size).toBe(0);
  });

  it('payload が null / 壊れていても落ちない', () => {
    expect(buildSpreadMap(null, 'TRY/JPY').size).toBe(0);
    expect(buildSpreadMap({}, 'TRY/JPY').size).toBe(0);
    expect(buildSpreadMap({ pairs: null }, 'TRY/JPY').size).toBe(0);
  });
});

describe('attachSpreads', () => {
  it('provider_id で join する', () => {
    const result = attachSpreads([ranking('gmo_click')], buildSpreadMap(PAYLOAD, 'TRY/JPY'));
    expect(result[0].trading_spread?.spread).toBe(1.4);
    expect(result[0].trading_spread?.condition).toBe('9-3時');
  });

  it('マップにない業者は trading_spread を付けない', () => {
    const result = attachSpreads([ranking('hirose')], buildSpreadMap(PAYLOAD, 'TRY/JPY'));
    expect(result[0].trading_spread).toBeUndefined();
  });

  it('元の配列を破壊しない', () => {
    const input = [ranking('gmo_click')];
    attachSpreads(input, buildSpreadMap(PAYLOAD, 'TRY/JPY'));
    expect(input[0].trading_spread).toBeUndefined();
  });

  it('空のマップでも元の順序と件数を保つ', () => {
    const input = [ranking('a'), ranking('b'), ranking('c')];
    const result = attachSpreads(input, new Map());
    expect(result.map((r) => r.provider_id)).toEqual(['a', 'b', 'c']);
  });
});
