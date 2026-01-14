
import React, { useState } from 'react';
import { useStore } from '../store';
import { StatusIcon, PriorityIcon } from './Icons';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Status, Priority } from '../types';
import { Markdown } from './ui/Markdown';
import { MarkdownEditor } from './MarkdownEditor';
import { ActivityFeed } from './ActivityFeed';
import { GitHubCard } from './integrations/GitHubCard';
import { FigmaCard } from './integrations/FigmaCard';
import { SlackCard } from './integrations/SlackCard';

// Explicitly type the component to handle reserved props like 'key' in map functions
const CommentItem: React.FC<{ comment: any; isReply?: boolean }> = ({ comment, isReply = false }) => {
  const { toggleReaction, deleteComment, updateComment, currentUser, selectedIssueId } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const emojis = ['👍', '👎', '😄', '🎉', '😕', '❤️', '🚀', '👀'];

  return (
    <div className={`flex gap-3 ${isReply ? 'ml-10 mt-4' : 'mt-8'}`}>
      <Avatar src={comment.user.avatar} name={comment.user.name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="bg-[#16161a] border border-[#1f1f23] rounded-xl p-3 group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-200">{comment.user.name}</span>
              <span className="text-[10px] text-gray-600">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setIsEditing(true)} className="p-1 text-gray-600 hover:text-gray-300">
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
               </button>
               {comment.user.id === currentUser.id && (
                 <button onClick={() => deleteComment(selectedIssueId!, comment.id)} className="p-1 text-gray-600 hover:text-red-400">
                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               )}
            </div>
          </div>
          
          {isEditing ? (
            <MarkdownEditor 
              initialValue={comment.body} 
              onSave={(val) => { updateComment(selectedIssueId!, comment.id, val); setIsEditing(false); }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <Markdown content={comment.body} />
              
              <div className="mt-4 flex flex-wrap gap-2">
                {comment.reactions.map((r: any) => (
                  <button 
                    key={r.emoji}
                    onClick={() => toggleReaction(selectedIssueId!, comment.id, r.emoji)}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border ${r.userIds.includes(currentUser.id) ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-[#0c0c0e] border-[#2d2d31] text-gray-500'} hover:border-teal-500/40 transition-all`}
                  >
                    <span>{r.emoji}</span>
                    <span className="text-[10px] font-bold">{r.userIds.length}</span>
                  </button>
                ))}
                
                <div className="relative group/emojis">
                   <button className="flex items-center justify-center w-6 h-6 rounded-full border border-[#2d2d31] text-gray-600 hover:text-gray-300 hover:border-gray-500 transition-all">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </button>
                   <div className="absolute left-0 bottom-full mb-2 hidden group-hover/emojis:flex bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-1 shadow-2xl gap-1 z-20">
                     {emojis.map(e => (
                       <button 
                        key={e} 
                        onClick={() => toggleReaction(selectedIssueId!, comment.id, e)}
                        className="p-1 hover:bg-[#1a1a1e] rounded transition-colors"
                       >
                         {e}
                       </button>
                     ))}
                   </div>
                </div>

                {!isReply && (
                  <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-[10px] text-gray-500 hover:text-gray-300 font-bold uppercase tracking-widest ml-auto">
                    Reply
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-4 animate-in slide-in-from-top-2">
            <MarkdownEditor 
              placeholder="Reply to thread..."
              onSave={(val) => { 
                useStore.getState().addComment(selectedIssueId!, { body: val, parentId: comment.id });
                setShowReplyForm(false);
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const IssueDetail = () => {
  const { selectedIssueId, issues, setView, updateIssue, addComment, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

  const issue = issues.find(i => i.id === selectedIssueId);

  if (!issue) return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      Select an issue to view details
    </div>
  );

  const mainComments = issue.comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => issue.comments.filter(c => c.parentId === parentId);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0c0c0e]">
      <div className="flex-1 overflow-y-auto p-8 border-r border-[#1f1f23]">
        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
            <span className="font-mono text-teal-500">{issue.key}</span>
            <span>/</span>
            <span>Issues</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{issue.title}</h1>
          <div className="prose prose-invert max-w-none text-gray-400">
            {issue.description || 'No description provided.'}
          </div>
        </header>

        {/* Integration Panel (if any linked) */}
        {(issue.integrations?.github || issue.integrations?.figma || issue.integrations?.slack) && (
          <div className="mt-10 pt-8 border-t border-[#1f1f23] space-y-4">
            <h4 className="text-[10px] uppercase font-bold text-gray-600 mb-4 tracking-widest flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Linked Services
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {issue.integrations.github && <GitHubCard github={issue.integrations.github} />}
              {issue.integrations.figma && <FigmaCard figma={issue.integrations.figma} />}
              {issue.integrations.slack && <SlackCard slack={issue.integrations.slack} />}
            </div>
          </div>
        )}

        <section className="mt-12 border-t border-[#1f1f23] pt-8">
          <div className="flex items-center gap-6 mb-8 border-b border-[#1f1f23]/50">
             <button 
              onClick={() => setActiveTab('comments')}
              className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'comments' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
             >
               Comments ({issue.comments.length})
               {activeTab === 'comments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />}
             </button>
             <button 
              onClick={() => setActiveTab('activity')}
              className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'activity' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
             >
               History ({issue.activities.length})
               {activeTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />}
             </button>
          </div>

          {activeTab === 'comments' ? (
            <div className="space-y-4">
              <div className="mb-10">
                <MarkdownEditor 
                  placeholder="Post a comment..."
                  onSave={(val) => addComment(issue.id, { body: val })}
                />
              </div>

              {mainComments.length === 0 ? (
                <div className="py-20 text-center text-gray-600 italic text-sm">No comments yet.</div>
              ) : (
                <div className="pb-20">
                  {mainComments.map(c => (
                    <div key={c.id}>
                      <CommentItem comment={c} />
                      {getReplies(c.id).map(reply => (
                        <CommentItem key={reply.id} comment={reply} isReply />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-6">
              <ActivityFeed activities={issue.activities} />
            </div>
          )}
        </section>
      </div>

      <aside className="w-80 bg-[#080809] p-6 space-y-8 overflow-y-auto">
        <div>
          <h4 className="text-[10px] uppercase font-bold text-gray-600 mb-4 tracking-widest">Metadata</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between group cursor-pointer">
              <span className="text-xs text-gray-500">Status</span>
              <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1a1a1e] transition-colors relative">
                <StatusIcon status={issue.status} size={12} />
                <span className="text-xs text-gray-300">{issue.status}</span>
              </div>
            </div>
            <div className="flex items-center justify-between group cursor-pointer">
              <span className="text-xs text-gray-500">Priority</span>
              <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1a1a1e] transition-colors">
                <PriorityIcon priority={issue.priority} size={12} />
                <span className="text-xs text-gray-300">{issue.priority}</span>
              </div>
            </div>
            <div className="flex items-center justify-between group cursor-pointer">
              <span className="text-xs text-gray-500">Assignee</span>
              <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1a1a1e] transition-colors">
                <Avatar src={issue.assignee?.avatar} name={issue.assignee?.name} size="xs" />
                <span className="text-xs text-gray-300">{issue.assignee?.name || 'Unassigned'}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase font-bold text-gray-600 mb-4 tracking-widest">Labels</h4>
          <div className="flex flex-wrap gap-2">
            {issue.labels.map(l => (
              <Badge key={l.id} style={{ borderColor: `${l.color}30`, color: l.color }}>{l.name}</Badge>
            ))}
            <button className="w-6 h-6 rounded-full border border-dashed border-gray-800 flex items-center justify-center text-gray-600 hover:text-gray-400 hover:border-gray-600 transition-all">+</button>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1f1f23]">
          <h4 className="text-[10px] uppercase font-bold text-gray-600 mb-4 tracking-widest">Actions</h4>
          <div className="space-y-2">
             <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs text-gray-400"
                onClick={() => useStore.getState().shareToSlack(issue.id, { channelName: 'engineering', threadUrl: '#', messageCount: 0 })}
              >
               <svg className="w-3.5 h-3.5 mr-2 text-[#E01E5A]" fill="currentColor" viewBox="0 0 512 512"><path d="M110.5 328.3c0 26.9-21.8 48.7-48.7 48.7S13.1 355.2 13.1 328.3s21.8-48.7 48.7-48.7h48.7v48.7zm24.4 0c0-26.9 21.8-48.7 48.7-48.7s48.7 21.8 48.7 48.7v121.8c0 26.9-21.8 48.7-48.7 48.7s-48.7-21.8-48.7-48.7V328.3zm48.7-143.4c-26.9 0-48.7-21.8-48.7-48.7S156.9 87.5 183.7 87.5s48.7 21.8 48.7 48.7v48.7h-48.7zm0 24.4c26.9 0 48.7 21.8 48.7 48.7s-21.8 48.7-48.7 48.7H61.9c-26.9 0-48.7-21.8-48.7-48.7S35 209.3 61.9 209.3h121.8zm143.4 48.7c0-26.9 21.8-48.7 48.7-48.7s48.7 21.8 48.7 48.7-21.8 48.7-48.7 48.7h-48.7v-48.7zm-24.4 0c0 26.9-21.8 48.7-48.7 48.7s-48.7-21.8-48.7-48.7V87.5c0-26.9 21.8-48.7 48.7-48.7s48.7 21.8 48.7 48.7v121.8zm-48.7 143.4c26.9 0 48.7 21.8 48.7 48.7s-21.8 48.7-48.7 48.7-48.7-21.8-48.7-48.7v-48.7h48.7zm0-24.4c-26.9 0-48.7-21.8-48.7-48.7s21.8-48.7 48.7-48.7h121.8c26.9 0 48.7 21.8 48.7 48.7s-21.8 48.7-48.7 48.7H277.5z" /></svg>
               Share to Slack
             </Button>
             <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs text-gray-400"
                onClick={() => useStore.getState().linkGithubPR(issue.id, { prNumber: 101, prTitle: 'fix: resolving layout issues', prStatus: 'open', prUrl: '#', repoName: 'linear-clone', branchName: 'fix/ui-layout' })}
              >
               <svg className="w-3.5 h-3.5 mr-2" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
               Link PR
             </Button>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1f1f23]">
          <Button variant="danger" size="sm" className="w-full" onClick={() => setView('issues')}>Close View</Button>
        </div>
      </aside>
    </div>
  );
};

export default IssueDetail;
