import React from 'react';

export const RakutenAds: React.FC = () => {
    return (
        <div className="sidebar-widget">
            <div className="widget-header">
                <h3>おすすめ情報</h3>
            </div>
            <div className="widget-content">
                <div className="ad-grid">
                    {/* Ad 1: Rakuten Travel */}
                    <div className="ad-item">
                        <a href="https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+6I9N5&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0eb4779e.5d30c5ba.0eb4779f.b871e4e3%2Fa26011467448_4AV5OF_1VA04Y_2HOM_6I9N5%3Fpc%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Ftravel.rakuten.co.jp%252F" rel="nofollow" target="_blank">
                            <img src="https://hbb.afl.rakuten.co.jp/hsb/0ea7f9a4.79280dcb.0ea7f99d.1ac92fca/153145/" alt="Rakuten Travel" style={{ border: 0, maxWidth: '100%', height: 'auto' }} />
                        </a>
                        <img width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4AV5OF+1VA04Y+2HOM+6I9N5" alt="" style={{ border: 0 }} />
                    </div>



                    {/* Ad 3: Rakuten Ichiba */}
                    <div className="ad-item">
                        <a href="https://rpx.a8.net/svt/ejp?a8mat=4AV5OF+1VA04Y+2HOM+656YP&rakuten=y&a8ejpredirect=http%3A%2F%2Fhb.afl.rakuten.co.jp%2Fhgc%2F0ea62065.34400275.0ea62066.204f04c0%2Fa26011467448_4AV5OF_1VA04Y_2HOM_656YP%3Fpc%3Dhttp%253A%252F%252Fwww.rakuten.co.jp%252F%26m%3Dhttp%253A%252F%252Fm.rakuten.co.jp%252F" rel="nofollow" target="_blank">
                            <img src="https://hbb.afl.rakuten.co.jp/hsb/0ec09ba3.bc2429d5.0eb4bbaa.95151395/" alt="Rakuten Ichiba" style={{ border: 0, maxWidth: '100%', height: 'auto' }} />
                        </a>
                        <img width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=4AV5OF+1VA04Y+2HOM+656YP" alt="" style={{ border: 0 }} />
                    </div>
                </div>

                <style jsx>{`
          .ad-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .ad-item {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f9fafb;
            padding: 5px;
            border-radius: 4px;
          }
          @media (max-width: 480px) {
            .ad-grid {
                grid-template-columns: 1fr; /* Stack on mobile for better visibility */
            }
          }
        `}</style>
            </div>
        </div>
    );
};
