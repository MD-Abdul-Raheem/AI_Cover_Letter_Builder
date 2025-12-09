import React, { useState } from 'react';
import InputCard from './components/InputCard';
import OutputSection from './components/OutputSection';
import { SparklesIcon, TrashIcon } from './components/Icons';
import { generateCoverLetter } from './services/geminiService';

const App: React.FC = () => {
  const [jdContent, setJdContent] = useState<string>('');
  const [resumeContent, setResumeContent] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [candidateName, setCandidateName] = useState<string>('');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const isFormValid = jdContent.trim().length > 50 && resumeContent.trim().length > 50;
  const hasContent = jdContent.length > 0 || resumeContent.length > 0 || instructions.length > 0 || generatedLetter.length > 0;

  const autoExtractName = (text: string) => {
    if (!text) return;
    // Simple heuristic: The name is often the first non-empty line in a resume
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length > 0) {
      const firstLine = lines[0];
      // Basic validation: reasonable length for a name (e.g., < 50 chars)
      // and check if it doesn't look like a generic header
      if (firstLine.length < 50 && !firstLine.toLowerCase().includes('resume') && !firstLine.toLowerCase().includes('curriculum vitae')) {
        setCandidateName(firstLine);
      }
    }
  };

  const handleResumeChange = (content: string) => {
    setResumeContent(content);
    // Only auto-extract if the name field is currently empty to avoid overwriting user edits
    if (!candidateName && content) {
      autoExtractName(content);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all content and start over?")) {
      setJdContent('');
      setResumeContent('');
      setInstructions('');
      setCandidateName('');
      setGeneratedLetter('');
      setError(null);
      setShowInstructions(false);
    }
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    setGeneratedLetter('');

    try {
      const letter = await generateCoverLetter({
        jdContent,
        resumeContent,
        instructions,
        candidateName
      });
      setGeneratedLetter(letter);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-secondary-500/30 selection:text-secondary-100 pb-8 sm:pb-20">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-500 via-primary-500 to-secondary-500 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 text-center relative z-10">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-600/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
            <span className="text-white">AI Cover Letter</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-primary-500">Nexus</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-4">
            Transform your resume and a job description into a perfectly tailored, professional cover letter in seconds using the power of Gemini 2.5.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-8 relative z-20">
        
        {/* Reset / Clear Button Row */}
        {hasContent && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 text-sm text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-900/50 border border-transparent hover:border-slate-800"
              title="Reset all fields"
            >
              <TrashIcon />
              <span>Clear All</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Input 1: JD */}
          <InputCard
            title="1. Job Description"
            placeholderText="Paste the full job description here..."
            value={jdContent}
            onChange={setJdContent}
            allowFileUpload={true}
          />

          {/* Input 2: Resume */}
          <InputCard
            title="2. Your Resume"
            placeholderText="Paste your resume content (text only) here..."
            value={resumeContent}
            onChange={handleResumeChange}
            allowFileUpload={true}
          />
        </div>

        {/* Input 3: Additional Instructions */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
          {!showInstructions ? (
            <div className="flex justify-center">
              <button
                onClick={() => setShowInstructions(true)}
                className="group flex items-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-secondary-400 rounded-full font-medium transition-all duration-300 border border-slate-800 hover:border-secondary-500/50 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
                <span>Customize</span>
              </button>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <InputCard
                title="3. Additional Instructions (Optional)"
                placeholderText="e.g., 'Emphasize my leadership skills', 'Keep the tone enthusiastic', 'Mention my relocation plans'..."
                value={instructions}
                onChange={setInstructions}
                allowFileUpload={false}
                heightClass="h-32"
                onClose={() => {
                  setShowInstructions(false);
                  setInstructions('');
                }}
              />
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 px-4">
          <button
            onClick={handleGenerate}
            disabled={!isFormValid || isLoading}
            className={`
              relative group flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 w-full sm:w-auto max-w-md
              ${!isFormValid || isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-900/40 hover:shadow-primary-600/40 hover:scale-105 active:scale-95 border border-transparent'
              }
            `}
          >
             {/* Gradient Border Hack for nice glow */}
            {!isFormValid && !isLoading && (
               <div className="absolute inset-0 rounded-full border border-slate-700"></div>
            )}
            
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Crafting Masterpiece...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Generate Professional Letter</span>
              </>
            )}
          </button>
          
          {!isFormValid && (
             <p className="text-sm text-slate-500">
               Please provide both a Job Description and Resume content to proceed.
             </p>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-200 flex items-center max-w-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="max-w-4xl mx-auto">
          <OutputSection content={generatedLetter} onChange={setGeneratedLetter} />
        </div>

      </div>
    </div>
  );
};

export default App;