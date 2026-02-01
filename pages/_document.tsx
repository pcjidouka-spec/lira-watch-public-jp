import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="ja">
            <Head>
                {/* Default Title for SEO */}
                <title>トルコリラ・ウォッチ | lira-watch.sbs - TRY/JPYスワップポイント比較ブログ</title>
                <meta name="description" content="トルコリラ円（TRY/JPY）の各FX会社のスワップポイントを毎日比較・アーカイブ。高金利通貨トルコリラの最新スワップポイントランキング、推移チャート、キャンペーン情報を網羅。" />

                {/* AI Learning Opt-Out (Allow crawling but prevent training) */}
                <meta name="robots" content="index, follow, max-image-preview:large" />
                <meta name="googlebot" content="index, follow" />
                <meta name="google" content="notranslate" />
                <meta name="google-extended" content="noindex" />
                <meta name="CCBot" content="noindex" />
                <meta name="GPTBot" content="noindex" />
                <meta name="anthropic-ai" content="noindex" />

                {/* Google Tag Manager */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P83RD2MT');`,
                    }}
                />
                {/* End Google Tag Manager */}
                <link rel="icon" href="/favicon.png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* RSS Feed */}
                <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="https://www.lira-watch.sbs/rss.xml" />
            </Head>
            <body>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-P83RD2MT"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>
                {/* End Google Tag Manager (noscript) */}
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
