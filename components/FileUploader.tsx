
import React, { useCallback, useState } from 'react';
import { UploadIcon, FileIcon, XIcon, CheckCircleIcon } from './icons';
import { formatFileSize } from '../utils/fileUtils';

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ file, onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
  };

  if (file) {
    return (
      <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg flex items-center justify-between animate-fade-in transition-all">
        <div className="flex items-center space-x-3 overflow-hidden">
          <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button onClick={handleRemoveFile} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
          <XIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${
        isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500'
      }`}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center space-y-2 text-slate-500 dark:text-slate-400">
        <UploadIcon className="h-10 w-10" />
        <p className="font-semibold">
          <span className="text-sky-600 dark:text-sky-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs">Any image or document file</p>
      </div>
    </div>
  );
};
