import React from 'react';
import { formatFileSize } from '../utils/fileUtils';
import { DownloadIcon, SparklesIcon, ArrowPathIcon } from './icons';

interface ResultDisplayProps {
  resultText: string;
  originalFile: File;
  targetSize: number;
  onReset: () => void;
  compressedFile: Blob | null;
  actualCompressedSize: number; // in KB
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  resultText,
  originalFile,
  targetSize,
  onReset,
  compressedFile,
  actualCompressedSize,
}) => {
  const isCompressed = !!compressedFile;

  const handleDownload = () => {
    const fileToDownload = compressedFile || originalFile;
    const url = URL.createObjectURL(fileToDownload);
    const a = document.createElement('a');
    a.href = url;
    
    let downloadName = originalFile.name;
    if (isCompressed) {
        const nameParts = originalFile.name.split('.');
        if (nameParts.length > 1) nameParts.pop();
        const name = nameParts.join('.');
        // All compressed images are converted to JPEG for simplicity and effectiveness.
        downloadName = `${name}-compressed.jpeg`;
    }
    
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-6">
        {isCompressed ? 'Compression Complete!' : 'Analysis Complete!'}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Original File</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{originalFile.name}</p>
          <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{formatFileSize(originalFile.size)}</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{isCompressed ? 'Compressed File' : 'Target (Simulated)'}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{isCompressed ? `Actual Size (Target: ${targetSize} KB)` : 'File type not compressible'}</p>
          <p className={`text-lg font-bold ${isCompressed ? 'text-green-500' : 'text-slate-500'}`}>
            {isCompressed ? formatFileSize(actualCompressedSize * 1024) : `${targetSize} KB`}
          </p>
        </div>
      </div>

      <div className="bg-sky-50 dark:bg-sky-900/30 p-5 rounded-lg border border-sky-200 dark:border-sky-800">
        <h3 className="flex items-center text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
          <SparklesIcon className="h-6 w-6 mr-2 text-sky-500"/>
          AI Analysis
        </h3>
        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
          {resultText}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-all transform hover:scale-105"
        >
          <DownloadIcon className="h-5 w-5 mr-2" />
          {isCompressed ? 'Download Compressed File' : 'Download Original File'}
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 font-semibold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Compress Another File
        </button>
      </div>
    </div>
  );
};