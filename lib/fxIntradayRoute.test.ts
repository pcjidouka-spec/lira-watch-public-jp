import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from '@/pages/api/fx-intraday';

function fakeRes() {
  const r = { statusCode: 0, body: undefined as unknown, headers: {} as Record<string, string> };
  const res = {
    setHeader(k: string, v: string) { r.headers[k] = v; return res; },
    status(c: number) { r.statusCode = c; return res; },
    json(b: unknown) { r.body = b; return res; },
  };
  return { r, res: res as any };
}

const BAR = { openTime: '1795726800000', open: '1', high: '1', low: '1', close: '1' };
const okFetch = () => vi.fn(async () => ({
  ok: true, status: 200, json: async () => ({ status: 0, data: [BAR] }),
}));

async function call(symbols: unknown) {
  const { r, res } = fakeRes();
  await handler({ query: { symbols } } as any, res);
  return r;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('/api/fx-intraday のルート', () => {
  const bad: [string, unknown][] = [
    ['小文字', 'usd_jpy'],
    ['13 本', Array.from({ length: 13 }, (_, i) => `AA${String.fromCharCode(65 + i)}_JPY`).join(',')],
    ['重複', 'USD_JPY,USD_JPY'],
    ['undefined', undefined],
    ['配列', ['USD_JPY']],
  ];
  for (const [name, q] of bad) {
    it(`不正な銘柄 (${name}) は 400・no-store で、GMO に取りに行かない`, async () => {
      const f = vi.fn();
      vi.stubGlobal('fetch', f);
      const r = await call(q);
      expect(r.statusCode).toBe(400);
      expect(r.body).toEqual({ error: 'bad symbols' });
      expect(r.headers['Cache-Control']).toBe('no-store');
      expect(f).toHaveBeenCalledTimes(0);
    });
  }

  it('正常: 2 銘柄を取り、GMO の data をそのまま返す', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-27T01:00:00Z'));
    const f = okFetch();
    vi.stubGlobal('fetch', f);
    const r = await call('USD_JPY,TRY_JPY');
    const body = r.body as any;
    expect(r.statusCode).toBe(200);
    expect(body.trading_date).toBe('2026-11-27');
    expect(body.server_time).toBe('2026-11-27T01:00:00.000Z');
    expect(body.bars.USD_JPY).toEqual([BAR]);
    expect(body.bars.TRY_JPY).toEqual([BAR]);
    expect(r.headers['Cache-Control']).toBe('s-maxage=60, stale-while-revalidate=60');
    expect(f).toHaveBeenCalledTimes(2);
    const urls = f.mock.calls.map((c) => String((c as unknown[])[0]));
    expect(urls[0]).toContain('symbol=USD_JPY');
    expect(urls[1]).toContain('symbol=TRY_JPY');
    for (const u of urls) {
      expect(u).toContain('priceType=BID');
      expect(u).toContain('interval=5min');
      expect(u).toContain('date=20261127');
    }
  });

  it('取引日の境目 (06:00 JST) で date が変わる', async () => {
    vi.useFakeTimers();
    for (const [iso, date] of [['2026-11-27T20:59:00Z', '20261127'], ['2026-11-27T21:00:00Z', '20261128']]) {
      vi.setSystemTime(new Date(iso));
      const f = okFetch();
      vi.stubGlobal('fetch', f);
      await call('USD_JPY');
      expect(String((f.mock.calls[0] as unknown[])[0])).toContain(`date=${date}`);
    }
  });

  it('GMO が 404 なら 502・no-store', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })));
    const r = await call('USD_JPY');
    expect(r.statusCode).toBe(502);
    expect(r.headers['Cache-Control']).toBe('no-store');
  });

  it('GMO の status が 0 でなければ 502', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ status: 1, data: [] }) })));
    expect((await call('USD_JPY')).statusCode).toBe(502);
  });

  it('GMO の data が配列でなければ 502', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ status: 0, data: 'x' }) })));
    expect((await call('USD_JPY')).statusCode).toBe(502);
  });
});
