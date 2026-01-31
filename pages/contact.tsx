import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
    return (
        <>
            <Head>
                <title>お問い合わせ | トルコリラ・ウォッチ</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                        <h1>お問い合わせ</h1>

                        <p>当サイトに関するご連絡がある場合は、以下の方法にてお願いいたします。</p>

                        <div className="note-box">
                            <p>※ 内容によっては返信できない場合があります。</p>
                            <p>※ 営業・勧誘・セールス目的のご連絡には対応しておりません。</p>
                        </div>

                        <section className="contact-method">
                            <h2>【お問い合わせ方法】</h2>
                            <div className="method-item">
                                <h3>・メールアドレス</h3>
                                <p className="email">pcjidouka@gmail.com</p>
                            </div>
                        </section>

                        <div className="back-link">
                            <Link href="/">トップページへ戻る</Link>
                        </div>
                    </div>
                </main>

                <footer className="footer">
                    <div className="footer-content">
                        <p className="copyright">&copy; 2026 トルコリラ・ウォッチ (lira-watch.sbs)</p>
                        <div className="footer-links">
                            <Link href="/privacy">プライバシーポリシー</Link> | <span className="current-page">お問い合わせ</span> | <Link href="/operator">運営者情報</Link>
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
        h1 {
          font-size: 28px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 16px;
          margin-bottom: 32px;
          color: #1f2937;
        }
        h2 {
          font-size: 20px;
          color: #374151;
          margin-bottom: 16px;
          border-left: 4px solid #764ba2;
          padding-left: 12px;
        }
        h3 {
          font-size: 18px;
          color: #4b5563;
          margin-bottom: 8px;
        }
        p {
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 16px;
        }
        .note-box {
          background-color: #fef2f2;
          border: 1px solid #fee2e2;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 32px;
        }
        .note-box p {
          color: #b91c1c;
          margin-bottom: 4px;
          font-size: 14px;
        }
        .note-box p:last-child {
          margin-bottom: 0;
        }
        .email {
          font-family: monospace;
          background: #f3f4f6;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
          font-size: 16px;
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
          text-align: center;
        }
        .footer-content {
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
        .footer-links a {
            color: #d1d5db;
            text-decoration: none;
            margin: 0 5px;
        }
        .footer-links a:hover {
            color: white;
            text-decoration: underline;
        }
        .current-page {
            color: white;
            font-weight: bold;
            margin: 0 5px;
        }
        @media (max-width: 600px) {
          .content-wrapper {
            padding: 24px;
          }
          h1 {
            font-size: 24px;
          }
        }
      `}</style>
        </>
    );
}
