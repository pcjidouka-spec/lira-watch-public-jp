import React from 'react';

// Amazon アソシエイトID
const AMAZON_ASSOCIATE_ID = 'lirawatch-22';

// Amazon商品画像のベースURL
const AMAZON_IMAGE_BASE = 'https://ws-fe.amazon-adsystem.com/widgets/q';

interface AmazonItemProps {
    asin: string;
    title?: string;
    size?: 'small' | 'medium' | 'large';
}

/**
 * Amazonアフィリエイトリンクコンポーネント
 * 
 * 使用例:
 * <AmazonItem asin="B0XXXXXX" />
 * <AmazonItem asin="B0XXXXXX" title="商品名" size="large" />
 */
export const AmazonItem: React.FC<AmazonItemProps> = ({
    asin,
    title = 'Amazon商品',
    size = 'medium'
}) => {
    // サイズに応じた画像サイズ
    const imageSizes = {
        small: { width: 75, height: 75 },
        medium: { width: 160, height: 160 },
        large: { width: 300, height: 300 }
    };

    const { width, height } = imageSizes[size];

    // Amazon商品ページへのリンク
    const productUrl = `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_ASSOCIATE_ID}`;

    // Amazon PA-API を使わない画像URL（Product Advertising API不要）
    const imageUrl = `${AMAZON_IMAGE_BASE}?_encoding=UTF8&ASIN=${asin}&Format=_SL${width}_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=${AMAZON_ASSOCIATE_ID}`;

    return (
        <a
            href={productUrl}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="amazon-item"
            title={title}
        >
            <img
                src={imageUrl}
                alt={title}
                width={width}
                height={height}
                loading="lazy"
            />
            <style jsx>{`
                .amazon-item {
                    display: inline-block;
                    background: white;
                    border-radius: 8px;
                    padding: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .amazon-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                .amazon-item img {
                    display: block;
                    object-fit: contain;
                }
            `}</style>
        </a>
    );
};

interface AmazonTextLinkProps {
    asin: string;
    children: React.ReactNode;
}

/**
 * Amazonアフィリエイトテキストリンクコンポーネント
 * 
 * 使用例:
 * <AmazonTextLink asin="B0XXXXXX">この商品をチェック</AmazonTextLink>
 */
export const AmazonTextLink: React.FC<AmazonTextLinkProps> = ({ asin, children }) => {
    const productUrl = `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_ASSOCIATE_ID}`;

    return (
        <a
            href={productUrl}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="amazon-text-link"
        >
            {children}
            <style jsx>{`
                .amazon-text-link {
                    color: #ff9900;
                    text-decoration: underline;
                    font-weight: 500;
                }
                .amazon-text-link:hover {
                    color: #cc7a00;
                }
            `}</style>
        </a>
    );
};

interface AmazonCardProps {
    asin: string;
    title: string;
    description?: string;
}

/**
 * Amazon商品カードコンポーネント（タイトル・説明付き）
 * 
 * 使用例:
 * <AmazonCard asin="B0XXXXXX" title="商品名" description="おすすめポイント" />
 */
export const AmazonCard: React.FC<AmazonCardProps> = ({ asin, title, description }) => {
    const productUrl = `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_ASSOCIATE_ID}`;
    const imageUrl = `${AMAZON_IMAGE_BASE}?_encoding=UTF8&ASIN=${asin}&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=${AMAZON_ASSOCIATE_ID}`;

    return (
        <div className="amazon-card">
            <a href={productUrl} target="_blank" rel="nofollow sponsored noopener">
                <img src={imageUrl} alt={title} loading="lazy" />
            </a>
            <div className="amazon-card-content">
                <a href={productUrl} target="_blank" rel="nofollow sponsored noopener" className="amazon-card-title">
                    {title}
                </a>
                {description && <p className="amazon-card-desc">{description}</p>}
                <a href={productUrl} target="_blank" rel="nofollow sponsored noopener" className="amazon-card-button">
                    Amazonで見る
                </a>
            </div>
            <style jsx>{`
                .amazon-card {
                    display: flex;
                    gap: 16px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px 0;
                }
                .amazon-card img {
                    width: 120px;
                    height: 120px;
                    object-fit: contain;
                    flex-shrink: 0;
                }
                .amazon-card-content {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .amazon-card-title {
                    font-weight: 600;
                    color: #111827;
                    text-decoration: none;
                    line-height: 1.4;
                }
                .amazon-card-title:hover {
                    color: #ff9900;
                    text-decoration: underline;
                }
                .amazon-card-desc {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0;
                    line-height: 1.5;
                }
                .amazon-card-button {
                    display: inline-block;
                    background: #ff9900;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    margin-top: auto;
                    width: fit-content;
                }
                .amazon-card-button:hover {
                    background: #e68a00;
                }
                @media (max-width: 480px) {
                    .amazon-card {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};

// ... existing components ...

interface AmazonIframeProps {
    asin: string;
    width?: number;
    height?: number;
}

/**
 * Amazonアフィリエイト iFrameリンクコンポーネント
 * Next.jsでscriptタグがブロックされる場合や、画像が表示されない場合の代替手段として使用します。
 * 
 * 使用例:
 * <AmazonIframe asin="B0XXXXXX" />
 */
export const AmazonIframe: React.FC<AmazonIframeProps> = ({
    asin,
    width = 120,
    height = 240
}) => {
    // Amazon iFrame URL (Product Link)
    const src = `https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=8&l=as4&f=ifr&ref=ss_til&asins=${asin}&t=${AMAZON_ASSOCIATE_ID}&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&lt1=_blank&m=amazon`;

    return (
        <iframe
            src={src}
            style={{ width: `${width}px`, height: `${height}px`, border: 'none', overflow: 'hidden' }}
            scrolling="no"
            marginWidth={0}
            marginHeight={0}
            frameBorder={0}
            title={`Amazon Product ${asin}`}
        />
    );
};
