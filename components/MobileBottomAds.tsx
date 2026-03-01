import React, { useState, useEffect } from 'react';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";

// 商品情報（楽天おすすめ情報）
const AD_ITEMS = [
    {
        url: "https://amzn.to/4r6Fldk",
        title: "アマノフーズ フリーズドライ 味噌汁 うちのおみそ汁 4種25食 詰め合わせ",
        image: "https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B096XFF3XQ&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=lirawatch-22",
        pixel: ""
    },
    {
        url: "https://amzn.to/46zu7GH",
        title: "ライオン Systema SP-T メディカルガーグル 100ml (3本)",
        image: "https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00YTZ12HM&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=lirawatch-22",
        pixel: ""
    },
    {
        url: "https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+6I9N5&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa26011467448_4AV5OF_1VA04Y_2HOM_6I9N5%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F",
        title: "楽天トラベル",
        image: "https://hbb.afl.rakuten.co.jp/hsb/0ea7f9a4.79280dcb.0ea7f99d.1ac92fca/153145/",
        pixel: "https://www15.a8.net/0.gif?a8mat=4AV5OF+1VA04Y+2HOM+6I9N5"
    },
    {
        url: "https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+656YP&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26011467448_4AV5OF_1VA04Y_2HOM_656YP%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F",
        title: "楽天市場",
        image: "https://hbb.afl.rakuten.co.jp/hsb/0ec09ba3.bc2429d5.0eb4bbaa.95151395/",
        pixel: "https://www16.a8.net/0.gif?a8mat=4AV5OF+1VA04Y+2HOM+656YP"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_127-208%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "丸亀製麺 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000090&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F11800662%2Fimgrc0093020218.jpg%3F_ex%3D128x128&s=128x128&t=picttext",
        pixel: ""
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_111-157%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "コメダ珈琲店 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000017&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10405894%2F02.jpg%3F_ex%3D128x128&s=128x128&t=picttext",
        pixel: ""
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_120-186%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "タリーズ 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000056&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10788053%2Fimgrc0089973014.jpg%3F_ex%3D128x128&s=128x128&t=picttext",
        pixel: ""
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_112-237%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "大戸屋 2,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000115&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10345136%2F2000yen_127188.jpg%3F_ex%3D128x128&s=128x128&t=picttext",
        pixel: ""
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50e6a3c0.cc7b86e7.50e6a3c1.b56469f6/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmayumi-store%2Fnt-st2-p%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "日本通信 SIM スターターパック",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50e6a3c0.cc7b86e7.50e6a3c1.b56469f6/?me_id=1366101&item_id=10000763&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fmayumi-store%2Fcabinet%2F06861712%2Fnt-st2-p%2F1.jpg%3F_ex%3D128x128&s=128x128&t=picttext",
        pixel: ""
    }
];

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
                    <a
                        key={idx}
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
