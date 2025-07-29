import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SkeletonChart } from '../ui/Skeleton';
import { MetricData } from '../../types';
import { FileDown } from 'lucide-react';
import { exportChartToPDF } from '../../utils/exportUtils';

interface BarChartProps {
  data: MetricData[];
  title: string;
  loading?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, loading = false }) => {
  const chartId = `bar-chart-${title.toLowerCase().replace(/\s+/g, '-')}`;

  const handleExportPDF = async () => {
    try {
      await exportChartToPDF(chartId, title);
    } catch (error) {
      console.error('Failed to export chart to PDF:', error);
    }
  };

  // Get top 10 campaigns by revenue
  const topCampaigns = data
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(item => ({
      name: item.campaignName.length > 15 
        ? item.campaignName.substring(0, 15) + '...' 
        : item.campaignName,
      revenue: item.revenue,
      conversions: item.conversions,
    }));

  if (loading) {
    return <SkeletonChart />;
  }

  return (
    <Card id={chartId}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <button
          onClick={handleExportPDF}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          title="Export chart to PDF"
        >
          <FileDown className="h-4 w-4" />
        </button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={topCampaigns} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              className="text-xs text-gray-600 dark:text-gray-400"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => [
                name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                name === 'revenue' ? 'Revenue' : 'Conversions'
              ]}
            />
            <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};