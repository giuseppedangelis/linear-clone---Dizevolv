
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gray' | 'teal' | 'indigo' | 'orange' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', size = 'md', className = '' }) => {
  const variants = {
    gray: 'bg-[#1f1f23] text-gray-400 border-[#2d2d31]',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center font-semibold border rounded ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
