export interface MetricData {
  id: number;
  campaignName: string;
  revenue: number;
  users: number;
  conversions: number;
  growth: number;
  date: string;
  channel: string;
  status: 'active' | 'paused' | 'completed';
  ctr: number;
  cpc: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  users: number;
  conversions: number;
}

export interface ChannelData {
  name: string;
  value: number;
  color: string;
}

export interface Theme {
  isDark: boolean;
  toggle: () => void;
}