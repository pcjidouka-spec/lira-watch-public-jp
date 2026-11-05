/**
 * GMO コインの FX の ticker (全銘柄の今のレート) を代わりに取る。
 * GMO の公開 API には CORS ヘッダが無く、ブラウザから直接は呼べないため。
 * 通貨強弱グラフの暫定の点 (lib/strengthLive.ts) が使う。
 */
import type { NextApiRequest, NextApiResponse } from 'next';

const TICKER = 'https://forex-api.coin.z.com/public/v1/ticker';
const TIMEOUT_MS = 5_000;

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(TICKER, { signal: ctrl.signal, headers: { 'User-Agent': 'lira-watch/strength' } });
    if (!r.ok) throw new Error(`http ${r.status}`);
    const body = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=60');
    res.status(200).json(body);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: e instanceof Error ? e.message : String(e) });
  } finally {
    clearTimeout(timer);
  }
}
