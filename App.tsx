import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CompressionForm } from './components/CompressionForm';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeFile } from './services/geminiService';
import { compressImage } from './utils/compressionUtils';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

export type AppState = 'FORM' | 'LOADING' | 'RESULT' | 'ERROR';
export type AuthModalMode = 'login' | 'signup';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('FORM');
  const [file, setFile] = useState<File | null>(null);
  const [targetSize, setTargetSize] = useState<number>(50);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [actualCompressedSize, setActualCompressedSize] = useState<number>(0);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');

  const openAuthModal = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to compress.');
      setAppState('ERROR');
      return;
    }
    
    setAppState('LOADING');
    setError('');

    const isImage = file.type.startsWith('image/');

    try {
      const analysisPromise = isImage
        ? analyzeFile(file, targetSize)
        : Promise.resolve(`This file type (${file.type}) cannot be analyzed by the AI or compressed by this tool.\n\n**File Details:**\nFor non-image files, compression is not performed. You can download the original file below. For document compression, specific tools that understand the file structure are recommended.`);
      
      const compressionPromise = isImage
        ? compressImage(file, targetSize)
        : Promise.resolve(null);
      
      const [analysisResult, compressionResult] = await Promise.all([analysisPromise, compressionPromise]);

      setAnalysisResult(analysisResult);
      if (compressionResult) {
        setCompressedFile(compressionResult.blob);
        setActualCompressedSize(compressionResult.actualSizeKB);
      } else {
        setCompressedFile(null);
        setActualCompressedSize(0);
      }
      
      setAppState('RESULT');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to process the file. ${errorMessage}`);
      setAppState('ERROR');
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult('');
    setError('');
    setCompressedFile(null);
    setActualCompressedSize(0);
    setAppState('FORM');
  };

  const renderContent = () => {
    switch (appState) {
      case 'FORM':
      case 'LOADING':
        return (
          <CompressionForm
            file={file}
            onFileSelect={handleFileSelect}
            targetSize={targetSize}
            onTargetSizeChange={setTargetSize}
            onSubmit={handleSubmit}
            isLoading={appState === 'LOADING'}
          />
        );
      case 'RESULT':
        return (
          <ResultDisplay
            resultText={analysisResult}
            originalFile={file!}
            targetSize={targetSize}
            onReset={handleReset}
            compressedFile={compressedFile}
            actualCompressedSize={actualCompressedSize}
          />
        );
      case 'ERROR':
        return (
            <div className="w-full max-w-2xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
                <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75"
                >
                    Try Again
                </button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200">
        <Header 
          onLoginClick={() => openAuthModal('login')}
          onSignUpClick={() => openAuthModal('signup')}
        />
        <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
        <Footer />
      </div>
      {isAuthModalOpen && (
        <AuthModal 
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)} 
        />
      )}
    </AuthProvider>
  );
};

export default App;
