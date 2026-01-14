
import React from 'react';

export const PriorityIcon = ({ priority, size = 16 }: { priority: string, size?: number }) => {
  const common = { width: size, height: size };
  switch (priority) {
    case 'Urgent': return <svg {...common} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    case 'High': return <svg {...common} fill="currentColor" viewBox="0 0 24 24" className="text-orange-400"><path d="M4 18h2v2H4v-2zm4-4h2v6H8v-6zm4-4h2v10h-2V10zm4-4h2v14h-2V6z" /></svg>;
    case 'Medium': return <svg {...common} fill="currentColor" viewBox="0 0 24 24" className="text-yellow-400"><path d="M4 18h2v2H4v-2zm4-4h2v6H8v-6zm4-4h2v10h-2V10z" /></svg>;
    case 'Low': return <svg {...common} fill="currentColor" viewBox="0 0 24 24" className="text-gray-400"><path d="M4 18h2v2H4v-2zm4-4h2v6H8v-6z" /></svg>;
    default: return <svg {...common} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-600"><circle cx="12" cy="12" r="10" strokeWidth={2} strokeDasharray="4 4" /></svg>;
  }
};

export const StatusIcon = ({ status, size = 16 }: { status: string, size?: number }) => {
  const common = { width: size, height: size };
  switch (status) {
    case 'Backlog': return <svg {...common} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500"><circle cx="12" cy="12" r="10" strokeWidth={2} strokeDasharray="3 3" /></svg>;
    case 'Todo': return <svg {...common} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400"><circle cx="12" cy="12" r="10" strokeWidth={2} /></svg>;
    case 'In Progress': return <svg {...common} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-500"><path strokeWidth={2} d="M12 2v20M2 12h20" className="rotate-45 origin-center" /><circle cx="12" cy="12" r="10" strokeWidth={2} /></svg>;
    case 'Done': return <svg {...common} fill="currentColor" viewBox="0 0 24 24" className="text-indigo-500"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" stroke="white" strokeWidth={2} fill="none" /></svg>;
    default: return <svg {...common} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path d="M15 9l-6 6M9 9l6 6" /></svg>;
  }
};
