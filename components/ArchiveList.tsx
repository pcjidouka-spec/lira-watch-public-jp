import React from 'react';
import Link from 'next/link';
import { articles } from '../data/articles';

export const ArchiveList: React.FC = () => {
  // Group articles by year and month
  const archiveMap: { [key: string]: { [key: string]: number } } = {};

  articles.forEach((article) => {
    const date = new Date(article.date.replace(/\//g, '-'));
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    if (!archiveMap[year]) {
      archiveMap[year] = {};
    }
    if (!archiveMap[year][month]) {
      archiveMap[year][month] = 0;
    }
    archiveMap[year][month]++;
  });

  // Sort years descending
  const years = Object.keys(archiveMap).sort((a, b) => b.localeCompare(a));

  return (
    <div className="archive-card">
      <h3 className="archive-title">📚 月別アーカイブ</h3>
      <div className="archive-content">
        {years.map((year) => (
          <div key={year} className="year-section">
            <h4 className="year-label">{year}年</h4>
            <ul className="month-list">
              {Object.keys(archiveMap[year])
                .sort((a, b) => b.localeCompare(a))
                .map((month) => (
                  <li key={`${year}-${month}`} className="month-item">
                    <Link href={`/?archive=${year}-${month}`} className="month-link">
                      {parseInt(month)}月 ({archiveMap[year][month]})
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <style jsx>{`
        .archive-card {
          background: white;
          border-radius: 12px;
          padding: 15px; /* Reduced from 20px */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
        }
        .archive-title {
          font-size: 16px; /* Reduced from 18px */
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 10px 0; /* Reduced from 15px */
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .archive-content {
          display: flex;
          flex-direction: column;
          gap: 10px; /* Reduced from 15px */
        }
        .year-label {
          font-size: 15px; /* Reduced from 16px */
          font-weight: 600;
          color: #374151;
          margin: 0 0 5px 0; /* Reduced from 8px */
          padding-bottom: 2px; /* Reduced from 4px */
          border-bottom: 2px solid #6366f1;
          display: inline-block;
        }
        .month-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px; /* Reduced from 8px */
        }
        .month-item {
          font-size: 14px;
        }
        .month-link {
          display: block;
          padding: 6px 10px;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 6px;
          color: #4b5563;
          text-decoration: none;
          transition: all 0.2s;
        }
        .month-link:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
          color: #4f46e5;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};
