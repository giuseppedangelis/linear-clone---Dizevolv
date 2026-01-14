
import React, { useState } from 'react';
import { useStore } from '../store';

// Define ShortcutItem as a React functional component to properly handle standard props like 'key' in JSX
const ShortcutItem: React.FC<{ keys: string[]; label: string }> = ({ keys, label }) => (
  <div className="flex items-center justify-between py-2 group">
    <span className="text-xs text-content-secondary group-hover:text-content-primary transition-colors">{label}</span>
    <div className="flex gap-1">
      {keys.map((key) => (
        <kbd key={key} className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-app-border-strong border border-app-border rounded text-[10px] font-mono text-content-primary shadow-sm uppercase">
          {key}
        </kbd>
      ))}
    </div>
  </div>
);

// Define Section as a React functional component to properly handle standard props like 'key' in JSX
const Section: React.FC<{ title: string; shortcuts: { keys: string[]; label: string }[] }> = ({ title, shortcuts }) => (
  <div className="mb-6">
    <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-3 border-b border-app-border pb-1">
      {title}
    </h3>
    <div className="space-y-0.5">
      {shortcuts.map((s, idx) => (
        <ShortcutItem key={idx} {...s} />
      ))}
    </div>
  </div>
);

export const HelpModal = () => {
  const { isHelpModalOpen, toggleHelpModal } = useStore();
  const [search, setSearch] = useState('');

  if (!isHelpModalOpen) return null;

  const sections = [
    {
      title: 'General',
      shortcuts: [
        { keys: ['Cmd', 'K'], label: 'Command Palette' },
        { keys: ['?'], label: 'Open Shortcuts Help' },
        { keys: ['Cmd', 'N'], label: 'Create New Issue' },
        { keys: ['Esc'], label: 'Close Active Overlay' },
      ],
    },
    {
      title: 'Navigation',
      shortcuts: [
        { keys: ['J'], label: 'Navigate Down' },
        { keys: ['K'], label: 'Navigate Up' },
        { keys: ['Enter'], label: 'Open Selected Item' },
        { keys: ['G', 'D'], label: 'Go to Dashboard' },
        { keys: ['G', 'I'], label: 'Go to Issues' },
        { keys: ['G', 'B'], label: 'Go to Board' },
      ],
    },
    {
      title: 'Issue Actions',
      shortcuts: [
        { keys: ['A'], label: 'Assign to Self' },
        { keys: ['S'], label: 'Cycle Status' },
        { keys: ['P'], label: 'Cycle Priority' },
        { keys: ['E'], label: 'Edit Issue' },
        { keys: ['Del'], label: 'Delete Issue' },
      ],
    },
  ];

  const filteredSections = sections.map(sec => ({
    ...sec,
    shortcuts: sec.shortcuts.filter(s => s.label.toLowerCase().includes(search.toLowerCase()))
  })).filter(sec => sec.shortcuts.length > 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-app-surface border border-app-border-strong rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
      >
        <header className="px-6 py-4 border-b border-app-border flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h2 id="help-title" className="text-sm font-bold text-content-primary">Keyboard Shortcuts</h2>
          </div>
          <div className="flex items-center gap-4">
             <input 
              autoFocus
              type="text" 
              placeholder="Search shortcuts..."
              className="bg-app-bg border border-app-border px-3 py-1 text-xs rounded-md focus:outline-none focus:border-brand-primary/50 transition-all w-48 text-content-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
             />
             <button onClick={toggleHelpModal} className="text-content-secondary hover:text-content-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </header>

        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto grid grid-cols-2 gap-x-12 gap-y-2">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, idx) => (
              <Section key={idx} {...section} />
            ))
          ) : (
            <div className="col-span-2 py-10 text-center text-content-secondary text-xs italic">
              No shortcuts found matching "{search}"
            </div>
          )}
        </div>

        <footer className="px-6 py-4 bg-app-sidebar border-t border-app-border flex items-center justify-between text-[10px] text-content-secondary">
          <p>Linear Clone • Built for performance</p>
          <div className="flex gap-4">
             <span>WCAG 2.1 AA Compliant</span>
             <span>Press <kbd className="bg-app-border-strong px-1 rounded">?</kbd> to toggle</span>
          </div>
        </footer>
      </div>
      <div className="absolute inset-0 -z-10" onClick={toggleHelpModal} aria-hidden="true" />
    </div>
  );
};
