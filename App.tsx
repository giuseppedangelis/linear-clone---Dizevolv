
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import IssueList from './components/IssueList';
import IssueDetail from './components/IssueDetail';
import Dashboard from './app/Dashboard';
import Settings from './app/Settings';
import Auth from './app/Auth';
import CreateIssueModal from './components/CreateIssueModal';
import CommandPalette from './components/CommandPalette';
import { HelpModal } from './components/HelpModal';
import KanbanBoard from './components/Board';
import CycleManager from './components/CycleManager';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import Roadmap from './components/Roadmap';
import ResourcePlanning from './components/ResourcePlanning';
import { useStore } from './store';
import { Priority, Status } from './types';

const App: React.FC = () => {
  const {
    isAuthenticated,
    currentView,
    setView,
    theme,
    toggleCreateModal,
    toggleCommandPalette,
    toggleHelpModal,
    isCreateModalOpen,
    isCommandPaletteOpen,
    isHelpModalOpen,
    isFilterSidebarOpen,
    toggleFilterSidebar,
    activeIssueIndex,
    setActiveIssueIndex,
    issues,
    updateIssue,
    currentUser,
    setSelectedIssue,
    filters
  } = useStore();

  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    if (theme === 'dark' || theme === 'high-contrast') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const visibleIssues = useMemo(() => {
    let list = [...issues];
    if (filters.status.length > 0) {
      list = list.filter(i => filters.status.includes(i.status));
    } else if (currentView === 'issues') {
      list = list.filter(i => i.status !== Status.DONE && i.status !== Status.BACKLOG);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q));
    }
    return list;
  }, [issues, filters, currentView]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
      const isCmd = e.metaKey || e.ctrlKey;

      // Global Escape
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) toggleCommandPalette();
        else if (isCreateModalOpen) toggleCreateModal();
        else if (isHelpModalOpen) toggleHelpModal();
        else if (isFilterSidebarOpen) toggleFilterSidebar();
        else if (currentView === 'issue-detail') setView('issues');
        else if (currentView === 'project-detail') setView('projects');
        return;
      }

      if (isCmd && e.key === 'k') { e.preventDefault(); toggleCommandPalette(); return; }
      if (isCmd && e.key === 'n') { e.preventDefault(); toggleCreateModal(); return; }
      if (isCmd && e.key === 'd') { e.preventDefault(); setView('dashboard'); return; }

      if (isInput) return;

      // Handle Sequences (G then X)
      if (lastKeyPressed === 'g') {
        setLastKeyPressed(null);
        if (e.key === 'd') { setView('dashboard'); return; }
        if (e.key === 'i') { setView('issues'); return; }
        if (e.key === 'b') { setView('board'); return; }
        if (e.key === 'p') { setView('projects'); return; }
        if (e.key === 'r') { setView('roadmap'); return; }
        if (e.key === 'c') { setView('cycles'); return; }
      }

      if (e.key === 'g') {
        setLastKeyPressed('g');
        // Auto clear after 1s
        setTimeout(() => setLastKeyPressed(null), 1000);
        return;
      }

      // Single Key Shortcuts
      if (e.key === 'c') { toggleCreateModal(); return; }
      if (e.key === 'f') { toggleFilterSidebar(); return; }
      if (e.key === '?') { toggleHelpModal(); return; }

      // Issue Actions on currently active issue
      const activeIssue = visibleIssues[activeIssueIndex];
      if (activeIssue) {
        if (e.key === 'a') {
          updateIssue(activeIssue.id, { assignee: currentUser });
          return;
        }
        if (e.key === 'p') {
          const priorities = Object.values(Priority);
          const currentIdx = priorities.indexOf(activeIssue.priority);
          const next = priorities[(currentIdx + 1) % priorities.length];
          updateIssue(activeIssue.id, { priority: next });
          return;
        }
        if (e.key === 's') {
          const statuses = Object.values(Status);
          const currentIdx = statuses.indexOf(activeIssue.status);
          const next = statuses[(currentIdx + 1) % statuses.length];
          updateIssue(activeIssue.id, { status: next });
          return;
        }
      }

      // Navigation
      if (e.key === 'j') {
        e.preventDefault();
        const next = Math.min(activeIssueIndex + 1, visibleIssues.length - 1);
        setActiveIssueIndex(next);
      }
      if (e.key === 'k') {
        e.preventDefault();
        const prev = Math.max(activeIssueIndex - 1, 0);
        setActiveIssueIndex(prev);
      }
      if (e.key === 'o' || e.key === 'Enter') {
        e.preventDefault();
        if (activeIssue) {
          setSelectedIssue(activeIssue.id);
          setView('issue-detail');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isAuthenticated,
    toggleCreateModal, toggleCommandPalette, toggleFilterSidebar, toggleHelpModal,
    isCreateModalOpen, isCommandPaletteOpen, isHelpModalOpen, isFilterSidebarOpen,
    currentView, setView, activeIssueIndex, setActiveIssueIndex,
    visibleIssues, setSelectedIssue, lastKeyPressed, updateIssue, currentUser
  ]);

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'issues': return <IssueList />;
      case 'board': return <KanbanBoard />;
      case 'issue-detail': return <IssueDetail />;
      case 'cycles': return <CycleManager />;
      case 'projects': return <ProjectList />;
      case 'project-detail': return <ProjectDetail />;
      case 'roadmap': return <Roadmap />;
      case 'resource-planning': return <ResourcePlanning />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-app-bg text-content-primary overflow-hidden font-sans transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col relative min-w-0" role="main">
        {renderView()}

        {!isCommandPaletteOpen && !isCreateModalOpen && !isHelpModalOpen && (
          <div className="fixed bottom-6 right-6 flex items-center gap-4 bg-app-surface/90 backdrop-blur-md px-3 py-2 rounded-lg border border-app-border-strong shadow-2xl transition-all hover:border-brand-primary/30 z-[90]">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-app-border-strong text-[10px] rounded font-mono text-content-secondary border border-app-border shadow-inner">J</kbd>
              <kbd className="px-1.5 py-0.5 bg-app-border-strong text-[10px] rounded font-mono text-content-secondary border border-app-border shadow-inner">K</kbd>
              <span className="text-[11px] text-content-secondary ml-1">Navigate</span>
            </div>
            <div className="w-px h-3 bg-app-border-strong" />
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-app-border-strong text-[10px] rounded font-mono text-content-secondary border border-app-border shadow-inner">?</kbd>
              <span className="text-[11px] text-content-secondary">Help</span>
            </div>
          </div>
        )}
      </div>

      <CreateIssueModal />
      <CommandPalette />
      <HelpModal />
    </div>
  );
};

export default App;
