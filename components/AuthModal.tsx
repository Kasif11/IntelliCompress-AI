import React, { useState } from 'react';
import { LoadingSpinner, XIcon } from './icons';
import { logIn, signUp } from '../services/authService';

type Mode = 'login' | 'signup';

interface AuthModalProps {
  onClose: () => void;
  initialMode: Mode;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode }) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await logIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-8"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          <XIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
          {mode === 'login' ? 'Log in to continue.' : 'Get started for free.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <LoadingSpinner className="h-6 w-6" /> : (mode === 'login' ? 'Log In' : 'Create Account')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};