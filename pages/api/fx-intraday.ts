/**
 * GMO コインの FX の 5 分足 (BID) を、今日の取引日ぶん代わりに取る。
 * GMO の公開 API には CORS ヘッダが無く、ブラウザから直接は呼べないため。
 * 通貨強弱グラフの「本日」タブ (lib/strengthIntraday.ts) が使う。
 * ★銘柄の検査と取引日は lib/strengthIntraday.ts にある (ここに判断を足さない)。
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { gmoDateParam, parseSymbolsParam } from '@/lib/strengthIntraday';
import { tradingDate } from '@/lib/strengthLive';

const KLINES = 'https://forex-api.coin.z.com/public/v1/klines';
const TIMEOUT_MS = 5_000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbols = parseSymbolsParam(req.query.symbols);
  if (!symbols) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(400).json({ error: 'bad symbols' });
    return;
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const serverMs = Date.now();
    const date = gmoDateParam(serverMs);
    const bars: Record<string, unknown[]> = {};
    // 1 本ずつ順に取る (同時に投げて GMO の上限に当たらないように)
    for (const s of symbols) {
      const url = `${KLINES}?symbol=${s}&priceType=BID&interval=5min&date=${date}`;
      const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'lira-watch/strength' } });
      if (!r.ok) throw new Error(`${s} http ${r.status}`);
      const body = (await r.json()) as { status?: unknown; data?: unknown };
      if (body.status !== 0 || !Array.isArray(body.data)) throw new Error(`${s} bad body`);
      bars[s] = body.data;
    }
    const serverTime = new Date(serverMs).toISOString();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=60');
    res.status(200).json({ server_time: serverTime, trading_date: tradingDate(serverTime), bars });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: e instanceof Error ? e.message : String(e) });
  } finally {
    clearTimeout(timer);
  }
}
