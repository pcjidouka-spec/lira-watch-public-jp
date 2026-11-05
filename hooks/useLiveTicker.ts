import { useEffect, useState } from 'react';
import { parseTicker, type TickerMap } from '@/lib/strengthLive';

const TIMEOUT_MS = 5_000;

/**
 * /api/fx-now/ を表示したときに 1 回取り、タブが見えている間だけ intervalMs ごとに取り直す。
 * 失敗・時間切れ・形の異常は null (暫定の点を出さない)。判断は lib/strengthLive.ts にあり、
 * ここは取得だけを持つ (DOM のテストが無いので薄く保つ)。
 */
export function useLiveTicker(intervalMs = 60_000): { ticker: TickerMap | null; now: number } {
  const [state, setState] = useState<{ ticker: TickerMap | null; now: number }>({ ticker: null, now: 0 });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (document.visibilityState !== 'visible') return;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      let ticker: TickerMap | null = null;
      try {
        const r = await fetch('/api/fx-now/', { signal: ctrl.signal });
        ticker = r.ok ? parseTicker(await r.json()) : null;
      } catch {
        ticker = null;
      } finally {
        clearTimeout(timer);
      }
      if (alive) setState({ ticker, now: Date.now() });
    };
    load();
    const id = window.setInterval(load, intervalMs);
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalMs]);
  return state;
}
