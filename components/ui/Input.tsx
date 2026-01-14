
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-gray-500">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full bg-[#0c0c0e] border ${error ? 'border-red-500/50' : 'border-[#2d2d31]'} rounded px-3 py-2 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all ${className}`}
          {...props}
        />
        {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-gray-500">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={`w-full bg-[#0c0c0e] border ${error ? 'border-red-500/50' : 'border-[#2d2d31]'} rounded px-3 py-2 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all resize-none min-h-[100px] ${className}`}
          {...props}
        />
        {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';
