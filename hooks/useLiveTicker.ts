import { useEffect, useState } from 'react';
import { parseLiveResponse, type TickerMap } from '@/lib/strengthLive';

const TIMEOUT_MS = 5_000;

type LiveState = { ticker: TickerMap | null; now: number };
const EMPTY: LiveState = { ticker: null, now: 0 };

/**
 * /api/fx-now/ を表示したときに 1 回取り、タブが見えている間だけ intervalMs ごとに取り直す。
 * 「今」(now) は応答のサーバー時刻。タブが隠れたら値を捨てる (見えていない間の古い値を残さない)。
 * 失敗・時間切れ・形の異常は null (暫定の点を出さない)。判断は lib/strengthLive.ts にあり、
 * ここは取得だけを持つ (DOM のテストが無いので薄く保つ)。
 */
export function useLiveTicker(intervalMs = 60_000): LiveState {
  const [state, setState] = useState<LiveState>(EMPTY);
  useEffect(() => {
    let alive = true;
    let seq = 0; // 発行した順
    let applied = 0; // 反映済みの最新の番号
    let inflight: AbortController | null = null;
    const load = async () => {
      if (document.visibilityState !== 'visible') return;
      const mine = ++seq;
      const ctrl = new AbortController();
      inflight = ctrl;
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      let next: LiveState = EMPTY;
      try {
        const r = await fetch('/api/fx-now/', { signal: ctrl.signal });
        const parsed = r.ok ? parseLiveResponse(await r.json()) : null;
        if (parsed) next = { ticker: parsed.ticker, now: parsed.serverMs };
      } catch {
        next = EMPTY;
      } finally {
        clearTimeout(timer);
      }
      // 隠れた後に返った応答・より新しい応答が先に反映済みなら捨てる
      if (!alive || mine < applied || document.visibilityState !== 'visible') return;
      applied = mine;
      setState(next);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        load();
      } else {
        applied = ++seq; // 進行中の応答は古い扱いにする
        inflight?.abort();
        setState(EMPTY);
      }
    };
    load();
    const id = window.setInterval(load, intervalMs);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      alive = false;
      inflight?.abort();
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs]);
  return state;
}
