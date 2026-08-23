import React, { useState } from 'react';
import { ProviderRanking } from '@/types';
import { useCampaignUpdates } from '@/hooks/useCampaignUpdates';
import { formatTradingSpread } from '@/lib/spreadDisplay';

interface RankingTableProps {
  buyRankings: ProviderRanking[];
  sellRankings: ProviderRanking[];
  currencyLabel?: string;
  unitLabel?: string;
  noteText?: string;
}

// Helper function to get provider_id consistently
const getProviderId = (p: any): string => {
  if (!p) return '';
  return String(p.provider_id || '').toLowerCase();
};

// Format actual_date / latest_date into short "M/D" notation.
// 入力例: "2026/05/12", "2026-05-12" → "5/12"
const formatShortDate = (raw?: string): string => {
  if (!raw) return '';
  const parts = raw.replace(/-/g, '/').split('/');
  if (parts.length === 3) {
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!isNaN(m) && !isNaN(d)) return `${m}/${d}`;
  } else if (parts.length === 2) {
    // 既に "5/12" 形式
    const m = parseInt(parts[0], 10);
    const d = parseInt(parts[1], 10);
    if (!isNaN(m) && !isNaN(d)) return `${m}/${d}`;
  }
  return raw;
};
export const RankingTable: React.FC<RankingTableProps> = ({ buyRankings, sellRankings, currencyLabel = 'トルコリラ', unitLabel, noteText }) => {
  const valueSuffix = unitLabel ? '' : '円';
  const valueColumnLabel = unitLabel ? `金額（${unitLabel}）` : '金額';
  const { hasNewCampaign } = useCampaignUpdates();
  const [isExpanded, setIsExpanded] = useState(false);

  // Combine data into rows for the unified table structure
  const maxRows = Math.max(buyRankings.length, sellRankings.length);
  const rows = Array.from({ length: maxRows }).map((_, i) => {
    // Clone objects to avoid mutating props and to allow injection
    const buy = buyRankings[i] ? { ...buyRankings[i] } : null;
    const sell = sellRankings[i] ? { ...sellRankings[i] } : null;

    // Hardcode DMM FX URLs as they are not in providers_config.json
    if (buy && buy.name === 'DMM FX') {
      buy.url = 'https://fx.dmm.com/fx/service/swapcalendar/';
      buy.campaign_url = 'https://fx.dmm.com/campaign/';
    }
    if (sell && sell.name === 'DMM FX') {
      sell.url = 'https://fx.dmm.com/fx/service/swapcalendar/';
      sell.campaign_url = 'https://fx.dmm.com/campaign/';
    }

    return {
      buy,
      sell,
    };
  });


  return (
    <div className="ranking-container">
      <div className="main-header">{currencyLabel} 円スワップポイント</div>
      <div className="ranking-period-note">順位は直近約2週間の付与日数加重平均に基づきます</div>

      <div className="table-wrapper">
        <table className="merged-table">
          <thead>
            <tr className="header-row">
              <th className="th-side-header buy" colSpan={4}>買いランキング</th>
              <th className="th-side-header sell" colSpan={4}>売りランキング</th>
            </tr>
            <tr className="sub-header">
              {/* Buy Columns */}
              <th className="th-rank">順位</th>
              <th className="th-name">FX会社</th>
              <th className="th-value">{valueColumnLabel}</th>
              <th className="th-spread">スプレッド</th>
              {/* Sell Columns */}
              <th className="th-rank border-left">順位</th>
              <th className="th-name">FX会社</th>
              <th className="th-value">{valueColumnLabel}</th>
              <th className="th-spread">スプレッド</th>
            </tr>
          </thead>
          <tbody>
            {(isExpanded ? rows : rows.slice(0, 3)).map((row, index) => (
              <tr key={index} className="ranking-row">
                {/* Buy Side */}
                <td className="td-rank">
                  {row.buy && <span className={`rank-number rank-${index + 1}`}>{index + 1}</span>}
                </td>
                <td className="td-name">
                  {row.buy && (
                    <div className="name-container">
                      {row.buy.url ? (
                        <a href={row.buy.url} target="_blank" rel="noopener noreferrer" className="provider-link">
                          {row.buy.name}
                        </a>
                      ) : (
                        <span className="provider-name-text">{row.buy.name}</span>
                      )}
                      {row.buy.campaign_url && (
                        <a href={row.buy.campaign_url} target="_blank" rel="noopener noreferrer" className="campaign-button" title="キャンペーン情報">
                          ｷｬﾝﾍﾟｰﾝ
                          {hasNewCampaign(row.buy.provider_id || '') && <span className="new-badge">New</span>}
                        </a>
                      )}

                      {getProviderId(row.buy) === 'jfx' && (
                        <>
                          <a href="https://px.a8.net/svt/ejp?a8mat=4AV5OF+5TKLPU+25B2+601S1" rel="nofollow" target="_blank" className="jfx-banner">
                            <img width="32" height="24" alt="JFX" src="https://www23.a8.net/svt/bgt?aid=260114559352&wid=001&eno=01&mid=s00000010019001008000&mc=1" />
                          </a>
                          <img width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4AV5OF+5TKLPU+25B2+601S1" alt="" style={{ border: 0 }} />
                        </>
                      )}
                      {getProviderId(row.buy) === 'hirose' && (
                        <>
                          <a
                            href="https://t.afi-b.com/visit.php?a=01064i-P15468G&p=79755021"
                            rel="nofollow noopener noreferrer"
                            target="_blank"
                            className="hirose-banner"
                          >
                            <img
                              src="https://www.afi-b.com/upload_image/1064-1202089209-3.gif"
                              width={88}
                              height={31}
                              style={{ border: 'none' }}
                              alt="FX"
                            />
                          </a>
                          <img
                            src="https://t.afi-b.com/lead/01064i/79755021/P15468G"
                            width={1}
                            height={1}
                            style={{ border: 'none' }}
                            alt=""
                          />
                        </>
                      )}
                      {getProviderId(row.buy) === 'matsui' && (
                        <>
                          <a href="https://px.a8.net/svt/ejp?a8mat=4AV5OF+584ZXU+4SM6+609HT" rel="nofollow" target="_blank" className="matsui-banner">
                            <img width="60" height="36" alt="MATSUI FX" src="https://www21.a8.net/svt/bgt?aid=260114559316&wid=001&eno=01&mid=s00000022371001009000&mc=1" />
                          </a>
                          <img width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4AV5OF+584ZXU+4SM6+609HT" alt="" style={{ border: 0 }} />
                        </>
                      )}
                      {getProviderId(row.buy) === 'saxo' && (
                        <>
                          <a href="https://px.a8.net/svt/ejp?a8mat=4AX0WP+123RHU+5PC8+BXIYP" rel="nofollow" target="_blank" className="saxo-banner">
                            <img width="50" height="30" alt="サクソバンク証券" src="https://www20.a8.net/svt/bgt?aid=260201689064&wid=001&eno=01&mid=s00000026612002004000&mc=1" />
                          </a>
                          <img width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4AX0WP+123RHU+5PC8+BXIYP" alt="" style={{ border: 0 }} />
                        </>
                      )}
                    </div>
                  )}
                </td>
                <td className="td-value buy">
                  {row.buy && (
                    <div className="value-container">
                      <span className="avg-value">{row.buy.swap_buy.toFixed(1)}{valueSuffix}</span>
                      {row.buy.latest_buy != null && (
                        <span className="latest-value">最新 {row.buy.latest_buy.toFixed(1)}{valueSuffix}</span>
                      )}
                      {row.buy.latest_buy != null && (row.buy.actual_date || row.buy.latest_date) && (
                        <span className="latest-date-note">({formatShortDate(row.buy.actual_date || row.buy.latest_date)} 時点)</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="td-spread buy">
                  {row.buy && formatTradingSpread(row.buy.trading_spread) && (
                    <span className="spread-value">{formatTradingSpread(row.buy.trading_spread)}</span>
                  )}
                </td>

                {/* Sell Side */}
                <td className="td-rank border-left">
                  {row.sell && <span className={`rank-number rank-${index + 1}`}>{index + 1}</span>}
                </td>
                <td className="td-name">
                  {row.sell && (
                    <div className="name-container">
                      {row.sell.url ? (
                        <a href={row.sell.url} target="_blank" rel="noopener noreferrer" className="provider-link">
                          {row.sell.name}
                        </a>
                      ) : (
                        <span className="provider-name-text">{row.sell.name}</span>
                      )}
                      {row.sell.campaign_url && (
                        <a href={row.sell.campaign_url} target="_blank" rel="noopener noreferrer" className="campaign-button" title="キャンペーン情報">
                          ｷｬﾝﾍﾟｰﾝ
                          {hasNewCampaign(row.sell.provider_id || '') && <span className="new-badge">New</span>}
                        </a>
                      )}

                      {getProviderId(row.sell) === 'jfx' && (
                        <>
                          <a href="https://px.a8.net/svt/ejp?a8mat=4AV5OF+5TKLPU+25B2+601S1" rel="nofollow" target="_blank" className="jfx-banner">
                            <img width="32" height="24" alt="JFX" src="https://www23.a8.net/svt/bgt?aid=260114559352&wid=001&eno=01&mid=s00000010019001008000&mc=1" />
                          </a>
                          <img width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4AV5OF+5TKLPU+25B2+601S1" alt="" style={{ border: 0 }} />
                        </>
                      )}
                      {getProviderId(row.sell) === 'hirose' && (
                        <>
                          <a
                            href="https://t.afi-b.com/visit.php?a=01064i-P15468G&p=79755021"
                            rel="nofollow noopener noreferrer"
                            target="_blank"
                            className="hirose-banner"
                          >
                            <img
                              src="https://www.afi-b.com/upload_image/1064-1202089209-3.gif"
                              width={88}
                              height={31}
                              style={{ border: 'none' }}
                              alt="FX"
                            />
                          </a>
                          <img
                            src="https://t.afi-b.com/lead/01064i/79755021/P15468G"
                            width={1}
                            height={1}
                            style={{ border: 'none' }}
                            alt=""
                          />
                        </>
                      )}
                      {getProviderId(row.sell) === 'matsui' && (
                        <>
                          <a href="https://px.a8.net/svt/ejp?a8mat=4AV5OF+584ZXU+4SM6+609HT" rel="nofollow" target="_blank" className="matsui-banner">
                            <img width="60" height="36" alt="MATSUI FX" src="https://www21.a8.net/svt/bgt?aid=260114559316&wid=001&eno=01&mid=s00000022371001009000&mc=1" />
                          </a>
                          <img width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4AV5OF+584ZXU+4SM6+609HT" alt="" style={{ border: 0 }} />
                        </>
                      )}
                      {getProviderId(row.sell) === 'saxo' && (
                        <>
                          <a href="https://px.a8.net/svt/ejp?a8mat=4AX0WP+123RHU+5PC8+BXIYP" rel="nofollow" target="_blank" className="saxo-banner">
                            <img width="50" height="30" alt="サクソバンク証券" src="https://www20.a8.net/svt/bgt?aid=260201689064&wid=001&eno=01&mid=s00000026612002004000&mc=1" />
                          </a>
                          <img width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4AX0WP+123RHU+5PC8+BXIYP" alt="" style={{ border: 0 }} />
                        </>
                      )}
                    </div>
                  )}
                </td>
                <td className="td-value sell">
                  {row.sell && (
                    <div className="value-container">
                      <span className="avg-value">{row.sell.swap_sell.toFixed(1)}{valueSuffix}</span>
                      {row.sell.latest_sell != null && (
                        <span className="latest-value">最新 {row.sell.latest_sell.toFixed(1)}{valueSuffix}</span>
                      )}
                      {row.sell.latest_sell != null && (row.sell.actual_date || row.sell.latest_date) && (
                        <span className="latest-date-note">({formatShortDate(row.sell.actual_date || row.sell.latest_date)} 時点)</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="td-spread sell">
                  {row.sell && formatTradingSpread(row.sell.trading_spread) && (
                    <span className="spread-value">{formatTradingSpread(row.sell.trading_spread)}</span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="no-data">データがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {noteText && (
        <p className="cross-pair-note" style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', padding: '0 12px' }}>
          {noteText}
        </p>
      )}

      <p className="spread-note" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', padding: '0 12px' }}>
        ※ スプレッドは各社が公表する原則固定スプレッドです（括弧内は適用条件）。市場急変時・重要指標発表時・流動性低下時には拡大します。出典は各社公式サイト。「変動」は変動スプレッド制、「—」は当サイトが値を取得できていないことを示します。
      </p>

      {rows.length > 3 && (
        <div className="toggle-wrapper">
          <button
            className="toggle-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <span className="icon">▲</span> 表示を閉じる
              </>
            ) : (
              <>
                <span className="icon">▼</span> すべてのランキングを見る（全{rows.length}社）
              </>
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        .ranking-container {
          width: 100%;
          max-width: 1100px; /* Aligns better with 1200px page max-width */
          margin: 0 auto 40px auto;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          border-radius: 8px;
          overflow: hidden;
          background: white;
          border: 1px solid #d1d5db;
        }

        .main-header {
          background: #ef4444; /* Light Red (Red 500) */
          color: white;
          text-align: center;
          font-size: 28px;
          font-weight: 900;
          padding: 10px; /* Reduced from 20px */
          border-bottom: 1px solid #fca5a5;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          background: linear-gradient(to bottom, #ef4444, #dc2626); /* Gradient for better look */
        }

        .ranking-period-note {
          text-align: center;
          font-size: 13px;
          color: #4b5563;
          padding: 8px 12px 10px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .merged-table {
          width: 100%;
          border-collapse: collapse;
        }

        /* Headers */
        .th-side-header {
          padding: 14px;
          font-size: 18px;
          font-weight: 700;
          color: white;
          text-align: center;
        }
        .th-side-header.buy { background-color: #059669; }
        .th-side-header.sell { background-color: #2563eb; } /* Changed to Blue (Blue 600) */

        .sub-header th {
          background-color: #f3f4f6;
          color: #374151;
          font-weight: 700;
          font-size: 15px;
          padding: 12px 4px;
          border-bottom: 2px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          text-align: center;
        }
        .sub-header th:last-child { border-right: none; }
        .sub-header th.border-left { border-left: 2px solid #d1d5db; }
        
        /* Outer padding adjustments (Left of Buy Rank / Right of Sell Value) */
        .sub-header th:first-child { padding-left: 8px; }
        .sub-header th:last-child { padding-right: 40px; }

        /* Rows & Cells */
        .ranking-row td {
          padding: 14px 4px;
          border-bottom: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          vertical-align: middle;
          font-size: 15px;
        }
        .ranking-row td:last-child { border-right: none; }
        .ranking-row td.border-left { border-left: 2px solid #d1d5db; }
        
        /* Outer padding adjustments for rows */
        .ranking-row td:first-child { padding-left: 8px; }
        .ranking-row td:last-child { padding-right: 40px; }

        /* Column Widths */
        .th-rank, .td-rank { 
          width: 1%; 
          white-space: nowrap; 
          text-align: center; 
          padding-left: 16px; 
          padding-right: 16px; 
        }
        /* Specific adjustments for center divider (Buy/Sell gap) */
        .td-rank.border-left, .th-rank.border-left {
            padding-left: 32px; /* Widen gap between Buy and Sell */
        }
        
        .th-name, .td-name { 
          width: auto; 
          text-align: left; 
          padding-left: 16px; 
          padding-right: 0px; /* Reduce gap to Value */
        }
        .th-value, .td-value { 
          width: 1%; 
          white-space: nowrap; 
          text-align: center; 
          padding-left: 2px; /* Reduce gap from Name */
          padding-right: 12px; 
        }

        /* Spread column (right of the amount column) */
        .th-spread, .td-spread {
          width: 1%;
          white-space: nowrap;
          text-align: center;
          padding-left: 8px;
          padding-right: 12px;
        }
        .td-spread.buy {
            padding-right: 32px; /* Widen gap between Buy and Sell */
        }

        /* Rank */
        .rank-number {
          display: inline-block;
          width: 28px; /* Larger */
          height: 28px;
          line-height: 28px;
          border-radius: 50%;
          background: #e5e7eb;
          color: #6b7280;
          font-weight: 700;
          font-size: 14px;
          text-align: center;
        }
        .rank-1 { background: #EAB308; color: white; transform: scale(1.1); box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .rank-2 { background: #9CA3AF; color: white; }
        .rank-3 { background: #B45309; color: white; }

        /* Name & Button */
        .name-container {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .provider-link {
          color: #1d4ed8;
          text-decoration: underline;
          font-weight: 600;
          font-size: 16px; /* Larger */
          cursor: pointer;
        }
        .provider-link:hover {
          color: #1e40af;
          background-color: #eff6ff;
        }
        .provider-name-text {
          color: #1f2937;
          font-weight: 500;
          font-size: 16px; /* Larger */
        }

        /* Campaign Button */
        .campaign-button {
          display: inline-block;
          padding: 4px 8px;
          background-color: #ef4444;
          color: white;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          transition: all 0.2s;
        }
        .campaign-button:hover {
          background-color: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        /* New Badge */
        .new-badge {
          display: inline-block;
          margin-left: 4px;
          padding: 2px 6px;
          background-color: #fbbf24;
          color: #92400e;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 800;
          vertical-align: middle;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* JFX Banner */
        .jfx-banner {
          display: inline-block;
          margin-left: 4px;
          line-height: 0;
        }
        .jfx-banner img {
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          vertical-align: middle;
          transition: all 0.2s;
        }
        .jfx-banner:hover img {
          transform: scale(1.05);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* ヒロセ通商 AFB バナー */
        .hirose-banner {
          display: inline-block;
          margin-left: 4px;
          line-height: 0;
        }
        .hirose-banner img {
          vertical-align: middle;
          transition: all 0.2s;
        }
        .hirose-banner:hover img {
          transform: scale(1.03);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Matsui Banner */
        .matsui-banner {
          display: inline-block;
          margin-left: 4px;
          line-height: 0;
        }
        .matsui-banner img {
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          vertical-align: middle;
          transition: all 0.2s;
        }
        .matsui-banner:hover img {
          transform: scale(1.05);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Saxo Banner */
        .saxo-banner {
          display: inline-block;
          margin-left: 4px;
          line-height: 0;
        }
        .saxo-banner img {
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          vertical-align: middle;
          transition: all 0.2s;
        }
        .saxo-banner:hover img {
          transform: scale(1.05);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .delay-warning {
          cursor: help;
          font-size: 12px;
          margin-left: 4px;
          vertical-align: middle;
        }

        /* Values */
        .td-value {
          font-family: 'Roboto', sans-serif;
          font-weight: 700;
          font-size: 16px; /* Larger */
        }
        .td-value.buy { color: #059669; }
        .td-value.sell { color: #2563eb; }

        .value-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .avg-value {
          font-size: 16px;
          font-weight: 700;
        }
        .latest-value {
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
        }
        .latest-date-note {
          font-size: 10px;
          font-weight: 400;
          color: #9ca3af;
          line-height: 1.2;
        }

        .spread-value {
          font-size: 13px;
          font-weight: 600;
          color: #4b5563;
          line-height: 1.3;
          font-family: 'Roboto', sans-serif;
        }

        @media (max-width: 768px) {
           .merged-table {
             min-width: 780px; /* Force scroll (spread columns added) */
           }
           
           /* モバイル用フォントサイズ調整 */
           .main-header {
             font-size: 20px;
             padding: 8px;
           }

           .ranking-period-note {
             font-size: 12px;
             padding: 6px 8px 8px;
           }
           
           .th-side-header {
             font-size: 14px;
             padding: 10px;
           }
        }

        /* Toggle Button Styles */
        .toggle-wrapper {
          padding: 20px;
          display: flex;
          justify-content: center;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .toggle-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .toggle-button:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .toggle-button .icon {
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};
// Last updated to trigger build: 2026-03-20 ヒロセ AFB バナー追加
