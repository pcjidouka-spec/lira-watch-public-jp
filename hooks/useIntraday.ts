import { useEffect, useState } from 'react';
import { parseIntradayResponse, type IntradayData } from '@/lib/strengthIntraday';

const TIMEOUT_MS = 8_000;

type State = { data: IntradayData | null; loading: boolean };
const LOADING: State = { data: null, loading: true };

/**
 * /api/fx-intraday/ を、部品が出ているあいだ (= 本日タブを選んでいるあいだ) だけ取る。
 * 出たときに 1 回取り、タブが見えている間だけ intervalMs ごとに取り直す。
 * タブが隠れたら値を捨て、戻ったら取り直すまで前の値を出さない (REQ-TODAY-007)。
 * 失敗・時間切れ・形の異常は data = null (データなし。判断は lib/strengthIntraday.ts)。
 */
export function useIntraday(symbols: readonly string[], intervalMs = 60_000): State {
  const key = symbols.join(',');
  const [state, setState] = useState<State>(LOADING);
  useEffect(() => {
    setState(LOADING);
    if (!key) {
      setState({ data: null, loading: false });
      return;
    }
    const list = key.split(',');
    let alive = true;
    let seq = 0;
    let applied = 0;
    let inflight: AbortController | null = null;
    const load = async () => {
      if (document.visibilityState !== 'visible') return;
      const mine = ++seq;
      const ctrl = new AbortController();
      inflight = ctrl;
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      let data: IntradayData | null = null;
      try {
        const r = await fetch(`/api/fx-intraday/?symbols=${encodeURIComponent(key)}`, { signal: ctrl.signal });
        data = r.ok ? parseIntradayResponse(await r.json(), list) : null;
      } catch {
        data = null;
      } finally {
        clearTimeout(timer);
      }
      if (!alive || mine < applied || document.visibilityState !== 'visible') return;
      applied = mine;
      setState({ data, loading: false });
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        load();
      } else {
        applied = ++seq;
        inflight?.abort();
        setState(LOADING);
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
  }, [key, intervalMs]);
  return state;
}
