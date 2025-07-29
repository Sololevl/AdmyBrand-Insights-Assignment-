import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { SkeletonTable } from '../ui/Skeleton';
import { MetricData } from '../../types';
import { Search, ChevronUp, ChevronDown, Filter, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { exportTableToPDF } from '../../utils/exportUtils';

interface DataTableProps {
  data: MetricData[];
  loading?: boolean;
}

type SortField = keyof MetricData;
type SortDirection = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ data, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterChannel, setFilterChannel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique channels and statuses for filters
  const channels = useMemo(() => [...new Set(data.map(item => item.channel))], [data]);
  const statuses = useMemo(() => [...new Set(data.map(item => item.status))], [data]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    return data
      .filter(item => 
        item.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterChannel === '' || item.channel === filterChannel) &&
        (filterStatus === '' || item.status === filterStatus)
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
  }, [data, searchTerm, filterChannel, filterStatus, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Campaign', 'Revenue', 'Users', 'Conversions', 'Growth %', 'Channel', 'Status', 'CTR %', 'CPC'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        `"${item.campaignName}"`,
        item.revenue,
        item.users,
        item.conversions,
        item.growth.toFixed(1),
        `"${item.channel}"`,
        item.status,
        item.ctr.toFixed(2),
        item.cpc.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    try {
      await exportTableToPDF();
    } catch (error) {
      console.error('Failed to export table to PDF:', error);
    }
  };

  if (loading) {
    return <SkeletonTable rows={10} columns={7} />;
  }

  return (
    <Card id="data-table">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Performance</h3>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Channels</option>
            {channels.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {[
                { key: 'campaignName', label: 'Campaign' },
                { key: 'revenue', label: 'Revenue' },
                { key: 'users', label: 'Users' },
                { key: 'conversions', label: 'Conversions' },
                { key: 'growth', label: 'Growth %' },
                { key: 'channel', label: 'Channel' },
                { key: 'status', label: 'Status' },
              ].map(column => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  onClick={() => handleSort(column.key as SortField)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortField === column.key && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <tr 
                key={item.id} 
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {item.campaignName}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  ${item.revenue.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {item.users.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {item.conversions.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className={clsx(
                    'font-medium',
                    item.growth >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  )}>
                    {item.growth >= 0 ? '+' : ''}{item.growth.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {item.channel}
                </td>
                <td className="py-3 px-4">
                  <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    item.status === 'active' && 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                    item.status === 'paused' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                    item.status === 'completed' && 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  )}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={clsx(
                  'px-3 py-2 rounded-lg transition-colors duration-200',
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                )}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
};