
import React from 'react';
import { Issue } from '../types';
import { StatusIcon, PriorityIcon } from './Icons';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';

interface IssueRowProps {
  issue: Issue;
  selected: boolean;
  onClick: () => void;
}

const IssueRow: React.FC<IssueRowProps> = ({ issue, selected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-selected={selected}
      aria-label={`Issue ${issue.key}: ${issue.title}. Status: ${issue.status}. Priority: ${issue.priority}.`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      className={`group flex items-center gap-4 px-4 py-2.5 cursor-pointer border-b border-app-border transition-all relative ${
        selected ? 'bg-app-surface ring-1 ring-inset ring-brand-primary/20 shadow-sm' : 'hover:bg-app-surface/50'
      }`}
    >
      {selected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-primary animate-in fade-in slide-in-from-left-1" />
      )}

      <div className="flex items-center gap-3 min-w-[100px] shrink-0">
        <PriorityIcon priority={issue.priority} size={14} />
        <span className="text-[11px] font-mono text-content-secondary group-hover:text-content-primary transition-colors uppercase tracking-tight">
          {issue.key}
        </span>
      </div>
      
      <div className="flex items-center shrink-0">
        <StatusIcon status={issue.status} size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate transition-colors ${selected ? 'text-content-primary font-semibold' : 'text-content-secondary group-hover:text-content-primary'}`}>
          {issue.title}
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5">
          {issue.labels.map(label => (
            <Badge key={label.id} size="sm" className="opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: label.color, borderColor: `${label.color}40`, backgroundColor: `${label.color}10` }}>
              {label.name}
            </Badge>
          ))}
        </div>
        
        <div className="w-20 text-[10px] text-content-secondary text-right font-medium font-mono">
          {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>

        <div className="w-6 h-6 flex justify-end">
          <Avatar 
            src={issue.assignee?.avatar} 
            name={issue.assignee?.name} 
            size="sm" 
            className={`${issue.assignee ? 'grayscale-0' : 'opacity-20'} transition-all`} 
          />
        </div>
      </div>
    </div>
  );
};

export default IssueRow;
