import { describe, expect, it } from 'vitest';
import {
  buildIntraday, gmoDateParam, intradayMembers, parseIntradayResponse, parseSymbolsParam,
  type IntradayData,
} from '@/lib/strengthIntraday';
import type { LivePeriod } from '@/lib/strengthLive';

const T0 = Date.parse('2026-11-26T21:00:00Z'); // 2026-11-27 06:00 JST
const M5 = 5 * 60_000;

const liveSeries = (symbol: string | null) => ({ level: 1, prev_price: 1, unit: 10000, symbol });

describe('intradayMembers (REQ-TODAY-003)', () => {
  it('GMO の銘柄がある通貨だけを返し、PLN・CNH (symbol が null)・参照系列・円は入れない', () => {
    const period: LivePeriod = {
      series: {},
      references: ['CHFTRY_S'],
      live: {
        next: '2026-11-27',
        series: {
          USD: liveSeries('USD_JPY'),
          TRY: liveSeries('TRY_JPY'),
          PLN: liveSeries(null),
          CNH: liveSeries(null),
          CHFTRY_S: liveSeries('CHF_JPY'),
          JPY: liveSeries('JPY_JPY'),
        },
        references: {},
      },
    };
    expect(intradayMembers(period, 'JPY')).toEqual({ USD: 'USD_JPY', TRY: 'TRY_JPY' });
  });

  it('live が無ければ空', () => {
    expect(intradayMembers(undefined, 'JPY')).toEqual({});
    expect(intradayMembers({ series: {} }, 'JPY')).toEqual({});
  });
});

describe('parseSymbolsParam (REQ-TODAY-004)', () => {
  it('XXX_JPY の形で重複のない 1〜12 本を受け付ける', () => {
    expect(parseSymbolsParam('USD_JPY,TRY_JPY')).toEqual(['USD_JPY', 'TRY_JPY']);
    const twelve = Array.from({ length: 12 }, (_, i) => `A${String.fromCharCode(65 + i)}A_JPY`).join(',');
    expect(parseSymbolsParam(twelve)).toHaveLength(12);
  });

  it.each([
    ['空', ''],
    ['13 本', Array.from({ length: 13 }, (_, i) => `A${String.fromCharCode(65 + i)}A_JPY`).join(',')],
    ['重複', 'USD_JPY,USD_JPY'],
    ['小文字', 'usd_jpy'],
    ['円以外の相手', 'EUR_USD'],
    ['余計な文字', 'USD_JPY&x=1'],
    ['空の要素', 'USD_JPY,'],
  ])('%s は null', (_label, q) => {
    expect(parseSymbolsParam(q)).toBeNull();
  });

  it('文字列でない (配列・undefined) は null', () => {
    expect(parseSymbolsParam(['USD_JPY'])).toBeNull();
    expect(parseSymbolsParam(undefined)).toBeNull();
  });
});

describe('gmoDateParam (REQ-TODAY-002)', () => {
  it('06:00 JST で日が変わる', () => {
    expect(gmoDateParam(Date.parse('2026-11-27T20:59:00Z'))).toBe('20261127'); // 11-28 05:59 JST
    expect(gmoDateParam(Date.parse('2026-11-27T21:00:00Z'))).toBe('20261128'); // 11-28 06:00 JST
  });
});

const gmoRow = (t: number, open: string, close: string) => ({
  openTime: String(t), open, high: open, low: close, close,
});

describe('parseIntradayResponse (REQ-TODAY-004・006)', () => {
  const ok = {
    server_time: new Date(T0 + 10 * 60_000).toISOString(),
    trading_date: '2026-11-27',
    bars: { USD_JPY: [gmoRow(T0, '100', '102')], TRY_JPY: [gmoRow(T0, '4', '3.8')] },
  };

  it('正しい形を読む', () => {
    const d = parseIntradayResponse(ok, ['USD_JPY', 'TRY_JPY']);
    expect(d).toEqual({
      serverMs: T0 + 10 * 60_000,
      tradingDate: '2026-11-27',
      bars: {
        USD_JPY: [{ t: T0, open: 100, close: 102 }],
        TRY_JPY: [{ t: T0, open: 4, close: 3.8 }],
      },
    });
  });

  it('足を時刻の順に並べ直す', () => {
    const j = { ...ok, bars: { USD_JPY: [gmoRow(T0 + M5, '101', '103'), gmoRow(T0, '100', '101')] } };
    expect(parseIntradayResponse(j, ['USD_JPY'])!.bars.USD_JPY.map((b) => b.t)).toEqual([T0, T0 + M5]);
  });

  it.each([
    ['要求した銘柄が応答に無い', { ...ok, bars: { USD_JPY: ok.bars.USD_JPY } }],
    ['足が 0 本', { ...ok, bars: { ...ok.bars, TRY_JPY: [] } }],
    ['終値が数でない', { ...ok, bars: { ...ok.bars, TRY_JPY: [gmoRow(T0, '4', 'x')] } }],
    ['終値が空', { ...ok, bars: { ...ok.bars, TRY_JPY: [gmoRow(T0, '4', '')] } }],
    ['始値が 0', { ...ok, bars: { ...ok.bars, TRY_JPY: [gmoRow(T0, '0', '3.8')] } }],
    ['openTime が数字でない', { ...ok, bars: { ...ok.bars, TRY_JPY: [{ ...gmoRow(T0, '4', '3.8'), openTime: 'abc' }] } }],
    ['trading_date が無い', { ...ok, trading_date: undefined }],
    ['server_time が読めない', { ...ok, server_time: 'x' }],
    ['bars が配列でない', { ...ok, bars: { ...ok.bars, TRY_JPY: 'x' } }],
    ['null', null],
  ])('%s は null (データなし)', (_label, j) => {
    expect(parseIntradayResponse(j, ['USD_JPY', 'TRY_JPY'])).toBeNull();
  });
});

const data = (bars: IntradayData['bars'], serverMs: number): IntradayData => ({
  serverMs, tradingDate: '2026-11-27', bars,
});

describe('buildIntraday (REQ-TODAY-005)', () => {
  const members = { USD: 'USD_JPY', TRY: 'TRY_JPY' };

  it('先頭は全通貨 1.0。各点は 終値 ÷ 最初の足の始値 を、円を含む平均で割る。スワップは足さない', () => {
    const d = data({
      USD_JPY: [{ t: T0, open: 100, close: 102 }],
      TRY_JPY: [{ t: T0, open: 4, close: 3.8 }],
    }, T0 + 10 * 60_000);
    const pts = buildIntraday(d, members, 'JPY')!;
    expect(pts).toHaveLength(2);
    expect(pts[0]).toEqual({ ms: T0, values: { JPY: 1, USD: 1, TRY: 1 } });
    const m = (1 + 1.02 + 0.95) / 3;
    expect(pts[1].ms).toBe(T0 + M5); // 足の終わり
    expect(pts[1].values.JPY).toBeCloseTo(1 / m, 12);
    expect(pts[1].values.USD).toBeCloseTo(1.02 / m, 12);
    expect(pts[1].values.TRY).toBeCloseTo(0.95 / m, 12);
  });

  it('足が無い時刻は直前の終値で埋め、最初の足より前は 1.0', () => {
    const d = data({
      USD_JPY: [{ t: T0, open: 100, close: 101 }, { t: T0 + M5, open: 101, close: 103 }],
      TRY_JPY: [{ t: T0 + M5, open: 4, close: 4.2 }],
    }, T0 + 20 * 60_000);
    const pts = buildIntraday(d, members, 'JPY')!;
    expect(pts.map((p) => p.ms)).toEqual([T0, T0 + M5, T0 + 2 * M5]);
    // T0 の足: TRY はまだ足が無いので 1.0
    const m1 = (1 + 1.01 + 1) / 3;
    expect(pts[1].values.TRY).toBeCloseTo(1 / m1, 12);
    expect(pts[1].values.USD).toBeCloseTo(1.01 / m1, 12);
    // T0+5 の足: USD は 103/100 (最初の足の始値で割る)、TRY は 4.2/4
    const m2 = (1 + 1.03 + 1.05) / 3;
    expect(pts[2].values.USD).toBeCloseTo(1.03 / m2, 12);
    expect(pts[2].values.TRY).toBeCloseTo(1.05 / m2, 12);
  });

  it('ある通貨だけ途中の足が抜けても、直前の終値で埋める', () => {
    const d = data({
      USD_JPY: [{ t: T0, open: 100, close: 101 }, { t: T0 + M5, open: 101, close: 102 }],
      TRY_JPY: [{ t: T0, open: 4, close: 4.4 }],
    }, T0 + 20 * 60_000);
    const pts = buildIntraday(d, members, 'JPY')!;
    const m = (1 + 1.02 + 1.1) / 3;
    expect(pts[2].values.TRY).toBeCloseTo(1.1 / m, 12);
  });

  it('まだ終わっていない最後の足は、サーバーの時刻 (分で切り捨て) に置く', () => {
    const d = data({
      USD_JPY: [{ t: T0, open: 100, close: 101 }],
      TRY_JPY: [{ t: T0, open: 4, close: 4 }],
    }, T0 + 2 * 60_000 + 30_000);
    const pts = buildIntraday(d, members, 'JPY')!;
    expect(pts[1].ms).toBe(T0 + 2 * 60_000);
  });

  it('どれか 1 つの銘柄の足が 0 本・応答に無いなら null (REQ-TODAY-006)', () => {
    expect(buildIntraday(data({ USD_JPY: [{ t: T0, open: 1, close: 1 }], TRY_JPY: [] }, T0), members, 'JPY')).toBeNull();
    expect(buildIntraday(data({ USD_JPY: [{ t: T0, open: 1, close: 1 }] }, T0), members, 'JPY')).toBeNull();
  });

  it('対象の通貨が 1 つも無ければ null', () => {
    expect(buildIntraday(data({}, T0), {}, 'JPY')).toBeNull();
  });
});
