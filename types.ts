
export enum Priority {
  URGENT = 'Urgent',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  NONE = 'No priority'
}

export enum Status {
  BACKLOG = 'Backlog',
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
  CANCELED = 'Canceled'
}

export type UserRole = 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
}

export interface Team {
  id: string;
  name: string;
  identifier: string; // e.g., "ART"
  members: User[];
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  status: 'pending' | 'completed';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planned' | 'started' | 'paused' | 'completed' | 'canceled';
  targetDate?: string;
  startDate?: string;
  lead?: User;
  icon?: string;
  members: User[];
  milestones: Milestone[];
}

export interface Cycle {
  id: string;
  name: string;
  number: number;
  startDate: string;
  endDate: string;
  completedAt?: string;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface Comment {
  id: string;
  issueId: string;
  user: User;
  body: string;
  reactions: Reaction[];
  parentId?: string; // For threading
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = 'status' | 'priority' | 'assignee' | 'label' | 'comment' | 'create' | 'integration';

export interface Activity {
  id: string;
  issueId: string;
  user: User;
  type: ActivityType;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface IntegrationData {
  github?: {
    prNumber: number;
    prTitle: string;
    prStatus: 'open' | 'closed' | 'merged' | 'draft';
    prUrl: string;
    branchName: string;
    repoName: string;
  };
  figma?: {
    fileName: string;
    fileUrl: string;
    lastUpdated: string;
    previewUrl?: string;
  };
  slack?: {
    channelName: string;
    threadUrl: string;
    messageCount: number;
  };
}

export interface Issue {
  id: string;
  key: string; 
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assignee?: User;
  creator: User;
  team: Team;
  project?: Project;
  cycle?: Cycle;
  labels: Label[];
  comments: Comment[];
  activities: Activity[];
  integrations?: IntegrationData;
  createdAt: string;
  updatedAt: string;
}

export type SortKey = 'priority' | 'status' | 'updatedAt' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  status: Status[];
  priority: Priority[];
  assignees: string[];
  search: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
}

export type Theme = 'light' | 'dark' | 'high-contrast';

export type ViewType = 'dashboard' | 'issues' | 'board' | 'projects' | 'project-detail' | 'resource-planning' | 'roadmap' | 'cycles' | 'cycle-detail' | 'settings' | 'issue-detail';

export type AuthViewType = 'login' | 'signup' | 'forgot-password' | 'reset-password';

export interface Analytics {
  velocity: {
    cycleName: string;
    completed: number;
    total: number;
  }[];
  cycleTime: {
    min: number;
    max: number;
    average: number;
    median: number;
    distribution: { days: number; count: number }[];
  };
  burndown: {
    day: string;
    expected: number;
    actual: number;
  }[];
  statusBreakdown: { name: string; value: number }[];
  activityMap: { date: string; count: number }[];
}
