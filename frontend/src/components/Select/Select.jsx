import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ 
  label, 
  error, 
  options = [],
  className = '', 
  id,
  ...props 
}, ref) => {
  const selectId = id || React.useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            appearance-none w-full pl-4 pr-10 py-3 
            rounded-[12px] border border-[#E6E1D8] bg-[#FAF8F5] text-[#1A1A1A] text-sm
            shadow-sm transition-all duration-300 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            dark:bg-[#121212] dark:border-gray-700 dark:text-[#F8F8F8]
            ${error ? 'border-red-400 bg-red-50 focus:ring-red-400' : ''}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-[#1A1A1A] dark:bg-[#121212] dark:text-[#F8F8F8]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6F6F6F]">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
