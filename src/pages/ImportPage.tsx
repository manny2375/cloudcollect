import React, { useState } from 'react';
import { FileUp, Download, AlertCircle, CheckCircle } from 'lucide-react';

const ImportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      // TODO: Implement actual import logic with D1 database
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate import
      setResult({
        successful: 150,
        failed: 5,
        errors: [
          { row: 12, message: 'Invalid email format' },
          { row: 25, message: 'Missing required field: account_number' },
          { row: 38, message: 'Duplicate account number' },
          { row: 67, message: 'Invalid phone number format' },
          { row: 89, message: 'Missing required field: first_name' },
        ]
      });
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const csvContent = `first_name,last_name,email,account_number,original_balance,current_balance,status,address,city,state,zip,phone
John,Doe,john.doe@example.com,ACC-12345,1000.00,750.00,active,123 Main St,Chicago,IL,60601,(555) 123-4567
Jane,Smith,jane.smith@example.com,ACC-12346,2500.00,2000.00,active,456 Oak Ave,New York,NY,10001,(555) 987-6543`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accounts_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Import Results</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Import completed with {result.successful} successful and {result.failed} failed records
          </p>
        </div>

        <div className="card p-6 text-center">
          {result.failed === 0 ? (
            <CheckCircle className="mx-auto h-12 w-12 text-success-500 mb-4" />
          ) : (
            <AlertCircle className="mx-auto h-12 w-12 text-warning-500 mb-4" />
          )}
          
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            {result.failed === 0 ? 'Import Completed Successfully' : 'Import Completed with Errors'}
          </h3>
          
          <p className="text-neutral-600 mb-6">
            {result.successful} accounts were imported successfully
            {result.failed > 0 && `, ${result.failed} accounts failed`}.
          </p>

          {result.failed > 0 && (
            <div className="mb-6 text-left">
              <h4 className="font-medium text-neutral-900 mb-3">Error Details:</h4>
              <div className="bg-neutral-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                {result.errors.map((error: any, index: number) => (
                  <div key={index} className="flex justify-between py-2 border-b border-neutral-200 last:border-b-0">
                    <span className="text-sm text-neutral-600">Row {error.row}</span>
                    <span className="text-sm text-error-600">{error.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setResult(null)}
              className="btn btn-secondary"
            >
              Import Another File
            </button>
            {result.successful > 0 && (
              <button
                onClick={() => window.location.href = '/dashboard/accounts'}
                className="btn btn-primary"
              >
                View Imported Accounts
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Import Accounts</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Upload CSV files containing debtor account information
        </p>
      </div>
      
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-neutral-900">Upload File</h2>
          <button
            onClick={downloadTemplate}
            className="btn btn-secondary btn-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </button>
        </div>

        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
          <FileUp className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          
          <div className="mb-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-primary-600 hover:text-primary-500 font-medium">
                Click to upload
              </span>
              <span className="text-neutral-500"> or drag and drop</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <p className="text-sm text-neutral-500">
            CSV, Excel files up to 10MB
          </p>
        </div>

        {file && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">{file.name}</p>
                <p className="text-sm text-neutral-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="btn btn-primary"
          >
            {importing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              'Import Accounts'
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-8 card p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Import Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
          <ul className="space-y-2">
            <li>• Use the template for best results</li>
            <li>• Required fields: first_name, last_name, account_number, original_balance</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
          </ul>
          <ul className="space-y-2">
            <li>• Date format: YYYY-MM-DD</li>
            <li>• Phone format: (555) 123-4567</li>
            <li>• Status values: active, paid, inactive, disputed</li>
            <li>• For large imports, processing may take several minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;