import React, { useState, useRef } from 'react';
import { FileUp, File, X, Download } from 'lucide-react';
import { parseExcelFile, generateExcelTemplate } from '../../utils/excelParser';
import { ImportResult } from '../../types';

interface FileUploaderProps {
  onUploadComplete: (result: ImportResult) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // Check file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setFile(file);
  };
  
  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const { data, errors } = await parseExcelFile(file);
      
      onUploadComplete({
        successful: data.length,
        failed: errors.length,
        errors,
      });
      
      // Reset the form after successful upload
      removeFile();
    } catch (err) {
      setError((err as Error).message || 'An error occurred while processing the file');
    } finally {
      setIsUploading(false);
    }
  };
  
  const downloadTemplate = () => {
    const blob = generateExcelTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accounts_template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Import Accounts</h2>
        <button
          onClick={downloadTemplate}
          className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
        >
          <Download size={16} className="mr-1" />
          Download Template
        </button>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        } ${file ? 'bg-gray-50' : ''} transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
        
        {!file ? (
          <div className="text-center">
            <FileUp 
              className="mx-auto h-12 w-12 text-gray-400" 
              aria-hidden="true" 
            />
            <div className="mt-4 flex flex-col items-center text-sm">
              <p className="font-medium text-indigo-600 hover:text-indigo-500">
                <span 
                  className="cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Click to upload
                </span>{' '}
                <span className="text-gray-500">or drag and drop</span>
              </p>
              <p className="text-gray-500 mt-1">
                Excel files only (.xlsx or .xls)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-8 w-8 text-indigo-500" />
              <div className="ml-3 text-sm">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            !file || isUploading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isUploading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Upload and Process'
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;