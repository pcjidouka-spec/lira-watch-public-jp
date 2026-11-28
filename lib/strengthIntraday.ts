/**
 * 通貨強弱グラフの「本日」タブ (GMO の 5 分足・スワップなし)。
 * 仕様: 上流リポジトリの docs/superpowers/specs/2026-11-28-strength-today-tab-design.md
 *
 * 判断と計算はすべてここに置く (API ルート・フック・部品は薄く保つ。DOM のテストが無いため)。
 * 対象の通貨は strength.json の live.series (上流の Python が決めたもの) だけから取り、
 * ここに通貨と銘柄の一覧を写さない。
 */
import { tradingDate, type LivePeriod } from '@/lib/strengthLive';

export const MAX_SYMBOLS = 12;
const SYMBOL_RE = /^[A-Z]{3}_JPY$/;
const BAR_MS = 5 * 60_000;
const MINUTE_MS = 60_000;

export type IntradayBar = { t: number; open: number; close: number };
export type IntradayData = { serverMs: number; tradingDate: string; bars: Record<string, IntradayBar[]> };
export type IntradayPoint = { ms: number; values: Record<string, number> };

/** 対象の通貨 → GMO の銘柄。PLN・CNH (symbol が null)・参照系列・円は入れない (REQ-TODAY-003) */
export function intradayMembers(period: LivePeriod | undefined, base: string): Record<string, string> {
  const out: Record<string, string> = {};
  const live = period?.live;
  if (!live) return out;
  const refs = new Set(period?.references ?? []);
  for (const [code, e] of Object.entries(live.series)) {
    if (code === base || refs.has(code)) continue;
    if (e.symbol) out[code] = e.symbol;
  }
  return out;
}

/** ?symbols= を読む。XXX_JPY の形で重複のない 1〜12 本だけ。それ以外は null (REQ-TODAY-004) */
export function parseSymbolsParam(q: unknown): string[] | null {
  if (typeof q !== 'string' || q === '') return null;
  const list = q.split(',');
  if (list.length > MAX_SYMBOLS) return null;
  if (!list.every((s) => SYMBOL_RE.test(s))) return null;
  if (new Set(list).size !== list.length) return null;
  return list;
}

/** GMO の klines の date (YYYYMMDD)。サーバーの時刻の取引日 (REQ-TODAY-002) */
export function gmoDateParam(serverMs: number): string {
  return tradingDate(new Date(serverMs).toISOString()).replace(/-/g, '');
}

/** 正の数として読める値だけを数にする。Number() は '' や true も数にするので型を先に絞る */
function positive(raw: unknown): number | null {
  if (!(typeof raw === 'number' || (typeof raw === 'string' && raw.trim() !== ''))) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseBars(rows: unknown): IntradayBar[] | null {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const out: IntradayBar[] = [];
  for (const row of rows as Record<string, unknown>[]) {
    if (!row || typeof row.openTime !== 'string' || !/^\d+$/.test(row.openTime)) return null;
    const open = positive(row.open);
    const close = positive(row.close);
    if (open === null || close === null) return null;
    out.push({ t: Number(row.openTime), open, close });
  }
  return out.sort((a, b) => a.t - b.t);
}

/**
 * /api/fx-intraday/ の応答を読む。要求した銘柄が 1 つでも欠ける・足が 0 本・形がおかしいときは
 * null (= データなし。一部の通貨だけで描かない。REQ-TODAY-006)
 */
export function parseIntradayResponse(json: unknown, symbols: readonly string[]): IntradayData | null {
  if (!json || typeof json !== 'object') return null;
  const j = json as { server_time?: unknown; trading_date?: unknown; bars?: unknown };
  if (typeof j.server_time !== 'string') return null;
  const serverMs = Date.parse(j.server_time);
  if (!Number.isFinite(serverMs)) return null;
  if (typeof j.trading_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(j.trading_date)) return null;
  if (!j.bars || typeof j.bars !== 'object') return null;
  const src = j.bars as Record<string, unknown>;
  const bars: Record<string, IntradayBar[]> = {};
  for (const s of symbols) {
    const b = parseBars(src[s]);
    if (!b) return null;
    bars[s] = b;
  }
  return { serverMs, tradingDate: j.trading_date, bars };
}

/**
 * 点の列 (REQ-TODAY-005)。先頭は最初の足の開始時刻で全通貨 1.0。
 * 各点: 通貨ごとに 終値 ÷ その通貨の最初の足の始値 (足が無い時刻は直前の終値、最初の足より前は 1.0)、
 * 円は 1.0。それを円を含む全通貨の算術平均で割る。スワップは足さない。
 * 点の時刻は足の終わり。まだ終わっていない足はサーバーの時刻 (分で切り捨て) に置く。
 * どれか 1 つの銘柄の足が無ければ null (REQ-TODAY-006)。
 */
export function buildIntraday(
  d: IntradayData, members: Record<string, string>, base: string,
): IntradayPoint[] | null {
  const codes = Object.keys(members).filter((c) => c !== base);
  if (codes.length === 0) return null;
  for (const c of codes) if (!d.bars[members[c]]?.length) return null;

  const times = [...new Set(codes.flatMap((c) => d.bars[members[c]].map((b) => b.t)))].sort((a, b) => a - b);
  const cap = Math.floor(d.serverMs / MINUTE_MS) * MINUTE_MS;
  const all = [base, ...codes];
  const ones: Record<string, number> = {};
  for (const c of all) ones[c] = 1;
  const points: IntradayPoint[] = [{ ms: times[0], values: ones }];

  const cursor: Record<string, number> = {};
  for (const t of times) {
    const raw: Record<string, number> = { [base]: 1 };
    for (const c of codes) {
      const bars = d.bars[members[c]];
      let i = cursor[c] ?? -1;
      while (i + 1 < bars.length && bars[i + 1].t <= t) i++;
      cursor[c] = i;
      raw[c] = i < 0 ? 1 : bars[i].close / bars[0].open;
    }
    const m = all.reduce((s, c) => s + raw[c], 0) / all.length;
    const values: Record<string, number> = {};
    for (const c of all) values[c] = raw[c] / m;
    points.push({ ms: Math.min(t + BAR_MS, Math.max(cap, t)), values });
  }
  return points;
}
