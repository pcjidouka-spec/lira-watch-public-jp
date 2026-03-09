import React from 'react';
import { ProviderRanking } from '@/types';

interface RankingBarChartProps {
  rankings: ProviderRanking[];
  type: 'buy' | 'sell';
  title: string;
}

export const RankingBarChart: React.FC<RankingBarChartProps> = ({ rankings, type, title }) => {
  if (rankings.length === 0) {
    return (
      <div className="ranking-chart-container">
        <h2 className="ranking-title">{title}</h2>
        <p className="no-data">データがありません</p>
      </div>
    );
  }

  // 買いの場合は通常通り、売りの場合は絶対値で計算
  const values = rankings.map(r => type === 'buy' ? r.swap_buy : Math.abs(r.swap_sell));
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1; // ゼロ除算を防ぐ

  return (
    <div className="ranking-chart-container">
      <h2 className="ranking-title">{title}</h2>
      <div className="bar-chart">
        {rankings.map((rank, index) => {
          const originalValue = type === 'buy' ? rank.swap_buy : rank.swap_sell;
          const displayValue = type === 'buy' ? rank.swap_buy : Math.abs(rank.swap_sell);
          const percentage = ((displayValue - minValue) / range) * 100;
          const isTop = index === 0;

          return (
            <div key={rank.provider_id} className="bar-item">
              <div className="bar-label">
                <span className="rank-number">{index + 1}位</span>
                {rank.url ? (
                  <a
                    href={rank.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`provider-name provider-link ${isTop ? 'top-name' : ''}`}
                  >
                    {rank.name}
                  </a>
                ) : (
                  <span className={`provider-name ${isTop ? 'top-name' : ''}`}>{rank.name}</span>
                )}
                {rank.campaign_url && (
                  <a
                    href={rank.campaign_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="campaign-button mobile-only"
                    title="キャンペーン情報"
                  >
                    キャンペーン
                  </a>
                )}
              </div>
              <div className="bar-wrapper">
                <div
                  className={`bar ${type}`}
                  style={{
                    width: `${Math.abs(percentage)}%`,
                    marginLeft: '0',
                  }}
                >
                  <span className="bar-value">{originalValue.toFixed(1)}円</span>
                </div>
              </div>
              {rank.campaign_url && (
                <a
                  href={rank.campaign_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="campaign-button desktop-only"
                  title="キャンペーン情報"
                >
                  キャンペーン
                </a>
              )}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .ranking-chart-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin: 12px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          overflow-x: auto;
        }
        .ranking-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .ranking-chart-container {
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
          }
          .ranking-title {
            font-size: 18px;
            margin-bottom: 12px;
          }
        }
        @media (max-width: 480px) {
          .ranking-chart-container {
            padding: 8px;
            margin: 4px 0;
          }
          .ranking-title {
            font-size: 16px;
            margin-bottom: 8px;
          }
        }
        .no-data {
          text-align: center;
          color: #6b7280;
          padding: 20px;
        }
        .bar-chart {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 0;
        }
        .bar-label {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 250px;
          min-width: 250px;
          max-width: 250px;
          flex-shrink: 0;
        }
        .mobile-only {
            display: none;
        }
        .desktop-only {
            display: block;
        }
        @media (max-width: 768px) {
          .bar-label {
            width: 200px;
            min-width: 200px;
            max-width: 200px;
          }
          .rank-number {
            font-size: 12px;
            padding: 2px 8px;
            min-width: 32px;
            width: 32px;
          }
          .provider-name {
            font-size: 13px;
          }
          .bar-value {
            font-size: 12px;
          }
          .bar-item {
             gap: 8px;
          }
        }
        @media (max-width: 480px) {
          .bar-item {
            flex-direction: column;
            align-items: stretch;
            gap: 2px;
            margin-bottom: 8px;
            border-bottom: 1px solid #f3f4f6;
            padding-bottom: 4px;
          }
          .bar-item:last-child {
            border-bottom: none;
          }
          .bar-label {
            width: 100%;
            min-width: 100%;
            max-width: 100%;
            justify-content: flex-start;
          }
          .mobile-only {
            display: block;
            margin-left: auto; /* Push to right */
            font-size: 10px;
            padding: 2px 6px;
            height: fit-content;
          }
          .desktop-only {
            display: none !important;
          }
          .rank-number {
             margin-right: 4px;
          }
          .provider-name {
             flex: 0 1 auto; /* Allow shrinking if needed, but flex-start alignment */
             margin-right: 4px;
          }
          .bar-wrapper {
             width: 100%;
             height: 24px;
          }
          .bar {
             min-width: 40px;
          }
        }
        .rank-number {
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 14px;
          
          min-width: 48px;
          width: 48px;
          text-align: center;
          flex-shrink: 0;
        }
        .provider-name {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.3;
          flex: 1;
        }
        .provider-name.top-name {
          color: #ef4444;
        }
        .provider-link {
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .provider-link:hover {
          opacity: 0.7;
          text-decoration: underline;
        }
        .provider-link.top-name {
          color: #ef4444;
        }
        .bar-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          height: 32px;
          background: #f3f4f6;
          border-radius: 6px;
          position: relative;
          overflow: visible;
        }
        .bar {
          height: 100%;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 8px;
          transition: all 0.3s ease;
          position: relative;
          min-width: 60px;
        }
        .bar.buy {
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
        }
        .bar.sell {
          background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
        }
        .bar-value {
          color: white;
          font-weight: 700;
          font-size: 13px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .campaign-button {
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.3s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }
        .campaign-button:hover {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

