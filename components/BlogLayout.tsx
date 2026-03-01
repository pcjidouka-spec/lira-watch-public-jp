import React, { ReactNode } from 'react';
import Link from 'next/link';
import { BlogmuraButtons } from './BlogmuraButtons';
import { HeaderAds } from './HeaderAds';
import { MobileBottomAds } from './MobileBottomAds';
import { MobileArticleDrawer } from './MobileArticleDrawer';

interface BlogLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  lastUpdated?: string;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children, sidebar, lastUpdated }) => {
  return (
    <div className="blog-container">
      <header className="header">
        <div className="header-wrapper">
          <HeaderAds position="left" />

          <div className="header-content">
            <div className="logo-section">
              <img
                src="/images/An_anime-style_Japanese_otaku_person_looking_at_a_-1757952948058.png"
                alt="トルコリラ・ウォッチ ロゴ"
                className="logo-image"
              />
              <h1 className="site-title">トルコリラ・ウォッチ</h1>
            </div>
            <p className="site-subtitle">TRY/JPY スワップポイント比較・運用ブログ</p>
            {lastUpdated && <p className="last-updated">最終更新: {lastUpdated}</p>}
          </div>

          <HeaderAds position="right" />
        </div>
      </header>

      <div className="main-wrapper">
        <div className="content-grid">
          <main className="main-column">
            {children}
          </main>
          <aside className="sidebar-column">
            {sidebar}
          </aside>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <BlogmuraButtons style={{ marginBottom: '16px' }} />
          <div className="blogmura-blogparts" data-chid="11211368" data-category="6750" data-type="pv"></div>
          <script src="https://blogparts.blogmura.com/js/parts_view.js" async></script>
          <p className="copyright">&copy; 2026 トルコリラ・ウォッチ (lira-watch.sbs)</p>
          <div className="footer-links">
            <Link href="/privacy">プライバシーポリシー</Link> | <Link href="/contact">お問い合わせ</Link> | <Link href="/operator">運営者情報</Link>
          </div>
        </div>
      </footer>

      {/* モバイル用ボトム広告 */}
      <MobileBottomAds />

      {/* モバイル用記事一覧ドロワー */}
      <MobileArticleDrawer />


      <style jsx>{`
        .blog-container {
          min-height: 100vh;
          background: #f3f4f6; /* 少しグレーを濃くしてブログっぽく */
        }
        
        /* Header Styles */
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 20px; /* Reduced from 20px */
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: 1400px; /* 広げる */
          margin: 0 auto;
          gap: 20px;
        }
        .header-content {
          max-width: 800px;
          flex-grow: 1;
        }
        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 5px; /* Reduced from 10px */
        }
        .logo-image {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border-radius: 50%; /* ロゴを丸く */
          background: white;
          padding: 2px;
        }
        .site-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        .site-subtitle {
          font-size: 15px;
          margin: 0;
          opacity: 0.9;
        }
        .last-updated {
          font-size: 12px;
          margin-top: 5px;
          opacity: 0.8;
          display: inline-block;
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 12px;
        }

        /* Layout Grid */
        .main-wrapper {
          max-width: 1240px; /* 少し広めに */
          margin: 0 auto;
          padding: 15px; /* Reduced from 20px */
        }
        .content-grid {
          display: grid;
          grid-template-columns: 3fr 1fr; /* サイドバーを可変幅（約25%）に変更 */
          gap: 20px; /* Reduced from 30px */
          align-items: start;
        }

        .main-column {
          /* メインコンテンツ */
          min-width: 0; /* Grid overflow対策 */
        }
        
        .sidebar-column {
          /* サイドバーコンテンツ */
          display: flex;
          flex-direction: column;
          gap: 12px; /* Reduced from 20px */
          width: 100%; /* Ensure it fills the grid track */
          max-width: 100%; /* Prevent expanding beyond grid track */
          overflow-x: hidden; /* Cut off any horizontal overflow */
        }

        /* Footer Styles */
        .footer {
          background: #1f2937;
          color: white;
          padding: 20px 20px; /* Reduced from 30px 20px */
          margin-top: 25px; /* Reduced from 40px */
          text-align: center;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .copyright {
          font-size: 12px;
          opacity: 0.8;
          margin: 0;
        }
        .footer-links {
          font-size: 12px;
        }
        .footer-links :global(a) {
          color: #d1d5db;
          text-decoration: none;
          margin: 0 5px;
        }
        .footer-links :global(a:hover) {
          color: white;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .content-grid {
            grid-template-columns: 1fr; /* 1カラムに */
            gap: 20px;
          }
          .sidebar-column {
             /* モバイル時はメインの下に配置される（デフォルト） */
          }
          .main-wrapper {
            padding: 15px;
          }
        }
        
        @media (max-width: 480px) {
           .header { padding: 20px 15px; }
           .site-title { font-size: 22px; }
           .logo-image { width: 40px; height: 40px; }
           .main-wrapper { padding: 10px; }
        }
      `}</style>
    </div>
  );
};
