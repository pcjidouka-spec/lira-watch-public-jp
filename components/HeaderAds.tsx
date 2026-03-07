import React, { useState, useEffect } from 'react';
import { AD_ITEMS, AdItem } from '../data/ad_items';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";

// 商品情報（楽天おすすめ情報）
// Moved to data/ad_items.ts

interface HeaderAdsProps {
    position: 'left' | 'right';
}

export const HeaderAds: React.FC<HeaderAdsProps> = ({ position }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // リンクを左右に分割
    const half = Math.ceil(AD_ITEMS.length / 2);
    const items = position === 'left' ? AD_ITEMS.slice(0, half) : AD_ITEMS.slice(half);

    if (!mounted) {
        return <div className={`header-ads-container ${position}`}></div>; // SSR時は空のコンテナを返す
    }

    return (
        <div className={`header-ads-container ${position}`}>
            {items.map((item: AdItem, idx: number) => (
                <a key={idx} href={item.url} target="_blank" rel="nofollow sponsored" className="header-ad-item" title={item.title}>
                    <img
                        src={item.image || AMAZON_LOGO_URL}
                        alt={item.title}
                        style={!item.image ? { padding: '10px', objectFit: 'contain' } : undefined}
                    />
                    {item.trackingPixel && (
                        <img src={item.trackingPixel} alt="" style={{ display: 'none' }} width="1" height="1" />
                    )}
                </a>
            ))}
            <style jsx>{`
                .header-ads-container {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    /* grid-template-rows: repeat(2, 50px);  <- Removed to allow scrolling/height adjustment */
                    gap: 8px;
                    width: 240px;
                    flex-shrink: 0;
                    
                    /* Scrollable Area Settings */
                    height: 110px; /* Approximately 2 rows + gap */
                    overflow-y: auto;
                    padding-right: 4px; /* Space for scrollbar */
                }
                
                /* Custom Scrollbar */
                .header-ads-container::-webkit-scrollbar {
                    width: 6px;
                }
                .header-ads-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                .header-ads-container::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 3px;
                }
                .header-ads-container::-webkit-scrollbar-thumb:hover {
                    background: #999;
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
                    height: 50px;
                }
                .header-ad-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .header-ad-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
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
