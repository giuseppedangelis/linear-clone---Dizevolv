
import React from 'react';
import { useStore } from '../store';
import { Badge } from './ui/Badge';

const Roadmap = () => {
  const { projects, setView, setSelectedProject } = useStore();

  // Simple Q1-Q4 roadmap simulation
  const quarters = [
    { name: 'Q1', months: ['Jan', 'Feb', 'Mar'] },
    { name: 'Q2', months: ['Apr', 'May', 'Jun'] },
    { name: 'Q3', months: ['Jul', 'Aug', 'Sep'] },
    { name: 'Q4', months: ['Oct', 'Nov', 'Dec'] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'started': return 'bg-teal-500/20 border-teal-500/30 text-teal-400';
      case 'planned': return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
      case 'completed': return 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400';
      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0c0c0e] overflow-hidden">
      <header className="h-12 flex items-center justify-between px-6 border-b border-[#1f1f23]">
        <h2 className="text-sm font-semibold flex items-center gap-2">
           <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
           Roadmap
        </h2>
        <div className="flex items-center gap-4">
          <Badge variant="teal" size="sm">2024</Badge>
          <div className="flex items-center gap-1">
             <button className="p-1 hover:bg-[#1a1a1e] rounded text-gray-600 hover:text-gray-300"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
             <button className="p-1 hover:bg-[#1a1a1e] rounded text-gray-600 hover:text-gray-300"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative">
        <div className="inline-flex min-w-full h-full border-r border-[#1f1f23]">
          {/* Sidebar for project names fixed */}
          <div className="w-64 border-r border-[#1f1f23] bg-[#0c0c0e] sticky left-0 z-20 shrink-0">
             <div className="h-10 border-b border-[#1f1f23] px-4 flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
               Project Name
             </div>
             {projects.map(p => (
               <div 
                key={p.id} 
                onClick={() => { setSelectedProject(p.id); setView('project-detail'); }}
                className="h-16 px-4 flex items-center text-sm font-medium border-b border-[#1f1f23] hover:bg-[#16161a] cursor-pointer transition-colors truncate"
               >
                 <span className="mr-2 opacity-50">{p.icon}</span>
                 {p.name}
               </div>
             ))}
          </div>

          {/* Timeline Grid */}
          <div className="flex flex-1">
            {quarters.map(q => (
              <div key={q.name} className="flex">
                {q.months.map(m => (
                  <div key={m} className="w-48 border-r border-[#1f1f23]/50 shrink-0 flex flex-col">
                    <div className="h-10 border-b border-[#1f1f23] px-3 flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-[#080809]">
                      {m}
                    </div>
                    {/* Rows matching projects */}
                    {projects.map(p => (
                      <div key={`${p.id}-${m}`} className="h-16 border-b border-[#1f1f23]/30 relative">
                        {/* Bars rendered conditionally based on mock dates */}
                        {/* Simulating Platform (Jan-Jun) and UX (Apr-Sep) */}
                        {p.id === 'p1' && ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].includes(m) && (
                          <div className={`absolute top-4 bottom-4 left-0 right-0 ${getStatusColor(p.status)} border rounded-sm mx-1 px-2 flex items-center text-[10px] font-bold overflow-hidden whitespace-nowrap`}>
                             {m === 'Jan' ? p.name : ''}
                          </div>
                        )}
                        {p.id === 'p2' && ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].includes(m) && (
                          <div className={`absolute top-4 bottom-4 left-0 right-0 ${getStatusColor(p.status)} border rounded-sm mx-1 px-2 flex items-center text-[10px] font-bold overflow-hidden whitespace-nowrap`}>
                             {m === 'Apr' ? p.name : ''}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
