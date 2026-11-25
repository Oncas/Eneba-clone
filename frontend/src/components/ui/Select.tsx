import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = ({
  label,
  error,
  required,
  helperText,
  className = '',
  id,
  options,
  placeholder,
  value,
  ...props
}: SelectProps) => {
  const inputId = id || props.name;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
          {helperText && <span className="text-gray-500 text-xs ml-2">({helperText})</span>}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full bg-[#0F0F1E] border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-[#2D2D44] focus:border-[#6B46C1] focus:ring-[#6B46C1]/20'
        } ${className}`}
        value={value}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#0F0F1E]">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};
