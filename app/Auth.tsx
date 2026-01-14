
import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AuthViewType } from '../types';

const Auth = () => {
  const [view, setView] = useState<AuthViewType>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    terms: false,
  });

  const { login, signup } = useStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (view === 'login') {
        await login(formData.email, formData.password);
      } else if (view === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords don't match");
          setIsLoading(false);
          return;
        }
        await signup(formData.name, formData.email, formData.password);
      } else if (view === 'forgot-password') {
        alert('Check your email for reset instructions.');
        setView('login');
      }
    } catch (err) {
      console.error(err);
      alert('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl mb-4 border border-brand-primary/20 shadow-xl shadow-brand-primary/5">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-content-primary tracking-tight">
            {view === 'login' && 'Sign in to Linear'}
            {view === 'signup' && 'Create your account'}
            {view === 'forgot-password' && 'Reset your password'}
          </h1>
          <p className="text-content-secondary text-sm mt-2">
            The issue tracking tool you'll actually enjoy using.
          </p>
        </div>

        <div className="bg-app-surface border border-app-border rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <Input 
                label="Full Name" 
                name="name" 
                placeholder="John Doe" 
                required 
                value={formData.name}
                onChange={handleInputChange}
              />
            )}
            
            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              placeholder="name@company.com" 
              required 
              value={formData.email}
              onChange={handleInputChange}
            />

            {view !== 'forgot-password' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-content-secondary">Password</label>
                  {view === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setView('forgot-password')}
                      className="text-xs text-brand-primary hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {view === 'signup' && (
              <Input 
                label="Confirm Password" 
                name="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            )}

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name={view === 'signup' ? 'terms' : 'rememberMe'}
                  className="w-4 h-4 rounded border-app-border-strong bg-app-bg text-brand-primary focus:ring-brand-primary/20 cursor-pointer" 
                  required={view === 'signup'}
                  onChange={handleInputChange}
                />
                <span className="text-xs text-content-secondary group-hover:text-content-primary transition-colors">
                  {view === 'signup' ? 'I agree to Terms & Conditions' : 'Keep me signed in'}
                </span>
              </label>
            </div>

            <Button variant="primary" className="w-full h-10 font-bold tracking-tight" isLoading={isLoading} type="submit">
              {view === 'login' && 'Sign In'}
              {view === 'signup' && 'Create Account'}
              {view === 'forgot-password' && 'Send Reset Link'}
            </Button>
          </form>

          {view !== 'forgot-password' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-app-border"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-app-surface px-3 text-content-secondary">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-10 text-xs font-bold gap-2" onClick={() => login('mock@test.com', 'pass')}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.248 1.248-3.216 2.592-7.392 2.592-6.528 0-11.76-5.28-11.76-11.808s5.232-11.808 11.76-11.808c3.528 0 6.144 1.392 8.16 3.312l2.304-2.304c-2.112-2.016-5.424-3.528-10.464-3.528-9.048 0-16.512 7.344-16.512 16.512s7.464 16.512 16.512 16.512c4.896 0 8.616-1.608 11.52-4.608 3.024-3.024 3.984-7.248 3.984-10.656 0-.984-.072-1.92-.216-2.832h-15.288z"/></svg>
                  Google
                </Button>
                <Button variant="outline" className="h-10 text-xs font-bold gap-2" onClick={() => login('mock@test.com', 'pass')}>
                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                   GitHub
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-content-secondary">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="ml-2 font-bold text-brand-primary hover:underline"
            >
              {view === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
