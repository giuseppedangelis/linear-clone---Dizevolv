
import React, { useState } from 'react';
import { useStore } from '../store';
import { Status, Priority, Issue } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Input';

const CreateIssueModal = () => {
  const { isCreateModalOpen, toggleCreateModal, addIssue, currentUser, currentTeam } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Added missing 'comments' and 'activities' property to satisfy Issue interface
    const newIssue: Issue = {
      id: Math.random().toString(36).substr(2, 9),
      key: `${currentTeam.identifier}-${Math.floor(Math.random() * 999)}`,
      title,
      description,
      status: Status.TODO,
      priority: Priority.MEDIUM,
      creator: currentUser,
      team: currentTeam,
      labels: [],
      comments: [],
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addIssue(newIssue);
    setTitle('');
    setDescription('');
    toggleCreateModal();
  };

  const suggestImprovement = async () => {
    if (!title) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this issue title to be more professional and clear for an engineering team: "${title}"`
      });
      if (response.text) {
        setTitle(response.text.trim().replace(/^"|"$/g, ''));
      }
    } catch (err) {
      console.error("AI Improvement failed", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-[#16161a] border border-[#2d2d31] w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <header className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="bg-[#2d2d31] px-1.5 py-0.5 rounded text-gray-300">{currentTeam.identifier}</span>
                <span>/</span>
                <span>New Issue</span>
              </div>
            </header>
            
            <Input
              autoFocus
              placeholder="Issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none bg-transparent px-0 text-lg font-medium shadow-none focus:ring-0 placeholder:text-gray-700"
            />
            
            <Textarea
              placeholder="Add description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-none bg-transparent px-0 text-sm shadow-none focus:ring-0 min-h-[150px] placeholder:text-gray-800"
            />
          </div>

          <div className="border-t border-[#1f1f23] p-4 bg-[#1a1a1e]/50 flex items-center justify-between">
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={suggestImprovement}
                isLoading={isAiLoading}
                disabled={!title}
                className="group"
              >
                <svg className="w-3.5 h-3.5 mr-1.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Improve
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={toggleCreateModal}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="primary"
                size="sm"
                disabled={!title.trim()}
              >
                Create Issue
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="absolute inset-0 -z-10" onClick={toggleCreateModal} />
    </div>
  );
};

export default CreateIssueModal;
