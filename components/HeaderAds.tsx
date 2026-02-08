import React from 'react';

const AMAZON_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png";

// 商品情報（楽天おすすめ情報）
const AD_ITEMS = [
    {
        url: "https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+6I9N5&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa26011467448_4AV5OF_1VA04Y_2HOM_6I9N5%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F",
        title: "楽天トラベル",
        image: "https://hbb.afl.rakuten.co.jp/hsb/0ea7f9a4.79280dcb.0ea7f99d.1ac92fca/153145/"
    },
    {
        url: "https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+656YP&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26011467448_4AV5OF_1VA04Y_2HOM_656YP%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F",
        title: "楽天市場",
        image: "https://hbb.afl.rakuten.co.jp/hsb/0ec09ba3.bc2429d5.0eb4bbaa.95151395/"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_127-208%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "丸亀製麺 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000090&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F11800662%2Fimgrc0093020218.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_111-157%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "コメダ珈琲店 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000017&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10405894%2F02.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_120-186%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "タリーズ 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000056&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10788053%2Fimgrc0089973014.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_112-237%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "大戸屋 2,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000115&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10345136%2F2000yen_127188.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://item.rakuten.co.jp/kouragumi/201175/",
        title: "骨取りサバ切身",
        image: "https://thumbnail.image.rakuten.co.jp/@0_mall/kouragumi/cabinet/10531638/imgrc0114997850.jpg?_ex=128x128"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd9f2a.b9209cb6.50cd9f2b.14e117e9/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmakuraseizou%2Fs003%2F&link_type=picttext",
        title: "そば殻枕",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd9f2a.b9209cb6.50cd9f2b.14e117e9/?me_id=1337128&item_id=10000107&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fmakuraseizou%2Fcabinet%2Fnarajirou%2Fimgrc0169565820.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cda52b.4cf3b824.50cda52c.5d187712/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fgeneless%2F03-0112yh%2F&link_type=picttext",
        title: "カーディガン",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cda52b.4cf3b824.50cda52c.5d187712/?me_id=1334588&item_id=10002249&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fgeneless%2Fcabinet%2Fshouhin01%2F03line%2Fygh_01%2F03-0112-00.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cda82a.411ce472.50cda82b.360f1622/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fa-price%2F4571495432325%2F&link_type=picttext",
        title: "冷蔵庫",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cda82a.411ce472.50cda82b.360f1622/?me_id=1243088&item_id=10975178&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fa-price%2Fcabinet%2Fdesign%2F20%2F0-4571495434251.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cdc9eb.ebe26f21.50cdc9ec.83ea9686/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffordear-nizimusubi%2Fb0dsj82zvx%2F&link_type=picttext",
        title: "プロテイン",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cdc9eb.ebe26f21.50cdc9ec.83ea9686/?me_id=1437967&item_id=10087846&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Ffordear-nizimusubi%2Fcabinet%2Frakub220_0017%2Fb0dsj82zvx00.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+6I9N5&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa26011467448_4AV5OF_1VA04Y_2HOM_6I9N5%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F",
        title: "楽天トラベル",
        image: "https://hbb.afl.rakuten.co.jp/hsb/0ea7f9a4.79280dcb.0ea7f99d.1ac92fca/153145/"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_127-208%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "丸亀製麺 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000090&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F11800662%2Fimgrc0093020218.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_111-157%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "コメダ珈琲店 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000017&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10405894%2F02.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_120-186%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "タリーズ 1,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000056&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10788053%2Fimgrc0089973014.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
    {
        url: "https://hb.afl.rakuten.co.jp/ichiba/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakkenshop%2Frakken_112-237%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
        title: "大戸屋 2,000円ギフト",
        image: "https://hbb.afl.rakuten.co.jp/hgb/50cd90e5.ba52a2fd.50cd90e6.09db1cba/?me_id=1405809&item_id=10000115&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakkenshop%2Fcabinet%2F10345128%2F10345136%2F2000yen_127188.jpg%3F_ex%3D128x128&s=128x128&t=picttext"
    },
];

interface HeaderAdsProps {
    position: 'left' | 'right';
}

export const HeaderAds: React.FC<HeaderAdsProps> = ({ position }) => {
    // リンクを左右に分割
    const half = Math.ceil(AD_ITEMS.length / 2);
    const items = position === 'left' ? AD_ITEMS.slice(0, half) : AD_ITEMS.slice(half);

    return (
        <div className={`header-ads-container ${position}`}>
            {items.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="nofollow sponsored" className="header-ad-item" title={item.title}>
                    <img
                        src={item.image || AMAZON_LOGO_URL}
                        alt={item.title}
                        style={!item.image ? { padding: '10px', objectFit: 'contain' } : undefined}
                    />
                </a>
            ))}
            <style jsx>{`
                .header-ads-container {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(2, 50px);
                    gap: 8px;
                    width: 240px;
                    flex-shrink: 0;
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
                    height: 100%;
                }
                .header-ad-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .header-ad-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
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
