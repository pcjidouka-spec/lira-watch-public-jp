import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

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

// 通貨ごとに固定色。期間を切り替えても線の色が変わらないようにする。
const COLORS: Record<string, string> = {
  JPY: '#111827',
  USD: '#3b82f6',
  TRY: '#ef4444',
  MXN: '#10b981',
  ZAR: '#f59e0b',
  HUF: '#8b5cf6',
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
    // p が無いときは codes が空なのでコールバックは呼ばれないが、
    // 期間が欠けた JSON を渡されても落ちないよう明示的に守る。
    const vals = codes.flatMap((c) => (p?.series?.[c] ?? []).filter((v): v is number => v !== null));
    if (!vals.length) return [0.95, 1.05];
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = Math.max((hi - lo) * 0.12, 0.002);
    return [lo - pad, hi + pad];
  }, [p, codes]);

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

      <div className="strength-wrapper">
        <ResponsiveContainer width="100%" height={420} minHeight={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 12, left: 4, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              domain={domain}
              tickFormatter={(v: number) => v.toFixed(3)}
              width={56}
            />
            <Tooltip
              formatter={(value, name) => [
                typeof value === 'number' ? value.toFixed(4) : 'データなし',
                CURRENCY_LABELS[String(name)] ?? String(name),
              ]}
              labelStyle={{ color: '#374151' }}
            />
            <Legend
              iconType="line"
              formatter={(value: string) => CURRENCY_LABELS[value] ?? value}
            />
            {codes.map((c) => (
              <Line
                key={c}
                type="monotone"
                dataKey={c}
                stroke={COLORS[c] ?? '#6b7280'}
                strokeWidth={c === data.base ? 3 : 2}
                strokeDasharray={c === data.base ? '6 3' : undefined}
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
        .strength-wrapper {
          width: 100%;
        }
        .strength-limited {
          margin: 8px 0 0;
          font-size: 12px;
          color: #b45309;
        }
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
      `}</style>
    </div>
  );
};
