import { useState, useEffect } from 'react';
import { SwapData, ProviderRanking, ProviderConfig, TradingSpread } from '@/types';
import { attachSpreads, buildSpreadMap } from '@/lib/spreadJoin';
import {
  parseCSVData,
  filterSuccessData,
  getBuyRanking,
  getSellRanking,
} from '@/lib/dataProcessor';
import { masterHistoryPath, providersConfigPath } from '@/lib/currencies';

export function useSwapData(currencyPair: string = 'TRY/JPY') {
  const [data, setData] = useState<SwapData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [siteUpdatedAt, setSiteUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerConfigs, setProviderConfigs] = useState<Map<string, ProviderConfig>>(new Map());
  const [spreadMap, setSpreadMap] = useState<Map<string, TradingSpread>>(new Map());

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
          // ★三項演算子の梯子をやめて lib/currencies.ts から引く。
          //   梯子だと通貨を足したときに書き忘れても型では落ちず、
          //   既定の TRY 設定に静かにフォールバックする。
          const configFile = providersConfigPath(currencyPair);
          const configResponse = await fetch(`${configFile}?t=${configTimestamp}`);
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

        // 取引スプレッド (Ask-Bid)。取得できなくても致命的ではないので握りつぶす。
        // ただし必ず先に空へ戻す: 失敗時に前の通貨ペアのマップが残ると、
        // attachSpreads は provider_id だけで join するため TRY の値が
        // MXN/USD のランキングに表示されてしまう。
        setSpreadMap(new Map());
        try {
          const spreadTimestamp = new Date().getTime();
          const spreadResponse = await fetch(`/data/spreads.json?t=${spreadTimestamp}`);
          if (spreadResponse.ok) {
            setSpreadMap(buildSpreadMap(await spreadResponse.json(), currencyPair));
          }
        } catch (spreadErr) {
          console.error('Failed to load trading spreads:', spreadErr);
        }

        // Fetch Master History (キャッシュバスティング付き)
        const timestamp = new Date().getTime();
        // ★同上。ここが TRY にフォールバックすると、タブのラベルは EUR なのに
        //   中身は TRY という取り違えになる (画面上は正常に見えるので気づけない)。
        const historyFile = masterHistoryPath(currencyPair);
        const response = await fetch(`${historyFile}?t=${timestamp}`);
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
  }, [currencyPair]);

  const buyRanking = data.length > 0
    ? attachSpreads(getBuyRanking(data, providerConfigs, currencyPair), spreadMap)
    : [];
  const sellRanking = data.length > 0
    ? attachSpreads(getSellRanking(data, providerConfigs, currencyPair), spreadMap)
    : [];

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


