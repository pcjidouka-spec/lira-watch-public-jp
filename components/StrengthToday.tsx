import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { CurrencyFlag } from '@/components/CurrencyFlag';
import { COLORS, DISPLAY_CODES } from '@/components/strengthStyle';
import type { StrengthData } from '@/components/StrengthChart';
import { useIntraday } from '@/hooks/useIntraday';
import { CURRENCY_LABELS } from '@/lib/strengthCurrencies';
import { buildIntraday, intradayMembers } from '@/lib/strengthIntraday';
import { strengthView, toggleHidden } from '@/lib/strengthSelection';

const NO_DATA = '本日のデータはありません（土日・取引開始前・取得できなかったとき）';
const NOTE = 'スワップを含まない値動きだけです。人民元・ポーランドズロチと、破線のポジションは表示していません。';

const JST_HM = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const fmtHm = (ms: number) => JST_HM.format(new Date(ms));

type Props = {
  data: StrengthData;
  hidden: string[];
  setHidden: React.Dispatch<React.SetStateAction<string[]>>;
  narrow: boolean;
};

/** 本日タブ (REQ-TODAY-005〜008)。計算はすべて lib/strengthIntraday.ts */
export const StrengthToday: React.FC<Props> = ({ data, hidden, setHidden, narrow }) => {
  const members = useMemo(() => intradayMembers(data.periods['1w'], data.base), [data]);
  const symbols = useMemo(() => Object.values(members), [members]);
  const { data: raw, loading } = useIntraday(symbols);
  const points = useMemo(
    () => (raw ? buildIntraday(raw, members, data.base) : null),
    [raw, members, data.base],
  );

  const codes = useMemo(() => [data.base, ...Object.keys(members)], [data.base, members]);
  const series = useMemo(() => {
    const out: Record<string, number[]> = {};
    for (const c of codes) out[c] = (points ?? []).map((p) => p.values[c]);
    return out;
  }, [codes, points]);
  const view = useMemo(() => strengthView(codes, hidden, series, null), [codes, hidden, series]);
  const chartData = useMemo(
    () => (points ?? []).map((p) => ({ time: fmtHm(p.ms), ...p.values })),
    [points],
  );

  if (loading) return <p className="strength-empty">読み込み中…</p>;
  if (!raw || !points) return <p className="strength-empty">{NO_DATA}</p>;

  const last = points[points.length - 1];
  return (
    <>
      <div className="strength-panel">
        <div className="strength-panel-head">
          <span className="strength-asof">
            {raw.tradingDate} の取引日 06:00〜{fmtHm(last.ms)}（JST）
          </span>
        </div>
        <div className="strength-filter">
          <span className="strength-filter-hint">凡例を押すと線を出し入れできます</span>
        </div>
        {view.showNone && <p className="strength-none">表示する線を凡例で選んでください</p>}
        <div className="strength-plot">
          <div className="strength-canvas">
            <ResponsiveContainer width="100%" height={narrow ? 300 : 420} minHeight={260}>
              <LineChart data={chartData} margin={{ top: 8, right: narrow ? 2 : 8, left: 0, bottom: 4 }}>
                <CartesianGrid stroke="#2a2a2a" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: narrow ? 9 : 10, fill: '#c9c9c9' }}
                  tickLine={{ stroke: '#3a3a3a' }}
                  axisLine={{ stroke: '#3a3a3a' }}
                  minTickGap={narrow ? 44 : 28}
                  height={narrow ? 22 : 26}
                />
                <YAxis
                  tick={{ fontSize: narrow ? 9 : 11, fill: '#c9c9c9' }}
                  tickLine={{ stroke: '#3a3a3a' }}
                  axisLine={{ stroke: '#3a3a3a' }}
                  domain={view.domain}
                  tickFormatter={(v: number) => v.toFixed(narrow ? 3 : 4)}
                  tickCount={narrow ? 5 : 8}
                  width={narrow ? 40 : 62}
                />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 6, fontSize: 12 }}
                  labelStyle={{ color: '#e5e7eb' }}
                  itemSorter={(item: any) => -(item.value ?? 0)}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(4) : 'データなし',
                    CURRENCY_LABELS[String(name)] ?? String(name),
                  ]}
                />
                {view.lines.map((c) => (
                  <Line
                    key={c}
                    type="monotone"
                    dataKey={c}
                    stroke={COLORS[c] ?? '#9ca3af'}
                    strokeWidth={c === data.base ? 2 : 1.5}
                    name={c}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ul className="strength-legend">
            {view.legend.map(({ code, value, pressed: shown }) => (
              <li key={code}>
                <button
                  type="button"
                  className={shown ? 'strength-legend-item' : 'strength-legend-item off'}
                  aria-pressed={shown}
                  title={`${CURRENCY_LABELS[code] ?? code}の線を${shown ? '隠す' : '表示する'}`}
                  onClick={() => setHidden((h) => toggleHidden(h, code))}
                >
                  <CurrencyFlag code={code} size={narrow ? 20 : 26} />
                  <span className="strength-legend-code" style={{ color: COLORS[code] }}>
                    {DISPLAY_CODES[code] ?? code}
                  </span>
                  <span className="strength-legend-value">{value === null ? '—' : value.toFixed(4)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="strength-note">{NOTE}</p>
      <p className="strength-note">
        価格は GMO コインの 5 分足（BID）で、取引日の始まり（06:00 JST）を 1.0 にしています。
        グラフに載せている通貨（凡例で隠した通貨も含む）の平均が 1.0 になるよう揃えているため、日本円も上下します。
      </p>
    </>
  );
};
