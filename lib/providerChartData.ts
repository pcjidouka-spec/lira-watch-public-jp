import { SwapData, ProviderConfig } from '@/types';

/**
 * 各事業者ごとの日次データを取得
 */
export function getProviderChartData(data: SwapData[], type: 'buy' | 'sell', providerConfigs?: Map<string, ProviderConfig>) {
  const providerMap = new Map<string, { name: string; data: { date: string; value: number }[] }>();

  // 実際に取得できた成功データのみを使用
  const successData = data.filter(d => d.status === 'success');

  // 事業者ごとにデータを日次データのMapを作成 (重複排除のため一時的にMapを使用)
  const tempMap = new Map<string, Map<string, number>>(); // providerId -> date -> value

  for (const record of successData) {
    const value = type === 'buy' ? record.swap_buy : record.swap_sell;

    // 値がない場合はスキップ（0は有効な値として扱う）
    if (value === null) continue;

    // 日付文字列 (YYYY-MM-DD or YYYY/MM/DD)
    // actual_dateがある場合はそちらを優先（データの実際の日付を使用）
    let dateStr = String(record.target_date);

    if (record.actual_date) {
      // YYYY/MM/DD 形式などを YYYY-MM-DD に正規化
      const normalizedActual = record.actual_date.replace(/\//g, '-');
      // 日付として有効か簡易チェック (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}/.test(normalizedActual)) {
        dateStr = normalizedActual;
      }
    }

    const dateKey = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;

    if (!tempMap.has(record.provider_id)) {
      tempMap.set(record.provider_id, new Map());
    }

    // 同一日付データがある場合は上書き（最新のデータを採用とみなす）
    tempMap.get(record.provider_id)!.set(dateKey, value);
  }

  // tempMapからproviderMapへ変換
  for (const [providerId, dateValueMap] of tempMap.entries()) {
    // providers_config.jsonのnameを優先的に使用
    const configName = providerConfigs?.get(providerId)?.name;
    // 名前解決のためのフォールバック
    const csvName = successData.find(d => d.provider_id === providerId)?.name;
    const providerName = configName || csvName || providerId;

    if (!providerMap.has(providerId)) {
      providerMap.set(providerId, {
        name: providerName,
        data: [],
      });
    }

    const dataList = providerMap.get(providerId)!.data;

    for (const [date, value] of dateValueMap.entries()) {
      dataList.push({
        date: date,
        value: value,
      });
    }

    // 日付順にソート
    dataList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return providerMap;
}

/**
 * チャート用のデータを生成（全事業者のデータを統合）
 */
export function prepareChartData(providerMap: Map<string, { name: string; data: { date: string; value: number }[] }>) {
  // 全日付を収集
  const allDates = new Set<string>();
  for (const [, info] of providerMap.entries()) {
    for (const item of info.data) {
      allDates.add(item.date);
    }
  }

  const sortedDates = Array.from(allDates).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  // 各日付ごとに各事業者の値を取得
  const chartData: any[] = [];

  for (const date of sortedDates) {
    const dataPoint: any = { date };

    for (const [providerId, info] of providerMap.entries()) {
      const item = info.data.find(d => d.date === date);
      dataPoint[info.name] = item ? item.value : null;
    }

    chartData.push(dataPoint);
  }

  return {
    chartData,
    providers: Array.from(providerMap.values()).map(info => info.name),
  };
}

