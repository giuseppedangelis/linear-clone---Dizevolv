
import React from 'react';
import { useStore } from '../store';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

const ProjectList = () => {
  const { projects, issues, setView, setSelectedProject } = useStore();

  const getProjectStats = (projectId: string) => {
    const projectIssues = issues.filter(i => i.project?.id === projectId);
    const completed = projectIssues.filter(i => i.status === 'Done').length;
    const total = projectIssues.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, progress };
  };

  const statusColors = {
    planned: 'gray',
    started: 'teal',
    paused: 'orange',
    completed: 'indigo',
    canceled: 'red'
  } as const;

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#0c0c0e]">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Projects</h1>
            <p className="text-gray-500 text-sm">Long-term initiatives and strategic goals.</p>
          </div>
          <Button variant="primary">Create Project</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const { completed, total, progress } = getProjectStats(project.id);
            
            return (
              <div 
                key={project.id}
                onClick={() => { setSelectedProject(project.id); setView('project-detail'); }}
                className="group bg-[#16161a] border border-[#1f1f23] rounded-xl p-6 hover:border-teal-500/30 transition-all cursor-pointer flex flex-col h-full shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#080809] border border-[#1f1f23] rounded-lg flex items-center justify-center text-xl">
                      {project.icon || '📁'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100 group-hover:text-teal-400 transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <Badge variant={statusColors[project.status]} size="sm" className="mt-1 capitalize">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-6 h-8">
                  {project.description || 'No description provided.'}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-teal-500">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#080809] rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-teal-500 transition-all duration-500 ease-out rounded-full`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1f1f23]">
                    <div className="flex -space-x-2">
                      {project.members.map(m => (
                        <Avatar key={m.id} src={m.avatar} name={m.name} size="xs" className="ring-2 ring-[#16161a]" />
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-gray-600">
                      {completed}/{total} Issues
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
