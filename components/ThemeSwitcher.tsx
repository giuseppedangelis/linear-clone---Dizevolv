
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Theme } from '../types';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { 
        id: 'light', 
        label: 'Light', 
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg> 
    },
    { 
        id: 'dark', 
        label: 'Dark', 
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> 
    },
    { 
        id: 'high-contrast', 
        label: 'High Contrast', 
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeWidth={2} d="M12 3v18" /></svg> 
    }
  ];

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const currentTheme = themes.find(t => t.id === theme) || themes[1];

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-content-secondary hover:text-content-primary hover:bg-app-surface transition-all border border-app-border"
        title="Switch Theme"
      >
        {currentTheme.icon}
        <span className="capitalize">{theme.replace('-', ' ')}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-48 bg-app-surface border border-app-border-strong rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="p-2 space-y-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeSelect(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded transition-colors ${
                  theme === t.id 
                    ? 'bg-brand-primary/10 text-brand-primary' 
                    : 'text-content-secondary hover:bg-app-bg hover:text-content-primary'
                }`}
              >
                {t.icon}
                <span className="flex-1 text-left">{t.label}</span>
                {theme === t.id && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
