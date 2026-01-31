import React, { useEffect, useRef } from 'react';

interface AdvancedChartProps {
    symbol: string;
    interval?: string;
    containerId: string;
    height?: string;
}

export const AdvancedChart: React.FC<AdvancedChartProps> = ({ symbol, interval = "60", containerId, height = "600px" }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // scriptタグが既にある場合は追加しない（React.StrictMode対策）
        if (container.current.querySelector('script')) return;

        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": symbol,
            "interval": interval,
            "timezone": "Asia/Tokyo",
            "theme": "light",
            "style": "1",
            "locale": "ja",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        });

        container.current.appendChild(script);
    }, [symbol, interval]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: height, width: '100%' }}>
            <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
            <div className="tradingview-widget-copyright">
                <a href="https://jp.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span className="blue-text">TradingView提供の{symbol}チャート</span>
                </a>
            </div>
        </div>
    );
};
