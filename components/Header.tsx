import React from 'react';
import { LogoIcon } from './icons';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/authService';

interface HeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignUpClick }) => {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Failed to log out", error);
      // Optionally show an error to the user
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <LogoIcon className="h-8 w-8 text-sky-500" />
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              IntelliCompress AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium hidden sm:inline truncate" title={user.email}>
                        Welcome, {user.fullName}!
                      </span>
                      <div className="h-8 w-8 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-300 text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onLoginClick}
                      className="text-sm font-semibold hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    >
                      Log In
                    </button>
                    <button
                      onClick={onSignUpClick}
                      className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};