import React, { useState } from 'react';
import Link from 'next/link';
import { articles } from '../data/articles';

interface TreeData {
    [year: string]: {
        [month: string]: {
            [day: string]: typeof articles[0][];
        };
    };
}

interface ArticleTreeProps {
    isMain?: boolean;
}

export const ArticleTree: React.FC<ArticleTreeProps> = ({ isMain = false }) => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    // Group articles by Year, Month, Day
    const treeData: TreeData = {};
    articles.forEach((article) => {
        const dateParts = article.date.split('/'); // YYYY/MM/DD
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        if (!treeData[year]) treeData[year] = {};
        if (!treeData[year][month]) treeData[year][month] = {};
        if (!treeData[year][month][day]) treeData[year][month][day] = [];

        treeData[year][month][day].push(article);
    });

    const toggleNode = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const sortedYears = Object.keys(treeData).sort((a, b) => b.localeCompare(a));

    return (
        <div className="article-tree">
            {sortedYears.map((year) => (
                <div key={year} className="tree-node year-node">
                    <div className="node-label" onClick={() => toggleNode(year)}>
                        <span className={`icon ${expandedNodes.has(year) ? 'open' : ''}`}>▶</span>
                        <span className="folder-icon">📂</span>
                        {year}年
                    </div>
                    {expandedNodes.has(year) && (
                        <div className="node-children">
                            {Object.keys(treeData[year])
                                .sort((a, b) => b.localeCompare(a))
                                .map((month) => {
                                    const monthId = `${year}-${month}`;
                                    return (
                                        <div key={monthId} className="tree-node month-node">
                                            <div className="node-label" onClick={() => toggleNode(monthId)}>
                                                <span className={`icon ${expandedNodes.has(monthId) ? 'open' : ''}`}>▶</span>
                                                <span className="folder-icon">📂</span>
                                                {parseInt(month)}月
                                            </div>
                                            {expandedNodes.has(monthId) && (
                                                <div className="node-children">
                                                    {Object.keys(treeData[year][month])
                                                        .sort((a, b) => b.localeCompare(a))
                                                        .map((day) => (
                                                            <div key={`${monthId}-${day}`} className="day-group">
                                                                {treeData[year][month][day].map((article) => (
                                                                    <div key={article.id} className="tree-leaf">
                                                                        <span className="day-text">{parseInt(day)}日</span>
                                                                        <Link href={`/articles/${article.id}`} className="article-link">
                                                                            {article.title}
                                                                        </Link>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            ))}

            <style jsx>{`
                .article-tree {
                    font-size: ${isMain ? '15px' : '13px'};
                    color: #4b5563;
                    user-select: none;
                }
                .tree-node {
                    margin-bottom: ${isMain ? '4px' : '2px'};
                }
                .node-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: ${isMain ? '6px 12px' : '4px 8px'};
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background 0.2s;
                    font-weight: 500;
                }
                .node-label:hover {
                    background: #f3f4f6;
                }
                .icon {
                    font-size: ${isMain ? '10px' : '8px'};
                    transition: transform 0.2s;
                    color: #9ca3af;
                }
                .icon.open {
                    transform: rotate(90deg);
                }
                .folder-icon {
                    font-size: ${isMain ? '16px' : '14px'};
                }
                .node-children {
                    padding-left: ${isMain ? '24px' : '16px'};
                    border-left: 1px dashed #e5e7eb;
                    margin-left: ${isMain ? '21px' : '14px'};
                }
                .day-group {
                    margin-bottom: ${isMain ? '4px' : '2px'};
                }
                .tree-leaf {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: ${isMain ? '5px 12px' : '3px 8px'};
                }
                .day-text {
                    color: #9ca3af;
                    font-size: ${isMain ? '12px' : '11px'};
                    min-width: ${isMain ? '35px' : '25px'};
                    margin-top: 2px;
                }
                .article-link {
                    color: #2563eb;
                    text-decoration: none;
                    line-height: 1.5;
                }
                .article-link:hover {
                    text-decoration: underline;
                }
                .year-node > .node-label {
                    color: #111827;
                    font-weight: 700;
                    font-size: ${isMain ? '18px' : '14px'};
                }
                .month-node > .node-label {
                    color: #374151;
                    font-size: ${isMain ? '16px' : '13px'};
                }
            `}</style>
        </div>
    );
};
