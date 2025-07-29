import { MetricData, ChartData, ChannelData } from '../types';
import { format, subDays } from 'date-fns';

// Generate realistic campaign data
export const generateCampaignData = (count: number = 50): MetricData[] => {
  const channels = ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'TikTok', 'YouTube'];
  const campaignTypes = ['Summer Sale', 'Black Friday', 'Holiday Special', 'Brand Awareness', 'Product Launch', 'Retargeting', 'Lead Gen'];
  const statuses: ('active' | 'paused' | 'completed')[] = ['active', 'paused', 'completed'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    campaignName: `${campaignTypes[Math.floor(Math.random() * campaignTypes.length)]} ${i + 1}`,
    revenue: Math.floor(Math.random() * 50000) + 5000,
    users: Math.floor(Math.random() * 10000) + 1000,
    conversions: Math.floor(Math.random() * 500) + 50,
    growth: (Math.random() * 40) - 10, // Can be negative
    date: format(subDays(new Date(), Math.floor(Math.random() * 90)), 'yyyy-MM-dd'),
    channel: channels[Math.floor(Math.random() * channels.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    ctr: Math.random() * 5 + 1, // 1-6%
    cpc: Math.random() * 3 + 0.5, // $0.50-$3.50
  }));
};

// Generate time series data for charts
export const generateChartData = (days: number = 30): ChartData[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = format(subDays(new Date(), days - 1 - i), 'MMM dd');
    const baseRevenue = 15000 + (Math.sin(i / 7) * 3000); // Weekly pattern
    
    return {
      date,
      revenue: Math.floor(baseRevenue + (Math.random() * 5000) - 2500),
      users: Math.floor((baseRevenue / 3) + (Math.random() * 2000) - 1000),
      conversions: Math.floor(baseRevenue / 50 + (Math.random() * 100) - 50),
    };
  });
};

// Generate channel breakdown data
export const generateChannelData = (): ChannelData[] => {
  return [
    { name: 'Google Ads', value: 35, color: '#3B82F6' },
    { name: 'Facebook', value: 25, color: '#8B5CF6' },
    { name: 'Instagram', value: 20, color: '#F59E0B' },
    { name: 'LinkedIn', value: 12, color: '#10B981' },
    { name: 'Twitter', value: 5, color: '#EF4444' },
    { name: 'Others', value: 3, color: '#6B7280' },
  ];
};

// Calculate aggregate metrics
export const calculateMetrics = (data: MetricData[]) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = data.reduce((sum, item) => sum + item.users, 0);
  const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0);
  const avgGrowth = data.reduce((sum, item) => sum + item.growth, 0) / data.length;

  return {
    totalRevenue,
    totalUsers,
    totalConversions,
    avgGrowth,
  };
};