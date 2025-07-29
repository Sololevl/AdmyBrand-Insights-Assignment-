import { useState, useEffect, useCallback } from 'react';
import { MetricData, ChartData, ChannelData } from '../types';
import { generateCampaignData, generateChartData, generateChannelData } from '../data/mockData';

export const useData = () => {
  const [campaignData, setCampaignData] = useState<MetricData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(() => {
    setLoading(true);
    
    // Simulate API call delay with more realistic timing
    setTimeout(() => {
      setCampaignData(generateCampaignData(100));
      setChartData(generateChartData(30));
      setChannelData(generateChannelData());
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    refreshData();
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setCampaignData(prev => prev.map(item => ({
        ...item,
        revenue: item.revenue + Math.floor((Math.random() - 0.5) * 1000),
        users: item.users + Math.floor((Math.random() - 0.5) * 100),
        conversions: item.conversions + Math.floor((Math.random() - 0.5) * 10),
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    campaignData,
    chartData,
    channelData,
    loading,
    refreshData,
  };
};