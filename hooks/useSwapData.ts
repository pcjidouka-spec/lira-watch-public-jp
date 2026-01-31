import { useState, useEffect } from 'react';
import { SwapData, ProviderRanking, ProviderConfig } from '@/types';
import {
  parseCSVData,
  filterSuccessData,
  getBuyRanking,
  getSellRanking,
} from '@/lib/dataProcessor';

export function useSwapData() {
  const [data, setData] = useState<SwapData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [siteUpdatedAt, setSiteUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerConfigs, setProviderConfigs] = useState<Map<string, ProviderConfig>>(new Map());

  useEffect(() => {
    async function loadData() {
      try {
        // Load data update time (from swap point acquisition script start)
        try {
          const timestamp = new Date().getTime();
          const infoResponse = await fetch(`/data/data_update_info.json?t=${timestamp}`);
          if (infoResponse.ok) {
            const infoData = await infoResponse.json();
            if (infoData.updated_at) {
              const dateObj = new Date(infoData.updated_at);
              if (!isNaN(dateObj.getTime())) {
                const formatted = `${dateObj.getFullYear()}年${String(dateObj.getMonth() + 1).padStart(2, '0')}月${String(dateObj.getDate()).padStart(2, '0')}日 ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
                setSiteUpdatedAt(formatted);
              }
            }
          }
        } catch (infoErr) {
          console.error('Failed to load data update info:', infoErr);
        }

        // Load provider configs (キャッシュバスティング付き)
        try {
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
        } catch (configErr) {
          console.error('Failed to load provider configs:', configErr);
        }

        // Fetch Master History (キャッシュバスティング付き)
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/master_history.csv?t=${timestamp}`);
        if (!response.ok) {
          throw new Error('データの読み込みに失敗しました');
        }

        const csvText = await response.text();
        const parsedData = parseCSVData(csvText);
        const filteredData = filterSuccessData(parsedData);

        setData(filteredData);

        // 元のデータから最新日付を取得（filterSuccessDataの前のデータを使用）
        // これにより、errorデータで置き換えられた日付ではなく、実際の最新日付を取得できる
        if (parsedData.length > 0) {
          const sortedData = [...parsedData].sort((a, b) =>
            new Date(b.target_date).getTime() - new Date(a.target_date).getTime()
          );
          const latestDate = sortedData[0].target_date;

          // 日付をフォーマット（YYYY-MM-DD → YYYY年MM月DD日）
          const dateObj = new Date(latestDate);
          if (isNaN(dateObj.getTime())) {
            // フォールバック: 文字列から直接抽出
            const dateMatch = latestDate.match(/(\d{4})-(\d{2})-(\d{2})/);
            if (dateMatch) {
              const [, year, month, day] = dateMatch;
              const formattedDate = `${year}年${month}月${day}日`;
              setLastUpdated(formattedDate);
            }
          } else {
            const formattedDate = `${dateObj.getFullYear()}年${String(dateObj.getMonth() + 1).padStart(2, '0')}月${String(dateObj.getDate()).padStart(2, '0')}日`;
            setLastUpdated(formattedDate);
          }
        } else {
          // データがない場合は update_info.json から取得を試みる
          try {
            const updateResponse = await fetch('/data/update_info.json');
            if (updateResponse.ok) {
              const updateInfo = await updateResponse.json();
              setLastUpdated(updateInfo.lastUpdated);
            }
          } catch (updateErr) {
            console.error('Failed to load update info:', updateErr);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const buyRanking = data.length > 0 ? getBuyRanking(data, providerConfigs) : [];
  const sellRanking = data.length > 0 ? getSellRanking(data, providerConfigs) : [];

  // Add URL information to rankings
  const buyRankingWithUrls = buyRanking.map(rank => ({
    ...rank,
    url: providerConfigs.get(rank.provider_id)?.url,
    campaign_url: providerConfigs.get(rank.provider_id)?.campaign_url,
  }));

  const sellRankingWithUrls = sellRanking.map(rank => ({
    ...rank,
    url: providerConfigs.get(rank.provider_id)?.url,
    campaign_url: providerConfigs.get(rank.provider_id)?.campaign_url,
  }));

  return {
    data,
    buyRanking: buyRankingWithUrls,
    sellRanking: sellRankingWithUrls,
    lastUpdated,
    siteUpdatedAt,
    loading,
    error,
  };

}


