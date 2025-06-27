import React, { useState } from 'react';
import { FileText, FileUp, Search, Filter, ChevronDown, Download, Trash2 } from 'lucide-react';

const DocumentsPage: React.FC = () => {
  const [documents] = useState([
    {
      id: '1',
      name: 'Demand Letter - John Doe.pdf',
      type: 'Demand Letter',
      uploadedAt: '2025-01-15T10:30:00Z',
      uploadedBy: 'Admin User',
      debtorName: 'John Doe',
      accountNumber: 'ACC-12345'
    },
    {
      id: '2',
      name: 'Payment Agreement - Jane Smith.pdf',
      type: 'Payment Agreement',
      uploadedAt: '2025-01-14T14:20:00Z',
      uploadedBy: 'Sarah Johnson',
      debtorName: 'Jane Smith',
      accountNumber: 'ACC-12346'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || doc.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Documents</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage all documents across accounts
        </p>
      </div>
      
      <div className="card">
        <div className="px-6 py-4 border-b border-neutral-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
            <h2 className="text-lg font-medium text-neutral-900">All Documents</h2>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
              
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input appearance-none pl-10 pr-10"
                >
                  <option value="all">All Document Types</option>
                  <option value="Demand Letter">Demand Letters</option>
                  <option value="Payment Agreement">Payment Agreements</option>
                  <option value="Legal Notice">Legal Notices</option>
                  <option value="Statement">Statements</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
              
              <button className="btn btn-primary">
                <FileUp className="h-4 w-4 mr-2" />
                Upload Document
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Account
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-neutral-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-neutral-900">
                            {doc.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{doc.debtorName}</div>
                      <div className="text-sm text-neutral-500">{doc.accountNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-neutral">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-neutral-500">
                        by {doc.uploadedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <button className="text-primary-600 hover:text-primary-900 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-error-600 hover:text-error-900 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-neutral-500">
                    No documents found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-neutral-200">
          <div className="text-sm text-neutral-500">
            Showing {filteredDocuments.length} documents
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;