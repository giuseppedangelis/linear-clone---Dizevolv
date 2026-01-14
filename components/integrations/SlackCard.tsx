
import React from 'react';
import { IntegrationData } from '../../types';

interface SlackCardProps {
  slack: IntegrationData['slack'];
}

export const SlackCard: React.FC<SlackCardProps> = ({ slack }) => {
  if (!slack) return null;

  return (
    <div className="bg-[#16161a] border border-[#1f1f23] rounded-lg overflow-hidden hover:border-[#2d2d31] transition-all group p-3 flex items-center gap-3">
      <div className="shrink-0">
        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#E01E5A] transition-colors" viewBox="0 0 512 512" fill="currentColor">
          <path d="M110.5 328.3c0 26.9-21.8 48.7-48.7 48.7S13.1 355.2 13.1 328.3s21.8-48.7 48.7-48.7h48.7v48.7zm24.4 0c0-26.9 21.8-48.7 48.7-48.7s48.7 21.8 48.7 48.7v121.8c0 26.9-21.8 48.7-48.7 48.7s-48.7-21.8-48.7-48.7V328.3zm48.7-143.4c-26.9 0-48.7-21.8-48.7-48.7S156.9 87.5 183.7 87.5s48.7 21.8 48.7 48.7v48.7h-48.7zm0 24.4c26.9 0 48.7 21.8 48.7 48.7s-21.8 48.7-48.7 48.7H61.9c-26.9 0-48.7-21.8-48.7-48.7S35 209.3 61.9 209.3h121.8zm143.4 48.7c0-26.9 21.8-48.7 48.7-48.7s48.7 21.8 48.7 48.7-21.8 48.7-48.7 48.7h-48.7v-48.7zm-24.4 0c0 26.9-21.8 48.7-48.7 48.7s-48.7-21.8-48.7-48.7V87.5c0-26.9 21.8-48.7 48.7-48.7s48.7 21.8 48.7 48.7v121.8zm-48.7 143.4c26.9 0 48.7 21.8 48.7 48.7s-21.8 48.7-48.7 48.7-48.7-21.8-48.7-48.7v-48.7h48.7zm0-24.4c-26.9 0-48.7-21.8-48.7-48.7s21.8-48.7 48.7-48.7h121.8c26.9 0 48.7 21.8 48.7 48.7s-21.8 48.7-48.7 48.7H277.5z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">
          Shared to #{slack.channelName}
        </h5>
        <div className="mt-0.5 text-[10px] text-gray-600 font-medium">
          {slack.messageCount} messages in thread
        </div>
      </div>
      <a 
        href={slack.threadUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-[#1f1f23] rounded transition-all shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      </a>
    </div>
  );
};
