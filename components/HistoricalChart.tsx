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
            <Legend
              wrapperStyle={{ paddingTop: '0px', textAlign: 'left' }}
              iconType="line"
              align="left"
              onClick={(e: any) => {
                const providerName = e.value;
                const providerId = getNameToIdMap.get(providerName);
                const config = providerId ? providerConfigs.get(providerId) : null;
                if (config?.url) {
                  window.open(config.url, '_blank', 'noopener,noreferrer');
                }
              }}
            />
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
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <style jsx global>{`
        .recharts-legend-wrapper {
          text-align: left !important;
          width: calc(100% - 0px) !important;
          padding-left: 40px !important;
          padding-right: 0 !important;
          box-sizing: border-box;
        }
        .recharts-legend-wrapper ul {
          text-align: left !important;
          padding-left: 0 !important;
          margin-left: 0 !important;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          width: 100%;
          gap: 0px;
        }
        .recharts-legend-wrapper .recharts-legend-item {
          display: inline-block;
          margin-right: 0;
          margin-bottom: 0px;
          margin-left: 0 !important;
          text-align: left;
          float: none !important;
          flex: 0 0 auto;
        }
        .recharts-legend-wrapper .recharts-legend-item-text {
          display: inline-block;
          width: 200px;
          text-align: left !important;
          vertical-align: middle;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .recharts-legend-wrapper .recharts-legend-item-text:hover {
          opacity: 0.7;
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .recharts-legend-wrapper {
            padding-left: 20px !important;
          }
          .recharts-legend-wrapper .recharts-legend-item-text {
            width: 120px;
            font-size: 11px;
          }
          .recharts-legend-wrapper ul {
            gap: 12px;
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
          .recharts-legend-wrapper {
            padding-left: 10px !important;
          }
          .recharts-legend-wrapper .recharts-legend-item-text {
            width: 100px;
            font-size: 10px;
          }
          .recharts-legend-wrapper ul {
            gap: 8px;
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


