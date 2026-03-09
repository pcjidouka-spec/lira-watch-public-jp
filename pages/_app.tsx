import type { AppProps } from 'next/app';
import Script from 'next/script';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-6343144082717938';
  
  return (
    <>
      {/* Google AdSenseスクリプト（全ページで一度だけ読み込む） */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <Component {...pageProps} />
    </>
  );
}


