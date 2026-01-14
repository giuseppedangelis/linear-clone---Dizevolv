
import React, { useMemo } from 'react';
import { useStore } from '../store';
import { Status, Priority, Issue } from '../types';
import { PriorityIcon, StatusIcon } from './Icons';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Added interface for BoardCard props to fix TS error when passing key in map
interface BoardCardProps {
  issue: Issue;
  compact: boolean;
}

// Updated to React.FC to properly handle React internal props like 'key'
const BoardCard: React.FC<BoardCardProps> = ({ issue, compact }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
    data: { type: 'Issue', issue },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  const { setSelectedIssue, setView } = useStore();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => { setSelectedIssue(issue.id); setView('issue-detail'); }}
      className={`group bg-[#16161a] border border-[#1f1f23] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-teal-500/40 transition-all shadow-sm ${compact ? 'py-2' : ''}`}
    >
      <div className="flex items-start gap-3 mb-2">
        <PriorityIcon priority={issue.priority} size={14} />
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">{issue.key}</span>
      </div>
      <p className={`text-sm leading-snug transition-colors group-hover:text-white ${compact ? 'truncate' : 'line-clamp-2'}`}>
        {issue.title}
      </p>
      {!compact && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {issue.labels.slice(0, 2).map(l => (
              <Badge key={l.id} size="sm" style={{ color: l.color, borderColor: `${l.color}30` }}>{l.name}</Badge>
            ))}
          </div>
          <Avatar src={issue.assignee?.avatar} name={issue.assignee?.name} size="xs" />
        </div>
      )}
    </div>
  );
};

// Added interface for BoardColumn props to fix TS error when passing key in map
interface BoardColumnProps {
  status: Status;
  issues: Issue[];
  compact: boolean;
}

// Updated to React.FC to properly handle React internal props like 'key'
const BoardColumn: React.FC<BoardColumnProps> = ({ status, issues, compact }) => {
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: 'Column', status },
  });

  return (
    <div ref={setNodeRef} className="kanban-column flex flex-col h-full bg-[#080809]/30 rounded-xl border border-transparent hover:bg-[#080809]/50 transition-colors">
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 bg-[#0c0c0e]/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <StatusIcon status={status} size={14} />
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{status}</h3>
          <span className="text-[10px] font-medium text-gray-600 bg-[#16161a] px-1.5 py-0.5 rounded-full">{issues.length}</span>
        </div>
        <button className="text-gray-600 hover:text-gray-400">
           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-2 pb-10 space-y-2">
        <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {issues.map(issue => (
            <BoardCard key={issue.id} issue={issue} compact={compact} />
          ))}
        </SortableContext>
        {issues.length === 0 && (
          <div className="h-24 border-2 border-dashed border-[#1f1f23] rounded-lg flex items-center justify-center text-[10px] text-gray-700 font-medium">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const { issues, updateIssue, boardCompact, toggleBoardMode, filters } = useStore();
  const [activeIssue, setActiveIssue] = React.useState<Issue | null>(null);

  const filteredIssues = useMemo(() => {
    let list = issues;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q));
    }
    return list;
  }, [issues, filters.search]);

  const columns = useMemo(() => {
    return Object.values(Status).reduce((acc, status) => {
      acc[status] = filteredIssues.filter(i => i.status === status);
      return acc;
    }, {} as Record<Status, Issue[]>);
  }, [filteredIssues]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Issue') {
      setActiveIssue(event.active.data.current.issue);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIssueId = active.id as string;
    const overId = over.id as string;

    // Determine if we dropped onto a column or another card
    let newStatus: Status | null = null;
    
    // Check if over a column
    if (over.data.current?.type === 'Column') {
      newStatus = over.data.current.status;
    } 
    // Check if over a card in a column
    else if (over.data.current?.type === 'Issue') {
      newStatus = over.data.current.issue.status;
    }

    if (newStatus && activeIssue?.status !== newStatus) {
      updateIssue(activeIssueId, { status: newStatus });
    }
    setActiveIssue(null);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
      <header className="h-12 flex items-center justify-between px-6 border-b border-[#1f1f23] shrink-0 bg-[#0c0c0e]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
           <h2 className="text-sm font-semibold flex items-center gap-2">
             <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
             Board View
           </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleBoardMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border border-[#2d2d31] transition-all ${boardCompact ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1e]'}`}
          >
            {boardCompact ? 'Detailed' : 'Compact'}
          </button>
          <div className="w-px h-4 bg-[#1f1f23]" />
          <button className="p-1.5 text-gray-500 hover:text-gray-200"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex h-full gap-4 items-start pb-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            {Object.values(Status).map(status => (
              <BoardColumn
                key={status}
                status={status}
                issues={columns[status]}
                compact={boardCompact}
              />
            ))}
            
            <DragOverlay dropAnimation={null}>
              {activeIssue ? (
                <div className="w-[300px] pointer-events-none scale-105 rotate-2">
                   <BoardCard issue={activeIssue} compact={boardCompact} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
    </div>
  );
};

export default KanbanBoard;
