import React, { useEffect, useRef } from 'react';

// Symbol Overview ウィジェットを使用することで、詳細タブに「アイデア」や「ニュース」を表示させることができ、
// ユーザーがコミュニティの投稿（トレードアイデア）を確認しやすくなります。
interface IdeasWidgetProps {
    height?: string;
}

// Symbol Overview ウィジェットを使用することで、詳細タブに「アイデア」や「ニュース」を表示させることができ、
// ユーザーがコミュニティの投稿（トレードアイデア）を確認しやすくなります。
export const IdeasWidget: React.FC<IdeasWidgetProps> = ({ height = "500px" }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        if (container.current.querySelector('script')) return;

        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": [
                [
                    "FX:TRYJPY|1D"
                ]
            ],
            "chartOnly": false,
            "width": "100%",
            "height": "100%",
            "locale": "ja",
            "colorTheme": "light",
            "autosize": true,
            "showVolume": false,
            "showMA": false,
            "hideDateRanges": false,
            "hideMarketStatus": false,
            "hideSymbolLogo": false,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            "fontSize": "10",
            "noTimeScale": false,
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "chartType": "area",
            "maLineColor": "#2962FF",
            "maLineWidth": 1,
            "maLength": 9,
            "lineWidth": 2,
            "lineType": 0,
            "dateRanges": [
                "1d|1",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ],
            "utm_source": "www.tradingview.com",
            "utm_medium": "widget_new",
            "utm_campaign": "symbol-overview"
        });

        container.current.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: height, width: '100%' }}>
            <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
            <div className="tradingview-widget-copyright">
                <a href="https://jp.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span className="blue-text">TradingView提供のTRYJPY詳細</span>
                </a>
            </div>
        </div>
    );
};
