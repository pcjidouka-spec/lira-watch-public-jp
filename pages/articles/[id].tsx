import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';
import { articles, Article } from '../../data/articles';

interface ArticlePageProps {
  article: Article;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  if (!article) {
    return <div>記事が見つかりません。</div>;
  }

  return (
    <>
      <Head>
        <title>{article.title} | トルコリラ・ウォッチ</title>
        <meta name="description" content={article.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* OGP Tags */}
        <meta property="og:title" content={`${article.title} | トルコリラ・ウォッチ`} />
        <meta property="og:description" content={article.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://lira-watch.sbs/articles/${article.id}`} />
        <meta property="og:image" content="https://lira-watch.sbs/images/An_anime-style_Japanese_otaku_person_looking_at_a_-1757952948058.png" />
      </Head>

      <div className="container">
        <header className="header">
          <div className="header-content">
            <Link href="/" className="site-title-link">
              <h1 className="site-title">トルコリラ・ウォッチ</h1>
            </Link>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            <article className="article">
              <div className="article-header">
                <span className="article-date">{article.date}</span>
                <h1 className="article-title">{article.title}</h1>
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
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p className="copyright">&copy; 2026 トルコリラ・ウォッチ (lira-watch.sbs)</p>
            <div className="footer-links">
              <Link href="/privacy">プライバシーポリシー</Link> | <Link href="/contact">お問い合わせ</Link> | <Link href="/operator">運営者情報</Link>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .site-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: white;
          cursor: pointer;
        }
        .site-title-link {
          text-decoration: none;
        }
        .main-content {
          flex: 1;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          width: 100%;
          box-sizing: border-box;
        }
        .content-wrapper {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
          margin-top: 8px;
          margin-bottom: 0px;
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
        
        .article-body :global(a) {
          color: #2563eb;
          text-decoration: underline;
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
        }
        .article-body :global(th) {
          background-color: #f8fafc;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
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
        .footer {
          background: #1f2937;
          color: white;
          padding: 24px;
          margin-top: 8px;
          text-align: center;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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

        @media (max-width: 600px) {
          .main-content {
            padding: 16px 12px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
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
    </>
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
