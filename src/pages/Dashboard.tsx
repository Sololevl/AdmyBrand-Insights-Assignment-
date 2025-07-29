import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { MetricCard } from '../components/ui/MetricCard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { DataTable } from '../components/table/DataTable';
import { useData } from '../hooks/useData';
import { calculateMetrics } from '../data/mockData';
import { DollarSign, Users, Target, TrendingUp } from 'lucide-react';
import DateRangeFilter from '../components/filterss/DateRangeFilter';

export const Dashboard: React.FC = () => {
  // Fetch data via custom hook
  const { campaignData, chartData, channelData, loading, refreshData } = useData();

  // Date-range filter state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Filter campaigns by date
  const filteredCampaigns = campaignData.filter(item => {
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || itemDate >= start) && (!end || itemDate <= end);
  });

  // Recalculate metrics for filtered data
  const metrics = calculateMetrics(filteredCampaigns);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onRefresh={refreshData} refreshing={loading} loading={loading} />

      <main className="p-6" id="dashboard-content">
        {/* Date Range Filter */}
        <div className="mb-6">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            change={12.5}
            icon={<DollarSign className="h-6 w-6" />}
            color="blue"
            loading={loading}
          />
          <MetricCard
            title="Total Users"
            value={metrics.totalUsers.toLocaleString()}
            change={8.2}
            icon={<Users className="h-6 w-6" />}
            color="purple"
            loading={loading}
          />
          <MetricCard
            title="Conversions"
            value={metrics.totalConversions.toLocaleString()}
            change={-2.4}
            icon={<Target className="h-6 w-6" />}
            color="green"
            loading={loading}
          />
          <MetricCard
            title="Avg Growth"
            value={`${metrics.avgGrowth.toFixed(1)}%`}
            change={metrics.avgGrowth}
            icon={<TrendingUp className="h-6 w-6" />}
            color="orange"
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <LineChart
              data={chartData}
              title="Revenue Trends (30 Days)"
              loading={loading}
            />
          </div>
          <DonutChart
            data={channelData}
            title="Channel Breakdown"
            loading={loading}
          />
          <div className="lg:col-span-2 xl:col-span-3">
            <BarChart
              data={filteredCampaigns}
              title="Top Performing Campaigns"
              loading={loading}
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable data={filteredCampaigns} loading={loading} />
      </main>
    </div>
  );
};
