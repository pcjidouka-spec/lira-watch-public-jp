/**
 * 通貨強弱グラフの暫定の点 (最新の点を、ページを開いたときの GMO コインのレートで計算する)。
 *
 * 材料 (live) は上流の日次の計算が strength.json に出す。ここでは業者もスワップも選び直さない。
 * 式は上流の _index_series / _index_composite の 1 歩と同じで、上流の本物の計算から作った
 * 見本 (__fixtures__/strength_live_cases.json) と一致することを strengthLive.test.ts が確かめる。
 * ★見本は手で書き換えない (上流の道具が作る)。
 */

export type TickerEntry = { bid: number; timestamp: string; status: string };
export type TickerMap = Record<string, TickerEntry>;

export type LiveSeriesInput = {
  level: number;
  prev_price: number;
  unit: number;
  symbol: string | null;
  swap?: number | null;
  swap_cross?: number | null;
  swap_leg?: number | null;
  leg_symbol?: string | null;
};

export type LiveRefInput = {
  level: number;
  prev_quote: number;
  prev_base: number;
  unit: number;
  direction: 'short' | 'long';
  quote_symbol: string | null;
  base_symbol: string | null;
  swap: number | null;
};

export type StrengthLive = {
  next: string;
  series: Record<string, LiveSeriesInput>;
  references: Record<string, LiveRefInput>;
};

export type LivePeriod = {
  series: Record<string, (number | null)[]>;
  references?: string[];
  live?: StrengthLive;
};

const MAX_AGE_MS = 10 * 60_000;
const MAX_FUTURE_MS = 60_000;

/** GMO の小数秒 (5〜6 桁) を 3 桁に詰めて読む。読めなければ NaN。 */
function parseTs(ts: string): number {
  return Date.parse(ts.replace(/(\.\d{3})\d+/, '$1'));
}

/**
 * FX の取引日。GMO の日足と同じく JST 06:00 (= 21:00Z) で日が変わり、夏冬で動かない
 * (実測: 日足の開始が 21:00Z で夏時間の時期も冬時間の時期も同じ)。
 * 時刻の 6 時間前の JST の日付 = 時刻に 3 時間足した UTC の日付。
 */
export function tradingDate(timestampIso: string): string {
  return new Date(parseTs(timestampIso) + 3 * 3_600_000).toISOString().slice(0, 10);
}

/** /api/fx-now/ の応答 { server_time, ticker } を読む。形が違えば null。 */
export function parseLiveResponse(json: unknown): { ticker: TickerMap; serverMs: number } | null {
  if (!json || typeof json !== 'object') return null;
  const j = json as { server_time?: unknown; ticker?: unknown };
  if (typeof j.server_time !== 'string') return null;
  const serverMs = Date.parse(j.server_time);
  if (!Number.isFinite(serverMs)) return null;
  const ticker = parseTicker(j.ticker);
  return ticker ? { ticker, serverMs } : null;
}

/** GMO の ticker の応答を読む。形が違えば null。数でない bid の銘柄は落とす。 */
export function parseTicker(json: unknown): TickerMap | null {
  if (!json || typeof json !== 'object') return null;
  const j = json as { status?: unknown; data?: unknown };
  if (j.status !== 0 || !Array.isArray(j.data)) return null;
  const out: TickerMap = {};
  for (const row of j.data as Record<string, unknown>[]) {
    if (!row || typeof row.symbol !== 'string') continue;
    const bid = Number(row.bid);
    if (!Number.isFinite(bid) || bid <= 0) continue;
    if (typeof row.timestamp !== 'string' || typeof row.status !== 'string') continue;
    out[row.symbol] = { bid, timestamp: row.timestamp, status: row.status };
  }
  return out;
}

/** その期間の暫定の点に要る銘柄 (重複なし)。 */
export function requiredSymbols(live: StrengthLive): string[] {
  const s = new Set<string>();
  for (const e of Object.values(live.series)) {
    if (e.symbol) s.add(e.symbol);
    if (e.symbol && e.leg_symbol) s.add(e.leg_symbol);
  }
  for (const r of Object.values(live.references)) {
    if (r.quote_symbol) s.add(r.quote_symbol);
    if (r.base_symbol) s.add(r.base_symbol);
  }
  return [...s];
}

/**
 * 暫定の点の値。円を含む参加通貨の平均で割る (参照系列は割らない)。
 * 必要な銘柄のレートが欠けていれば null。
 */
export function computeProvisional(
  period: LivePeriod, base: string, rates: Record<string, number>,
): Record<string, number | null> | null {
  const live = period.live;
  if (!live) return null;
  for (const s of requiredSymbols(live)) if (!(rates[s] > 0)) return null;

  const refs = new Set(period.references ?? []);
  const members = Object.keys(period.series).filter((c) => !refs.has(c));
  const raw: Record<string, number | null> = {};
  const basket: number[] = [];
  for (const c of members) {
    if (c === base) {
      raw[c] = 1.0;
      basket.push(1.0);
      continue;
    }
    const e = live.series[c];
    if (!e) {
      raw[c] = null; // 線が始まっていない (平均にも入れない)
      continue;
    }
    let v: number | null = null;
    if (e.symbol) {
      const P = rates[e.symbol];
      let swap: number | null = null;
      if (e.leg_symbol !== undefined) {
        swap = e.swap_cross == null || e.swap_leg == null || !e.leg_symbol
          ? null
          : e.swap_cross + e.swap_leg * (P / rates[e.leg_symbol]);
      } else {
        swap = e.swap ?? null;
      }
      if (swap !== null) {
        const priceReturn = (P - e.prev_price) / e.prev_price;
        v = e.level * (1.0 + priceReturn + swap / (e.unit * P));
      }
    }
    raw[c] = v;
    basket.push(v ?? e.level);
  }
  const mean = basket.length ? basket.reduce((a, b) => a + b, 0) / basket.length : null;

  const out: Record<string, number | null> = {};
  for (const c of members) {
    const v = raw[c];
    out[c] = v === null || !mean ? null : v / mean;
  }
  for (const c of refs) {
    const r = live.references[c];
    if (!r || r.swap == null || !r.quote_symbol || !r.base_symbol) {
      out[c] = null;
      continue;
    }
    const q = rates[r.quote_symbol];
    const b = rates[r.base_symbol];
    const rq = (q - r.prev_quote) / r.prev_quote;
    const rb = (b - r.prev_base) / r.prev_base;
    const priceReturn = r.direction === 'short' ? rq - rb : rb - rq;
    out[c] = r.level * (1.0 + priceReturn + r.swap / (r.unit * b));
  }
  return out;
}

/** 出す条件 (REQ-LIVE-002) を満たすときだけ暫定の点を返す。 */
export function provisionalPoint(
  period: LivePeriod, base: string, ticker: TickerMap | null, nowMs: number,
): { date: string; asOf: string; values: Record<string, number | null> } | null {
  const live = period.live;
  if (!live || !ticker) return null;
  const rates: Record<string, number> = {};
  let asOf = '';
  let asOfMs = -Infinity;
  for (const s of requiredSymbols(live)) {
    const t = ticker[s];
    if (!t || t.status !== 'OPEN') return null;
    const ms = parseTs(t.timestamp);
    if (!Number.isFinite(ms)) return null;
    if (nowMs - ms > MAX_AGE_MS || ms - nowMs > MAX_FUTURE_MS) return null;
    if (tradingDate(t.timestamp) !== live.next) return null;
    rates[s] = t.bid;
    if (ms > asOfMs) {
      asOfMs = ms;
      asOf = t.timestamp;
    }
  }
  const values = computeProvisional(period, base, rates);
  return values ? { date: live.next, asOf, values } : null;
}
