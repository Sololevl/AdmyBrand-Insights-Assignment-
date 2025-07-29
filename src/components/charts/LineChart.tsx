import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { SkeletonChart } from '../ui/Skeleton';
import { ChartData } from '../../types';
import { FileDown } from 'lucide-react';
import { exportChartToPDF } from '../../utils/exportUtils';

interface LineChartProps {
  data: ChartData[];
  title: string;
  loading?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title, loading = false }) => {
  const chartId = `line-chart-${title.toLowerCase().replace(/\s+/g, '-')}`;

  const handleExportPDF = async () => {
    try {
      await exportChartToPDF(chartId, title);
    } catch (error) {
      console.error('Failed to export chart to PDF:', error);
    }
  };

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
          <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              className="text-xs text-gray-600 dark:text-gray-400"
            />
            <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3B82F6' }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};