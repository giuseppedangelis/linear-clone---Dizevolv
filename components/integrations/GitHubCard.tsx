
import React from 'react';
import { IntegrationData } from '../../types';

interface GitHubCardProps {
  github: IntegrationData['github'];
}

export const GitHubCard: React.FC<GitHubCardProps> = ({ github }) => {
  if (!github) return null;

  const statusColors = {
    open: 'text-green-500 bg-green-500/10 border-green-500/20',
    merged: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    closed: 'text-red-500 bg-red-500/10 border-red-500/20',
    draft: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
  };

  return (
    <div className="bg-[#16161a] border border-[#1f1f23] rounded-lg overflow-hidden hover:border-[#2d2d31] transition-all group">
      <div className="p-3 flex items-start gap-3">
        <div className="mt-1">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${statusColors[github.prStatus]}`}>
              {github.prStatus}
            </span>
            <span className="text-[11px] text-gray-500 font-mono">{github.repoName}</span>
          </div>
          <h5 className="text-sm font-medium text-gray-200 truncate group-hover:text-teal-400 transition-colors">
            {github.prTitle}
          </h5>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-gray-600">
            <span className="flex items-center gap-1 font-mono">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
               #{github.prNumber}
            </span>
            <span className="flex items-center gap-1 font-mono bg-[#1f1f23] px-1 rounded">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               {github.branchName}
            </span>
          </div>
        </div>
        <a 
          href={github.prUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-[#1f1f23] rounded transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>
    </div>
  );
};
