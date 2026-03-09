import React from 'react';

interface BlogmuraButtonsProps {
    className?: string;
    style?: React.CSSProperties;
    orientation?: 'horizontal' | 'vertical' | 'responsive';
}

export const BlogmuraButtons: React.FC<BlogmuraButtonsProps> = ({
    className,
    style,
    orientation = 'horizontal'
}) => {
    const links = [
        {
            href: "https://fx.blogmura.com/ranking/in?p_cid=11211368",
            imgSrc: "https://b.blogmura.com/fx/88_31.gif",
            alt: "にほんブログ村 為替ブログへ",
            text: "にほんブログ村"
        },
        {
            href: "https://fx.blogmura.com/turkey-lira/ranking/in?p_cid=11211368",
            imgSrc: "https://b.blogmura.com/fx/turkey-lira/88_31.gif",
            alt: "にほんブログ村 為替ブログ トルコリラへ",
            text: "にほんブログ村"
        },
        {
            href: "https://fx.blogmura.com/fxunemployedtrader/ranking/in?p_cid=11211368",
            imgSrc: "https://b.blogmura.com/fx/fxunemployedtrader/88_31.gif",
            alt: "にほんブログ村 為替ブログ FX 無職投資家へ",
            text: "にほんブログ村"
        },
        {
            href: "https://investment.blogmura.com/ranking/in?p_cid=11211368",
            imgSrc: "https://b.blogmura.com/investment/88_31.gif",
            alt: "にほんブログ村 投資ブログへ",
            text: "にほんブログ村"
        },
        {
            href: "https://investment.blogmura.com/okane_toushi/ranking/in?p_cid=11211368",
            imgSrc: "https://b.blogmura.com/investment/okane_toushi/88_31.gif",
            alt: "にほんブログ村 投資ブログ お金（投資）へ",
            text: "にほんブログ村"
        },
        {
            href: "https://blogmura.com/ranking/in?p_cid=11211368",
            imgSrc: "https://b.blogmura.com/88_31.gif",
            alt: "ブログランキング・にほんブログ村へ",
            text: "にほんブログ村"
        },
        {
            href: "https://blogmura.com/profiles/11211368?p_cid=11211368",
            imgSrc: "https://blogparts.blogmura.com/parts_image/user/pv11211368.gif",
            alt: "PVアクセスランキング にほんブログ村",
            text: "PVアクセスランキング"
        }
    ];

    return (
        <div className={`blogmura-container ${orientation} ${className || ''}`} style={style}>
            {links.map((link, index) => (
                <div key={index} className="blogmura-item">
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <img src={link.imgSrc} width="88" height="31" alt={link.alt} />
                    </a>
                </div>
            ))}
            <style jsx>{`
        .blogmura-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          padding: 10px;
        }
        
        .blogmura-container.vertical {
          flex-direction: column;
          align-items: center;
        }
        
        .blogmura-container.responsive {
            flex-direction: row;
            justify-content: space-around; /* space-around for better filling */
            width: 100%;
        }

        .blogmura-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .blogmura-item img {
          border: 0;
          display: block;
        }
      `}</style>
        </div>
    );
};
