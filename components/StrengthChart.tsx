import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer,
} from 'recharts';
import { CurrencyFlag } from '@/components/CurrencyFlag';
import { provisionalPoint, type StrengthLive } from '@/lib/strengthLive';
import { useLiveTicker } from '@/hooks/useLiveTicker';
import { CURRENCY_LABELS, REFERENCE_NOTE_COMMON, referenceNotes, priceProxyNotes } from '@/lib/strengthCurrencies';
import {
  loadHidden, presetHidden, saveHidden, strengthView, toggleHidden, type SelectionPreset,
} from '@/lib/strengthSelection';

export type StrengthPeriod = {
  dates: string[];
  series: Record<string, (number | null)[]>;
  providers: Record<string, string>;
  switch_history: Record<string, { provider: string; from: string }[]>;
  insufficient: string[];
  /** 通貨ではない参照系列のコード。バスケットの平均計算には入っていない */
  references?: string[];
  requested_from: string;
  /** 要求した窓がデータ開始より前まで遡っている (タブ名より実期間が短い) */
  data_limited: boolean;
  /** 暫定の点の材料 (lib/strengthLive.ts) */
  live?: StrengthLive;
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
  PLN: '#fb923c',
  AUD: '#14b8a6',
  // EUR/CHF (2026-09-11 追加)。色相環の空きに置いた。既存 10 系列の色相は
  // 27/50/142/173/187/199/258/291/359 (+ 白) で、50-142 と 291-359 が空く。
  // EUR = ライム (色相 82)・CHF = ピンク (色相 330)。どちらも最近傍まで
  // 29 度以上あり、既存で最も近い USD-AUD の 14 度より余裕がある。
  EUR: '#a3e635',
  CHF: '#f472b6',
  // GBP (2026-09-29 追加)。色相 約 225。最近傍 (199 / 258) からどちらも 25 度以上離れる。
  GBP: '#4f7cff',
  // CNH (2026-10-09 追加)。色相 273。最近傍 (HUF 255 / CHFTRY_S 292) から 18 度以上離れる。
  CNH: '#a242f0',
  CHFTRY_S: '#e879f9',
  CHFTRY_B: '#38bdf8',
  // USD/TRY 売り (2026-10-06 追加)。色相 120。最近傍 (EUR 82 / 142) から 20 度以上離れる。
  USDTRY_S: '#5fd35f',
  // USD/CHF 買い (2026-11-13 に USD/TRY 売りと並べて追加)。色相 158。最近傍 (ZAR 142 / AUD 173) から
  // 15 度以上離れる (既存で最も近い USD-AUD の 14 度より狭くしない)。参照系列は破線なので実線の通貨とも分かれる。
  USDCHF_B: '#34d399',
};

// 凡例に出す短いコード。通貨は3文字コードのままでよいが、参照系列は
// 内部コード (CHFTRY_S) をそのまま出すと読めないので置き換える。
const DISPLAY_CODES: Record<string, string> = {
  CHFTRY_S: 'CHF/TRY売',
  CHFTRY_B: 'CHF/TRY買',
  USDTRY_S: 'USD/TRY売',
  USDCHF_B: 'USD/CHF買',
};

// 線の絞り込みのボタン (2026-11-13。lib/strengthSelection.ts)
const PRESET_LABELS: [SelectionPreset, string][] = [
  ['all', 'すべて'],
  ['currencies', '通貨だけ'],
  ['references', '参照だけ'],
];

/** localStorage に触れるだけで例外になる環境があるので、取り出しも try の中で行う (lib 側で包む) */
const browserStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const fmtDate = (d: string) => d.slice(5).replace('-', '/');
const JST_PARTS = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
/** 'YYYY-MM-DD HH:MM' (JST)。日付と時刻を同じ時刻から取る。 */
const fmtJstDateTime = (ts: string) => {
  const parts: Record<string, string> = {};
  JST_PARTS.formatToParts(new Date(Date.parse(ts.replace(/(\.\d{3})\d+/, '$1'))))
    .forEach((x) => { parts[x.type] = x.value; });
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
};
const PROVISIONAL_KEY = '__provisional';

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

/**
 * 狭い画面かどうか。recharts の軸幅・高さ・目盛り数は CSS では変えられず
 * props で渡すしかないので、JS 側でも幅を知る必要がある。
 * SSR では判定できないため初期値は広い画面扱いにし、マウント後に補正する。
 */
function useNarrowScreen(query = '(max-width: 600px)'): boolean {
  const [narrow, setNarrow] = useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return narrow;
}

export const StrengthChart: React.FC<Props> = ({ data }) => {
  const [period, setPeriod] = useState<string>('1m');
  const narrow = useNarrowScreen();
  const p = data.periods[period];
  const { ticker, now } = useLiveTicker();
  const prov = useMemo(
    () => (p ? provisionalPoint(p, data.base, ticker, now) : null),
    [p, data.base, ticker, now],
  );

  const codes = useMemo(() => Object.keys(p?.series ?? {}), [p]);

  // 非表示の系列。初めは全部表示 (サーバの HTML と同じ)。覚えた内容は描いたあとに読む。
  // ★覚えるのは非表示の側なので、あとから足した系列は表示で始まる (REQ-USDCHF-073)
  const [hidden, setHidden] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);
  React.useEffect(() => {
    setHidden(loadHidden(browserStorage));
    setRestored(true);
  }, []);
  React.useEffect(() => {
    // 読む前に書くと、覚えた内容を空で上書きしてしまう
    if (restored) saveHidden(browserStorage, hidden);
  }, [hidden, restored]);

  const chartData = useMemo(() => {
    if (!p) return [];
    const rows = p.dates.map((d, i) => {
      const row: Record<string, string | number | boolean | null> = { date: fmtDate(d) };
      codes.forEach((c) => {
        row[c] = p.series[c][i];
      });
      return row;
    });
    if (prov) {
      const row: Record<string, string | number | boolean | null> = {
        date: `${fmtDate(prov.date)} 暫定`, [PROVISIONAL_KEY]: true,
      };
      codes.forEach((c) => {
        row[c] = prov.values[c] ?? null;
      });
      rows.push(row);
    }
    return rows;
  }, [p, codes, prov]);

  // 線・Y 軸 (表示中の線だけで詰める)・凡例 (現在値の高い順。元アプリと同じく強い通貨が上)・
  // 全部非表示の文言は、すべてこの戻り値から描く (REQ-USDCHF-075。lib/strengthSelection.ts)
  const view = useMemo(
    () => strengthView(codes, hidden, p?.series ?? {}, prov ? prov.values : null),
    [codes, hidden, p, prov],
  );

  const bands = useMemo(() => (p ? weekBands(p.dates) : []), [p]);

  if (!p || !p.dates.length) {
    return <p className="strength-empty">データがまだありません。</p>;
  }

  const providerName = (id: string) => data.provider_names[id] ?? id;
  // 今のレートが取れない通貨 = GMO に銘柄が無い (ECB 経路) 系列だけ。スワップ欠けや参照系列は含めない
  const noRateCodes = prov
    ? codes.filter((c) => c !== data.base && p.live?.series[c]?.symbol === null)
    : [];

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
          <span className="strength-asof">
            {prov
              ? `${fmtJstDateTime(prov.asOf)}（JST）時点の価格で暫定`
              : `${p.dates[p.dates.length - 1]} 時点`}
          </span>
          <span className="strength-range">
            {p.dates[0]} 〜 {p.dates[p.dates.length - 1]}（{p.dates.length}日）
          </span>
        </div>

        <div className="strength-filter" role="group" aria-label="表示する線">
          <span className="strength-filter-title">表示</span>
          {PRESET_LABELS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="strength-filter-btn"
              onClick={() => setHidden((h) => presetHidden(key, codes, p.references ?? [], h))}
            >
              {label}
            </button>
          ))}
          <span className="strength-filter-hint">凡例を押すと線を出し入れできます</span>
        </div>
        {view.showNone && (
          <p className="strength-none">表示する線を凡例で選んでください</p>
        )}

        <div className="strength-plot">
          <div className="strength-canvas">
            <ResponsiveContainer width="100%" height={narrow ? 300 : 420} minHeight={260}>
              <LineChart
                data={chartData}
                margin={{ top: 8, right: narrow ? 2 : 8, left: 0, bottom: 4 }}
              >
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
                  // 狭い画面は 1.0173 の6桁が入らないので3桁に落とす
                  tickFormatter={(v: number) => v.toFixed(narrow ? 3 : 4)}
                  tickCount={narrow ? 5 : 8}
                  width={narrow ? 40 : 62}
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
                {view.lines.map((c) => (
                  <Line
                    key={c}
                    type="monotone"
                    dataKey={c}
                    stroke={COLORS[c] ?? '#9ca3af'}
                    strokeWidth={c === data.base ? 2 : 1.5}
                    // 参照系列は通貨ではないので破線にして区別する
                    strokeDasharray={(p.references ?? []).includes(c) ? '5 3' : undefined}
                    name={c}
                    dot={(props: any) =>
                      props.payload?.[PROVISIONAL_KEY] && props.value != null ? (
                        <circle key={`${c}-prov`} cx={props.cx} cy={props.cy} r={3}
                          fill={COLORS[c] ?? '#9ca3af'} stroke="#000" strokeWidth={1} />
                      ) : (
                        <g key={`${c}-${props.index}`} />
                      )
                    }
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
            {view.legend.map(({ code, value, pressed: shown }) => {
              return (
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
                {/* 凡例は幅が足りるので狭い画面でも4桁のまま。3桁だと
                    USD と TRY がどちらも 0.991 になって区別できない */}
                <span className="strength-legend-value">
                  {value === null ? '—' : value.toFixed(4)}
                </span>
                </button>
              </li>
              );
            })}
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
              {c === 'GBP' && '（GBP/USD＋USD/JPY の合成）'}
              {from && <span className="strength-from">（{from}〜）</span>}
            </span>
          );
        })}
      </div>

      {prov && (
        <p className="strength-note strength-live-note">
          最新の点（{fmtDate(prov.date)}）は {fmtJstDateTime(prov.asOf)}（JST）時点の GMO コインのレート（BID）で計算した暫定値です。
          スワップは前日までの 14 日平均を使い、翌朝の日次更新で確定値に置き換わります。
          {noRateCodes.length > 0 && (
            <>
              {' '}今のレートが取れない通貨（
              {noRateCodes
                .map((c) => CURRENCY_LABELS[c] ?? c)
                .join('、')}
              ）は最新の点がありません。
            </>
          )}
        </p>
      )}
      <p className="strength-note">{data.note}</p>
      <p className="strength-note">
        各通貨を1万通貨（ハンガリーフォリントは10万通貨）ぶん、レバレッジ1倍で買って
        持ち続けた場合の損益を、為替の値動きとスワップの両方を含めて指数にしています。
        グラフに載せている通貨（凡例で隠した通貨も含む）の平均が1.0になるよう揃えているため、日本円も上下します。
        凡例で線を隠しても揃え直しはしないので、残した線の値は変わりません。
        円はスワップを受け取れないので、円の線が下がるほど他通貨が優位という読み方になります。
      </p>
      {'GBP' in p.series && (
        <p className="strength-note">
          英ポンドは GBP/JPY のスワップを集めていないため、同じ会社の GBP/USD 買いと
          USD/JPY 買いを組み合わせた値で計算しています。
        </p>
      )}
      {priceProxyNotes(Object.keys(p.series)).map((n) => (
        <p key={n} className="strength-note">{n}</p>
      ))}
      {referenceNotes(p.references ?? []).length > 0 && (
        <p className="strength-note">
          {referenceNotes(p.references ?? []).join('')}
          <strong>{REFERENCE_NOTE_COMMON.strong}</strong>
          {REFERENCE_NOTE_COMMON.rest}
        </p>
      )}
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
          width: 100%;
          padding: 0;
          border: 0;
          background: none;
          font: inherit;
          cursor: pointer;
        }
        .strength-legend-item.off {
          opacity: 0.3;
        }
        .strength-legend-item:focus-visible {
          outline: 1px solid #9ca3af;
          border-radius: 4px;
        }
        .strength-filter {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }
        .strength-filter-title {
          color: #9ca3af;
          font-size: 11px;
        }
        .strength-filter-btn {
          padding: 2px 10px;
          border: 1px solid #374151;
          background: #111827;
          color: #e5e7eb;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .strength-filter-hint {
          color: #6b7280;
          font-size: 11px;
        }
        .strength-none {
          margin: 0 0 6px;
          color: #fbbf24;
          font-size: 12px;
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
          /* 本文カードの左右余白ぶんだけ外にはみ出させて、狭い画面でも
             チャートに幅を渡す。この打ち消しが無いと 375px 幅で実際の
             プロット領域が 89px しか残らなかった (カード余白80px + Y軸62px)。 */
          .strength-panel {
            margin-left: -12px;
            margin-right: -12px;
            border-radius: 8px;
            padding: 8px 6px 4px;
          }
          .strength-panel-head {
            padding: 0 4px;
            margin-bottom: 4px;
          }
          .strength-asof {
            font-size: 12px;
          }
          .strength-range {
            font-size: 10px;
          }
          .strength-plot {
            gap: 4px;
          }
          .strength-legend {
            width: 44px;
          }
          .strength-legend-code {
            font-size: 11px;
          }
          .strength-legend-value {
            font-size: 9px;
          }
          .strength-filter-hint {
            display: none;
          }
          .strength-tabs {
            gap: 5px;
          }
          .strength-tab {
            padding: 5px 9px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};
