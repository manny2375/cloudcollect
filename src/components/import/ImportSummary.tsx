import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ImportResult } from '../../types';
import { Link } from 'react-router-dom';

interface ImportSummaryProps {
  result: ImportResult;
  onDismiss: () => void;
}

const ImportSummary: React.FC<ImportSummaryProps> = ({ result, onDismiss }) => {
  const { successful, failed, errors } = result;
  const hasErrors = failed > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
      <div className="text-center mb-6">
        {!hasErrors ? (
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
        ) : successful > 0 ? (
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
        )}
        
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {!hasErrors
            ? 'Import Completed Successfully'
            : 'Import Completed with Errors'}
        </h3>
        
        <p className="mt-1 text-sm text-gray-500">
          {successful} accounts were imported successfully
          {hasErrors && `, ${failed} accounts failed`}.
        </p>
      </div>
      
      {hasErrors && (
        <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
            Error Details
          </div>
          <div className="max-h-60 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Row
                  </th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {errors.map((error, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {error.row}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {error.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-6 flex space-x-3 justify-center">
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Import Another File
        </button>
        
        {successful > 0 && (
          <Link
            to="/accounts"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Imported Accounts
          </Link>
        )}
      </div>
    </div>
  );
};

export default ImportSummary;