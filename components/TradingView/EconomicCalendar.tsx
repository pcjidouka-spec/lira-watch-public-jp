import React, { useEffect, useRef } from 'react';

interface EconomicCalendarProps {
    height?: string;
}

export const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ height = "600px" }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        if (container.current.querySelector('script')) return;

        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "colorTheme": "light",
            "isTransparent": false,
            "width": "100%",
            "height": "100%",
            "locale": "ja",
            "importanceFilter": "0,1", // 重要指標のみ
            "currencyFilter": "USD,JPY,TRY", // USD, JPY, TRYに関連するもの
            "utm_source": "www.tradingview.com",
            "utm_medium": "widget_new",
            "utm_campaign": "events"
        });

        container.current.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: height, width: '100%' }}>
            <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
            <div className="tradingview-widget-copyright">
                <a href="https://jp.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span className="blue-text">TradingView提供の経済カレンダー</span>
                </a>
            </div>
        </div>
    );
};
