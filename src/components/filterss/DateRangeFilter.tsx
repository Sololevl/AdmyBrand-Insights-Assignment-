import React from 'react';

type DateRangeProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

const DateRangeFilter: React.FC<DateRangeProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
