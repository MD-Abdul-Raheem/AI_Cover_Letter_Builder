import React, { useState, useRef, DragEvent } from 'react';
import { InputMethod, InputCardProps } from '../types';
import { TextIcon, UploadIcon } from './Icons';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;

const InputCard: React.FC<InputCardProps> = ({ 
  title, 
  value, 
  onChange, 
  placeholderText, 
  allowFileUpload = true,
  heightClass = "h-64",
  onClose
}) => {
  const [method, setMethod] = useState<InputMethod>(allowFileUpload ? 'file' : 'text');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    return fullText;
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          resolve(text);
        } else {
          reject(new Error("Failed to read text file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    setFileName(file.name);
    
    try {
      let text = '';
      
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } 
      else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.name.toLowerCase().endsWith('.docx')
      ) {
        text = await extractTextFromDocx(file);
      } 
      else if (
        file.type === 'text/plain' || 
        file.name.toLowerCase().endsWith('.txt') || 
        file.name.toLowerCase().endsWith('.md')
      ) {
        text = await readTextFile(file);
      } 
      else {
        throw new Error("Unsupported format. Please upload .pdf, .docx, .txt, or .md files.");
      }

      if (!text.trim()) {
         throw new Error("The file appears to be empty or text could not be extracted.");
      }

      onChange(text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process file.");
      setFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-slate-700 flex flex-col h-full min-h-[400px]">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 shrink-0 gap-2">
        <h3 className="text-base sm:text-lg font-medium text-slate-200 truncate">{title}</h3>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {allowFileUpload && (
              <button
                onClick={() => {
                    setMethod(method === 'file' ? 'text' : 'file');
                    setError(null);
                }}
                className="group flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 whitespace-nowrap"
                title={method === 'file' ? "Switch to Text Input" : "Switch to File Upload"}
              >
                {method === 'file' ? (
                  <>
                    <TextIcon />
                    <span className="hidden sm:inline">Paste Text</span>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <span className="hidden sm:inline">Upload File</span>
                  </>
                )}
              </button>
            )}
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors ml-2"
                    title="Remove Section"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        {method === 'text' || !allowFileUpload ? (
          <textarea
            className={`w-full ${heightClass} bg-slate-950 border border-slate-800 rounded-lg p-3 sm:p-4 text-sm sm:text-base text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-500 transition-all resize-none placeholder-slate-600 flex-grow`}
            placeholder={placeholderText}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div 
            className={`w-full ${heightClass} border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group relative overflow-hidden flex-grow
              ${error 
                ? 'border-red-500/50 bg-red-900/10 hover:bg-red-900/20' 
                : isDragging 
                  ? 'border-primary-500 bg-primary-500/10' 
                  : 'border-slate-700 bg-slate-950/50 hover:bg-slate-900 hover:border-secondary-500/50'
              }
            `}
            onClick={triggerFileUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".txt,.md,.pdf,.docx" 
              onChange={handleFileChange}
            />
            
            <div className={`p-3 sm:p-4 rounded-full transition-colors mb-2 sm:mb-3 relative z-10 pointer-events-none
                ${error 
                    ? 'bg-red-500/20 text-red-400' 
                    : isDragging || isProcessing
                        ? 'bg-primary-500/20 text-primary-300' 
                        : 'bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-secondary-400'
                }
            `}>
              {isProcessing ? (
                <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : error ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
                  </svg>
              ) : (
                  <UploadIcon />
              )}
            </div>
            
            <div className="text-center relative z-10 px-2 sm:px-4 pointer-events-none">
              <p className={`font-medium text-sm sm:text-base md:text-lg transition-colors break-words 
                  ${error 
                      ? 'text-red-400' 
                      : isDragging || isProcessing
                          ? 'text-primary-300' 
                          : 'text-slate-300 group-hover:text-secondary-300'
                  }
              `}>
                {error ? error : isProcessing ? 'Extracting text...' : (fileName ? fileName : 'Drag & Drop File Here')}
              </p>
              
              {!fileName && !error && !isProcessing && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1">or click to browse (.pdf, .docx, .txt, .md)</p>
              )}
              
              {fileName && !error && !isProcessing && (
                 <p className="text-xs text-green-400 mt-2 font-medium bg-green-900/20 px-2 py-1 rounded inline-block">Ready to process</p>
              )}
            </div>

            {/* Subtle background animation for Drag state */}
            {(isDragging || isProcessing) && !error && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 pointer-events-none" />
            )}
          </div>
        )}
        
        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 shrink-0 gap-1 sm:gap-0">
          <span className="text-xs text-slate-500 truncate max-w-full">
             {method === 'file' ? 'Supported: PDF, DOCX, TXT, MD' : 'Paste content directly'}
          </span>
          <span className={`text-xs font-medium transition-colors whitespace-nowrap ${value.length > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
            {value.length > 0 ? `${value.length.toLocaleString()} characters loaded` : 'No content'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputCard;