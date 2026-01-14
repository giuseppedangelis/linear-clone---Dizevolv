
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Issue, Status, Priority, User, ViewType, Team, FilterState, Cycle, Project, Comment, Activity, IntegrationData, Theme } from './types';

export interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  icon?: string;
}

interface AppState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;

  // Navigation & Theme
  currentView: ViewType;
  setView: (view: ViewType) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  selectedCycleId: string | null;
  setSelectedCycle: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProject: (id: string | null) => void;

  // Data
  issues: Issue[];
  cycles: Cycle[];
  projects: Project[];
  currentUser: User;
  currentTeam: Team;

  // Selection & Keyboard Nav
  activeIssueIndex: number;
  selectedIssueId: string | null;
  bulkSelectedIds: Set<string>;

  // UI State
  isCreateModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  isFilterSidebarOpen: boolean;
  isHelpModalOpen: boolean;
  filters: FilterState;
  savedViews: SavedView[];
  boardCompact: boolean;

  // Actions
  setActiveIssueIndex: (index: number) => void;
  setSelectedIssue: (id: string | null) => void;
  toggleBulkSelect: (id: string) => void;
  clearBulkSelect: () => void;
  toggleCreateModal: () => void;
  toggleCommandPalette: () => void;
  toggleFilterSidebar: () => void;
  toggleHelpModal: () => void;
  toggleBoardMode: () => void;
  setFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssues: (ids: string[]) => void;

  // Collaboration Actions
  addComment: (issueId: string, comment: Partial<Comment>) => void;
  updateComment: (issueId: string, commentId: string, body: string) => void;
  deleteComment: (issueId: string, commentId: string) => void;
  toggleReaction: (issueId: string, commentId: string, emoji: string) => void;

  // Integration Actions
  linkGithubPR: (issueId: string, githubData: IntegrationData['github']) => void;
  linkFigmaFile: (issueId: string, figmaData: IntegrationData['figma']) => void;
  shareToSlack: (issueId: string, slackData: IntegrationData['slack']) => void;

  saveCurrentView: (name: string) => void;
  applySavedView: (view: SavedView) => void;

  // Project Actions
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;

  // Cycle Actions
  addCycle: (cycle: Cycle) => void;
  moveIssueToCycle: (issueId: string, cycleId: string | null) => void;
}

const MOCK_USER: User = {
  id: 'u-1',
  name: 'Senior Dev',
  email: 'dev@artti.capital',
  avatar: 'https://i.pravatar.cc/150?u=u1',
  role: 'admin'
};

const MOCK_TEAM: Team = {
  id: 't-1',
  name: 'Artti Engineering',
  identifier: 'ART',
  members: [
    MOCK_USER,
    { id: 'u-2', name: 'Frontend Jane', email: 'jane@artti.capital', avatar: 'https://i.pravatar.cc/150?u=u2', role: 'member' },
    { id: 'u-3', name: 'Backend Bob', email: 'bob@artti.capital', avatar: 'https://i.pravatar.cc/150?u=u3', role: 'member' }
  ]
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Platform Infrastructure',
    description: 'Scaling our core microservices and database layer for Q3 growth.',
    status: 'started',
    startDate: '2024-01-15',
    targetDate: '2024-06-30',
    lead: MOCK_USER,
    icon: '🚀',
    members: [MOCK_USER],
    milestones: [
      { id: 'm1', name: 'Database Migration', targetDate: '2024-03-01', status: 'completed' },
      { id: 'm2', name: 'Autoscaling Implementation', targetDate: '2024-05-15', status: 'pending' }
    ]
  }
];

const INITIAL_FILTERS: FilterState = {
  status: [],
  priority: [],
  assignees: [],
  search: '',
  sortKey: 'priority',
  sortOrder: 'desc'
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ user: MOCK_USER, isAuthenticated: true });
      },
      signup: async (name, email, password) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        set({ user: { id: 'u-' + Math.random(), name, email, role: 'member' }, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, currentView: 'dashboard' });
      },

      currentView: 'dashboard',
      setView: (view) => set({ currentView: view }),
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      selectedCycleId: null,
      setSelectedCycle: (id) => set({ selectedCycleId: id }),
      selectedProjectId: null,
      setSelectedProject: (id) => set({ selectedProjectId: id }),

      issues: [
        {
          id: '1',
          key: 'ART-1',
          title: 'Initialize repository with Next.js and Tailwind',
          description: 'Setup the base structure of the Linear clone.',
          status: Status.DONE,
          priority: Priority.HIGH,
          creator: MOCK_USER,
          team: MOCK_TEAM,
          labels: [{ id: 'l1', name: 'Setup', color: '#FF5500' }],
          comments: [],
          activities: [
            { id: 'a1', issueId: '1', user: MOCK_USER, type: 'create', createdAt: new Date(Date.now() - 86400000).toISOString() }
          ],
          project: INITIAL_PROJECTS[0],
          integrations: {
            github: {
              prNumber: 42,
              prTitle: 'feat: add base framework setup',
              prStatus: 'merged',
              prUrl: 'https://github.com/artti/linear-clone/pull/42',
              branchName: 'main',
              repoName: 'linear-clone'
            }
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      cycles: [
        {
          id: 'c1',
          name: 'Sprint 1: Foundation',
          number: 1,
          startDate: new Date(Date.now() - 604800000).toISOString(),
          endDate: new Date(Date.now() + 604800000).toISOString()
        }
      ],
      projects: INITIAL_PROJECTS,
      currentUser: MOCK_USER,
      currentTeam: MOCK_TEAM,

      activeIssueIndex: 0,
      selectedIssueId: null,
      bulkSelectedIds: new Set(),

      isCreateModalOpen: false,
      isCommandPaletteOpen: false,
      isFilterSidebarOpen: false,
      isHelpModalOpen: false,
      boardCompact: false,
      filters: INITIAL_FILTERS,
      savedViews: [],

      setActiveIssueIndex: (activeIssueIndex) => set({ activeIssueIndex }),
      setSelectedIssue: (id) => set({ selectedIssueId: id }),
      toggleBulkSelect: (id) => set((state) => {
        const next = new Set(state.bulkSelectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return { bulkSelectedIds: next };
      }),
      clearBulkSelect: () => set({ bulkSelectedIds: new Set() }),
      toggleCreateModal: () => set((state) => ({ isCreateModalOpen: !state.isCreateModalOpen })),
      toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
      toggleFilterSidebar: () => set((state) => ({ isFilterSidebarOpen: !state.isFilterSidebarOpen })),
      toggleHelpModal: () => set((state) => ({ isHelpModalOpen: !state.isHelpModalOpen })),
      toggleBoardMode: () => set((state) => ({ boardCompact: !state.boardCompact })),
      setFilters: (updates) => set((state) => ({ filters: { ...state.filters, ...updates } })),
      resetFilters: () => set({ filters: INITIAL_FILTERS }),

      addIssue: (issue) => set((state) => ({
        issues: [{ ...issue, activities: [{ id: Math.random().toString(), issueId: issue.id, user: state.currentUser, type: 'create', createdAt: new Date().toISOString() }], comments: [] }, ...state.issues]
      })),

      updateIssue: (id, updates) => set((state) => {
        const currentIssue = state.issues.find(i => i.id === id);
        if (!currentIssue) return state;

        const newActivities: Activity[] = [];
        const now = new Date().toISOString();

        if (updates.status && updates.status !== currentIssue.status) {
          newActivities.push({ id: Math.random().toString(), issueId: id, user: state.currentUser, type: 'status', oldValue: currentIssue.status, newValue: updates.status, createdAt: now });
        }
        if (updates.priority && updates.priority !== currentIssue.priority) {
          newActivities.push({ id: Math.random().toString(), issueId: id, user: state.currentUser, type: 'priority', oldValue: currentIssue.priority, newValue: updates.priority, createdAt: now });
        }
        if (updates.assignee !== undefined && updates.assignee?.id !== currentIssue.assignee?.id) {
          newActivities.push({ id: Math.random().toString(), issueId: id, user: state.currentUser, type: 'assignee', oldValue: currentIssue.assignee?.name || 'Unassigned', newValue: updates.assignee?.name || 'Unassigned', createdAt: now });
        }

        return {
          issues: state.issues.map(i => i.id === id ? {
            ...i,
            ...updates,
            activities: [...i.activities, ...newActivities],
            updatedAt: now
          } : i)
        };
      }),

      addComment: (issueId, commentData) => set((state) => {
        const newComment: Comment = {
          id: Math.random().toString(),
          issueId,
          user: state.currentUser,
          body: commentData.body || '',
          reactions: [],
          parentId: commentData.parentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const newActivity: Activity = { id: Math.random().toString(), issueId, user: state.currentUser, type: 'comment', createdAt: new Date().toISOString() };

        return {
          issues: state.issues.map(i => i.id === issueId ? { ...i, comments: [...i.comments, newComment], activities: [...i.activities, newActivity] } : i)
        };
      }),

      updateComment: (issueId, commentId, body) => set((state) => ({
        issues: state.issues.map(i => i.id === issueId ? {
          ...i,
          comments: i.comments.map(c => c.id === commentId ? { ...c, body, updatedAt: new Date().toISOString() } : c)
        } : i)
      })),

      deleteComment: (issueId, commentId) => set((state) => ({
        issues: state.issues.map(i => i.id === issueId ? {
          ...i,
          comments: i.comments.filter(c => c.id !== commentId)
        } : i)
      })),

      toggleReaction: (issueId, commentId, emoji) => set((state) => ({
        issues: state.issues.map(i => i.id === issueId ? {
          ...i,
          comments: i.comments.map(c => {
            if (c.id !== commentId) return c;
            const existingReaction = c.reactions.find(r => r.emoji === emoji);
            let nextReactions;
            if (existingReaction) {
              const hasUser = existingReaction.userIds.includes(state.currentUser.id);
              nextReactions = c.reactions.map(r => r.emoji === emoji ? {
                ...r,
                userIds: hasUser ? r.userIds.filter(uid => uid !== state.currentUser.id) : [...r.userIds, state.currentUser.id]
              } : r).filter(r => r.userIds.length > 0);
            } else {
              nextReactions = [...c.reactions, { emoji, userIds: [state.currentUser.id] }];
            }
            return { ...c, reactions: nextReactions };
          })
        } : i)
      })),

      linkGithubPR: (issueId, githubData) => set((state) => ({
        issues: state.issues.map(i => i.id === issueId ? {
          ...i,
          integrations: { ...i.integrations, github: githubData },
          activities: [...i.activities, { id: Math.random().toString(), issueId, user: state.currentUser, type: 'integration', newValue: `Linked GitHub PR #${githubData?.prNumber}`, createdAt: new Date().toISOString() }]
        } : i)
      })),

      linkFigmaFile: (issueId, figmaData) => set((state) => ({
        issues: state.issues.map(i => i.id === issueId ? {
          ...i,
          integrations: { ...i.integrations, figma: figmaData },
          activities: [...i.activities, { id: Math.random().toString(), issueId, user: state.currentUser, type: 'integration', newValue: `Linked Figma design: ${figmaData?.fileName}`, createdAt: new Date().toISOString() }]
        } : i)
      })),

      shareToSlack: (issueId, slackData) => set((state) => ({
        issues: state.issues.map(i => i.id === issueId ? {
          ...i,
          integrations: { ...i.integrations, slack: slackData },
          activities: [...i.activities, { id: Math.random().toString(), issueId, user: state.currentUser, type: 'integration', newValue: `Shared to Slack #${slackData?.channelName}`, createdAt: new Date().toISOString() }]
        } : i)
      })),

      deleteIssues: (ids) => set((state) => ({
        issues: state.issues.filter(i => !ids.includes(i.id)),
        bulkSelectedIds: new Set()
      })),

      saveCurrentView: (name) => set((state) => ({
        savedViews: [...state.savedViews, { id: Math.random().toString(), name, filters: state.filters }]
      })),
      applySavedView: (view) => set({ filters: view.filters, currentView: 'issues' }),

      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      addCycle: (cycle) => set((state) => ({ cycles: [...state.cycles, cycle] })),
      moveIssueToCycle: (issueId, cycleId) => set((state) => {
        const cycle = state.cycles.find(c => c.id === cycleId) || undefined;
        return {
          issues: state.issues.map(i => i.id === issueId ? { ...i, cycle } : i)
        };
      })
    }),
    {
      name: 'artti-linear-clone-storage-v13',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        savedViews: state.savedViews,
        cycles: state.cycles,
        projects: state.projects,
        theme: state.theme
      }),
    }
  )
);
