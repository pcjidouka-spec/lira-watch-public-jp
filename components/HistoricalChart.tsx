import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SwapData, ProviderRanking, ProviderConfig } from '@/types';
import { getProviderChartData, prepareChartData } from '@/lib/providerChartData';

interface HistoricalChartProps {
  data: SwapData[];
  type: 'buy' | 'sell';
  ranking: ProviderRanking[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  '#14b8a6', '#a855f7', '#e11d48', '#0ea5e9', '#22c55e',
];

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ data, type, ranking }) => {
  const [providerConfigs, setProviderConfigs] = useState<Map<string, ProviderConfig>>(new Map());

  useEffect(() => {
    async function loadProviderConfigs() {
      try {
        // キャッシュバスティング付きで読み込み
        const configTimestamp = new Date().getTime();
        const configResponse = await fetch(`/providers_config.json?t=${configTimestamp}`);
        if (configResponse.ok) {
          const configData = await configResponse.json();
          const configMap = new Map<string, ProviderConfig>();
          configData.providers.forEach((provider: ProviderConfig) => {
            // 正規IDをマップ
            configMap.set(provider.id, provider);
            // アンダースコアなしのIDもマップ（CSVデータとの互換性のため）
            const normalizedId = provider.id.replace(/_/g, '');
            if (normalizedId !== provider.id) {
              configMap.set(normalizedId, provider);
            }
          });
          setProviderConfigs(configMap);
        }
      } catch (err) {
        console.error('Failed to load provider configs:', err);
      }
    }
    loadProviderConfigs();
  }, []);

  const { chartData, providers } = useMemo(() => {
    const providerMap = getProviderChartData(data, type, providerConfigs);
    const prepared = prepareChartData(providerMap);

    // ランキングの順番に合わせてプロバイダーを並び替え
    const rankedProviderNames = ranking.map(r => r.name);
    const sortedProviders = rankedProviderNames.filter(name =>
      prepared.providers.includes(name)
    );

    // ランキングにないプロバイダーも追加（ランキングに表示されないがデータがある場合）
    const remainingProviders = prepared.providers.filter(name =>
      !rankedProviderNames.includes(name)
    );

    return {
      chartData: prepared.chartData,
      providers: [...sortedProviders, ...remainingProviders],
    };
  }, [data, type, ranking, providerConfigs]);

  // 表示するプロバイダーを管理するState
  const [visibleProviders, setVisibleProviders] = useState<string[]>([]);

  // 初回ロード時やプロバイダーリスト変更時に表示リストを初期化
  useEffect(() => {
    if (providers.length > 0) {
      setVisibleProviders(prev => {
        // 初回は全て表示
        if (prev.length === 0) return providers;
        // プロバイダーリストが変わった場合（例: buy/sell切り替え）、
        // 基本的にはリセットせず、新しいリストに存在するものだけ残す＋新規は追加する方針も考えられるが、
        // シンプルに「現在表示中のものは維持、無くなったものは消える」形にする
        // ただしtypeが変わった場合は全く別のグラフになるため、リセットしたい意図もあるかもしれないが、
        // ここでは「既存の選択状態を可能な限り維持」する
        const currentSet = new Set(providers);
        const validPrev = prev.filter(p => currentSet.has(p));

        // もし有効なものが一つもなくなってしまったら（例：データが全然違う場合）、全選択に戻す
        if (validPrev.length === 0) return providers;

        // 新しく追加されたプロバイダーがあれば、それはデフォルトで表示するか？
        // ここでは「以前選択されていたものだけ」を表示し、新規は非表示にするか、
        // あるいは「全選択」状態なら新規も追加するか...
        // ユーザー体験としては「一度チェック外したものは外れたまま」が良い。

        // 新規プロバイダーをデフォルトONにする場合:
        const prevSet = new Set(prev);
        const newProviders = providers.filter(p => !prevSet.has(p));
        return [...validPrev, ...newProviders];
      });
    }
  }, [providers]);

  // プロバイダーIDと名前のマッピングを作成
  const providerIdMap = useMemo(() => {
    const map = new Map<string, string>();
    data.forEach(d => {
      if (!map.has(d.provider_id)) {
        map.set(d.provider_id, d.name);
      }
    });
    return map;
  }, [data]);

  // 名前からプロバイダーIDを取得
  const getNameToIdMap = useMemo(() => {
    const map = new Map<string, string>();
    providerIdMap.forEach((name, id) => {
      map.set(name, id);
    });
    return map;
  }, [providerIdMap]);

  const toggleProvider = (providerName: string) => {
    setVisibleProviders(prev => {
      if (prev.includes(providerName)) {
        return prev.filter(p => p !== providerName);
      } else {
        return [...prev, providerName];
      }
    });
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="custom-legend-list">
        {payload.map((entry: any, index: number) => {
          const { value, color } = entry;
          const isVisible = visibleProviders.includes(value);
          const providerId = getNameToIdMap.get(value);
          const config = providerId ? providerConfigs.get(providerId) : null;

          return (
            <li key={`item-${index}`} className="custom-legend-item">
              <div className="legend-checkbox-container" onClick={() => toggleProvider(value)}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => { }} // onClickで処理するのでダミー
                  className="legend-checkbox"
                />
                <span className="legend-color-box" style={{ backgroundColor: color }} />
              </div>
              <span
                className="legend-text"
                onClick={(e) => {
                  e.stopPropagation(); // チェックボックス切り替えを防止
                  if (config?.url) {
                    window.open(config.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                title={config?.url ? "公式サイトへ移動" : ""}
              >
                {value}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">
        {type === 'buy' ? '買いスワップ' : '売りスワップ'}の推移（各事業者別・日次）
      </h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={450} minHeight={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: '円', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => value !== null ? `${value.toFixed(1)}円` : 'データなし'}
              labelStyle={{ color: '#374151' }}
            />
            <Legend content={renderLegend} verticalAlign="bottom" align="left" wrapperStyle={{ paddingTop: '20px' }} />
            {providers.map((provider, index) => {
              const providerId = getNameToIdMap.get(provider);
              const config = providerId ? providerConfigs.get(providerId) : null;
              return (
                <Line
                  key={provider}
                  type="monotone"
                  dataKey={provider}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  name={provider}
                  dot={{ r: 3 }}
                  connectNulls={false}
                  hide={!visibleProviders.includes(provider)}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <style jsx global>{`
        .custom-legend-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: flex-start;
          width: 100%;
        }
        .custom-legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        .legend-checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-right: 5px;
        }
        .legend-checkbox {
          cursor: pointer;
          margin-right: 5px;
        }
        .legend-color-box {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 5px;
          border-radius: 2px;
        }
        .legend-text {
          cursor: pointer;
          font-size: 12px;
          color: #374151;
          transition: color 0.2s;
        }
        .legend-text:hover {
          color: #111827;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .custom-legend-list {
            gap: 10px;
          }
          .legend-text {
            font-size: 11px;
          }
          .recharts-xAxis {
            font-size: 9px !important;
          }
          .recharts-yAxis {
            font-size: 10px !important;
          }
          .recharts-cartesian-axis-tick {
            font-size: 9px !important;
          }
        }
        @media (max-width: 480px) {
          .custom-legend-list {
            gap: 8px;
          }
          .legend-text {
            font-size: 10px;
          }
          .recharts-legend-wrapper {
             padding-left: 0 !important;
          }
           .recharts-xAxis {
            font-size: 8px !important;
          }
          .recharts-yAxis {
             font-size: 9px !important;
          }
          .recharts-cartesian-axis-tick {
             font-size: 8px !important;
          }
        }
      `}</style>
      <style jsx>{`
        .chart-wrapper {
          width: 100%;
          min-width: 0;
          overflow-x: auto;
        }
        @media (max-width: 768px) {
          .chart-wrapper {
            min-height: 350px;
          }
          .chart-wrapper :global(.recharts-wrapper) {
            overflow: visible !important;
          }
        }
        @media (max-width: 480px) {
          .chart-wrapper {
            min-height: 300px;
          }
          .chart-wrapper :global(.recharts-wrapper) {
            overflow: visible !important;
          }
        }
      `}</style>
      <style jsx>{`
        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin: 16px 0;
          width: 100%;
          overflow-x: auto;
        }
        .chart-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .chart-container {
            padding: 16px;
            margin: 16px 0;
            border-radius: 8px;
          }
          .chart-title {
            font-size: 18px;
            margin-bottom: 16px;
          }
        }
        @media (max-width: 480px) {
          .chart-container {
            padding: 12px;
            margin: 12px 0;
          }
          .chart-title {
            font-size: 16px;
            margin-bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
};


