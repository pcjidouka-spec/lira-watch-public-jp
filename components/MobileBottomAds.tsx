import React, { useState, useEffect } from 'react';
import { AD_ITEMS } from '../data/ad_items';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";

// 商品情報（楽天おすすめ情報）
// Moved to data/ad_items.ts

export const MobileBottomAds: React.FC = () => {
    const [isDismissed, setIsDismissed] = useState(false);

    if (isDismissed) {
        return null;
    }

    return (
        <div className="mobile-bottom-ads">
            <button
                className="close-button"
                onClick={() => setIsDismissed(true)}
                aria-label="閉じる"
            >
                ×
            </button>
            <div className="ads-scroll-container">
                {AD_ITEMS.map((item, idx) => (
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
                    max-height: 140px;
                    overflow-y: auto;
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

                .ads-scroll-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: flex-start;
                    align-content: flex-start;
                }

                .ads-scroll-container::-webkit-scrollbar {
                    display: none;
                }

                .ad-item {
                    flex-shrink: 0;
                    width: 50px;
                    height: 45px;
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
                    padding: 5px;
                }

                /* モバイルのみ表示 - 1200px以下 */
                @media (max-width: 1200px) {
                    .mobile-bottom-ads {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};
