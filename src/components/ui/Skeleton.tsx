import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-[length:200%_100%]'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Specialized skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        height={16}
        width={i === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm', className)}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton width={80} height={16} className="mb-3" />
        <Skeleton width={120} height={32} className="mb-2" />
        <Skeleton width={60} height={14} />
      </div>
      <Skeleton variant="circular" width={48} height={48} />
    </div>
  </div>
);

export const SkeletonChart: React.FC<{ className?: string; title?: boolean }> = ({ 
  className, 
  title = true 
}) => (
  <div className={clsx('p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm', className)}>
    {title && <Skeleton width={200} height={24} className="mb-6" />}
    <div className="space-y-4">
      <div className="flex justify-between items-end h-40">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            width={24}
            height={Math.random() * 120 + 40}
            className="rounded-t-lg"
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} width={20} height={12} />
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 6, 
  className 
}) => (
  <div className={clsx('p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm', className)}>
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <Skeleton width={200} height={24} />
      <Skeleton width={120} height={36} />
    </div>
    
    {/* Filters */}
    <div className="flex gap-4 mb-6">
      <Skeleton width={300} height={40} className="flex-1" />
      <Skeleton width={120} height={40} />
      <Skeleton width={120} height={40} />
    </div>

    {/* Table Header */}
    <div className="grid grid-cols-6 gap-4 pb-3 border-b border-gray-200 dark:border-gray-700 mb-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} width="80%" height={16} />
      ))}
    </div>

    {/* Table Rows */}
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-6 gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              width={colIndex === 0 ? '90%' : '70%'} 
              height={16} 
            />
          ))}
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <Skeleton width={200} height={16} />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={36} height={36} />
        ))}
      </div>
    </div>
  </div>
);