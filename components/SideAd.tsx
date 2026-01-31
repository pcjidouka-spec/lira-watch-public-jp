import React from 'react';
import { AdSense } from './AdSense';

interface SideAdProps {
    side: 'left' | 'right';
    adSlot: string;
}

export const SideAd: React.FC<SideAdProps> = ({ side, adSlot }) => {
    return (
        <>
            <div className={`side-ad-container ${side}`}>
                <div className="side-ad-content">
                    <AdSense
                        adSlot={adSlot}
                        adFormat="vertical"
                        style={{ display: 'block', width: '160px', minHeight: '600px' }}
                    />
                </div>
            </div>
            <style jsx>{`
        .side-ad-container {
          position: fixed;
          top: 100px; /* Header height + spacing */
          width: 180px;
          height: calc(100vh - 100px);
          display: none; /* Hidden by default */
          z-index: 10;
        }

        .side-ad-container.left {
          left: 10px;
        }

        .side-ad-container.right {
          right: 10px;
        }

        .side-ad-content {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        /* Large screens only */
        @media (min-width: 1400px) {
          .side-ad-container {
            display: block;
          }
        }
      `}</style>
        </>
    );
};
