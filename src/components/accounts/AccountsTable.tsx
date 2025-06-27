import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface Account {
  id: string;
  first_name: string;
  last_name: string;
  account_number: string;
  current_balance: number;
  original_balance: number;
  status: string;
  last_payment_date?: string;
  last_payment_amount?: number;
  phones?: Array<{ number: string; is_primary: boolean }>;
}

interface AccountsTableProps {
  accounts: Account[];
  isLoading?: boolean;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Filter accounts based on search term and status
  const filteredAccounts = accounts.filter(account => {
    const searchFields = [
      `${account.first_name} ${account.last_name}`.toLowerCase(),
      account.account_number.toLowerCase(),
      account.account_number.replace(/[^0-9]/g, ''),
    ];

    const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
    
    const matchesSearch = searchTerm === '' || searchTerms.every(term => {
      const normalizedTerm = term.replace(/[^a-zA-Z0-9]/g, '');
      return searchFields.some(field => 
        field.includes(normalizedTerm) || 
        (field === account.account_number.toLowerCase() && field.includes(term))
      );
    });
      
    const matchesStatus = filterStatus === 'all' || account.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-3 md:space-y-0">
          <h2 className="text-lg font-medium text-neutral-900">Accounts</h2>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or account #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
            </div>
            
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input appearance-none pl-10 pr-10"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="paid">Paid</option>
                <option value="inactive">Inactive</option>
                <option value="disputed">Disputed</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Account #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Original Balance
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Current Balance
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Last Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-neutral-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : filteredAccounts.length > 0 ? (
              filteredAccounts.map(account => (
                <tr key={account.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/dashboard/accounts/${account.id}`} 
                      className="text-primary-600 hover:text-primary-900 font-medium transition-colors"
                    >
                      {account.first_name} {account.last_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                    {account.account_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                    {formatCurrency(account.original_balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-900 font-medium">
                    {formatCurrency(account.current_balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${
                      account.status === 'active' ? 'badge-primary' : 
                      account.status === 'paid' ? 'badge-success' : 
                      account.status === 'disputed' ? 'badge-warning' : 
                      'badge-neutral'
                    }`}>
                      {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                    {account.last_payment_date ? (
                      <div>
                        <div>{new Date(account.last_payment_date).toLocaleDateString()}</div>
                        {account.last_payment_amount && (
                          <div className="text-xs text-neutral-400">
                            {formatCurrency(account.last_payment_amount)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-400">No payments</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-neutral-500">
                  No accounts found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          Showing {filteredAccounts.length} of {accounts.length} accounts
        </div>
        
        <div className="flex space-x-2">
          <Link 
            to="/dashboard/import" 
            className="btn btn-primary btn-sm"
          >
            Import Accounts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountsTable;