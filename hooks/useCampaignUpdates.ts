import { useState, useEffect } from 'react';

interface CampaignUpdate {
    has_new: boolean;
    updated_at: string | null;
}

interface CampaignUpdatesData {
    updated_at: string;
    providers: {
        [key: string]: CampaignUpdate;
    };
}

export function useCampaignUpdates() {
    const [campaignUpdates, setCampaignUpdates] = useState<CampaignUpdatesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/campaign_updates.json')
            .then(res => res.json())
            .then(data => {
                setCampaignUpdates(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load campaign updates:', err);
                setLoading(false);
            });
    }, []);

    const hasNewCampaign = (providerId: string): boolean => {
        return campaignUpdates?.providers?.[providerId]?.has_new || false;
    };

    return { campaignUpdates, loading, hasNewCampaign };
}
