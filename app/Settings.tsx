
import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

type SettingsTab = 'profile' | 'team' | 'integrations' | 'notifications' | 'privacy' | 'about';

const Settings = () => {
  const { currentUser, currentTeam, setView } = useStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const menuItems: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { id: 'team', label: 'Team', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'integrations', label: 'Integrations', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg> },
    { id: 'notifications', label: 'Notifications', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
    { id: 'privacy', label: 'Privacy', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 800);
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-6">
              <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" className="w-20 h-20" />
              <div>
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-[10px] text-content-secondary mt-2">JPG, GIF or PNG. Max size of 800K.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={currentUser.name} />
              <Input label="Public Handle" defaultValue={`@${currentUser.name.toLowerCase().replace(' ', '')}`} />
            </div>
            <Input label="Email Address" defaultValue={currentUser.email} disabled />
            <Textarea label="Bio" placeholder="Tell us a little bit about yourself..." defaultValue="Senior Software Engineer focusing on craft and performance." />
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setView('dashboard')}>Cancel</Button>
              <Button variant="primary" isLoading={isSaving} onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-app-surface border border-app-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-content-primary mb-4">Team Details</h3>
              <div className="space-y-4">
                <Input label="Team Name" defaultValue={currentTeam.name} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Team ID" defaultValue={currentTeam.identifier} disabled />
                  <Input label="Cycle Length" defaultValue="2 weeks" />
                </div>
              </div>
            </div>
            <div className="bg-app-surface border border-app-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-content-primary">Members</h3>
                <Button variant="primary" size="sm">Invite Member</Button>
              </div>
              <div className="divide-y divide-app-border">
                {currentTeam.members.map(member => (
                  <div key={member.id} className="py-3 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar src={member.avatar} name={member.name} size="sm" />
                      <div>
                        <div className="text-xs font-bold text-content-primary">{member.name}</div>
                        <div className="text-[10px] text-content-secondary">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="gray" size="sm">Member</Badge>
                      <button className="p-1.5 text-content-secondary hover:text-brand-error opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'integrations':
        const integrations = [
          { id: 'github', name: 'GitHub', desc: 'Link pull requests to issues', connected: true, color: '#fff' },
          { id: 'slack', name: 'Slack', desc: 'Get notifications in channels', connected: false, color: '#4A154B' },
          { id: 'figma', name: 'Figma', desc: 'Embed designs in issues', connected: false, color: '#F24E1E' },
          { id: 'sentry', name: 'Sentry', desc: 'Sync errors to backlog', connected: false, color: '#362D59' },
        ];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {integrations.map(int => (
              <div key={int.id} className="bg-app-surface border border-app-border rounded-xl p-5 flex items-start gap-4 hover:border-brand-primary/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-app-bg border border-app-border flex items-center justify-center text-lg">
                  {int.id === 'github' && '🐙'}
                  {int.id === 'slack' && '💬'}
                  {int.id === 'figma' && '🎨'}
                  {int.id === 'sentry' && '🐞'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-content-primary">{int.name}</h4>
                  <p className="text-[11px] text-content-secondary mt-0.5">{int.desc}</p>
                  <div className="mt-3">
                    <Button variant={int.connected ? 'outline' : 'primary'} size="xs">
                      {int.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
                {int.connected && <div className="w-2 h-2 rounded-full bg-brand-success" />}
              </div>
            ))}
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-app-surface border border-app-border rounded-xl divide-y divide-app-border animate-in fade-in slide-in-from-bottom-2 duration-300">
            {[
              { id: 'mentions', label: 'Mentions', desc: 'When someone @mentions you in a comment' },
              { id: 'assignments', label: 'Issue Assignments', desc: 'When an issue is assigned to you' },
              { id: 'status', label: 'Status Changes', desc: 'When the status of an issue you follow changes' },
              { id: 'summary', label: 'Weekly Summary', desc: 'A weekly digest of team performance' },
            ].map(pref => (
              <div key={pref.id} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-content-primary">{pref.label}</h4>
                  <p className="text-[11px] text-content-secondary">{pref.desc}</p>
                </div>
                <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-brand-primary/20 cursor-pointer">
                  <div className="translate-x-4 h-4 w-4 rounded-full bg-brand-primary shadow-sm transition-transform" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-app-surface border border-app-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-content-primary mb-2">Public Profile</h3>
              <p className="text-[11px] text-content-secondary mb-4">Making your profile public allows anyone with your link to see your contributions.</p>
              <Button variant="outline" size="sm">Enable Public Profile</Button>
            </div>
            <div className="bg-brand-error/5 border border-brand-error/20 rounded-xl p-6">
              <h3 className="text-sm font-bold text-brand-error mb-2">Danger Zone</h3>
              <p className="text-[11px] text-brand-error opacity-70 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="border-brand-error/20 text-brand-error hover:bg-brand-error/10">Export My Data</Button>
                <Button variant="danger" size="sm">Delete Account</Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-app-bg">
      <aside className="w-64 border-r border-app-border p-6 space-y-2 hidden lg:block bg-app-sidebar/30">
        <h2 className="text-xs font-bold uppercase tracking-widest text-content-secondary mb-6 px-3">Workspace Settings</h2>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === item.id ? 'bg-app-surface text-brand-primary font-bold shadow-sm border border-app-border' : 'text-content-secondary hover:text-content-primary hover:bg-app-surface/50'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 md:p-12">
          <header className="mb-10">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
              Settings
            </div>
            <h1 className="text-3xl font-bold text-content-primary tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-content-secondary text-sm mt-1">Manage your {activeTab} preferences and account settings.</p>
          </header>

          <div className="pb-20">
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
