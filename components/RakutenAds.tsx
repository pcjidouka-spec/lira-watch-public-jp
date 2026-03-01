import React from 'react';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";

// Amazon商品データ
const AMAZON_ITEMS = [
  { url: "https://amzn.to/4r6Fldk", title: "アマノフーズ フリーズドライ 味噌汁 うちのおみそ汁 4種25食 詰め合わせ", image: "https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B096XFF3XQ&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=lirawatch-22" },
  { url: "https://amzn.to/46zu7GH", title: "ライオン Systema SP-T メディカルガーグル 100ml (3本)", image: "https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00YTZ12HM&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=lirawatch-22" },
  { url: "https://amzn.to/4aZuvzy", title: "タオル研究所 [ボリュームリッチ] #003 バスタオル", image: "https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B086WB3NVX&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=lirawatch-22" },
  { url: "https://amzn.to/403b6c4", title: "丸島醤油 つゆの素 ＜210g＞×6袋セット", image: "https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0763LX8ZJ&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=lirawatch-22" },
  { url: "https://amzn.to/403b6c4", title: "丸島醤油 つゆの素", image: "https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0763LX8ZJ&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=lirawatch-22" },
  { url: "https://amzn.to/45Jtjia", title: "Amazon 緑茶ラベルレス 500ml", image: "" },
  { url: "https://amzn.to/4a7WrB0", title: "DANISH ENDURANCE ソックス", image: "" },
  { url: "https://amzn.to/4tf8gy8", title: "Amazon商品", image: "" },
  { url: "https://amzn.to/4aayIAc", title: "Amazon商品", image: "" },
  { url: "https://amzn.to/4buP4Gc", title: "Amazon商品", image: "" },
  { url: "https://amzn.to/4aoR4ys", title: "TRUSCO 新聞紙・雑誌ストッカー", image: "" },
  { url: "https://amzn.to/4qsIy6J", title: "JAKS ホエイプロテイン", image: "" },
  { url: "https://amzn.to/4k5fBMg", title: "ハウス とろうま牛角煮カレー", image: "" },
  { url: "https://amzn.to/4qPUQa1", title: "熊野油脂 馬油シャンプー", image: "" },
  { url: "https://amzn.to/46n6HUG", title: "熊野油脂 馬油コンディショナー", image: "" },
  { url: "https://amzn.to/3LXL9Hw", title: "TRUSCO 新聞紙・雑誌ストッカー", image: "" },
  { url: "https://amzn.to/4qRjRBS", title: "ナカノ スタイリング タントN", image: "" },
  { url: "https://amzn.to/3M6E5br", title: "有機黒ごまペースト", image: "" },
  { url: "https://amzn.to/4rp4BvU", title: "キッチン・ドレイン・ネオ", image: "" },
  { url: "https://amzn.to/4qKMznP", title: "馬油シャンプー 詰替", image: "" },
  { url: "https://amzn.to/3LMrlXA", title: "Amazon商品", image: "" }
];

export const RakutenAds: React.FC = () => {
  return (
    <div className="sidebar-widget">
      <div className="widget-header">
        <h3>おすすめ情報</h3>
      </div>
      <div className="widget-content">
        {/* Amazon Items Section */}
        <div className="amazon-grid">
          {AMAZON_ITEMS.map((item, idx) => (
            <a key={idx} href={item.url} target="_blank" rel="nofollow sponsored" className="amazon-item" title={item.title}>
              <img
                src={item.image || AMAZON_LOGO_URL}
                alt={item.title}
                style={!item.image ? { padding: '5px', objectFit: 'contain' } : undefined}
              />
            </a>
          ))}
        </div>

        <div className="separator" />

        {/* Rakuten Items Section (Smaller) */}
        <div className="rakuten-grid">
          {/* Ad 1: Rakuten Travel */}
          <div className="rakuten-item">
            <a href="https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+6I9N5&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa26011467448_4AV5OF_1VA04Y_2HOM_6I9N5%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F" rel="nofollow" target="_blank">
              <img src="https://hbb.afl.rakuten.co.jp/hsb/0ea7f9a4.79280dcb.0ea7f99d.1ac92fca/153145/" alt="Rakuten Travel" />
            </a>
            <img width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4AV5OF+1VA04Y+2HOM+6I9N5" alt="" style={{ border: 0 }} />
          </div>

          {/* Ad 3: Rakuten Ichiba */}
          <div className="rakuten-item">
            <a href="https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+656YP&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26011467448_4AV5OF_1VA04Y_2HOM_656YP%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F" rel="nofollow" target="_blank">
              <img src="https://hbb.afl.rakuten.co.jp/hsb/0ec09ba3.bc2429d5.0eb4bbaa.95151395/" alt="Rakuten Ichiba" />
            </a>
            <img width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=4AV5OF+1VA04Y+2HOM+656YP" alt="" style={{ border: 0 }} />
          </div>
        </div>

        <style jsx>{`
          .amazon-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 20px;
          }
          .amazon-item {
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            aspect-ratio: 1;
            transition: transform 0.2s;
          }
          .amazon-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .amazon-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .separator {
            height: 1px;
            background: #e5e7eb;
            margin: 15px 0;
          }

          .rakuten-grid {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
          }
          .rakuten-item {
            /* 楽天広告を小さく表示 (60%程度) */
            width: 120px; 
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f9fafb;
            padding: 5px;
            border-radius: 4px;
          }
          .rakuten-item img {
            width: 100%;
            height: auto;
            border: 0;
          }

          @media (max-width: 480px) {
            .amazon-grid {
                grid-template-columns: repeat(3, 1fr);
            }
          }
        `}</style>
      </div>
    </div>
  );
};
