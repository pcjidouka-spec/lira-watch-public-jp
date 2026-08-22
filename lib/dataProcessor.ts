import { SwapData, ProviderRanking, ProviderConfig } from '@/types';

/**
 * CSVデータをパースしてSwapData配列に変換
 */
export function parseCSVData(csvText: string): SwapData[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  const data: SwapData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const record: any = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index]?.trim() || null;
    });

    // 数値変換とnull処理
    const swapData: SwapData = {
      target_date: record.target_date || '',
      provider_id: record.provider_id || '',
      currency_pair: record.currency_pair || 'TRY/JPY', // デフォルト値
      name: record.name || '',
      days: record.days === 'None' || !record.days ? null : parseInt(record.days, 10),
      swap_buy: record.swap_buy === 'None' || !record.swap_buy ? null : parseFloat(record.swap_buy),
      swap_sell: record.swap_sell === 'None' || !record.swap_sell ? null : parseFloat(record.swap_sell),
      settlement_date: record.settlement_date === 'None' || !record.settlement_date ? null : record.settlement_date,
      status: (record.status === 'success' || record.status === 'error') ? record.status : 'error',
      actual_date: record.actual_date === 'None' || !record.actual_date ? undefined : record.actual_date,
    };

    data.push(swapData);
  }

  return data;
}

/**
 * CSV行をパース（カンマ区切り、引用符対応）
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i < line.length - 1 ? line[i + 1] : '';

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // エスケープされた引用符
        current += '"';
        i++; // 次の文字をスキップ
      } else {
        // 引用符の開始/終了
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * 成功ステータスのデータのみをフィルタリング
 * errorの場合は前日の最新データを保持するロジック
 */
export function filterSuccessData(data: SwapData[]): SwapData[] {
  // 日付順にソート
  const sorted = [...data].sort((a, b) =>
    new Date(a.target_date).getTime() - new Date(b.target_date).getTime()
  );

  const result: SwapData[] = [];
  const providerLatestSuccess: Map<string, SwapData> = new Map();

  for (const record of sorted) {
    if (record.status === 'success') {
      // 成功データはそのまま追加し、最新データを記録
      result.push(record);
      providerLatestSuccess.set(record.provider_id, record);
    } else {
      // errorの場合は前回の成功データがあればそれを使用
      const lastSuccess = providerLatestSuccess.get(record.provider_id);
      if (lastSuccess) {
        result.push({
          ...lastSuccess,
          target_date: record.target_date, // 日付は現在の日付に更新
        });
      }
    }
  }

  return result;
}

/**
 * 最新日のデータを取得
 */
export function getLatestData(data: SwapData[]): SwapData[] {
  if (data.length === 0) return [];

  const sorted = [...data].sort((a, b) =>
    new Date(b.target_date).getTime() - new Date(a.target_date).getTime()
  );

  const latestDate = sorted[0].target_date;
  return sorted.filter(d => d.target_date === latestDate);
}

/**
 * 直近約2週間（14日分・データセット最新日を終端）のデータを取得
 */
export function getPast30DaysData(data: SwapData[]): SwapData[] {
  if (data.length === 0) return [];

  // Sort descending by date
  const sorted = [...data].sort((a, b) => {
    const timeA = a.target_date ? new Date(a.target_date).getTime() : 0;
    const timeB = b.target_date ? new Date(b.target_date).getTime() : 0;
    return timeB - timeA;
  });

  const latestDateStr = sorted[0].target_date;
  if (!latestDateStr) return [];

  // Consider the most recent date in the dataset as 'today' to avoid issues with missing recent data
  const latestDate = new Date(latestDateStr);

  // Calculate the cutoff date (14 days inclusive from the latest date)
  const cutoffDate = new Date(latestDate);
  cutoffDate.setDate(latestDate.getDate() - 13);

  // Set cutoff time to start of day for accurate comparison
  cutoffDate.setHours(0, 0, 0, 0);

  return sorted.filter(d => {
    if (!d.target_date) return false;
    const d_date = new Date(d.target_date);
    d_date.setHours(0, 0, 0, 0);
    return d_date >= cutoffDate && d_date <= latestDate;
  });
}

/**
 * クロスペア（対円でない通貨ペア）判定。
 *
 * クロスペアは JPY クロスと次の点で挙動が違うため、ランキング/グラフの分岐に使う:
 *   - 買スワップ 0 円が正常値（取得失敗ではない）
 *   - 売スワップがプラス（受取り）になりうる
 *
 * CHF/TRY は買が常にマイナス・売がプラスで、この特性がそのまま当てはまる (2026-08-22 追加)。
 * 判定が dataProcessor / providerChartData / index.tsx の3箇所に重複していたため、
 * ここを唯一の定義とする。新しいクロスペアを足すときはこの配列だけ更新する。
 */
export const CROSS_PAIRS = ['EUR/USD', 'GBP/USD', 'CHF/TRY'] as const;

export function isCrossPairCode(currencyPair: string): boolean {
  return (CROSS_PAIRS as readonly string[]).includes(currencyPair);
}

/**
 * 買いスワップランキングを生成（降順）- 直近約2週間の付与日数加重平均
 * エラーや欠損データがあった日は平均値を出す際の母数から除外する
 */
export function getBuyRanking(data: SwapData[], providerConfigs?: Map<string, ProviderConfig>, currencyPair: string = 'TRY/JPY'): ProviderRanking[] {
  // クロスペア（EUR/USD, GBP/USD, CHF/TRY）では買スワップ 0 円が正常値のため、
  // ランキング除外フィルタを無効化する。JPY クロスでは 0 = 取得失敗/取扱なしの
  // 可能性が高いため従来通り除外。
  const isCrossPair = isCrossPairCode(currencyPair);
  // 指定通貨ペアの成功データのみを使用（エラーや欠損データは除外）
  const successData = data.filter(d => d.status === 'success' && (d.currency_pair || 'TRY/JPY') === currencyPair);
  const windowData = getPast30DaysData(successData);

  // 事業者ごとに平均を計算（付与日数加重平均）
  const providerMap = new Map<string, { name: string; weightedSum: number; totalDays: number; dates: string[] }>();

  for (const record of windowData) {
    // 0のデータは平均計算から除外（クロスペアでは 0 も有効値として扱う）
    if (record.swap_buy !== null && !isNaN(record.swap_buy)) {
      const isValidForAverage = isCrossPair || record.swap_buy !== 0;
      if (isValidForAverage) {
        // daysがnullまたは0の場合は1として扱う
        const days = record.days && record.days > 0 ? record.days : 1;

        if (!providerMap.has(record.provider_id)) {
          // providers_config.jsonのnameを優先的に使用
          const configName = providerConfigs?.get(record.provider_id)?.name;
          const displayName = configName || record.name;
          providerMap.set(record.provider_id, {
            name: displayName,
            weightedSum: 0,
            totalDays: 0,
            dates: [],
          });
        }
        const info = providerMap.get(record.provider_id)!;
        info.weightedSum += record.swap_buy * days;
        info.totalDays += days;
        info.dates.push(record.target_date);
      }
    }
  }

  const ranking: ProviderRanking[] = [];

  for (const [providerId, info] of providerMap.entries()) {
    // 付与日数加重平均を計算: Σ(swap_buy × days) / Σ(days)
    const avgBuy = info.totalDays > 0
      ? info.weightedSum / info.totalDays
      : 0;

    // 売りスワップも計算（付与日数加重平均、成功データのみを使用、0のデータは除外）
    let sellWeightedSum = 0;
    let sellTotalDays = 0;
    for (const record of windowData) {
      if (record.provider_id === providerId && record.swap_sell !== null && record.swap_sell !== 0) {
        const days = record.days && record.days > 0 ? record.days : 1;
        sellWeightedSum += record.swap_sell * days;
        sellTotalDays += days;
      }
    }
    const avgSell = sellTotalDays > 0
      ? sellWeightedSum / sellTotalDays
      : 0;

    // 最新のactual_dateを取得
    const latestRecord = windowData.find(d => d.provider_id === providerId);

    // 最新日の単日値を取得（datesは降順ソート済みwindowDataから追加されるので最初が最新）
    const sortedDates = [...info.dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const latestDate = sortedDates[0] || '';
    const latestDayRecords = windowData.filter(d => d.provider_id === providerId && d.target_date === latestDate);
    const latestBuy = latestDayRecords.length > 0 && latestDayRecords[0].swap_buy !== null ? latestDayRecords[0].swap_buy : null;
    const latestSellVal = latestDayRecords.length > 0 && latestDayRecords[0].swap_sell !== null ? latestDayRecords[0].swap_sell : null;

    ranking.push({
      provider_id: providerId,
      name: info.name,
      swap_buy: avgBuy,
      swap_sell: avgSell,
      latest_buy: latestBuy,
      latest_sell: latestSellVal,
      latest_date: latestDate,
      actual_date: latestRecord?.actual_date,
    });
  }

  return ranking
    .filter(r => isCrossPair ? true : r.swap_buy !== 0) // 0円の業者を除外（クロスペアでは残す）
    .sort((a, b) => b.swap_buy - a.swap_buy);
}

/**
 * 売りスワップランキングを生成（受取りが多い順 = 値の大きい順）- 直近約2週間の付与日数加重平均
 * エラーや欠損データがあった日は平均値を出す際の母数から除外する
 *
 * 並び順の注意 (2026-08-02 修正):
 *   以前は「絶対値が小さい順」でソートしていた。JPY クロス (TRY/JPY 等) は売スワップが
 *   全てマイナス（支払い）なので「絶対値が小さい＝支払いが少ない＝上位」で正しかったが、
 *   EUR/USD・GBP/USD は売スワップがプラス（受取り）になるため、絶対値ソートだと
 *   受取りが最も少ない業者が1位という逆順になっていた。
 *   値の大きい順にすれば、マイナス（支払い小さい順）・プラス（受取り大きい順）の
 *   どちらも正しく並ぶ。JPY クロスの並びは修正前後で変わらない。
 */
export function getSellRanking(data: SwapData[], providerConfigs?: Map<string, ProviderConfig>, currencyPair: string = 'TRY/JPY'): ProviderRanking[] {
  // 指定通貨ペアの成功データのみを使用（エラーや欠損データは除外）
  const successData = data.filter(d => d.status === 'success' && (d.currency_pair || 'TRY/JPY') === currencyPair);
  const windowData = getPast30DaysData(successData);

  // 事業者ごとに平均を計算（付与日数加重平均）
  const providerMap = new Map<string, { name: string; weightedSum: number; totalDays: number; dates: string[] }>();

  for (const record of windowData) {
    // 0のデータは平均計算から除外
    if (record.swap_sell !== null && record.swap_sell !== 0 && !isNaN(record.swap_sell)) {
      // daysがnullまたは0の場合は1として扱う
      const days = record.days && record.days > 0 ? record.days : 1;

      if (!providerMap.has(record.provider_id)) {
        // providers_config.jsonのnameを優先的に使用
        const configName = providerConfigs?.get(record.provider_id)?.name;
        const displayName = configName || record.name;
        providerMap.set(record.provider_id, {
          name: displayName,
          weightedSum: 0,
          totalDays: 0,
          dates: [],
        });
      }
      const info = providerMap.get(record.provider_id)!;
      info.weightedSum += record.swap_sell * days;
      info.totalDays += days;
      info.dates.push(record.target_date);
    }
  }

  const ranking: ProviderRanking[] = [];

  for (const [providerId, info] of providerMap.entries()) {
    // 付与日数加重平均を計算: Σ(swap_sell × days) / Σ(days)
    const avgSell = info.totalDays > 0
      ? info.weightedSum / info.totalDays
      : 0;

    // 買いスワップも計算（付与日数加重平均、成功データのみを使用、0のデータは除外）
    let buyWeightedSum = 0;
    let buyTotalDays = 0;
    for (const record of windowData) {
      if (record.provider_id === providerId && record.swap_buy !== null && record.swap_buy !== 0) {
        const days = record.days && record.days > 0 ? record.days : 1;
        buyWeightedSum += record.swap_buy * days;
        buyTotalDays += days;
      }
    }
    const avgBuy = buyTotalDays > 0
      ? buyWeightedSum / buyTotalDays
      : 0;

    // 最新のactual_dateを取得
    const latestRecord = windowData.find(d => d.provider_id === providerId);

    // 最新日の単日値を取得
    const sortedDates = [...info.dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const latestDate = sortedDates[0] || '';
    const latestDayRecords = windowData.filter(d => d.provider_id === providerId && d.target_date === latestDate);
    const latestBuyVal = latestDayRecords.length > 0 && latestDayRecords[0].swap_buy !== null ? latestDayRecords[0].swap_buy : null;
    const latestSellVal = latestDayRecords.length > 0 && latestDayRecords[0].swap_sell !== null ? latestDayRecords[0].swap_sell : null;

    ranking.push({
      provider_id: providerId,
      name: info.name,
      swap_buy: avgBuy,
      swap_sell: avgSell,
      latest_buy: latestBuyVal,
      latest_sell: latestSellVal,
      latest_date: latestDate,
      actual_date: latestRecord?.actual_date,
    });
  }

  return ranking
    .filter(r => r.swap_sell !== 0) // 0円の業者を除外
    .sort((a, b) => b.swap_sell - a.swap_sell); // 値の大きい順（支払いが少ない/受取りが多い順）
}


