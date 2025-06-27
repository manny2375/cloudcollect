import React from 'react';
import AccountsTable from '../components/accounts/AccountsTable';
import { useDebtors } from '../hooks/useAPI';

const AccountsPage: React.FC = () => {
  const { debtors, loading, error } = useDebtors();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error-600 mb-2">Error Loading Accounts</h2>
          <p className="text-neutral-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Accounts</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage and view all debtor accounts
        </p>
      </div>
      
      <AccountsTable accounts={debtors} isLoading={loading} />
    </div>
  );
};

export default AccountsPage;