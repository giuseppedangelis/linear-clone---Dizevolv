
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';

interface MarkdownEditorProps {
  initialValue?: string;
  onSave: (value: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  initialValue = '', 
  onSave, 
  onCancel, 
  placeholder = 'Write something...',
  autoFocus = false
}) => {
  const [value, setValue] = useState(initialValue);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const { currentTeam } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const filteredMembers = currentTeam.members.filter(m => 
    m.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setValue(newVal);

    const cursorPosition = e.target.selectionStart;
    const lastChar = newVal.slice(cursorPosition - 1, cursorPosition);
    
    if (lastChar === '@') {
      setShowMentions(true);
      setMentionQuery('');
    } else if (showMentions) {
      const atIndex = newVal.lastIndexOf('@', cursorPosition - 1);
      if (atIndex === -1 || /\s/.test(newVal.slice(atIndex, cursorPosition))) {
        setShowMentions(false);
      } else {
        setMentionQuery(newVal.slice(atIndex + 1, cursorPosition));
      }
    }
  };

  const handleMentionSelect = (name: string) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const atIndex = value.lastIndexOf('@', cursorPosition - 1);
    const newVal = value.slice(0, atIndex + 1) + name + ' ' + value.slice(cursorPosition);
    setValue(newVal);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(prev => (prev + 1) % filteredMembers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(prev => (prev - 1 + filteredMembers.length) % filteredMembers.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleMentionSelect(filteredMembers[mentionIndex].name.replace(/\s+/g, ''));
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onSave(value);
        setValue('');
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-[#16161a] border border-[#1f1f23] rounded-xl p-3 focus-within:border-teal-500/30 transition-all relative">
      <textarea
        ref={textareaRef}
        className="w-full bg-transparent text-sm text-gray-200 focus:outline-none resize-none min-h-[100px] placeholder:text-gray-700 font-sans"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      
      {showMentions && filteredMembers.length > 0 && (
        <div className="absolute left-3 bottom-12 z-50 w-48 bg-[#0c0c0e] border border-[#2d2d31] rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          {filteredMembers.map((member, idx) => (
            <button
              key={member.id}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${idx === mentionIndex ? 'bg-[#1a1a1e] text-white' : 'text-gray-400'}`}
              onClick={() => handleMentionSelect(member.name.replace(/\s+/g, ''))}
            >
              <Avatar src={member.avatar} name={member.name} size="xs" />
              <span>{member.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 font-mono">Markdown supported</span>
        </div>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button size="xs" variant="ghost" onClick={onCancel}>Cancel</Button>
          )}
          <Button 
            size="xs" 
            variant="primary" 
            disabled={!value.trim()} 
            onClick={() => { onSave(value); setValue(''); }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
