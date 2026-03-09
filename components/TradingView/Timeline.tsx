import React, { useEffect, useRef } from 'react';

interface TimelineProps {
    height?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ height = "600px" }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        if (container.current.querySelector('script')) return;

        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "feedMode": "market",
            "market": "financial_markets", // 全体的な金融市場
            "colorTheme": "light",
            "isTransparent": false,
            "displayMode": "regular",
            "width": "100%",
            "height": "100%",
            "locale": "ja",
            "utm_source": "www.tradingview.com",
            "utm_medium": "widget_new",
            "utm_campaign": "timeline"
        });

        container.current.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: height, width: '100%' }}>
            <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
            <div className="tradingview-widget-copyright">
                <a href="https://jp.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span className="blue-text">TradingView提供のトップストーリー</span>
                </a>
            </div>
        </div>
    );
};
