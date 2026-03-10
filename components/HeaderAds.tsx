import React, { useState, useEffect } from 'react';
import { AD_ITEMS, AdItem } from '../data/ad_items';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";
const ROTATE_INTERVAL_MS = 5000; // 5秒ごとにバナー切り替え

interface HeaderAdsProps {
    position: 'left' | 'right';
}

export const HeaderAds: React.FC<HeaderAdsProps> = ({ position }) => {
    const [mounted, setMounted] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    const half = Math.ceil(AD_ITEMS.length / 2);
    const items = position === 'left' ? AD_ITEMS.slice(0, half) : AD_ITEMS.slice(half);

    useEffect(() => {
        if (!mounted || items.length <= 1) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, ROTATE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [mounted, items.length]);

    if (!mounted) {
        return <div className={`header-ads-container ${position}`}></div>;
    }

    const currentItem = items[activeIndex] as AdItem;

    return (
        <div className={`header-ads-container ${position}`}>
            <a
                href={currentItem.url}
                target="_blank"
                rel="nofollow sponsored"
                className="header-ad-item"
                title={currentItem.title}
            >
                <img
                    src={currentItem.image || AMAZON_LOGO_URL}
                    alt={currentItem.title}
                    style={!currentItem.image ? { padding: '10px', objectFit: 'contain' } : undefined}
                />
                {currentItem.trackingPixel && (
                    <img src={currentItem.trackingPixel} alt="" style={{ display: 'none' }} width="1" height="1" />
                )}
            </a>
            <div className="header-ads-dots">
                {items.map((_, idx) => (
                    <span
                        key={idx}
                        className={`dot ${idx === activeIndex ? 'active' : ''}`}
                        aria-hidden
                    />
                ))}
            </div>
            <style jsx>{`
                .header-ads-container {
                    width: 480px;
                    flex-shrink: 0;
                    height: 220px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .header-ad-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                    height: 100px;
                    flex: 1;
                }
                .header-ad-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .header-ad-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .header-ads-dots {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                }
                .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #ccc;
                    transition: background 0.3s;
                }
                .dot.active {
                    background: #667eea;
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
