import { describe, it, expect } from 'vitest';
import fixture from './__fixtures__/strength_live_cases.json';
import {
  tradingDate, parseTicker, requiredSymbols, computeProvisional, provisionalPoint,
  type LivePeriod, type TickerMap, type TickerEntry,
} from './strengthLive';

type Case = {
  name: string; base: string; period: LivePeriod;
  rates: Record<string, number>; expected: Record<string, number | null>;
};
const cases = (fixture as unknown as { cases: Case[] }).cases;

describe('computeProvisional は Python の _build_period の 1 歩と一致する (REQ-LIVE-003〜007)', () => {
  for (const c of cases) {
    it(c.name, () => {
      const got = computeProvisional(c.period, c.base, c.rates);
      expect(got).not.toBeNull();
      expect(Object.keys(got!).sort()).toEqual(Object.keys(c.expected).sort());
      for (const [code, want] of Object.entries(c.expected)) {
        const v = got![code];
        if (want === null) {
          expect(v, code).toBeNull();
        } else {
          expect(v, code).not.toBeNull();
          expect(Math.abs((v as number) - want) / Math.abs(want), code).toBeLessThan(1e-12);
        }
      }
    });
  }
});

describe('tradingDate (NY 17:00 で日が変わる)', () => {
  it('冬時間 (EST): 22:00Z が境目', () => {
    expect(tradingDate('2026-11-04T21:59:59Z')).toBe('2026-11-04');
    expect(tradingDate('2026-11-04T22:00:00Z')).toBe('2026-11-05');
  });
  it('夏時間 (EDT): 21:00Z が境目', () => {
    expect(tradingDate('2026-10-27T20:59:59Z')).toBe('2026-10-27');
    expect(tradingDate('2026-10-27T21:00:00Z')).toBe('2026-10-28');
  });
  it('GMO の 5〜6 桁の小数秒を読める', () => {
    expect(tradingDate('2026-11-05T03:44:41.94321Z')).toBe('2026-11-05');
  });
});

describe('parseTicker (REQ-LIVE-008)', () => {
  const ok = { status: 0, data: [
    { symbol: 'USD_JPY', ask: '157.918', bid: '157.913', timestamp: '2026-11-05T03:44:41.943Z', status: 'OPEN' },
    { symbol: 'TRY_JPY', ask: '3.153', bid: 'x', timestamp: '2026-11-05T03:44:41.943Z', status: 'OPEN' },
  ] };
  it('数でない bid の銘柄は落とす', () => {
    const t = parseTicker(ok)!;
    expect(t.USD_JPY.bid).toBe(157.913);
    expect(t.TRY_JPY).toBeUndefined();
  });
  it('形が違えば null', () => {
    expect(parseTicker(null)).toBeNull();
    expect(parseTicker({ status: 5, data: [] })).toBeNull();
    expect(parseTicker({ status: 0 })).toBeNull();
    expect(parseTicker('oops')).toBeNull();
  });
});

describe('provisionalPoint の出す条件 (REQ-LIVE-002)', () => {
  const c = cases.find((x) => x.name === 'weekday')!;
  const next = c.period.live!.next;
  // next の取引日の昼 (JST)。冬時間なら前日 22:00Z から始まる
  const ts = `${next}T03:00:00.000Z`;
  const now = Date.parse(ts) + 60_000;
  const ticker = (over: Partial<TickerEntry> = {}, drop?: string): TickerMap => {
    const t: TickerMap = {};
    for (const s of requiredSymbols(c.period.live!)) {
      if (s === drop) continue;
      t[s] = { bid: c.rates[s], timestamp: ts, status: 'OPEN', ...over };
    }
    return t;
  };

  it('揃えば出て、値は computeProvisional と同じ', () => {
    const got = provisionalPoint(c.period, c.base, ticker(), now)!;
    expect(got.date).toBe(next);
    expect(got.asOf).toBe(ts);
    expect(got.values).toEqual(computeProvisional(c.period, c.base, c.rates));
  });
  it('OPEN でなければ出ない', () => {
    expect(provisionalPoint(c.period, c.base, ticker({ status: 'CLOSE' }), now)).toBeNull();
  });
  it('10 分より古ければ出ない', () => {
    expect(provisionalPoint(c.period, c.base, ticker(), Date.parse(ts) + 10 * 60_000 + 1)).toBeNull();
    expect(provisionalPoint(c.period, c.base, ticker(), Date.parse(ts) + 10 * 60_000)).not.toBeNull();
  });
  it('1 分より先の時刻なら出ない', () => {
    expect(provisionalPoint(c.period, c.base, ticker(), Date.parse(ts) - 60_001)).toBeNull();
  });
  it('取引日が next でなければ出ない (日次が遅れた朝・日付の飛び)', () => {
    const later = `${next}T23:00:00.000Z`; // NY では next の翌取引日
    expect(provisionalPoint(c.period, c.base, ticker({ timestamp: later }), Date.parse(later))).toBeNull();
  });
  it('丁度 1 分先の時刻は出る (境界の通る側)', () => {
    expect(provisionalPoint(c.period, c.base, ticker(), Date.parse(ts) - 60_000)).not.toBeNull();
  });

  // 1 銘柄だけ壊す (他は正常)。REQ-LIVE-002: どれか 1 つでも条件を外れたら出さない
  const symbols = requiredSymbols(c.period.live!);
  const picks: [string, string][] = [
    ['先頭', symbols[0]],
    ['中間', symbols[Math.floor(symbols.length / 2)]],
    ['末尾', symbols[symbols.length - 1]],
  ];
  const oneBad = (sym: string, over: Partial<TickerEntry>): TickerMap => {
    const t = ticker();
    t[sym] = { ...t[sym], ...over };
    return t;
  };
  for (const [label, sym] of picks) {
    it(`${label}の銘柄 1 つだけ CLOSE なら出ない`, () => {
      expect(provisionalPoint(c.period, c.base, oneBad(sym, { status: 'CLOSE' }), now)).toBeNull();
    });
    it(`${label}の銘柄 1 つだけ 10 分より古ければ出ない`, () => {
      const n = Date.parse(ts) + 10 * 60_000; // 他は丁度 10 分 (通る)
      const old = new Date(Date.parse(ts) - 1).toISOString(); // 1 つだけ 10 分 + 1ms
      expect(provisionalPoint(c.period, c.base, ticker(), n)).not.toBeNull();
      expect(provisionalPoint(c.period, c.base, oneBad(sym, { timestamp: old }), n)).toBeNull();
    });
    it(`${label}の銘柄 1 つだけ 1 分より先の時刻なら出ない`, () => {
      const n = Date.parse(ts) - 60_000; // 他は丁度 1 分先 (通る)
      const fut = new Date(Date.parse(ts) + 1).toISOString(); // 1 つだけ 1 分 + 1ms 先
      expect(provisionalPoint(c.period, c.base, ticker(), n)).not.toBeNull();
      expect(provisionalPoint(c.period, c.base, oneBad(sym, { timestamp: fut }), n)).toBeNull();
    });
    it(`${label}の銘柄 1 つだけ取引日が違えば出ない`, () => {
      // next の取引日の終わりの境目をまたぐ 2 点 (どちらも now から 10 分以内なので、日付だけが違う)
      let edge = Date.parse(`${next}T12:00:00.000Z`);
      while (tradingDate(new Date(edge).toISOString()) === next) edge += 60_000;
      const inDay = new Date(edge - 60_000).toISOString();
      const nextDay = new Date(edge + 30_000).toISOString();
      const n = edge + 60_000;
      expect(tradingDate(inDay)).toBe(next);
      expect(tradingDate(nextDay)).not.toBe(next);
      expect(provisionalPoint(c.period, c.base, ticker({ timestamp: inDay }), n)).not.toBeNull();
      const t = ticker({ timestamp: inDay });
      t[sym] = { ...t[sym], timestamp: nextDay };
      expect(provisionalPoint(c.period, c.base, t, n)).toBeNull();
    });
    it(`${label}の銘柄 1 つだけ欠ければ出ない`, () => {
      expect(provisionalPoint(c.period, c.base, ticker({}, sym), now)).toBeNull();
    });
  }

  it('必要な銘柄が 1 つでも欠ければ出ない', () => {
    const s = requiredSymbols(c.period.live!)[0];
    expect(provisionalPoint(c.period, c.base, ticker({}, s), now)).toBeNull();
  });
  it('ticker が無い・live が無いなら出ない', () => {
    expect(provisionalPoint(c.period, c.base, null, now)).toBeNull();
    const { live: _omit, ...noLive } = c.period;
    expect(provisionalPoint(noLive, c.base, ticker(), now)).toBeNull();
  });
});

describe('requiredSymbols', () => {
  it('ECB の通貨 (symbol: null) を含まず、合成の脚と参照系列の 2 脚を含む', () => {
    const s = requiredSymbols(cases[0].period.live!);
    expect(s).toContain('GBP_JPY');
    expect(s).toContain('USD_JPY');
    expect(s).toContain('CHF_JPY');
    expect(s).toContain('TRY_JPY');
    expect(s.every((x) => typeof x === 'string')).toBe(true);
    expect(new Set(s).size).toBe(s.length);
  });
});
