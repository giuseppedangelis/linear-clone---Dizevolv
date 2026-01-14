
import React, { useState } from 'react';
import { useStore } from '../store';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Tabs } from './ui/Tabs';
import IssueRow from './IssueRow';

const ProjectDetail = () => {
  const { selectedProjectId, projects, issues, setView, setSelectedIssue } = useStore();
  const [activeTab, setActiveTab] = useState('issues');
  
  const project = projects.find(p => p.id === selectedProjectId);
  if (!project) return <div className="p-8 text-gray-500">Project not found</div>;

  const projectIssues = issues.filter(i => i.project?.id === project.id);
  const completedCount = projectIssues.filter(i => i.status === 'Done').length;
  const progress = projectIssues.length > 0 ? Math.round((completedCount / projectIssues.length) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col bg-[#0c0c0e] overflow-hidden">
      <header className="p-8 border-b border-[#1f1f23]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#16161a] border border-[#1f1f23] rounded-xl flex items-center justify-center text-2xl">
              {project.icon || '📁'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                <Badge variant="teal">{project.status}</Badge>
              </div>
              <p className="text-gray-500 mt-1 max-w-2xl">{project.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button size="sm" variant="outline">Edit Project</Button>
              {project.targetDate && (
                <span className="text-xs text-gray-600 font-mono">Due {new Date(project.targetDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-8 py-4">
             <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">
                  <span>Overall Completion</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-[#16161a] rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
             </div>
             <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                 {project.members.map(m => (
                   <Avatar key={m.id} src={m.avatar} name={m.name} size="sm" className="ring-2 ring-[#0c0c0e]" />
                 ))}
               </div>
               <span className="text-xs text-gray-500">{project.members.length} members</span>
             </div>
          </div>

          <Tabs 
            activeTab={activeTab} 
            onChange={setActiveTab} 
            className="mt-4 -mb-8 border-none"
            tabs={[
              { id: 'issues', label: 'Issues' },
              { id: 'milestones', label: 'Milestones' },
              { id: 'activity', label: 'Activity' }
            ]}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'issues' && (
            <div className="space-y-1">
              {projectIssues.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-[#1f1f23] rounded-xl text-gray-600">
                  No issues linked to this project.
                </div>
              ) : (
                projectIssues.map(issue => (
                  <IssueRow 
                    key={issue.id} 
                    issue={issue} 
                    selected={false} 
                    onClick={() => { setSelectedIssue(issue.id); setView('issue-detail'); }} 
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-6">
              {project.milestones.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-[#1f1f23] rounded-xl text-gray-600">
                  No milestones defined yet.
                </div>
              ) : (
                project.milestones.map(ms => (
                  <div key={ms.id} className="bg-[#16161a] border border-[#1f1f23] rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-200">{ms.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">Target: {new Date(ms.targetDate).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={ms.status === 'completed' ? 'indigo' : 'gray'}>
                      {ms.status}
                    </Badge>
                  </div>
                ))
              )}
              <Button variant="ghost" className="w-full py-4 border-2 border-dashed border-[#1f1f23]">+ Add Milestone</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
