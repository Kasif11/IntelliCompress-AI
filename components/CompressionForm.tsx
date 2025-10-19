
import React from 'react';
import { FileUploader } from './FileUploader';
import { LoadingSpinner } from './icons';

interface CompressionFormProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  targetSize: number;
  onTargetSizeChange: (size: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const CompressionForm: React.FC<CompressionFormProps> = ({
  file,
  onFileSelect,
  targetSize,
  onTargetSizeChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto transition-all duration-300">
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl border border-slate-200 dark:border-slate-700">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Smart File Compression
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Upload your file, set a target size, and get AI-powered optimization tips.
            </p>
          </div>

          <FileUploader file={file} onFileSelect={onFileSelect} />

          {file && (
            <div className="space-y-4 animate-fade-in">
              <label htmlFor="target-size" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Desired File Size (in KB)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="target-size"
                  value={targetSize}
                  onChange={(e) => onTargetSizeChange(Number(e.target.value))}
                  className="w-full pl-4 pr-16 py-3 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  min="1"
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-slate-500 dark:text-slate-400 font-semibold">KB</span>
              </div>
            </div>
          )}

          <button
            onClick={onSubmit}
            disabled={!file || isLoading}
            className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="h-6 w-6 mr-3" />
                Analyzing...
              </>
            ) : (
              'Analyze & Compress'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
