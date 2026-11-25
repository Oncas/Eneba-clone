import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export const Input = ({ 
  label, 
  error, 
  required, 
  helperText,
  className = '', 
  id,
  value,
  ...props 
}: InputProps) => {
  const inputId = id || props.name;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
          {helperText && <span className="text-gray-500 text-xs ml-2">({helperText})</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-[#0F0F1E] border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-[#2D2D44] focus:border-[#6B46C1] focus:ring-[#6B46C1]/20'
        } ${className}`}
        value={value}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};
