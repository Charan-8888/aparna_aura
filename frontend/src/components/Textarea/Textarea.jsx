import React, { forwardRef } from 'react';

const Textarea = forwardRef(({ 
  label, 
  error, 
  className = '', 
  id,
  rows = 4,
  ...props 
}, ref) => {
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5f5651] mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`
          flex w-full rounded-[14px] border border-[#ded2c1] bg-white/95 px-4 py-3 text-sm placeholder:text-gray-400 shadow-[0_8px_24px_rgba(48,27,47,0.035)] 
          focus:outline-none focus:ring-2 focus:ring-[#382135] focus:border-transparent
          disabled:cursor-not-allowed disabled:opacity-50
          dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:focus:ring-[#D4AF37]
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
