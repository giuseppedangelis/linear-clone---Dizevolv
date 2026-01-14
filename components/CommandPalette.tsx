
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';

const CommandPalette = () => {
  const { isCommandPaletteOpen, toggleCommandPalette, setView, applySavedView, savedViews } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSelectedIndex(0);
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const baseCommands = [
    { id: 'issues', name: 'Go to Issues', icon: '📋', type: 'command', action: () => setView('issues') },
    { id: 'projects', name: 'Go to Projects', icon: '📁', type: 'command', action: () => setView('projects') },
    { id: 'cycles', name: 'Go to Cycles', icon: '🔄', type: 'command', action: () => setView('cycles') },
    { id: 'create', name: 'Create new issue', icon: '➕', type: 'command', action: () => useStore.getState().toggleCreateModal() },
  ];

  const viewCommands = savedViews.map(v => ({
    id: v.id,
    name: `View: ${v.name}`,
    icon: '📂',
    type: 'view',
    action: () => applySavedView(v)
  }));

  const allItems = [...baseCommands, ...viewCommands];
  const filteredItems = allItems.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') toggleCommandPalette();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        selected.action();
        toggleCommandPalette();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0c0c0e] border border-[#2d2d31] rounded-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-[#1f1f23]">
          <span className="text-gray-500 mr-3 text-lg">🔍</span>
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent text-gray-200 focus:outline-none text-base font-medium placeholder:text-gray-700"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1.5 ml-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[#1f1f23] text-[10px] text-gray-600 font-mono border border-[#2d2d31]">ESC</kbd>
          </div>
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filteredItems.length > 0 ? (
            <div className="space-y-0.5">
              {filteredItems.map((item, idx) => (
                <button
                  key={item.id}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    item.action();
                    toggleCommandPalette();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors group relative ${
                    idx === selectedIndex ? 'bg-[#1a1a1e]' : ''
                  }`}
                >
                  {idx === selectedIndex && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-teal-500 rounded-r-full" />
                  )}
                  <span className={`text-lg transition-opacity ${idx === selectedIndex ? 'opacity-100' : 'opacity-40'}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <span className={`text-sm block ${idx === selectedIndex ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {item.name}
                    </span>
                    {item.type === 'view' && (
                      <span className="text-[10px] text-gray-600 block uppercase tracking-tight">Saved View</span>
                    )}
                  </div>
                  {idx === selectedIndex && (
                    <kbd className="text-[10px] text-gray-600 font-mono">ENTER</kbd>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-600 flex flex-col items-center gap-2">
              <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>No results for "{query}"</span>
            </div>
          )}
        </div>

        <footer className="px-4 py-2 bg-[#080809] border-t border-[#1f1f23] flex items-center justify-between text-[10px] text-gray-600">
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-1"><kbd className="bg-[#1f1f23] px-1 rounded">↑↓</kbd> Navigate</span>
             <span className="flex items-center gap-1"><kbd className="bg-[#1f1f23] px-1 rounded">↵</kbd> Select</span>
          </div>
          <span>Linear Clone Core</span>
        </footer>
      </div>
      <div className="fixed inset-0 -z-10" onClick={toggleCommandPalette} />
    </div>
  );
};

export default CommandPalette;
