
import React, { useState } from 'react';
import { useStore } from '../store';
import { ViewType } from '../types';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  shortcut?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick, shortcut }) => (
  <button
    onClick={onClick}
    className={`w-full group flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${active ? 'bg-app-border-strong text-content-primary shadow-sm' : 'text-content-secondary hover:bg-app-surface hover:text-content-primary'}`}
  >
    <span className={`${active ? 'text-brand-primary' : 'text-content-secondary group-hover:text-content-primary'}`}>{icon}</span>
    <span className="flex-1 text-left truncate">{label}</span>
    {shortcut && <span className="text-[9px] opacity-0 group-hover:opacity-40 font-mono tracking-tighter">{shortcut}</span>}
  </button>
);

const Sidebar = () => {
  const { currentView, setView, toggleCreateModal, currentTeam, savedViews, applySavedView, user, logout } = useStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <aside className="w-60 bg-app-sidebar border-r border-app-border flex flex-col h-full py-3 select-none shrink-0 overflow-hidden transition-colors duration-200">
      <div className="px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <div className="w-6 h-6 bg-brand-primary rounded flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-brand-primary/20">
            {currentTeam.identifier[0]}
          </div>
          <span className="truncate">{currentTeam.name}</span>
          <svg className="w-3 h-3 text-content-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      <div className="px-2 space-y-0.5 mb-6">
        <button
          onClick={toggleCreateModal}
          className="w-full mb-3 bg-app-surface hover:bg-app-border-strong border border-app-border py-1.5 px-3 rounded text-[13px] text-content-secondary flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-content-secondary group-hover:text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span>New Issue</span>
          </div>
          <span className="text-[9px] text-content-secondary font-mono bg-app-bg px-1 rounded border border-app-border">C</span>
        </button>

        <NavItem
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          label="Dashboard"
          active={currentView === 'dashboard'}
          onClick={() => setView('dashboard')}
          shortcut="G D"
        />
        <NavItem
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          label="All Issues"
          active={currentView === 'issues'}
          onClick={() => setView('issues')}
          shortcut="G I"
        />
        <NavItem
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>}
          label="Board"
          active={currentView === 'board'}
          onClick={() => setView('board')}
          shortcut="⇧ B"
        />
        <NavItem
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          label="Roadmap"
          active={currentView === 'roadmap'}
          onClick={() => setView('roadmap')}
          shortcut="G R"
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-4 text-[10px] uppercase font-bold text-content-secondary mb-2 tracking-widest">Saved Views</div>
        <div className="px-2 space-y-0.5 mb-6">
          {savedViews.map(view => (
            <NavItem
              key={view.id}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
              label={view.name}
              onClick={() => applySavedView(view)}
            />
          ))}
        </div>

        <div className="px-4 text-[10px] uppercase font-bold text-content-secondary mb-2 tracking-widest">Workspace</div>
        <div className="px-2 space-y-0.5">
          <NavItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
            label="Projects"
            active={currentView === 'projects' || currentView === 'project-detail'}
            onClick={() => setView('projects')}
            shortcut="G P"
          />
          <NavItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            label="Cycles"
            active={currentView === 'cycles'}
            onClick={() => setView('cycles')}
            shortcut="G C"
          />
          <NavItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            label="Esteira"
            active={currentView === 'resource-planning'}
            onClick={() => setView('resource-planning')}
          />
        </div>
      </div>

      <div className="mt-auto px-2 pb-4 space-y-4">
        <div className="px-2">
          <ThemeSwitcher />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full px-2 py-3 flex items-center gap-3 border-t border-app-border bg-app-sidebar hover:bg-app-surface transition-colors"
          >
            <div className="relative shrink-0">
              <img src={user?.avatar || "https://picsum.photos/32/32?grayscale"} className="w-7 h-7 rounded-full border border-app-border-strong" alt="User" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-app-sidebar" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs text-content-primary font-medium truncate">{user?.name || "Marco Silva"}</div>
              <div className="text-[10px] text-content-secondary truncate capitalize">{user?.role || "Admin"} Plan</div>
            </div>
            <svg className={`w-3 h-3 text-content-secondary transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" /></svg>
          </button>

          {isUserMenuOpen && (
            <div className="absolute bottom-full left-0 w-full mb-1 bg-app-surface border border-app-border-strong rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-1.5 space-y-0.5">
                <button onClick={() => { setView('settings'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-content-secondary hover:text-content-primary hover:bg-app-bg rounded transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile
                </button>
                <button onClick={() => { setView('settings'); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-content-secondary hover:text-content-primary hover:bg-app-bg rounded transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                  Settings
                </button>
                <div className="h-px bg-app-border my-1" />
                <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-error hover:bg-brand-error/10 rounded transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
