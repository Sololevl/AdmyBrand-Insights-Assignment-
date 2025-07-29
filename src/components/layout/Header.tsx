import React from 'react';
import { Bell, Settings, User, Sun, Moon, RefreshCw, FileDown } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui/Logo';
import { exportFullDashboardToPDF } from '../../utils/exportUtils';

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  onExportPDF?: () => void;
  loading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, refreshing, onExportPDF, loading = false }) => {
  const { isDark, toggle } = useTheme();

  const handleExportPDF = async () => {
    try {
      if (onExportPDF) {
        onExportPDF();
      } else {
        await exportFullDashboardToPDF();
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Skeleton width={60} height={60} className="rounded-lg" />
            <div>
              <Skeleton width={150} height={24} className="mb-1" />
              <Skeleton width={80} height={16} />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="circular" width={40} height={40} />
            ))}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right space-y-1">
                <Skeleton width={80} height={16} />
                <Skeleton width={100} height={12} />
              </div>
              <Skeleton variant="circular" width={40} height={40} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={toggle}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
            <Settings className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Mridul Madhav Jindal
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Team Member
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};