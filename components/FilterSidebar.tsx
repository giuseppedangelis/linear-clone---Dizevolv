
import React from 'react';
import { useStore } from '../store';
import { Status, Priority } from '../types';
import { StatusIcon, PriorityIcon } from './Icons';
import { Button } from './ui/Button';

const FilterSidebar = () => {
  const { filters, setFilters, resetFilters, isFilterSidebarOpen, toggleFilterSidebar } = useStore();

  if (!isFilterSidebarOpen) return null;

  const toggleStatus = (status: Status) => {
    const next = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    setFilters({ status: next });
  };

  const togglePriority = (priority: Priority) => {
    const next = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    setFilters({ priority: next });
  };

  return (
    <aside className="w-64 border-l border-[#1f1f23] bg-[#080809] flex flex-col animate-in slide-in-from-right duration-200">
      <header className="h-12 flex items-center justify-between px-4 border-b border-[#1f1f23]">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Filters</span>
        <button onClick={toggleFilterSidebar} className="text-gray-600 hover:text-gray-300">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <div>
          <h4 className="text-[11px] font-semibold text-gray-400 mb-3">Status</h4>
          <div className="space-y-1">
            {Object.values(Status).map((s) => (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                  filters.status.includes(s) ? 'bg-[#1a1a1e] text-white' : 'text-gray-500 hover:bg-[#16161a]'
                }`}
              >
                <StatusIcon status={s} size={12} />
                <span className="flex-1 text-left">{s}</span>
                {filters.status.includes(s) && <div className="w-1 h-1 rounded-full bg-teal-500" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold text-gray-400 mb-3">Priority</h4>
          <div className="space-y-1">
            {Object.values(Priority).map((p) => (
              <button
                key={p}
                onClick={() => togglePriority(p)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                  filters.priority.includes(p) ? 'bg-[#1a1a1e] text-white' : 'text-gray-500 hover:bg-[#16161a]'
                }`}
              >
                <PriorityIcon priority={p} size={12} />
                <span className="flex-1 text-left">{p}</span>
                {filters.priority.includes(p) && <div className="w-1 h-1 rounded-full bg-orange-500" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold text-gray-400 mb-3">Assignees</h4>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-2 py-1 rounded border border-[#2d2d31] text-[10px] text-gray-500 hover:border-teal-500/50 hover:text-gray-300 transition-all">
              <img src="https://picsum.photos/32/32" className="w-4 h-4 rounded-full" alt="" />
              Assignee to me
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#1f1f23]">
        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={resetFilters}>
          Clear all filters
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
