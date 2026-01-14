
import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../store';
import IssueRow from './IssueRow';
import { Tabs } from './ui/Tabs';
import { Button } from './ui/Button';
import { Priority, Status } from '../types';
import FilterSidebar from './FilterSidebar';
import { parseFilterQuery } from '../utils/queryParser';

const IssueList = () => {
  const { 
    issues, 
    selectedIssueId, 
    setSelectedIssue, 
    activeIssueIndex,
    setActiveIssueIndex,
    setView,
    filters, 
    setFilters,
    bulkSelectedIds,
    toggleBulkSelect,
    clearBulkSelect,
    deleteIssues,
    isFilterSidebarOpen,
    toggleFilterSidebar,
    saveCurrentView
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('active');
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search input and parse it for syntax
  useEffect(() => {
    const timer = setTimeout(() => {
      const parsed = parseFilterQuery(searchInput);
      setFilters(parsed);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  const filteredIssues = useMemo(() => {
    let list = [...issues];
    
    // Status filters (from sidebar OR manual syntax)
    if (filters.status.length > 0) {
      list = list.filter(i => filters.status.includes(i.status));
    } else {
      // Tab defaults if no manual status filter is active
      if (activeTab === 'backlog') list = list.filter(i => i.status === Status.BACKLOG);
      else if (activeTab === 'done') list = list.filter(i => i.status === Status.DONE);
      else list = list.filter(i => i.status !== Status.DONE && i.status !== Status.BACKLOG);
    }

    // Priority filters
    if (filters.priority.length > 0) {
      list = list.filter(i => filters.priority.includes(i.priority));
    }

    // Keyword search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q));
    }

    // Sort
    list.sort((a, b) => {
      const order = [Priority.URGENT, Priority.HIGH, Priority.MEDIUM, Priority.LOW, Priority.NONE];
      const valA = order.indexOf(a.priority);
      const valB = order.indexOf(b.priority);
      return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [issues, filters, activeTab]);

  const handleSaveView = () => {
    const name = prompt('Name this view:');
    if (name) saveCurrentView(name);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
        <header className="h-12 flex items-center justify-between px-4 border-b border-[#1f1f23] shrink-0 bg-[#0c0c0e]/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Tabs 
              className="border-none"
              activeTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: 'active', label: 'Active', icon: <div className="w-2 h-2 rounded-full bg-yellow-500" /> },
                { id: 'backlog', label: 'Backlog', icon: <div className="w-2 h-2 rounded-full bg-gray-600" /> },
                { id: 'done', label: 'Done', icon: <div className="w-2 h-2 rounded-full bg-indigo-500" /> },
              ]}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative group">
               <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <input 
                type="text" 
                placeholder='Search... (ex: is:urgent)' 
                className="bg-[#16161a] border border-[#1f1f23] rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/10 transition-all w-40 sm:w-64 placeholder:text-gray-700 text-gray-200"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
               />
            </div>

            <Button variant="ghost" size="xs" onClick={toggleFilterSidebar} className={isFilterSidebarOpen ? 'bg-[#1a1a1e] text-white' : ''}>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filter
            </Button>
            
            <button onClick={handleSaveView} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-[#1a1a1e] rounded transition-colors" title="Save View">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            </button>
          </div>
        </header>

        {/* Sort Headers */}
        <div className="flex items-center gap-4 px-4 py-2 text-[10px] uppercase font-bold text-gray-600 border-b border-[#1f1f23] bg-[#0c0c0e] z-[5]">
          <div className="w-6 shrink-0" />
          <div className="min-w-[100px] shrink-0">Identifier</div>
          <div className="shrink-0 w-8"></div>
          <div className="flex-1">Title</div>
          <div className="w-24 text-right">Updated</div>
          <div className="w-6 shrink-0"></div>
        </div>

        <main className="flex-1 overflow-y-auto pb-20 relative">
          {filteredIssues.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-[#16161a] border border-[#1f1f23] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs text-gray-700 mt-1 max-w-[200px]">Adjust your search or filters to see results.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1f1f23]/50">
              {filteredIssues.map((issue, idx) => (
                <div key={issue.id} className="relative flex items-center group">
                   <div className="pl-4 pr-1 shrink-0 z-10">
                     <input 
                      type="checkbox" 
                      checked={bulkSelectedIds.has(issue.id)}
                      onChange={() => toggleBulkSelect(issue.id)}
                      className="w-3.5 h-3.5 rounded border-[#2d2d31] bg-[#16161a] accent-teal-500 cursor-pointer"
                     />
                   </div>
                   <div className="flex-1 min-w-0">
                      <IssueRow 
                        issue={issue} 
                        selected={idx === activeIssueIndex}
                        onClick={() => {
                          setSelectedIssue(issue.id);
                          setView('issue-detail');
                        }}
                      />
                   </div>
                </div>
              ))}
            </div>
          )}

          {/* Bulk Action Bar */}
          {bulkSelectedIds.size > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#16161a] border border-teal-500/30 rounded-full px-6 py-2 shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-300 z-[100] backdrop-blur-md">
              <span className="text-sm font-medium text-teal-400">{bulkSelectedIds.size} selected</span>
              <div className="w-px h-4 bg-[#2d2d31]" />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="xs" className="text-xs">Update Status</Button>
                <Button variant="ghost" size="xs" className="text-xs">Assign</Button>
                <Button variant="danger" size="xs" onClick={() => deleteIssues(Array.from(bulkSelectedIds))}>Delete</Button>
              </div>
              <button onClick={clearBulkSelect} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </main>
      </div>

      <FilterSidebar />
    </div>
  );
};

export default IssueList;
