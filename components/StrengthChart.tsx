import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer,
} from 'recharts';
import { CurrencyFlag } from '@/components/CurrencyFlag';

export type StrengthPeriod = {
  dates: string[];
  series: Record<string, (number | null)[]>;
  providers: Record<string, string>;
  switch_history: Record<string, { provider: string; from: string }[]>;
  insufficient: string[];
  requested_from: string;
  /** 要求した窓がデータ開始より前まで遡っている (タブ名より実期間が短い) */
  data_limited: boolean;
};

export type StrengthData = {
  generated_at: string;
  base: string;
  note: string;
  provider_names: Record<string, string>;
  units: Record<string, number>;
  periods: Record<string, StrengthPeriod>;
};

const PERIOD_LABELS: [string, string][] = [
  ['1w', '1週間'],
  ['1m', '1ヶ月'],
  ['3m', '3ヶ月'],
  ['6m', '6ヶ月'],
  ['1y', '1年'],
];

// 黒地で見分けがつく彩度の高い色。期間を切り替えても線の色は変えない。
const COLORS: Record<string, string> = {
  JPY: '#ffffff',
  USD: '#22d3ee',
  TRY: '#ff4d4f',
  MXN: '#ffd400',
  ZAR: '#4ade80',
  HUF: '#a78bfa',
};

const CURRENCY_LABELS: Record<string, string> = {
  JPY: '日本円',
  USD: '米ドル',
  TRY: 'トルコリラ',
  MXN: 'メキシコペソ',
  ZAR: '南アフリカランド',
  HUF: 'ハンガリーフォリント',
};

const fmtDate = (d: string) => d.slice(5).replace('-', '/');

/**
 * 週ごとに交互の縦帯を出すための区間を作る。
 *
 * 元アプリはセッション単位の細い縦帯でリズムを作っている。月単位で切ると
 * 1ヶ月タブでは帯が1本の大きな塊になり、リズムではなく「ハイライト」に
 * 見えてしまうため、どのタブでも同じ密度になる週単位にしている。
 */
function weekBands(dates: string[]): { x1: string; x2: string }[] {
  const bands: { x1: string; x2: string }[] = [];
  let i = 0;
  let odd = false;
  while (i < dates.length) {
    let j = i;
    // 月曜で区切る。最初の区間だけは途中から始まる
    while (j + 1 < dates.length && new Date(dates[j + 1] + 'T00:00:00').getDay() !== 1) j++;
    if (odd) bands.push({ x1: fmtDate(dates[i]), x2: fmtDate(dates[j]) });
    odd = !odd;
    i = j + 1;
  }
  return bands;
}

interface Props {
  data: StrengthData;
}

export const StrengthChart: React.FC<Props> = ({ data }) => {
  const [period, setPeriod] = useState<string>('1m');
  const p = data.periods[period];

  const codes = useMemo(() => Object.keys(p?.series ?? {}), [p]);

  const chartData = useMemo(() => {
    if (!p) return [];
    return p.dates.map((d, i) => {
      const row: Record<string, string | number | null> = { date: fmtDate(d) };
      codes.forEach((c) => {
        row[c] = p.series[c][i];
      });
      return row;
    });
  }, [p, codes]);

  // 起点=1.0 からの乖離が小さいので、Y 軸は実データ幅に合わせて詰める
  const domain = useMemo<[number, number]>(() => {
    const vals = codes.flatMap((c) => (p?.series?.[c] ?? []).filter((v): v is number => v !== null));
    if (!vals.length) return [0.95, 1.05];
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = Math.max((hi - lo) * 0.12, 0.002);
    return [lo - pad, hi + pad];
  }, [p, codes]);

  // 凡例は現在値の高い順。元アプリと同じく、強い通貨が上に来る
  const ranked = useMemo(() => {
    if (!p) return [];
    const latest = (c: string) => {
      const s = p.series[c];
      for (let i = s.length - 1; i >= 0; i--) if (s[i] !== null) return s[i] as number;
      return null;
    };
    return codes
      .map((c) => ({ code: c, value: latest(c) }))
      .sort((a, b) => (b.value ?? -Infinity) - (a.value ?? -Infinity));
  }, [p, codes]);

  const bands = useMemo(() => (p ? weekBands(p.dates) : []), [p]);

  if (!p || !p.dates.length) {
    return <p className="strength-empty">データがまだありません。</p>;
  }

  const providerName = (id: string) => data.provider_names[id] ?? id;

  return (
    <div className="strength-chart">
      <div className="strength-tabs" role="tablist">
        {PERIOD_LABELS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={period === key}
            className={period === key ? 'strength-tab active' : 'strength-tab'}
            onClick={() => setPeriod(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="strength-panel">
        <div className="strength-panel-head">
          <span className="strength-asof">{p.dates[p.dates.length - 1]} 時点</span>
          <span className="strength-range">
            {p.dates[0]} 〜 {p.dates[p.dates.length - 1]}（{p.dates.length}日）
          </span>
        </div>

        <div className="strength-plot">
          <div className="strength-canvas">
            <ResponsiveContainer width="100%" height={420} minHeight={280}>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                {bands.map((b) => (
                  <ReferenceArea
                    key={b.x1}
                    x1={b.x1}
                    x2={b.x2}
                    fill="#12202e"
                    fillOpacity={1}
                    ifOverflow="extendDomain"
                  />
                ))}
                <CartesianGrid stroke="#2a2a2a" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#c9c9c9' }}
                  tickLine={{ stroke: '#3a3a3a' }}
                  axisLine={{ stroke: '#3a3a3a' }}
                  minTickGap={28}
                  height={26}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#c9c9c9' }}
                  tickLine={{ stroke: '#3a3a3a' }}
                  axisLine={{ stroke: '#3a3a3a' }}
                  domain={domain}
                  tickFormatter={(v: number) => v.toFixed(4)}
                  tickCount={8}
                  width={62}
                />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #374151',
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#e5e7eb' }}
                  itemSorter={(item: any) => -(item.value ?? 0)}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(4) : 'データなし',
                    CURRENCY_LABELS[String(name)] ?? String(name),
                  ]}
                />
                {codes.map((c) => (
                  <Line
                    key={c}
                    type="monotone"
                    dataKey={c}
                    stroke={COLORS[c] ?? '#9ca3af'}
                    strokeWidth={c === data.base ? 2 : 1.5}
                    name={c}
                    dot={false}
                    connectNulls={false}
                    // 125点の密な線を左から描くアニメーションは、読めるようになるまで
                    // 1.5秒ほど待たされるうえ、線が途中で切れているように見える。
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <ul className="strength-legend">
            {ranked.map(({ code, value }) => (
              <li key={code} className="strength-legend-item">
                <CurrencyFlag code={code} size={26} />
                <span className="strength-legend-code" style={{ color: COLORS[code] }}>
                  {code}
                </span>
                <span className="strength-legend-value">
                  {value === null ? '—' : value.toFixed(4)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {p.data_limited && (
        <p className="strength-limited">
          データの蓄積は {p.dates[0]} からです。このタブはその日以降
          （{p.dates.length}日ぶん）を表示しています。
        </p>
      )}

      {p.insufficient.length > 0 && (
        <p className="strength-insufficient">
          この期間はデータ不足のため非表示:{' '}
          {p.insufficient.map((c) => CURRENCY_LABELS[c] ?? c).join('、')}
        </p>
      )}

      <div className="strength-providers">
        <span className="strength-providers-title">採用スワップ</span>
        {Object.keys(p.providers).map((c) => {
          const hist = p.switch_history[c] ?? [];
          const from = hist.length ? hist[hist.length - 1].from : null;
          return (
            <span key={c} className="strength-provider">
              {CURRENCY_LABELS[c] ?? c}: {providerName(p.providers[c])}
              {from && <span className="strength-from">（{from}〜）</span>}
            </span>
          );
        })}
      </div>

      <p className="strength-note">{data.note}</p>
      <p className="strength-note">
        各通貨を1万通貨（ハンガリーフォリントは10万通貨）ぶん、レバレッジ1倍で買って
        持ち続けた場合の損益を、為替の値動きとスワップの両方を含めて指数にしています。
        表示している通貨の平均が1.0になるよう揃えているため、日本円も上下します。
        円はスワップを受け取れないので、円の線が下がるほど他通貨が優位という読み方になります。
      </p>
      <p className="strength-generated">最終更新: {data.generated_at}</p>

      <style jsx>{`
        .strength-chart {
          margin: 0 0 24px;
        }
        .strength-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .strength-tab {
          padding: 6px 16px;
          border: 1px solid #d1d5db;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
        }
        .strength-tab.active {
          background: #1f2937;
          border-color: #1f2937;
          color: #fff;
        }
        .strength-panel {
          background: #0b0b0b;
          border-radius: 10px;
          padding: 12px 12px 6px;
        }
        .strength-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }
        .strength-asof {
          color: #f3f4f6;
          font-size: 13px;
          font-weight: 700;
        }
        .strength-range {
          color: #9ca3af;
          font-size: 11px;
        }
        .strength-plot {
          display: flex;
          align-items: stretch;
          gap: 10px;
        }
        .strength-canvas {
          flex: 1;
          min-width: 0;
        }
        .strength-legend {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 92px;
          flex: 0 0 auto;
        }
        .strength-legend-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .strength-legend-code {
          font-size: 12px;
          font-weight: 700;
          line-height: 1.2;
        }
        .strength-legend-value {
          font-size: 10px;
          color: #9ca3af;
          line-height: 1.2;
        }
        .strength-limited,
        .strength-insufficient {
          margin: 8px 0 0;
          font-size: 12px;
          color: #b45309;
        }
        .strength-providers {
          margin: 10px 0 0;
          font-size: 12px;
          color: #4b5563;
          display: flex;
          flex-wrap: wrap;
          gap: 4px 14px;
          align-items: baseline;
        }
        .strength-providers-title {
          font-weight: 600;
          color: #374151;
        }
        .strength-from {
          color: #9ca3af;
        }
        .strength-note {
          margin: 10px 0 0;
          font-size: 12px;
          line-height: 1.7;
          color: #6b7280;
        }
        .strength-generated {
          margin: 8px 0 0;
          font-size: 11px;
          color: #9ca3af;
        }
        .strength-empty {
          color: #6b7280;
        }
        @media (max-width: 600px) {
          .strength-legend {
            width: 62px;
          }
        }
      `}</style>
    </div>
  );
};
