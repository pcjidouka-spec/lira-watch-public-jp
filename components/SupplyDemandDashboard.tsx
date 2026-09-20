import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type Stage = 'none' | 'caution' | 'warning' | 'surge' | null;

export interface SDPoint {
  d: string;
  v: number | null;
  z: number | null;
  s: Stage;
  dir: number;
}

export interface SDEpisode {
  start: string;
  end: string;
  stage: 'warning' | 'surge';
  z: number | null;
  dir: number;
  weeks: number;
  /** 直前の警戒以上の区間と逆向きだったか (0003 §2)。 */
  reversal: boolean;
}

/** グラフの背景に塗る区間。★episodes と違い「注意」も含み、段階ごとに分かれている。 */
export interface SDBand {
  start: string;
  end: string;
  stage: 'caution' | 'warning' | 'surge';
  z: number | null;
  dir: number;
  weeks: number;
}

export interface SDCurrency {
  code: string;
  name: string;
  points: SDPoint[];
  episodes: SDEpisode[];
  bands: SDBand[];
  current: { stage: Stage; dir: number; z: number | null; date: string | null; active: boolean };
  stats: { weeks: number; first: string; mean_open_interest: number | null };
}

export interface SupplyDemandData {
  generated_at: string;
  as_of: string | null;
  stale_currencies: { code: string; name: string; date: string }[];
  stale_after_days: number;
  gaps: { code: string; from: string; to: string; days: number }[];
  cadence: string;
  source: string;
  source_url: string;
  lag_note: string;
  nature_note: string;
  basis_note: string;
  /** ページ側がビルド時刻から計算して差し込む。JSON には無い (0003 §4-5)。 */
  as_of_age_days: number | null;
  /** ページを組んだ日 (YYYY-MM-DD)。JSON には無い。 */
  built_at: string;
  method: {
    value: string;
    slope: string;
    score: string;
    stages: { caution: number; warning: number; surge: number };
    now_active_threshold: number;
  };
  currencies: SDCurrency[];
  unavailable: { code: string; name: string; reason: string }[];
}

const PERIODS: { key: string; label: string; weeks: number }[] = [
  { key: '1y', label: '1年', weeks: 52 },
  { key: '2y', label: '2年', weeks: 104 },
  // ★「全期間」とは書かない。ページ側が 157 週に絞って渡しているので嘘になる。
  { key: '3y', label: '3年', weeks: 156 },
];

// 買い方向は赤、売り方向は青。段階が上がるほど濃くする。
// 注意(caution)は年7.5回出るので、区間だらけに見えないよう最も薄くする。
// ★濃度は 2026-09-20 に上げた。注意 0.10 は暗い背景 (#0f1a26) に対してほぼ判別できず、
//   「現在の状態＝変化拡大」なのにグラフに何も見えない、という報告を受けた。
//   ★上げすぎない: 帯は大きな面なので、濃い飽和色の塊にすると目立ちすぎて線が読めなくなる。
const BAND: Record<string, Record<string, string>> = {
  buy: {
    caution: 'rgba(239, 68, 68, 0.18)',
    warning: 'rgba(239, 68, 68, 0.30)',
    surge: 'rgba(239, 68, 68, 0.45)',
  },
  sell: {
    caution: 'rgba(59, 130, 246, 0.18)',
    warning: 'rgba(59, 130, 246, 0.30)',
    surge: 'rgba(59, 130, 246, 0.45)',
  },
};

/** 区間の線の色 (開始地点の縦線用)。帯より濃く、面ではなく線なので飽和させてよい。 */
const EDGE: Record<string, string> = {
  buy: 'rgba(248, 113, 113, 0.9)',
  sell: 'rgba(96, 165, 250, 0.9)',
};

/** カードの背景色。マーカーのリングに使う (marks: 重なる印には 2px の surface リング)。 */
const CARD_SURFACE = '#0f1a26';

/** 方向の判定はここ 1 箇所に集める。
 *  ★以前は配色が `dir >= 0`（0 を買い＝赤）、ツールチップが `dir > 0`（0 を売り）で
 *    食い違っていた。`direction_of` は傾きがちょうど 0 のとき 0 を返すので到達しうる。 */
function isBuy(dir: number): boolean {
  return dir > 0;
}

function directionLabel(dir: number): string {
  return isBuy(dir) ? '買い方向' : '売り方向';
}

function bandColor(dir: number, stage: 'caution' | 'warning' | 'surge'): string {
  return BAND[isBuy(dir) ? 'buy' : 'sell'][stage];
}

function edgeColor(dir: number): string {
  return EDGE[isBuy(dir) ? 'buy' : 'sell'];
}

/**
 * 帯の描画範囲を、軸のカテゴリ値で返す。
 *
 * ★ReferenceArea は x1 と x2 が同じだと【幅ゼロになり何も描かれない】。
 *   1 週だけの区間がすべてこれに当たり、実測で 2 年窓の帯 51 本のうち
 *   ★29 本 (57%) が消えていた (2026-09-20 に利用者の指摘で発覚)。
 *   -> 1 週の区間は次の週まで伸ばす。最終週なら前の週へ伸ばす。
 *   ★「1 週の帯は 1 区間ぶんの幅で描く」と読み替えていることになるので、
 *     読み方の説明にもそう書く。
 */
function bandSpan(
  startDate: string,
  endDate: string,
  axis: string[],
  axisIndex: Map<string, number>,
): [string, string] | null {
  if (axis.length === 0) return null;
  const rawStart = axisIndex.get(startDate);
  const rawEnd = axisIndex.get(endDate);
  // 期間の外で始まった区間は左端に丸める。
  const from = rawStart ?? 0;
  const to = rawEnd ?? axis.length - 1;
  if (from > to) return null;
  if (from !== to) return [axis[from], axis[to]];
  // 幅ゼロ。隣へ 1 区間ぶん伸ばす。
  if (to + 1 < axis.length) return [axis[from], axis[to + 1]];
  if (from - 1 >= 0) return [axis[from - 1], axis[to]];
  return null;
}

const STAGE_LABEL: Record<string, string> = {
  caution: '注意',
  warning: '警戒',
  surge: '急変',
};

function statusLabel(current: SDCurrency['current']): { icon: string; text: string; tone: string } {
  const { stage, dir } = current;
  if (stage === 'surge' || stage === 'warning') {
    const strong = stage === 'surge';
    if (isBuy(dir)) {
      return {
        icon: '🔴',
        text: strong ? '急激な買い変化' : '買い方向へ変化中',
        tone: strong ? 'surge-buy' : 'warning-buy',
      };
    }
    return {
      icon: '🔵',
      text: strong ? '急激な売り変化' : '売り方向へ変化中',
      tone: strong ? 'surge-sell' : 'warning-sell',
    };
  }
  if (stage === 'caution') return { icon: '🟡', text: '変化拡大', tone: 'caution' };
  if (stage === null) return { icon: '·', text: '判定に必要な履歴が不足', tone: 'unknown' };
  return { icon: '—', text: '通常', tone: 'normal' };
}

export function SupplyDemandDashboard({ data }: { data: SupplyDemandData }) {
  const [periodKey, setPeriodKey] = React.useState('2y');
  const [narrow, setNarrow] = React.useState(false);

  React.useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 720);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const period = PERIODS.find((p) => p.key === periodKey) ?? PERIODS[1];

  // 全通貨で共通の時間軸を作る。同時性を見る画面なので、通貨ごとに軸を変えない。
  const axis = React.useMemo(() => {
    const all = new Set<string>();
    data.currencies.forEach((c) => c.points.forEach((p) => all.add(p.d)));
    const sorted = Array.from(all).sort();
    return period.weeks > 0 ? sorted.slice(-period.weeks) : sorted;
  }, [data, period.weeks]);

  const firstDate = axis[0] ?? '';
  const axisIndex = React.useMemo(() => {
    const map = new Map<string, number>();
    axis.forEach((d, i) => map.set(d, i));
    return map;
  }, [axis]);

  // 現在の状態は、変化が大きい通貨を先に並べる。通常の通貨を探させない。
  const ranked = React.useMemo(() => {
    const order = { surge: 0, warning: 1, caution: 2, none: 3 } as Record<string, number>;
    return [...data.currencies].sort((a, b) => {
      const ra = order[a.current.stage ?? 'none'] ?? 4;
      const rb = order[b.current.stage ?? 'none'] ?? 4;
      if (ra !== rb) return ra - rb;
      return Math.abs(b.current.z ?? 0) - Math.abs(a.current.z ?? 0);
    });
  }, [data]);

  const activeCount = data.currencies.filter((c) => c.current.active).length;
  const surgeCount = data.currencies.filter((c) => c.current.stage === 'surge').length;
  const isStale =
    data.as_of_age_days !== null && data.as_of_age_days > data.stale_after_days;

  return (
    <div className="sd-root">
      {/* ---- データが古いときの申告 (0003 §4-3)。通知は作らない。画面が自分で語る ---- */}
      {isStale && (
        <p className="sd-stale-banner">
          <strong>このデータは古くなっています。</strong>
          最新の集計は {data.as_of} 時点で、ビルド時点から {data.as_of_age_days} 日前です
          （通常は最大 {data.stale_after_days} 日）。
          取得が止まっている可能性があります。下の「現在の状態」は現在を表していません。
        </p>
      )}
      {data.gaps.length > 0 && (
        <p className="sd-stale-banner">
          <strong>週が抜けている箇所があります。</strong>
          {data.gaps
            .map((g) => `${g.code}: ${g.from}→${g.to}（${g.days}日）`)
            .join('、')}
          。この区間をまたぐ傾きは正しくありません。
        </p>
      )}
      {data.stale_currencies.length > 0 && (
        <p className="sd-stale-banner">
          <strong>最新週が届いていない通貨があります。</strong>
          {data.stale_currencies.map((c) => `${c.code}（${c.date} 時点）`).join('、')}
        </p>
      )}

      {/* ---- 現在の状態 ---- */}
      <section className={isStale ? 'sd-now sd-now-stale' : 'sd-now'}>
        <div className="sd-now-head">
          <h2>現在の状態</h2>
          <span className="sd-asof">
            {data.as_of} 時点（週次）
            {/* ★「急変」は |z|>=3.0 だけに使う語 (0003 §1)。
                ここは警戒以上 (|z|>=2.0) の集計なので「変化中」と書く。 */}
            {activeCount > 0 ? ` ・ ${activeCount}通貨が変化中` : ' ・ 変化中の通貨なし'}
            {surgeCount > 0 ? `（うち急変 ${surgeCount}）` : ''}
          </span>
        </div>
        <ul className="sd-now-list">
          {ranked.map((c) => {
            const s = statusLabel(c.current);
            return (
              <li key={c.code} className={`sd-now-item tone-${s.tone}`}>
                <span className="sd-now-code">{c.code}</span>
                <span className="sd-now-name">{c.name}</span>
                <span className="sd-now-state">
                  <span className="sd-now-icon">{s.icon}</span>
                  {s.text}
                </span>
                <span className="sd-now-z">{c.current.z === null ? '—' : `z ${c.current.z.toFixed(2)}`}</span>
              </li>
            );
          })}
          {data.unavailable.map((u) => (
            <li key={u.code} className="sd-now-item tone-unavailable">
              <span className="sd-now-code">{u.code}</span>
              <span className="sd-now-name">{u.name}</span>
              <span className="sd-now-state">
                <span className="sd-now-icon">×</span>
                データ対象外
              </span>
              <span className="sd-now-z">—</span>
            </li>
          ))}
        </ul>
        {data.unavailable.map((u) => (
          <p key={u.code} className="sd-unavailable-note">
            <strong>{u.name}（{u.code}）</strong>：{u.reason}
          </p>
        ))}
      </section>

      {/* ---- 期間 ---- */}
      <div className="sd-tabs" role="tablist">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={p.key === periodKey}
            className={p.key === periodKey ? 'sd-tab active' : 'sd-tab'}
            onClick={() => setPeriodKey(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ---- 同時性ビュー ---- */}
      <section className="sd-timeline-wrap">
        <div className="sd-now-head">
          <h2>どの通貨で同時に起きたか</h2>
          <span className="sd-asof">
            {firstDate} 〜 {data.as_of}（{axis.length}週）
          </span>
        </div>
        <div className="sd-timeline">
          {data.currencies.map((c) => (
            <div key={c.code} className="sd-tl-row">
              <span className="sd-tl-code">{c.code}</span>
              <span className="sd-tl-track">
                {c.episodes.map((e) => {
                  const a = axisIndex.get(e.start);
                  const b = axisIndex.get(e.end);
                  if (a === undefined && b === undefined) return null;
                  const from = a ?? 0;
                  const to = b ?? axis.length - 1;
                  const left = (from / axis.length) * 100;
                  const width = Math.max(((to - from + 1) / axis.length) * 100, 0.7);
                  return (
                    <span
                      key={`${e.start}-${e.end}`}
                      className="sd-tl-band"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        background: bandColor(e.dir, e.stage),
                      }}
                      data-reversal={e.reversal ? '1' : undefined}
                      title={`${e.start}〜${e.end}（${e.weeks}週） ${
                        directionLabel(e.dir)
                      } ${e.stage === 'surge' ? '急変' : '変化中'}${
                        e.reversal ? '・反転' : ''
                      } z=${e.z ?? '—'}`}
                    />
                  );
                })}
                {/* ★各行の右端に現在の段階を出す。帯は警戒以上しか描かないので、
                    注意 (変化拡大) だと行が空に見え、上の「現在の状態」と食い違う
                    (2026-09-20 に利用者の指摘で判明)。ここには注意も出す。 */}
                {c.current.stage && c.current.stage !== 'none' && (
                  <span
                    className="sd-tl-now"
                    style={{
                      background: bandColor(
                        c.current.dir,
                        c.current.stage as 'caution' | 'warning' | 'surge',
                      ),
                      borderColor: edgeColor(c.current.dir),
                    }}
                    title={`現在: ${statusLabel(c.current).text} (z=${c.current.z ?? '—'})`}
                  />
                )}
              </span>
            </div>
          ))}
        </div>
        <p className="sd-basis">{data.basis_note}</p>
        <div className="sd-legend">
          <span className="sd-legend-group">
            <span className="sd-legend-dir">買い方向</span>
            {(['caution', 'warning', 'surge'] as const).map((st) => (
              <span key={st} className="sd-legend-item">
                <i style={{ background: BAND.buy[st] }} />
                {STAGE_LABEL[st]}
              </span>
            ))}
          </span>
          <span className="sd-legend-group">
            <span className="sd-legend-dir">売り方向</span>
            {(['caution', 'warning', 'surge'] as const).map((st) => (
              <span key={st} className="sd-legend-item">
                <i style={{ background: BAND.sell[st] }} />
                {STAGE_LABEL[st]}
              </span>
            ))}
          </span>
          <span className="sd-legend-item">
            <i className="sd-legend-reversal" />反転（直前の区間と逆向き）
          </span>
          <span className="sd-legend-item">
            <i className="sd-legend-now" />現在地点（各行の右端・下のグラフの最新点）
          </span>
          <span className="sd-legend-note">
            帯は警戒以上のみ。注意（変化拡大）は各行の右端と、下のグラフの背景に出ます。
            1 週だけの区間は 1 区間ぶんの幅で描いています
          </span>
        </div>
      </section>

      {/* ---- 通貨ごとの需給グラフ ---- */}
      <section className="sd-charts">
        <div className="sd-now-head">
          <h2>通貨ごとの需給の推移</h2>
          <span className="sd-asof">背景色は「需給の変化が急だった区間」です</span>
        </div>
        <div className="sd-grid">
          {data.currencies.map((c) => {
            const rows = c.points
              .filter((p) => axisIndex.has(p.d))
              .map((p) => ({ date: p.d, value: p.v }));
            const lastIndex = rows.length - 1;
            // ★背景は bands を使う。episodes (警戒以上をひとまとめ) では
            //   要件 §5 の 3 段階 (注意/警戒/急変) が表現できない。
            //   ★bandSpan を通すこと。通さないと 1 週の区間が幅ゼロで消える。
            const visible = c.bands
              .filter((e) => axisIndex.has(e.start) || axisIndex.has(e.end))
              .map((e) => ({ band: e, span: bandSpan(e.start, e.end, axis, axisIndex) }))
              .filter((x) => x.span !== null);
            // ★要件 §12「急変開始地点」。区間 (警戒以上) の始まりに縦線を引く。
            const onsets = c.episodes.filter((e) => axisIndex.has(e.start));
            const s = statusLabel(c.current);
            return (
              <div key={c.code} className="sd-card">
                <div className="sd-card-head">
                  <span className="sd-card-title">
                    <strong>{c.code}</strong> {c.name}
                  </span>
                  <span className={`sd-card-state tone-${s.tone}`}>
                    {s.icon} {s.text}
                  </span>
                </div>
                <div className="sd-card-plot">
                  <ResponsiveContainer width="100%" height={narrow ? 170 : 200}>
                    <LineChart data={rows} margin={{ top: 6, right: 6, left: 0, bottom: 2 }}>
                      {visible.map(({ band, span }) => (
                        <ReferenceArea
                          key={`${band.start}-${band.end}-${band.stage}`}
                          x1={span![0]}
                          x2={span![1]}
                          fill={bandColor(band.dir, band.stage)}
                          fillOpacity={1}
                          ifOverflow="extendDomain"
                        />
                      ))}
                      <CartesianGrid stroke="#263043" vertical={false} />
                      {/* ★y=0 はグリッドではなく「買い越し / 売り越しの境目」という閾値。
                          破線なのはそのため (グリッドを破線にするのは別の話)。 */}
                      <ReferenceLine y={0} stroke="#4b5563" strokeDasharray="3 3" />
                      {onsets.map((e) => (
                        <ReferenceLine
                          key={`onset-${e.start}`}
                          x={e.start}
                          stroke={edgeColor(e.dir)}
                          strokeWidth={1.4}
                          ifOverflow="extendDomain"
                        />
                      ))}
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 9, fill: '#c9c9c9' }}
                        tickLine={{ stroke: '#3a3a3a' }}
                        axisLine={{ stroke: '#3a3a3a' }}
                        minTickGap={narrow ? 48 : 36}
                        height={20}
                      />
                      <YAxis
                        tick={{ fontSize: 9, fill: '#c9c9c9' }}
                        tickLine={{ stroke: '#3a3a3a' }}
                        axisLine={{ stroke: '#3a3a3a' }}
                        width={44}
                        tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#111827',
                          border: '1px solid #374151',
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: '#e5e7eb' }}
                        formatter={(value) => [
                          typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : 'データなし',
                          '需給（ネット÷建玉）',
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#e5e7eb"
                        strokeWidth={1.6}
                        connectNulls={false}
                        isAnimationActive={false}
                        // ★要件 §12「現在地点」。最新の 1 点だけに段階色の印を置く。
                        //   これが無いと「現在の状態＝変化拡大」と画面が結びつかない
                        //   (2026-09-20 に利用者の指摘で判明)。
                        //   surface 色の 2px リングで、線や帯に重なっても輪郭が残る。
                        dot={(props: any) => {
                          if (props.index !== lastIndex) {
                            return <g key={`d${props.index}`} />;
                          }
                          const staged = s.tone !== 'normal' && s.tone !== 'unknown';
                          const fill = staged ? edgeColor(c.current.dir) : '#e5e7eb';
                          return (
                            <circle
                              key="now"
                              cx={props.cx}
                              cy={props.cy}
                              r={4.5}
                              fill={fill}
                              stroke={CARD_SURFACE}
                              strokeWidth={2}
                            />
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="sd-card-foot">
                  平均建玉 {c.stats.mean_open_interest?.toLocaleString() ?? '—'} 枚 ／{' '}
                  {c.stats.first} から {c.stats.weeks} 週
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <style jsx>{`
        .sd-root {
          margin-top: 8px;
        }
        .sd-now-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .sd-now-head h2 {
          font-size: 17px;
          margin: 0;
          color: #1f2937;
        }
        .sd-asof {
          font-size: 12px;
          color: #6b7280;
        }
        .sd-now-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }
        .sd-now-item {
          display: grid;
          grid-template-columns: 52px 1fr auto 70px;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-bottom: 1px solid #f1f2f4;
          font-size: 14px;
          border-left: 4px solid transparent;
        }
        .sd-now-item:last-child {
          border-bottom: none;
        }
        .sd-now-code {
          font-weight: 700;
          color: #111827;
          letter-spacing: 0.02em;
        }
        .sd-now-name {
          color: #4b5563;
        }
        .sd-now-state {
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
        }
        .sd-now-icon {
          margin-right: 5px;
        }
        .sd-now-z {
          text-align: right;
          font-variant-numeric: tabular-nums;
          color: #6b7280;
          font-size: 12px;
        }
        .tone-surge-buy {
          border-left-color: #ef4444;
          background: #fef2f2;
        }
        .tone-warning-buy {
          border-left-color: #fca5a5;
          background: #fffafa;
        }
        .tone-surge-sell {
          border-left-color: #3b82f6;
          background: #eff6ff;
        }
        .tone-warning-sell {
          border-left-color: #93c5fd;
          background: #fafcff;
        }
        .tone-caution {
          border-left-color: #f59e0b;
          background: #fffbeb;
        }
        .tone-unavailable .sd-now-code,
        .tone-unavailable .sd-now-name,
        .tone-unavailable .sd-now-state {
          color: #9ca3af;
        }
        .tone-unknown .sd-now-state {
          color: #9ca3af;
          font-weight: 500;
        }
        .sd-unavailable-note {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.7;
          margin: 8px 0 0;
        }
        .sd-tabs {
          display: flex;
          gap: 6px;
          margin: 22px 0 10px;
        }
        .sd-tab {
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 999px;
          padding: 5px 16px;
          font-size: 13px;
          cursor: pointer;
        }
        .sd-tab.active {
          background: #764ba2;
          border-color: #764ba2;
          color: white;
        }
        .sd-timeline-wrap {
          margin-top: 18px;
        }
        .sd-timeline {
          background: #12202e;
          border-radius: 10px;
          padding: 12px 12px 10px;
        }
        .sd-tl-row {
          display: grid;
          grid-template-columns: 44px 1fr;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .sd-tl-row:last-child {
          margin-bottom: 0;
        }
        .sd-tl-code {
          font-size: 11px;
          font-weight: 700;
          color: #cbd5e1;
        }
        .sd-tl-track {
          position: relative;
          display: block;
          height: 16px;
          background: #1b2a3c;
          border-radius: 3px;
          overflow: hidden;
        }
        .sd-tl-band {
          position: absolute;
          top: 0;
          bottom: 0;
          border-radius: 2px;
        }
        .sd-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 10px;
          font-size: 12px;
          color: #4b5563;
        }
        .sd-legend-group {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .sd-legend-dir {
          font-weight: 600;
          color: #374151;
        }
        .sd-legend-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .sd-legend-note {
          color: #9ca3af;
          font-size: 11.5px;
        }
        .sd-legend-reversal {
          background: transparent;
          border-top: 3px solid #fbbf24;
          outline: none !important;
          height: 3px !important;
        }
        .sd-basis {
          font-size: 12px;
          line-height: 1.8;
          color: #6b7280;
          margin: 10px 0 0;
        }
        .sd-stale-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          line-height: 1.8;
          color: #7f1d1d;
          margin: 0 0 14px;
        }
        .sd-now-stale .sd-now-list {
          opacity: 0.55;
        }
        .sd-tl-band[data-reversal='1'] {
          border-top: 3px solid #fbbf24;
        }
        .sd-tl-now {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 7px;
          border-left: 2px solid;
          border-radius: 0 3px 3px 0;
        }
        .sd-legend-now {
          background: #e5e7eb;
          border-radius: 50%;
          width: 11px !important;
          height: 11px !important;
          outline: 2px solid #0f1a26 !important;
        }
        .sd-legend-item i {
          width: 22px;
          height: 11px;
          border-radius: 2px;
          display: inline-block;
          outline: 1px solid #d1d5db;
        }
        .sd-charts {
          margin-top: 26px;
        }
        .sd-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .sd-card {
          background: #0f1a26;
          border-radius: 10px;
          padding: 10px 10px 6px;
        }
        .sd-card-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .sd-card-title {
          font-size: 13px;
          color: #e5e7eb;
        }
        .sd-card-title strong {
          font-size: 14px;
          letter-spacing: 0.02em;
        }
        .sd-card-state {
          font-size: 11px;
          color: #cbd5e1;
          background: transparent;
          border-left: none;
          padding: 0;
        }
        .sd-card-plot {
          width: 100%;
        }
        .sd-card-foot {
          font-size: 10.5px;
          color: #8b9bb0;
          margin: 2px 0 4px;
          line-height: 1.6;
        }
        @media (max-width: 720px) {
          .sd-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .sd-now-item {
            grid-template-columns: 44px 1fr auto;
            font-size: 13px;
          }
          .sd-now-z {
            display: none;
          }
          .sd-now-name {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
