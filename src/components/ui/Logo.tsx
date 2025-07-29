import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2.5 shadow-lg">
        <div className="flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-white" />
          <TrendingUp className="h-4 w-4 text-white/80 absolute top-1 right-1" />
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          ADmyBRAND
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">
          Insights
        </p>
      </div>
    </div>
  );
};