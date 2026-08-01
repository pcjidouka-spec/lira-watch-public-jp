// Generate ranking_<currency>.json from master_history_<currency>.csv at build time.
//
// This is a Node.js port of the relevant logic in lib/dataProcessor.ts:
//   parseCSVData -> filterSuccessData -> getPast30DaysData -> getBuyRanking / getSellRanking
//
// X (Twitter) posting (lira-watch-secrets/post_x.py) reads the resulting JSON
// instead of re-implementing the same aggregation in Python. This guarantees
// HP and X show the exact same numbers and apply the same filters (e.g. error
// fill-forward by previous success, sample-day weighting, 0-yen exclusion).

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');

// ---------------------------------------------------------------------------
// CSV parsing (mirrors parseCSVLine + parseCSVData in dataProcessor.ts)

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        const next = i < line.length - 1 ? line[i + 1] : '';
        if (ch === '"') {
            if (inQuotes && next === '"') { current += '"'; i++; }
            else { inQuotes = !inQuotes; }
        } else if (ch === ',' && !inQuotes) {
            result.push(current); current = '';
        } else { current += ch; }
    }
    result.push(current);
    return result;
}

function parseCSV(csvText, defaultCurrencyPair) {
    const lines = csvText.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) continue;
        const record = {};
        headers.forEach((h, idx) => {
            const v = (values[idx] ?? '').trim();
            record[h] = v === '' ? null : v;
        });
        data.push({
            target_date: record.target_date || '',
            provider_id: record.provider_id || '',
            currency_pair: record.currency_pair || defaultCurrencyPair,
            name: record.name || '',
            days: !record.days || record.days === 'None' ? null : parseInt(record.days, 10),
            swap_buy: !record.swap_buy || record.swap_buy === 'None' ? null : parseFloat(record.swap_buy),
            swap_sell: !record.swap_sell || record.swap_sell === 'None' ? null : parseFloat(record.swap_sell),
            settlement_date: !record.settlement_date || record.settlement_date === 'None' ? null : record.settlement_date,
            status: (record.status === 'success' || record.status === 'error') ? record.status : 'error',
            actual_date: !record.actual_date || record.actual_date === 'None' ? undefined : record.actual_date,
        });
    }
    return data;
}

// ---------------------------------------------------------------------------
// Filtering / windowing (mirrors dataProcessor.ts exactly)

function filterSuccessData(data) {
    const sorted = [...data].sort((a, b) =>
        new Date(a.target_date).getTime() - new Date(b.target_date).getTime()
    );
    const result = [];
    const providerLatestSuccess = new Map();
    for (const r of sorted) {
        if (r.status === 'success') {
            result.push(r);
            providerLatestSuccess.set(r.provider_id, r);
        } else {
            const last = providerLatestSuccess.get(r.provider_id);
            if (last) {
                result.push({ ...last, target_date: r.target_date });
            }
        }
    }
    return result;
}

function getPast14DaysData(data) {
    if (data.length === 0) return [];
    const sorted = [...data].sort((a, b) =>
        new Date(b.target_date).getTime() - new Date(a.target_date).getTime()
    );
    const latestStr = sorted[0].target_date;
    if (!latestStr) return [];
    const latest = new Date(latestStr);
    const cutoff = new Date(latest);
    cutoff.setDate(latest.getDate() - 13);
    cutoff.setHours(0, 0, 0, 0);
    return sorted.filter(d => {
        if (!d.target_date) return false;
        const dd = new Date(d.target_date);
        dd.setHours(0, 0, 0, 0);
        return dd >= cutoff && dd <= latest;
    });
}

// ---------------------------------------------------------------------------
// Provider config (so display name matches HP)

function loadProviderConfigs(currencyPair) {
    const map = new Map();
    const file =
        currencyPair === 'MXN/JPY' ? 'providers_config_mxn.json'
        : currencyPair === 'USD/JPY' ? 'providers_config_usd.json'
        : currencyPair === 'EUR/USD' ? 'providers_config_eurusd.json'
        : currencyPair === 'GBP/USD' ? 'providers_config_gbpusd.json'
        : 'providers_config.json';
    const p = path.join(PUBLIC_DIR, file);
    if (!fs.existsSync(p)) return map;
    const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    (raw.providers || []).forEach(prov => {
        map.set(prov.id, prov);
        const normalized = prov.id.replace(/_/g, '');
        if (normalized !== prov.id) map.set(normalized, prov);
    });
    return map;
}

// ---------------------------------------------------------------------------
// Ranking (mirrors getBuyRanking / getSellRanking in dataProcessor.ts)

function buildRanking(data, providerConfigs, currencyPair, side) {
    const isCrossPair = currencyPair === 'EUR/USD' || currencyPair === 'GBP/USD';
    const isBuy = side === 'buy';
    const successData = data.filter(d =>
        d.status === 'success' && (d.currency_pair || currencyPair) === currencyPair
    );
    const windowData = getPast14DaysData(successData);

    const providerMap = new Map();
    for (const r of windowData) {
        const value = isBuy ? r.swap_buy : r.swap_sell;
        if (value === null || isNaN(value)) continue;
        // Buy side: cross pair allows 0 (legitimate). JPY pair excludes 0.
        // Sell side: 0 is always excluded.
        const valid = isBuy ? (isCrossPair || value !== 0) : (value !== 0);
        if (!valid) continue;
        const days = r.days && r.days > 0 ? r.days : 1;
        if (!providerMap.has(r.provider_id)) {
            const cfg = providerConfigs.get(r.provider_id);
            providerMap.set(r.provider_id, {
                name: (cfg && cfg.name) || r.name,
                weightedSum: 0,
                totalDays: 0,
            });
        }
        const info = providerMap.get(r.provider_id);
        info.weightedSum += value * days;
        info.totalDays += days;
    }

    const ranking = [];
    for (const [pid, info] of providerMap.entries()) {
        const avg = info.totalDays > 0 ? info.weightedSum / info.totalDays : 0;
        ranking.push({
            provider_id: pid,
            name: info.name,
            avg: avg,
            sample_days: info.totalDays,
        });
    }

    if (isBuy) {
        return ranking
            .filter(r => isCrossPair ? true : r.avg !== 0)
            .sort((a, b) => b.avg - a.avg);
    }
    // 値の大きい順（支払いが少ない/受取りが多い順）。
    // 絶対値ソートだと、売スワップがプラスになるクロスペアで順位が逆転する
    // (dataProcessor.getSellRanking と同じ修正。2026-08-02)
    return ranking
        .filter(r => r.avg !== 0)
        .sort((a, b) => b.avg - a.avg);
}

// ---------------------------------------------------------------------------
// Main

function generateRankingFor(currencyPair, csvFilename, outFilename) {
    const csvPath = path.join(DATA_DIR, csvFilename);
    if (!fs.existsSync(csvPath)) {
        console.warn(`[skip] CSV not found: ${csvPath}`);
        return;
    }
    const csvText = fs.readFileSync(csvPath, 'utf8');
    const parsed = parseCSV(csvText, currencyPair);
    const filtered = filterSuccessData(parsed);
    const providerConfigs = loadProviderConfigs(currencyPair);

    const buy = buildRanking(filtered, providerConfigs, currencyPair, 'buy');
    const sell = buildRanking(filtered, providerConfigs, currencyPair, 'sell');

    // latest target_date = max of all rows in original CSV (HP does the same)
    const dateSet = new Set(parsed.map(r => r.target_date).filter(Boolean));
    const latestDate = [...dateSet].sort().pop() || '';

    const output = {
        currency_pair: currencyPair,
        target_date: latestDate,
        period_label: '直近約2週間',
        generated_at: new Date().toISOString(),
        buy_ranking: buy,
        sell_ranking: sell,
    };

    const outPath = path.join(DATA_DIR, outFilename);
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log(`[OK] ${outFilename}: buy=${buy.length}, sell=${sell.length}, latest=${latestDate}`);
}

function main() {
    if (!fs.existsSync(DATA_DIR)) {
        console.error(`[ERROR] data dir missing: ${DATA_DIR}`);
        process.exit(1);
    }
    // TRY/JPY only is required for X posting today, but emit MXN/USD too
    // so future workflows can read whichever pair they need with the same logic.
    generateRankingFor('TRY/JPY', 'master_history_try.csv', 'ranking_try.json');
    generateRankingFor('MXN/JPY', 'master_history_mxn.csv', 'ranking_mxn.json');
    generateRankingFor('USD/JPY', 'master_history_usd.csv', 'ranking_usd.json');
}

main();
