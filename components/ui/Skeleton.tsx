
import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-[#1f1f23] rounded ${className}`} />;
};

export const IssueSkeleton = () => (
  <div className="flex items-center gap-4 px-4 py-3 border-b border-[#1f1f23]">
    <Skeleton className="w-20 h-4" />
    <Skeleton className="w-4 h-4" />
    <Skeleton className="flex-1 h-4 max-w-md" />
    <Skeleton className="w-16 h-5" />
    <Skeleton className="w-6 h-6 rounded-full" />
  </div>
);
