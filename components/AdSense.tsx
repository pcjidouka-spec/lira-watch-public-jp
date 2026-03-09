import React, { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense広告コンポーネント
 * 
 * 使用方法:
 * 1. Google AdSenseでサイトを登録し、広告ユニットを作成
 * 2. 環境変数 NEXT_PUBLIC_ADSENSE_CLIENT_ID に広告クライアントIDを設定（デフォルト: ca-pub-6343144082717938）
 * 3. adSlotプロパティに広告スロットIDを指定
 * 
 * 例:
 * <AdSense 
 *   adSlot="1234567890" 
 *   adFormat="auto"
 *   style={{ display: 'block', textAlign: 'center' }}
 * />
 */
export const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  style,
  className = '',
}) => {
  // デフォルトのクライアントIDを使用（環境変数が設定されていない場合）
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-6343144082717938';

  // 広告の初期化（useEffectで実行）- フックは常に同じ順序で呼ばれる必要がある
  useEffect(() => {
    // 広告スロットIDが設定されている場合のみ初期化
    if (adSlot && typeof window !== 'undefined') {
      try {
        // adsbygoogleが読み込まれているか確認
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error('AdSense initialization error:', err);
      }
    }
  }, [adSlot]);

  // 開発環境では広告を表示しない（オプション）
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SHOW_ADS) {
    return (
      <div
        className={`ad-placeholder ${className}`}
        style={{
          ...style,
          minHeight: '100px',
          background: '#f3f4f6',
          border: '2px dashed #d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <span style={{ color: '#9ca3af', fontSize: '14px' }}>
          広告プレースホルダー (AdSlot: {adSlot})
        </span>
      </div>
    );
  }

  // 広告スロットIDが設定されていない場合は表示しない
  if (!adSlot) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'block',
        ...style,
      }}
      data-ad-client={clientId}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
};

/**
 * 広告セクション用のラッパーコンポーネント
 * 広告を囲むコンテナとスタイリングを提供
 */
export const AdSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, title, className = '', style }) => {
  return (
    <div className={`ad-section ${className}`} style={style}>
      {title && (
        <div className="ad-section-title">
          <span>{title}</span>
        </div>
      )}
      <div className="ad-section-content">
        {children}
      </div>
      <style jsx>{`
        .ad-section {
          margin: 8px 0;
          padding: 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .ad-section-title {
          text-align: center;
          margin-bottom: 12px;
          font-size: 12px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .ad-section-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100px;
        }
        @media (max-width: 480px) {
          .ad-section {
            margin: 4px 0;
            padding: 8px; /* Reduced padding */
            border-radius: 6px;
          }
          .ad-section-title {
            margin-bottom: 4px;
            font-size: 10px;
          }
          .ad-section-content {
            min-height: 50px; /* Reduced min-height */
            display: block; /* Allow block to avoid centering issues with standard banners */
          }
        }
      `}</style>
    </div>
  );
};

