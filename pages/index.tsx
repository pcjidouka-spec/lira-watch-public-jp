import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSwapData } from '@/hooks/useSwapData';
import { RankingTable } from '@/components/RankingTable';
import { HistoricalChart } from '@/components/HistoricalChart';
import { AdSense, AdSection } from '@/components/AdSense';
import { articles } from '../data/articles';
import { AdvancedChart } from '@/components/TradingView/AdvancedChart';
import { EconomicCalendar } from '@/components/TradingView/EconomicCalendar';
import { Timeline } from '@/components/TradingView/Timeline';
import { IdeasWidget } from '@/components/TradingView/IdeasWidget';
import { BlogLayout } from '@/components/BlogLayout';
import { BlogmuraButtons } from '@/components/BlogmuraButtons';
import { RakutenAds } from '@/components/RakutenAds';


export default function Home() {
  const {
    buyRanking,
    sellRanking,
    data,
    lastUpdated,
    siteUpdatedAt,
    loading,
    error,
  } = useSwapData();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>データを読み込み中...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f3f4f6;
          }
          .loading-spinner {
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">エラー: {error}</p>
        <style jsx>{`
          .error-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f3f4f6;
          }
          .error-message {
            color: #ef4444;
            font-size: 18px;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  // Sidebar Content Definition
  const sidebarContent = (
    <>
      <div className="sidebar-widget">
        <div className="widget-content" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
            いつもありがとうございます。<br />
            これからも有用な情報をお届け出来るよう、応援して下さい♪
          </p>
          <a href="https://fx.blogmura.com/turkey-lira/ranking/in?p_cid=11211368" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <span className="iine-banner" style={{ marginBottom: '8px' }}>いいね♪</span>
          </a>
          <br />
          <a href="https://blogmura.com/ranking/in?p_cid=11211368" target="_blank" rel="noopener noreferrer" className="blogmura-text-link">
            にほんブログ村
          </a>
          <div style={{ marginTop: '12px', borderTop: '1px dashed #e5e7eb', paddingTop: '12px' }}>
            <div className="blogmura-blogparts" data-chid="11211368" data-category="6750" data-type="pv"></div>
            <script src="https://blogparts.blogmura.com/js/parts_view.js" async></script>
          </div>
        </div>
      </div>

      <div className="sidebar-widget">
        <div className="widget-header">
          <h3>新着記事</h3>
        </div>
        <div className="widget-content">
          <ul className="sidebar-article-list">
            {articles.slice(0, 5).map((article) => {
              // Check if article is within 5 days
              const articleDate = new Date(article.date.replace(/\//g, '-'));
              const today = new Date();
              const diffTime = today.getTime() - articleDate.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isNew = diffDays <= 5;

              return (
                <li key={article.id} className="sidebar-article-item">
                  <span className="sidebar-bullet">・</span>
                  <span className="sidebar-article-date">{article.date}</span>
                  <span className="sidebar-spacer"> </span>
                  <Link href={`/articles/${article.id}`} className={`sidebar-article-link ${isNew ? 'sidebar-new-article' : ''}`}>
                    {article.title}
                  </Link>
                  {isNew && <span className="sidebar-new-badge">New</span>}
                </li>
              );
            })}
          </ul>
          <div style={{ textAlign: 'right', marginTop: '12px', borderTop: '1px dashed #f3f4f6', paddingTop: '8px' }}>
            <Link href="#new-articles" className="sidebar-article-link" style={{ fontSize: '12px' }}>
              » 過去記事一覧
            </Link>
          </div>
        </div>
      </div>

      <div className="sidebar-widget">
        <div className="widget-header">
          <h3>トルコリラ/円</h3>
        </div>
        <div className="widget-content">
          <IdeasWidget height="300" />
        </div>
      </div>


      <RakutenAds />

      <div className="sidebar-widget">
        <div className="widget-header">
          <h3>LIVEチャート</h3>
        </div>
        <div className="widget-content">
          <AdvancedChart symbol="FX:TRYJPY" interval="60" containerId="tv_tryjpy_sidebar" height="700px" />
          <div style={{ height: '10px' }}></div>
          <AdvancedChart symbol="FX:USDJPY" interval="60" containerId="tv_usdjpy_sidebar" height="700px" />
        </div>
      </div>

      <div className="sidebar-widget">
        <div className="widget-header">
          <h3>経済カレンダー</h3>
        </div>
        <div className="widget-content">
          <EconomicCalendar height="1500px" />
        </div>
      </div>




      <div className="sidebar-widget">
        <div className="widget-header">
          <h3>リスク管理について</h3>
        </div>
        <div className="widget-content risk-block">
          <p>トルコリラは高金利通貨として知られていますが、為替変動リスクも高い通貨です。急激な変動によりスワップポイントの利益を上回る損失が発生する可能性があります。</p>
        </div>
      </div>

      <div className="sidebar-widget">
        <div className="widget-header">
          <h3>免責事項</h3>
        </div>
        <div className="widget-content disclaimer-block">
          <p>本サイトのデータは自動収集されており、正確性を完全に保証するものではありません。投資判断は必ず各FX会社の公式サイトをご確認の上、自己責任で行ってください。</p>
        </div>
      </div>
    </>
  );

  return (
    <BlogLayout sidebar={sidebarContent} lastUpdated={siteUpdatedAt || lastUpdated || undefined}>
      <Head>
        <title>トルコリラ・ウォッチ | lira-watch.sbs - TRY/JPYスワップポイント比較ブログ</title>
        <meta name="description" content="トルコリラ円（TRY/JPY）の各FX会社のスワップポイントを毎日比較・アーカイブ。高金利通貨トルコリラの最新スワップポイントランキング、推移チャート、キャンペーン情報を網羅。" />
        <meta name="keywords" content="トルコリラ, TRY/JPY, スワップポイント, 比較, FX, トルコリラ円, スワップ投資, 高金利通貨, ランキング, ブログ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="canonical" href="https://lira-watch.sbs/" />

        {/* OGP Tags */}
        <meta property="og:title" content="トルコリラ・ウォッチ | TRY/JPYスワップポイント比較・推移" />
        <meta property="og:description" content="トルコリラ円（TRY/JPY）のスワップポイントを毎日更新で徹底比較。過去の推移データやランキング、最新の市場ニュースもチェックできます。" />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content="https://lira-watch.sbs/" />
        <meta property="og:image" content="https://lira-watch.sbs/images/An_anime-style_Japanese_otaku_person_looking_at_a_-1757952948058.png" />
        <meta property="og:site_name" content="トルコリラ・ウォッチ" />
        <meta property="og:locale" content="ja_JP" />

        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-6343144082717938" />
      </Head>

      {/* --- メインコンテンツ: ブログ記事フィード形式 --- */}

      {/* 1. ランキング更新 (Top Post) */}
      <article className="blog-post featured-post">
        <header className="post-header">
          <div className="post-meta">
            <span className="post-date">{siteUpdatedAt ? siteUpdatedAt.split(' ')[0] : (lastUpdated || '2026/01/01')}</span>
            <span className="post-time">{siteUpdatedAt ? siteUpdatedAt.split(' ')[1] : '05:00'}</span>
            <span className="post-category">ランキング更新</span>
          </div>
          <h1 className="post-title">【毎日更新】トルコリラ円スワップポイントランキング・推移</h1>
        </header>

        <div className="post-content">
          <p className="lead-text">
            {siteUpdatedAt || lastUpdated} 時点における、各FX会社のトルコリラ円（TRY/JPY）<a href="#swap-ranking" className="internal-link">スワップポイント比較ランキング</a>とキャンペーン情報の更新（５日以内）、<a href="#new-articles" className="internal-link">関連する情報を纏めた記事</a>をお届けします。
          </p>

          <h2 id="swap-ranking" className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
            スワップポイントランキング
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0' }}>
              <a href="https://fx.blogmura.com/turkey-lira/ranking/in?p_cid=11211368" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                <span className="iine-banner">いいね♪</span>
              </a>
              <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280', marginLeft: '8px' }}>←応援お願いします。</span>
            </span>
          </h2>

          <div className="ranking-wrapper">
            <RankingTable
              buyRankings={buyRanking}
              sellRankings={sellRanking}
            />
          </div>


          {data.length > 0 && (
            <div className="charts-wrapper top-margin-reduced">
              <h2 className="section-title chart-title">スワップポイント推移チャート</h2>
              <HistoricalChart data={data} type="buy" ranking={buyRanking} />
              <HistoricalChart data={data} type="sell" ranking={sellRanking} />
            </div>
          )}
        </div>

        <footer className="post-footer">
          <p>※ データは各社公式サイトより毎日自動取得しています。</p>
        </footer>
      </article>

      {/* 2. 記事フィード */}
      <div id="new-articles" className="article-feed">
        <h2 className="feed-title">新着記事</h2>
        {articles.map((article) => {
          // Check if article is within 5 days
          const articleDate = new Date(article.date.replace(/\//g, '-'));
          const today = new Date();
          const diffTime = today.getTime() - articleDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isNew = diffDays <= 5;

          return (
            <article key={article.id} className="blog-post">
              <header className="post-header">
                <div className="post-meta" style={{ marginBottom: article.thumbnail ? '16px' : '0' }}>
                  <span className="post-date">{article.date}</span>
                  <span className="post-category">コラム</span>
                  {isNew && <span className="new-badge-article" style={{ marginLeft: '12px', verticalAlign: 'middle' }}>New</span>}
                </div>

                {article.thumbnail ? (
                  <div className="post-thumbnail-main" style={{ marginBottom: '8px' }}>
                    <Link href={`/articles/${article.id}`}>
                      <img src={article.thumbnail} alt={article.title} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'block' }} />
                    </Link>
                  </div>
                ) : (
                  <h2 className="post-title" style={{ marginBottom: '16px' }}>
                    <Link href={`/articles/${article.id}`} className={`title-link ${isNew ? 'new-article' : ''}`}>
                      {article.title}
                    </Link>
                  </h2>
                )}
              </header>

              <div className="post-excerpt" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="read-more-wrapper" style={{ marginTop: 0 }}>
                  <Link href={`/articles/${article.id}`} className="read-more-btn">続きを読む &raquo;</Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <style jsx global>{`
        /* Blog Post Styles */
        .blog-post {
          background: white;
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        .featured-post {
          border-top: 4px solid #3b82f6;
        }

        .post-header {
          margin-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 15px;
        }
        .post-meta {
          display: flex;
          gap: 10px;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
          align-items: center;
        }
        .post-category {
          background: #eff6ff;
          color: #3b82f6;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 500;
        }
        .post-date {
          font-family: 'Georgia', serif;
        }
        .post-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          line-height: 1.4;
          margin: 0;
        }
        .title-link {
          text-decoration: none;
          color: #111827;
          transition: color 0.2s;
        }
        .title-link:hover {
          color: #3b82f6;
        }
        .title-link.new-article {
          color: #ef4444; /* Red color for new articles */
        }
        .title-link.new-article:hover {
          color: #dc2626;
        }
        .new-badge-article {
          display: inline-block;
          margin-left: 8px;
          padding: 3px 8px;
          background-color: #fbbf24;
          color: #92400e;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 800;
          vertical-align: middle;
          animation: pulse 2s infinite;
        }

        .lead-text {
          font-size: 16px;
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 24px;
        }
        .internal-link {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.2s;
        }
        .internal-link:hover {
          color: #1d4ed8;
        }
        .section-title {
          font-size: 20px;
          border-left: 4px solid #3b82f6;
          padding-left: 12px;
          margin: 20px 0 15px 0; /* Reduced top/bottom margins slightly */
          color: #1f2937;
          font-weight: 700;
        }
        
        .ranking-wrapper {
             margin-bottom: 20px; /* Reduced from default default 40px inside component styling if overridden */
        }

        .ad-in-post {
          margin: 20px 0; /* Reduced from 30px */
          background: #f9fafb;
          padding: 10px;
          border-radius: 4px;
        }

        /* Reduced Spacing specifically for Chart Title */
        .top-margin-reduced .chart-title {
             margin-top: 10px; /* Significantly reduced top margin for visual proximity */
        }

        .post-footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px dashed #e5e7eb;
          font-size: 12px;
          color: #9ca3af;
          text-align: right;
        }

        .read-more-wrapper {
          margin-top: 15px;
        }
        .read-more-btn {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        }
        .read-more-btn:hover {
          background: #2563eb;
        }

        .feed-title {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 20px;
          padding-left: 10px;
          border-left: 3px solid #d1d5db;
        }

        /* Sidebar Widget Styles */
        .sidebar-widget {
          background: white;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          overflow: hidden;
          border: 1px solid #e5e7eb;
          box-sizing: border-box; /* Ensure border doesn't add to width */
          width: 100%; /* Ensure it takes full width of parent */
          max-width: 100%; /* Prevent overflow */
        }
        .widget-header {
          background: #f9fafb;
          padding: 12px 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        .widget-header h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #374151;
        }
        .widget-content, .profile-content {
          padding: 15px;
        }
        
        .risk-block, .disclaimer-block {
             font-size: 12px;
             line-height: 1.5;
             color: #4b5563;
        }
        .risk-block { background: #fee2e2; color: #7f1d1d; }
        .disclaimer-block { background: #fff7ed; color: #7c2d12; }

        /* Profile Styles */
        .profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        /* Removed .profile-icon-wrapper and img style since user asked to remove image */
        
        .profile-name {
          font-weight: 700;
          font-size: 16px;
          margin: 0;
        }
        .profile-desc {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }
        



        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Sidebar Article List */
        .sidebar-article-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .sidebar-article-item {
          border-bottom: 1px solid #f3f4f6;
          padding: 8px 0;
          margin-bottom: 4px;
          /* Flex or inline setup if needed, but span is inline by default */
        }
        .sidebar-article-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .sidebar-bullet {
          color: #6b7280;
          font-size: 12px;
        }
        .sidebar-article-date {
          /* display: block removed */
          font-size: 11px;
          color: #6b7280;
        }
        .sidebar-spacer {
          font-size: 12px;
        }
        .sidebar-article-link {
          display: inline; /* Changed from block */
          text-decoration: underline;
          color: #2563eb; 
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          transition: color 0.2s;
        }
        .sidebar-article-link:hover {
          color: #1d4ed8;
        }
        .sidebar-article-link.sidebar-new-article {
          color: #ef4444; /* Red color for new articles in sidebar */
          font-weight: 600;
        }
        .sidebar-article-link.sidebar-new-article:hover {
          color: #dc2626;
        }
        .sidebar-new-badge {
          display: inline-block;
          margin-left: 4px;
          padding: 2px 6px;
          background-color: #ef4444; /* Red background */
          color: #ffffff; /* White text */
          border-radius: 3px;
          font-size: 10px;
          font-weight: 800;
          vertical-align: middle;
          animation: pulse 2s infinite;
        }
        .blogmura-text-link {
          color: #2563eb;
          text-decoration: underline;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .blogmura-text-link:hover {
          color: #1d4ed8;
        }

        @media (max-width: 600px) {
           .blog-post { padding: 20px; }
           .post-title { font-size: 20px; }
        }

        .iine-banner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 88px;
          height: 31px;
          background: linear-gradient(to bottom, #ff9a9e 0%, #ff6a88 100%);
          color: white;
          font-size: 14px;
          font-weight: bold;
          border-radius: 4px;
          text-shadow: 0 1px 1px rgba(0,0,0,0.2);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          border: 1px solid #ff4757;
          text-decoration: none;
          line-height: 1;
        }
        .iine-banner:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
      `}</style>
    </BlogLayout>
  );
}
