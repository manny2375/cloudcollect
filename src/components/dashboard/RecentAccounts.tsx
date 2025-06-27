import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

interface Account {
  id: string;
  debtorName: string;
  accountNumber: string;
  balance: number;
  status: string;
  lastPaymentDate: string;
  lastPaymentAmount?: number;
}

interface RecentAccountsProps {
  accounts: Account[];
}

const RecentAccounts: React.FC<RecentAccountsProps> = ({ accounts }) => {
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900">Recent Accounts</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr className="bg-neutral-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Account #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Balance
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
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    to={`/dashboard/accounts/${account.id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-900 transition-colors"
                  >
                    {account.debtorName}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {account.accountNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                  {formatCurrency(account.balance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`badge ${
                    account.status === 'Active' ? 'badge-primary' : 
                    account.status === 'Paid' ? 'badge-success' : 
                    account.status === 'Disputed' ? 'badge-warning' : 
                    'badge-neutral'
                  }`}>
                    {account.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-900">{account.lastPaymentDate}</div>
                  {account.lastPaymentAmount && (
                    <div className="text-sm text-neutral-500">
                      {formatCurrency(account.lastPaymentAmount)}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-neutral-200">
        <Link 
          to="/dashboard/accounts" 
          className="text-sm text-primary-600 hover:text-primary-900 font-medium transition-colors"
        >
          View all accounts →
        </Link>
      </div>
    </div>
  );
};

export default RecentAccounts;