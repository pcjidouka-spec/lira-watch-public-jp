import React from 'react';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";

// 商品情報（ユーザー様にて画像URLをSiteStripeから取得して差し替えてください）
const AD_ITEMS = [
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

interface HeaderAdsProps {
    position: 'left' | 'right';
}

export const HeaderAds: React.FC<HeaderAdsProps> = ({ position }) => {
    // リンクを左右に分割
    const half = Math.ceil(AD_ITEMS.length / 2);
    const items = position === 'left' ? AD_ITEMS.slice(0, half) : AD_ITEMS.slice(half);

    return (
        <div className={`header-ads-container ${position}`}>
            {items.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="nofollow sponsored" className="header-ad-item" title={item.title}>
                    <img
                        src={item.image || AMAZON_LOGO_URL}
                        alt={item.title}
                        style={!item.image ? { padding: '10px', objectFit: 'contain' } : undefined}
                    />
                </a>
            ))}
            <style jsx>{`
                .header-ads-container {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(2, 50px);
                    gap: 8px;
                    width: 240px;
                    flex-shrink: 0;
                }
                .header-ad-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                    height: 100%;
                }
                .header-ad-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .header-ad-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                @media (max-width: 1200px) {
                    .header-ads-container {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};
