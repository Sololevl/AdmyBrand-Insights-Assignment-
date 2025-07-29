import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { ChannelData } from '../../types';
import { FileDown } from 'lucide-react';
import { exportChartToPDF } from '../../utils/exportUtils';

interface DonutChartProps {
  data: ChannelData[];
  title: string;
  loading?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, title, loading = false }) => {
  const chartId = `donut-chart-${title.toLowerCase().replace(/\s+/g, '-')}`;

  const handleExportPDF = async () => {
    try {
      await exportChartToPDF(chartId, title);
    } catch (error) {
      console.error('Failed to export chart to PDF:', error);
    }
  };

  if (loading) {
    return (
      <Card id={chartId}>
        <Skeleton width={200} height={24} className="mb-6" />
        <div className="flex items-center justify-center">
          <div className="relative">
            <Skeleton variant="circular" width={160} height={160} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton variant="circular" width={80} height={80} />
            </div>
          </div>
          <div className="ml-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton variant="circular" width={8} height={8} />
                <Skeleton width={80} height={14} />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number) => [`${value}%`, 'Share']}
            />
            <Legend 
              verticalAlign="middle" 
              align="right" 
              layout="vertical" 
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};