// Debug version of RankingTable to diagnose Matsui banner issue
import React from 'react';
import { ProviderRanking } from '@/types';

interface RankingTableProps {
    buyRankings: ProviderRanking[];
    sellRankings: ProviderRanking[];
}

export const RankingTableDebug: React.FC<RankingTableProps> = ({ buyRankings, sellRankings }) => {
    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h2>買いランキング Debug</h2>
            {buyRankings.map((item, i) => (
                <div key={i} style={{ marginBottom: '10px', padding: '10px', background: '#f0f0f0' }}>
                    <div><strong>順位:</strong> {i + 1}</div>
                    <div><strong>Name:</strong> {item.name}</div>
                    <div><strong>Provider ID:</strong> {item.provider_id}</div>
                    <div><strong>URL:</strong> {item.url || 'なし'}</div>
                    <div><strong>Campaign URL:</strong> {item.campaign_url || 'なし'}</div>
                    <div style={{ marginTop: '5px', padding: '5px', background: '#fff' }}>
                        <div>isMatsui判定:</div>
                        <div>- ID includes 'matsui': {item.provider_id?.toLowerCase().includes('matsui') ? '✓' : '×'}</div>
                        <div>- Name includes 'matsui': {item.name?.toLowerCase().includes('matsui') ? '✓' : '×'}</div>
                        <div>- Name includes '松井': {item.name?.includes('松井') ? '✓' : '×'}</div>
                        <div>- Name includes 'マツイ': {item.name?.includes('マツイ') ? '✓' : '×'}</div>
                    </div>
                </div>
            ))}

            <h2>売りランキング Debug</h2>
            {sellRankings.map((item, i) => (
                <div key={i} style={{ marginBottom: '10px', padding: '10px', background: '#f0f0f0' }}>
                    <div><strong>順位:</strong> {i + 1}</div>
                    <div><strong>Name:</strong> {item.name}</div>
                    <div><strong>Provider ID:</strong> {item.provider_id}</div>
                    <div><strong>URL:</strong> {item.url || 'なし'}</div>
                    <div><strong>Campaign URL:</strong> {item.campaign_url || 'なし'}</div>
                </div>
            ))}
        </div>
    );
};
