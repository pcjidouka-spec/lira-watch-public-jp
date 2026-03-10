import React, { useState, useEffect } from 'react';
import { AD_ITEMS, AdItem } from '../data/ad_items';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";

interface HeaderAdsProps {
    position: 'left' | 'right';
}

export const HeaderAds: React.FC<HeaderAdsProps> = ({ position }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const half = Math.ceil(AD_ITEMS.length / 2);
    const items = position === 'left' ? AD_ITEMS.slice(0, 2) : AD_ITEMS.slice(half, half + 2);

    if (!mounted) {
        return <div className={`header-ads-container ${position}`}></div>;
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
                    width: 360px;
                    flex-shrink: 0;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }

                .header-ad-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                    height: 75px;
                }
                .header-ad-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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
