export interface SwapData {
  target_date: string;
  provider_id: string;
  name: string;
  days: number | null;
  swap_buy: number | null;
  swap_sell: number | null;
  settlement_date: string | null;
  status: 'success' | 'error';
}

export interface ProviderRanking {
  provider_id: string;
  name: string;
  swap_buy: number;
  swap_sell: number;
  latest_date: string;
  url?: string;
  campaign_url?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  url: string;
  currency_pair_selector: string;
  campaign_url?: string;
}

