import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { articles } from '../data/articles';

export const MobileArticleDrawer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    // 記事が新しいかどうかを判定（5日以内）
    const isNewArticle = (date: string) => {
        const articleDate = new Date(date.replace(/\//g, '-'));
        const today = new Date();
        const diffTime = today.getTime() - articleDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 5;
    };

    // スクロール制御
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* トリガーボタン */}
            <button
                className="drawer-trigger"
                onClick={() => setIsOpen(true)}
                aria-label="記事一覧を開く"
            >
                <span className="trigger-icon">📰</span>
                <span className="trigger-text">記事</span>
            </button>

            {/* オーバーレイ */}
            {isOpen && (
                <div
                    className="drawer-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ドロワー本体 */}
            <div className={`article-drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>📚 記事一覧</h3>
                    <button
                        className="close-button"
                        onClick={() => setIsOpen(false)}
                        aria-label="閉じる"
                    >
                        ×
                    </button>
                </div>

                <div className="drawer-content">
                    <ul className="article-list">
                        {articles.map((article) => {
                            const isNew = isNewArticle(article.date);
                            return (
                                <li key={article.id} className="article-item">
                                    <Link
                                        href={`/articles/${article.id}`}
                                        className={`article-link ${isNew ? 'new' : ''}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="article-date">{article.date}</span>
                                        <span className="article-title">{article.title}</span>
                                        {isNew && <span className="new-badge">New</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <style jsx>{`
                /* トリガーボタン */
                .drawer-trigger {
                    display: none;
                    position: fixed;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 9998;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px 0 0 8px;
                    padding: 12px 8px;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    box-shadow: -2px 2px 10px rgba(0,0,0,0.2);
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .drawer-trigger:active {
                    transform: translateY(-50%) scale(0.95);
                }

                .trigger-icon {
                    font-size: 20px;
                }

                .trigger-text {
                    font-size: 10px;
                    font-weight: bold;
                    writing-mode: vertical-rl;
                }

                /* オーバーレイ */
                .drawer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                /* ドロワー */
                .article-drawer {
                    position: fixed;
                    top: 0;
                    right: -85%;
                    width: 85%;
                    max-width: 320px;
                    height: 100%;
                    background: white;
                    z-index: 1001;
                    transition: right 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    box-shadow: -4px 0 20px rgba(0,0,0,0.2);
                }

                .article-drawer.open {
                    right: 0;
                }

                .drawer-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .drawer-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: bold;
                }

                .close-button {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    font-size: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                .close-button:hover {
                    background: rgba(255,255,255,0.3);
                }

                .drawer-content {
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }

                .article-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .article-item {
                    border-bottom: 1px solid #f3f4f6;
                }

                .article-link {
                    display: flex;
                    flex-direction: column;
                    padding: 14px 16px;
                    text-decoration: none;
                    transition: background 0.2s;
                }

                .article-link:active {
                    background: #f3f4f6;
                }

                .article-date {
                    font-size: 11px;
                    color: #6b7280;
                    margin-bottom: 4px;
                }

                .article-title {
                    font-size: 14px;
                    color: #1f2937;
                    line-height: 1.4;
                    font-weight: 500;
                }

                .article-link.new .article-title {
                    color: #ef4444;
                    font-weight: 600;
                }

                .new-badge {
                    display: inline-block;
                    margin-top: 6px;
                    padding: 2px 8px;
                    background: #ef4444;
                    color: white;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    width: fit-content;
                    animation: pulse 2s infinite;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                /* モバイルのみ表示 */
                @media (max-width: 900px) {
                    .drawer-trigger {
                        display: flex;
                    }
                }
            `}</style>
        </>
    );
};
