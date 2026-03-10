import React, { useState, useEffect } from 'react';
import { AD_ITEMS } from '../data/ad_items';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";
const ROTATE_INTERVAL_MS = 5000;

export const MobileBottomAds: React.FC = () => {
    const [isDismissed, setIsDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeSetIndex, setActiveSetIndex] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || isDismissed || AD_ITEMS.length === 0) return;
        const setCount = Math.ceil(AD_ITEMS.length / 3) || 1;
        const timer = setInterval(() => {
            setActiveSetIndex((prev) => (prev + 1) % setCount);
        }, ROTATE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [mounted, isDismissed]);

    if (!mounted || isDismissed) {
        return null;
    }

    const start = activeSetIndex * 3;
    const items = AD_ITEMS.slice(start, start + 3);
    const setCount = Math.ceil(AD_ITEMS.length / 3) || 1;

    return (
        <div className="mobile-bottom-ads">
            <button
                className="close-button"
                onClick={() => setIsDismissed(true)}
                aria-label="閉じる"
            >
                ×
            </button>
            <div className="ads-row">
                {items.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="nofollow sponsored"
                            className="ad-item"
                            title={item.title}
                        >
                            <img
                                src={item.image || AMAZON_LOGO_URL}
                                alt={item.title}
                            />
                        </a>
                        {item.trackingPixel && (
                            <img src={item.trackingPixel} alt="" style={{ display: 'none' }} width="1" height="1" />
                        )}
                    </React.Fragment>
                ))}
            </div>
            {setCount > 1 && (
                <div className="ads-dots">
                    {Array.from({ length: setCount }).map((_, idx) => (
                        <span key={idx} className={`dot ${idx === activeSetIndex ? 'active' : ''}`} aria-hidden />
                    ))}
                </div>
            )}
            <style jsx>{`
                .mobile-bottom-ads {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0.95));
                    padding: 10px;
                    padding-top: 25px;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
                    z-index: 9999;
                    border-top: 2px solid #667eea;
                }

                .close-button {
                    position: absolute;
                    top: 2px;
                    right: 8px;
                    background: #667eea;
                    color: white;
                    border: none;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }

                .close-button:hover {
                    background: #5a67d8;
                }

                .ads-row {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .ad-item {
                    flex: 1;
                    min-width: 0;
                    max-width: 180px;
                    height: 68px;
                    background: white;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }

                .ad-item:active {
                    transform: scale(0.95);
                }

                .ad-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    padding: 4px;
                }

                .ads-dots {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    margin-top: 8px;
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
                    .mobile-bottom-ads {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};
