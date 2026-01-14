
import React from 'react';
import { Activity, ActivityType } from '../types';
import { Avatar } from './ui/Avatar';
import { StatusIcon, PriorityIcon } from './Icons';

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'status': return <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />;
    case 'priority': return <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />;
    case 'assignee': return <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />;
    case 'comment': return <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />;
    case 'create': return <div className="w-1.5 h-1.5 rounded-full bg-green-500" />;
    default: return <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />;
  }
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
};

export const ActivityFeed: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  const sorted = [...activities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#1f1f23]">
      {sorted.map((activity) => (
        <div key={activity.id} className="flex gap-4 relative z-10">
          <div className="mt-1.5 shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-[#0c0c0e] ring-4 ring-[#0c0c0e]">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 flex items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-xs text-gray-400">
                <Avatar src={activity.user.avatar} name={activity.user.name} size="xs" />
                <span className="font-semibold text-gray-200">{activity.user.name}</span>
                {activity.type === 'create' && <span>created the issue</span>}
                {activity.type === 'status' && (
                  <span className="flex items-center gap-1">
                    changed status from <span className="text-gray-500 italic">{activity.oldValue}</span> to <span className="text-teal-400 font-medium">{activity.newValue}</span>
                  </span>
                )}
                {activity.type === 'assignee' && (
                  <span>assigned this to <span className="text-blue-400">{activity.newValue}</span></span>
                )}
                {activity.type === 'comment' && <span>commented</span>}
             </div>
             <div className="text-[10px] text-gray-600 font-mono whitespace-nowrap" title={new Date(activity.createdAt).toLocaleString()}>
               {formatRelativeTime(activity.createdAt)}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
