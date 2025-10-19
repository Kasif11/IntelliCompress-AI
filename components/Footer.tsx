
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} IntelliCompress AI. All Rights Reserved.</p>
      </div>
    </footer>
  );
};