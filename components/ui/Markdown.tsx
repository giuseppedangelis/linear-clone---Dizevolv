
import React from 'react';

const parseMarkdown = (text: string) => {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/`(.*?)`/g, '<code class="bg-[#2d2d31] px-1 rounded text-xs">$1</code>') // Inline code
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-teal-400 hover:underline" target="_blank">$1</a>') // Link
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-2 border-[#2d2d31] pl-4 italic text-gray-500">$1</blockquote>') // Quote
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>') // H1
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold mt-3 mb-2">$1</h2>') // H2
    .replace(/@(\w+)/g, '<span class="text-teal-500 font-medium">@$1</span>'); // Mentions

  return { __html: html.replace(/\n/g, '<br />') };
};

export const Markdown: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  return (
    <div 
      className={`prose prose-invert max-w-none text-sm leading-relaxed ${className}`}
      dangerouslySetInnerHTML={parseMarkdown(content)}
    />
  );
};
