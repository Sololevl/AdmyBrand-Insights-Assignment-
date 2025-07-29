import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './Skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'orange';
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  loading = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Card hover className="group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:scale-105 transition-transform duration-200">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className={clsx(
              'flex items-center text-sm font-medium',
              change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              {change >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
        <div className={clsx(
          'p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-200',
          colorClasses[color]
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
};