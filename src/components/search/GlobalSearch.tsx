import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiClient } from '../../hooks/useAPI';
import { formatCurrency } from '../../utils/formatters';

interface SearchResult {
  id: string;
  first_name: string;
  last_name: string;
  account_number: string;
  current_balance: number;
  status: string;
  phone_numbers?: string;
}

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setIsOpen(true);

    if (term.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await apiClient.searchDebtors(term);
      setResults(searchResults.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = (accountId: string) => {
    navigate(`/dashboard/accounts/${accountId}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, account #, phone, or SSN..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="input w-full pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
      </div>

      {isOpen && (searchTerm || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-96 overflow-y-auto z-50 animate-scale-in">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-neutral-200">
              {results.map(account => (
                <li 
                  key={account.id}
                  onClick={() => handleSelectAccount(account.id)}
                  className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-neutral-900">
                        {account.first_name} {account.last_name}
                      </div>
                      <div className="text-sm text-neutral-500">
                        Account: {account.account_number}
                      </div>
                      {account.phone_numbers && (
                        <div className="text-sm text-neutral-500">
                          Phone: {account.phone_numbers}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-neutral-900">
                        {formatCurrency(account.current_balance)}
                      </div>
                      <span className={`badge ${
                        account.status === 'active' ? 'badge-primary' : 
                        account.status === 'paid' ? 'badge-success' : 
                        account.status === 'disputed' ? 'badge-warning' : 
                        'badge-neutral'
                      }`}>
                        {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm ? (
            <div className="p-4 text-center text-neutral-500">
              No accounts found matching "{searchTerm}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;