
import React from 'react';
import { useStore } from '../store';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

const CycleManager = () => {
  const { cycles, issues, setView, setSelectedCycle } = useStore();

  const getCycleStats = (cycleId: string) => {
    const cycleIssues = issues.filter(i => i.cycle?.id === cycleId);
    const completed = cycleIssues.filter(i => i.status === 'Done').length;
    const total = cycleIssues.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent };
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#0c0c0e]">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Cycles</h1>
            <p className="text-gray-500 text-sm">Manage iterations and team velocity.</p>
          </div>
          <Button variant="primary">New Cycle</Button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {cycles.map(cycle => {
            const { completed, total, percent } = getCycleStats(cycle.id);
            const isCurrent = new Date() >= new Date(cycle.startDate) && new Date() <= new Date(cycle.endDate);

            return (
              <div 
                key={cycle.id}
                onClick={() => { setSelectedCycle(cycle.id); setView('cycle-detail'); }}
                className="group bg-[#16161a] border border-[#1f1f23] rounded-xl p-6 hover:border-teal-500/30 transition-all cursor-pointer shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-teal-500 animate-pulse' : 'bg-gray-600'}`} />
                    <h3 className="font-semibold text-lg text-gray-100 group-hover:text-teal-400 transition-colors">
                      {cycle.name}
                    </h3>
                    <Badge variant={isCurrent ? 'teal' : 'gray'}>Cycle {cycle.number}</Badge>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {new Date(cycle.startDate).toLocaleDateString()} — {new Date(cycle.endDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-teal-500">{percent}% ({completed} / {total} issues)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#080809] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 transition-all duration-500 ease-out rounded-full" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#1f1f23] flex items-center justify-between">
                  <div className="flex items-center gap-8">
                     <div>
                       <div className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-1">Velocity</div>
                       <div className="text-sm font-semibold text-gray-300">12 pts / week</div>
                     </div>
                     <div>
                       <div className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-1">Scope</div>
                       <div className="text-sm font-semibold text-gray-300">{total} issues</div>
                     </div>
                  </div>
                  <button className="text-xs text-gray-500 group-hover:text-gray-300 flex items-center gap-1">
                    View full report
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini Analytics Section */}
        <section className="mt-12">
          <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-6">Velocity History</h4>
          <div className="bg-[#16161a] border border-[#1f1f23] rounded-xl p-8 h-48 flex items-end gap-4">
            {[40, 65, 30, 85, 55, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-teal-500/20 to-teal-500/10 border border-teal-500/20 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-teal-900 px-2 py-0.5 rounded text-[10px] font-bold text-teal-300">
                  {h} pts
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CycleManager;
