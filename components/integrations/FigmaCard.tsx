
import React from 'react';
import { IntegrationData } from '../../types';

interface FigmaCardProps {
  figma: IntegrationData['figma'];
}

export const FigmaCard: React.FC<FigmaCardProps> = ({ figma }) => {
  if (!figma) return null;

  return (
    <div className="bg-[#16161a] border border-[#1f1f23] rounded-lg overflow-hidden hover:border-[#2d2d31] transition-all group">
      <div className="aspect-video bg-[#0c0c0e] relative overflow-hidden flex items-center justify-center border-b border-[#1f1f23]">
        {figma.previewUrl ? (
          <img src={figma.previewUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Design preview" />
        ) : (
          <div className="text-gray-700 text-3xl opacity-20 group-hover:opacity-40 transition-opacity font-bold">FIGMA</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-transparent to-transparent" />
      </div>
      <div className="p-3 flex items-start gap-3">
        <div className="mt-1">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F24E1E] transition-colors" viewBox="0 0 38 57" fill="currentColor">
            <path d="M19 28.5C19 25.9833 20.0008 23.5698 21.7825 21.7882C23.5641 20.0065 25.9775 19 28.5 19C31.0225 19 33.4359 20.0065 35.2175 21.7882C36.9992 23.5698 38 25.9833 38 28.5C38 31.0167 36.9992 33.4302 35.2175 35.2118C33.4359 36.9935 31.0225 38 28.5 38C25.9775 38 23.5641 36.9935 21.7825 35.2118C20.0008 33.4302 19 31.0167 19 28.5Z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 44.9833 1.00084 42.5698 2.78249 40.7882C4.56414 39.0065 6.97754 38 9.5 38C12.0225 38 14.4359 39.0065 16.2175 40.7882C17.9992 42.5698 19 44.9833 19 47.5C19 50.0167 17.9992 52.4302 16.2175 54.2118C14.4359 55.9935 12.0225 57 9.5 57C6.97754 57 4.56414 55.9935 2.78249 54.2118C1.00084 52.4302 0 50.0167 0 47.5Z" fill="#0ACF83"/>
            <path d="M0 28.5C0 25.9833 1.00084 23.5698 2.78249 21.7882C4.56414 20.0065 6.97754 19 9.5 19C12.0225 19 14.4359 20.0065 16.2175 21.7882C17.9992 23.5698 19 25.9833 19 28.5L19 38L9.5 38C6.97754 38 4.56414 36.9935 2.78249 35.2118C1.00084 33.4302 0 31.0167 0 28.5Z" fill="#A259FF"/>
            <path d="M0 9.5C0 6.98334 1.00084 4.56979 2.78249 2.78816C4.56414 1.00652 6.97754 0 9.5 0L28.5 0C31.0225 0 33.4359 1.00652 35.2175 2.78816C36.9992 4.56979 38 6.98334 38 9.5C38 12.0167 36.9992 14.4302 35.2175 16.2118C33.4359 17.9935 31.0225 19 28.5 19L9.5 19C6.97754 19 4.56414 17.9935 2.78249 16.2118C1.00084 14.4302 0 12.0167 0 9.5Z" fill="#F24E1E"/>
            <path d="M19 9.5C19 6.98334 20.0008 4.56979 21.7825 2.78816C23.5641 1.00652 25.9775 0 28.5 0C31.0225 0 33.4359 1.00652 35.2175 2.78816C36.9992 4.56979 38 6.98334 38 9.5C38 12.0167 36.9992 14.4302 35.2175 16.2118C33.4359 17.9935 31.0225 19 28.5 19L19 19L19 9.5Z" fill="#FF7262"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-medium text-gray-200 truncate group-hover:text-[#F24E1E] transition-colors">
            {figma.fileName}
          </h5>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-600">
            <span>Last updated {figma.lastUpdated}</span>
          </div>
        </div>
        <a 
          href={figma.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-[#1f1f23] rounded transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>
    </div>
  );
};
