import React from 'react';
import { Users, DollarSign, TrendingUp, AlertCircle, Target, Clock, CheckCircle, Activity } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentAccounts from '../components/dashboard/RecentAccounts';
import { useDebtors, useDashboardStats } from '../hooks/useAPI';
import { formatCurrency } from '../utils/formatters';

const DashboardPage: React.FC = () => {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { debtors, loading: debtorsLoading } = useDebtors(5, 0);

  const recentAccounts = debtors.slice(0, 5).map(account => ({
    id: account.id,
    debtorName: `${account.first_name} ${account.last_name}`,
    accountNumber: account.account_number,
    balance: account.current_balance,
    originalBalance: account.original_balance,
    lastPaymentDate: account.last_payment_date ? new Date(account.last_payment_date).toLocaleDateString() : 'No payments',
    lastPaymentAmount: account.last_payment_amount,
    status: account.status.charAt(0).toUpperCase() + account.status.slice(1)
  }));

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="mt-2 text-neutral-600">Welcome back! Here's what's happening with your collections.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-neutral-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Live data</span>
          </div>
          <button className="btn btn-primary btn-sm">
            <Activity className="w-4 h-4 mr-2" />
            View Activity
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Accounts"
            value={stats.totalAccounts.toLocaleString()}
            change={{ value: 12, type: 'increase' }}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Outstanding Debt"
            value={formatCurrency(stats.totalDebt)}
            change={{ value: 8, type: 'increase' }}
            icon={DollarSign}
            color="red"
          />
          <StatCard
            title="Collected This Month"
            value={formatCurrency(stats.collectedDebt)}
            change={{ value: 23, type: 'increase' }}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            change={{ value: 5, type: 'increase' }}
            icon={Target}
            color="purple"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAccounts accounts={recentAccounts} />
        </div>
        
        <div className="space-y-6">
          {/* Collection Progress */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Collection Progress</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-neutral-500">On track</span>
              </div>
            </div>
            
            {stats && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-neutral-700">Monthly Goal</span>
                    <span className="text-neutral-600">
                      {formatCurrency(stats.collectedDebt)} / {formatCurrency(100000)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((stats.collectedDebt / 100000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {Math.round((stats.collectedDebt / 100000) * 100)}% of monthly goal
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg mx-auto mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">{stats.successRate}%</p>
                    <p className="text-xs text-neutral-500">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">4.2</p>
                    <p className="text-xs text-neutral-500">Avg Days</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Today's Activity</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">New Accounts</p>
                    <p className="text-xs text-neutral-500">Added today</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-600">12</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Payments</p>
                    <p className="text-xs text-neutral-500">Processed today</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-emerald-600">8</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Follow-ups</p>
                    <p className="text-xs text-neutral-500">Due today</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-amber-600">15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;