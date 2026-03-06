import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { articles, Article } from '../../data/articles';
import { BlogLayout } from '../../components/BlogLayout';

interface ArticlePageProps {
  article: Article;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  if (!article) {
    return <div>記事が見つかりません。</div>;
  }

  // 2026/03/02以降の記事かどうかを判定
  const articleDate = new Date(article.date.replace(/\//g, '-'));
  const isAfterMarch2026 = articleDate >= new Date('2026-03-02');
  const isOldArticle = articleDate <= new Date('2026-02-28');

  // Simple Sidebar for article pages (can be empty or fixed)
  const sidebarContent = (
    <div className="article-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">最近の記事</h3>
        {articles.slice(0, 5).map(a => (
          <Link key={a.id} href={`/articles/${a.id}`} className="sidebar-article-link">
            {a.title}
          </Link>
        ))}
      </div>
      <style jsx>{`
        .sidebar-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .sidebar-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 12px;
          border-bottom: 2px solid #764ba2;
          padding-bottom: 5px;
        }
        .sidebar-article-link {
          display: block;
          font-size: 13px;
          color: #4b5563;
          text-decoration: none;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .sidebar-article-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );

  return (
    <BlogLayout sidebar={sidebarContent}>
      <Head>
        <title>{article.title} | トルコリラ・ウォッチ</title>
        <meta name="description" content={article.title} />
        {article.tags && article.tags.length > 0 && (
          <meta name="keywords" content={article.tags.join(', ')} />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* OGP Tags */}
        <meta property="og:site_name" content="トルコリラ・ウォッチ" />
        <meta property="og:title" content={article.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.lira-watch.sbs/articles/${article.id}`} />
        <meta
          property="og:image"
          content={article.thumbnail ? `https://www.lira-watch.sbs${article.thumbnail}` : "https://www.lira-watch.sbs/images/An_anime-style_Japanese_otaku_person_looking_at_a_-1757952948058.png"}
        />
        <meta property="og:description" content={article.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().substring(0, 100) + '...'} />
      </Head>

      <div className="content-wrapper">
        <article className="article">
          {/* サムネイル画像を本文中の最上部（タイトルの前）に配置（にほんブログ村等の軽量クローラー対応） */}
          {article.thumbnail && (
            <div className={`txt-img article-thumbnail-container ${isAfterMarch2026 ? 'cover-mode' : ''} ${isOldArticle ? 'old-article' : ''}`}>
              <img
                src={article.thumbnail}
                className="meta-thumbnail-image"
                alt={article.title}
              />
            </div>
          )}

          <div className="article-header">
            <span className="article-date">{article.date}</span>
            <h1 className="article-title">{article.title}</h1>
            {article.tags && article.tags.length > 0 && (
              <div className="article-tags top-tags">
                {article.tags.map(tag => (
                  <span key={tag} className="article-tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        <div className="back-link">
          <Link href="/">トップページへ戻る</Link>
        </div>
      </div>

      <style jsx>{`
        .content-wrapper {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .article-header {
          margin-bottom: 32px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 16px;
        }
        .article-date {
          color: #6b7280;
          font-size: 14px;
        }
        .article-title {
          font-size: 28px;
          color: #1f2937;
          margin-bottom: 20px;
          line-height: 1.3;
          white-space: pre-wrap;
        }
        .article-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .article-tags.top-tags {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed #e2e8f0;
        }
        .article-tag {
          font-size: 14px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
        }
        
        .article-body :global(h3) {
          font-size: 22px;
          color: #1f2937;
          border-left: 5px solid #764ba2;
          padding-left: 12px;
          margin-top: 40px;
          margin-bottom: 16px;
        }
        .article-body :global(h3:first-child) {
          margin-top: 0;
        }
        .article-body :global(.campaign-title) {
           font-weight: bold;
           color: #4b5563;
           font-size: 18px;
           margin-bottom: 16px;
        }
        
        .article-thumbnail-container {
          width: 100%;
          aspect-ratio: 4 / 3;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 0 32px 0;
        }

        .article-thumbnail-container.old-article {
          aspect-ratio: auto;
          background: transparent;
        }

        .article-thumbnail-container.cover-mode {
          background: transparent;
        }
        
        .meta-thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .article-thumbnail-container.cover-mode .meta-thumbnail-image {
          object-fit: cover;
        }
        .article-body :global(.campaign-details) {
           background: #f8fafc;
           padding: 20px;
           border-radius: 8px;
           border: 1px solid #e2e8f0;
        }
        .article-body :global(p) {
          line-height: 1.8;
          color: #374151;
          margin-bottom: 12px;
        }
        .article-body :global(strong) {
          color: #1f2937;
        }

        .article-body :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        
        .article-body :global(a) {
          color: #2563eb;
          text-decoration: underline;
          word-break: break-all;
        }
        
        .article-body :global(a:hover) {
          color: #1d4ed8;
        }

        /* Table Styles */
        .article-body :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
          font-size: 14px;
        }
        .article-body :global(th),
        .article-body :global(td) {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
          word-break: break-word;
        }
        .article-body :global(th) {
          background-color: #f8fafc;
          font-weight: 600;
          color: #1f2937;
        }
        .article-body :global(tr:nth-child(even)) {
          background-color: #f9fafb;
        }
        /* List Styles including OL */
        .article-body :global(ul),
        .article-body :global(ol) {
          padding-left: 24px;
          margin-bottom: 24px;
        }
        .article-body :global(li) {
          margin-bottom: 8px;
          color: #374151;
        }

        .back-link {
          margin-top: 40px;
          text-align: center;
        }
        .back-link a {
          display: inline-block;
          padding: 12px 24px;
          background: #f3f4f6;
          color: #4b5563;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .back-link a:hover {
          background: #e5e7eb;
        }

        @media (max-width: 600px) {
          .content-wrapper {
            padding: 24px 16px !important;
            border-radius: 8px !important;
            margin: 0 !important;
          }
          .article-title {
            font-size: 20px !important;
            line-height: 1.4 !important;
          }
          .article-body :global(p) {
            text-indent: 1em !important;
            padding: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            text-align: justify;
          }
          .article-body :global(h3) {
            font-size: 18px !important;
            margin-left: 0 !important;
            margin-top: 32px !important;
          }
          .article-body :global(ul),
          .article-body :global(ol) {
            padding-left: 1.5em !important;
            padding-right: 0 !important;
          }
          .article-body :global(table) {
            font-size: 11px !important;
            display: block !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
          }
          .article-body :global(th),
          .article-body :global(td) {
            padding: 8px 4px !important;
          }
          .article-body :global(.campaign-details) {
            padding: 16px !important;
            margin: 16px -8px !important;
            border-radius: 4px !important;
          }
        }
      `}</style>
      <style jsx global>{`
        @media (max-width: 600px) {
          .article-body p {
             text-indent: 1em !important;
             padding: 0 !important;
             margin: 0 0 16px 0 !important;
          }
        }
      `}</style>
    </BlogLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = articles.map((article) => ({
    params: { id: article.id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const article = articles.find((a) => a.id === params?.id);
  return {
    props: {
      article,
    },
  };
};
