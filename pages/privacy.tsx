import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
    return (
        <>
            <Head>
                <title>プライバシーポリシー | トルコリラ・ウォッチ</title>
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
                        <h1>プライバシーポリシー</h1>

                        <p>当サイト（以下、「当サイト」といいます）では、個人情報の取り扱いについて、以下のとおり定めます。</p>

                        <section>
                            <h2>1. 個人情報の取得について</h2>
                            <p>当サイトでは、通常の閲覧において、氏名、住所、電話番号等の個人情報を取得することはありません。</p>
                            <p>ただし、お問い合わせの際に、メールアドレス等の個人情報をご入力いただく場合があります。</p>
                        </section>

                        <section>
                            <h2>2. 個人情報の利用目的</h2>
                            <p>取得した個人情報は、お問い合わせへの対応のためにのみ利用します。</p>
                            <p>なお、すべてのお問い合わせに対して返信を行うことをお約束するものではありません。</p>
                        </section>

                        <section>
                            <h2>3. 個人情報の管理について</h2>
                            <p>取得した個人情報は、必要な対応が完了次第、適切な方法により速やかに削除または破棄します。</p>
                            <p>当サイトでは、個人情報を長期的に保管・蓄積することはありません。</p>
                        </section>

                        <section>
                            <h2>4. 個人情報の第三者への開示</h2>
                            <p>取得した個人情報は、法令に基づく場合を除き、第三者に開示または提供することはありません。</p>
                        </section>

                        <section>
                            <h2>5. 広告について</h2>
                            <p>当サイトでは、第三者配信の広告サービス「Google AdSense」を利用しています。</p>
                            <p>Googleなどの第三者配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie（クッキー）を使用することがあります。</p>
                            <p>Cookie を使用することで、当サイトや他サイトへの過去のアクセス情報に基づいて広告が配信されますが、氏名、住所、メールアドレス、電話番号などの個人を特定する情報は含まれません。</p>
                            <p>ユーザーは、広告設定によりパーソナライズ広告を無効にすることができます。</p>
                            <p>また、<a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a> にアクセスすることで、第三者配信事業者による Cookie の使用を無効にすることが可能です。</p>
                        </section>

                        <section>
                            <h2>6. アクセス解析ツールについて</h2>
                            <p>当サイトでは、アクセス解析ツールとして Google Analytics を利用する場合があります。</p>
                            <p>Google Analytics は、トラフィックデータの収集のために Cookie を使用しています。</p>
                            <p>これらのデータは匿名で収集されており、個人を特定するものではありません。</p>
                        </section>

                        <section>
                            <h2>7. 免責事項</h2>
                            <p>当サイトに掲載する情報については、できる限り正確な内容を掲載するよう努めていますが、正確性や安全性を保証するものではありません。</p>
                            <p>当サイトの情報を利用することで生じた損害等について、当サイトでは一切の責任を負いかねます。</p>
                        </section>

                        <section>
                            <h2>8. プライバシーポリシーの変更</h2>
                            <p>当サイトは、必要に応じて本ポリシーの内容を変更することがあります。</p>
                            <p>変更後のプライバシーポリシーは、本ページにて公開します。</p>
                        </section>

                        <div className="footer-info">
                            <p>制定日：2026年1月</p>
                            <p>運営者：トルコリラ・ウォッチ (lira-watch.sbs)</p>
                        </div>

                        <div className="back-link">
                            <Link href="/">トップページへ戻る</Link>
                        </div>
                    </div>
                </main>

                <footer className="footer">
                    <div className="footer-content">
                        <p className="copyright">&copy; 2026 トルコリラ・ウォッチ (lira-watch.sbs)</p>
                        <div className="footer-links">
                            <span className="current-page">プライバシーポリシー</span> | <Link href="/contact">お問い合わせ</Link> | <Link href="/operator">運営者情報</Link>
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
          margin-top: 32px;
          margin-bottom: 16px;
          border-left: 4px solid #764ba2;
          padding-left: 12px;
        }
        p {
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 16px;
        }
        .footer-info {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: right;
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
