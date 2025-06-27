import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Download, Filter, ChevronDown, FileText, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('This Month');
  
  // Mock data - replace with real data from D1
  const stats = {
    totalCollected: 456000,
    successRate: 74,
    averagePayment: 742,
    paymentGrowth: 12.4
  };
  
  // Collection data for bar chart
  const collectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Collections',
        data: [65000, 59000, 80000, 81000, 56000, 78500],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  // Account status data for doughnut chart
  const accountStatusData = {
    labels: ['Active', 'Paid', 'Inactive', 'Disputed'],
    datasets: [
      {
        data: [186, 42, 8, 7],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
      },
    ],
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  // Saved reports data
  const reports = [
    {
      name: 'Monthly Collection Summary',
      description: 'Summary of collections for the current month',
      type: 'PDF',
      date: '2025-01-15',
    },
    {
      name: 'Account Status Report',
      description: 'Breakdown of accounts by status',
      type: 'Excel',
      date: '2025-01-12',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-neutral-500">
          View and generate reports on collection performance
        </p>
      </div>

      {/* Performance Overview */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-neutral-900">Collection Performance</h2>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="input appearance-none pl-3 pr-8"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-neutral-400 pointer-events-none" />
            </div>

            <button className="btn btn-secondary btn-sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>

        <div className="h-80 mb-8">
          <Bar data={collectionData} options={barOptions} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-600">Total Collected</div>
                <div className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(stats.totalCollected)}</div>
                <div className="text-xs text-blue-600 mt-1">This Month</div>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-4 border border-emerald-200">
            <div className="text-sm text-neutral-600">Success Rate</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.successRate}%</div>
            <div className="text-xs text-emerald-600 mt-1">of total accounts</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-4 border border-amber-200">
            <div className="text-sm text-neutral-600">Average Payment</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(stats.averagePayment)}</div>
            <div className="text-xs text-amber-600 mt-1">per account</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-neutral-600">Payment Growth</div>
            <div className="text-2xl font-bold text-purple-700 mt-1">+{stats.paymentGrowth}%</div>
            <div className="text-xs text-purple-600 mt-1">vs. previous period</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="card">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-900">Saved Reports</h3>
            </div>

            <div className="divide-y divide-neutral-200">
              {reports.map((report, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-neutral-400 mt-1" />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-neutral-900">{report.name}</h4>
                          <p className="text-sm text-neutral-500">{report.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-neutral-500">{new Date(report.date).toLocaleDateString()}</span>
                          <span className={`badge ${
                            report.type === 'PDF' ? 'badge-error' : 'badge-success'
                          }`}>
                            {report.type}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <button className="text-sm text-primary-600 hover:text-primary-900 font-medium transition-colors">View</button>
                        <span className="text-neutral-300 mx-2">|</span>
                        <button className="text-sm text-primary-600 hover:text-primary-900 font-medium transition-colors">Download</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Account Status</h3>
          <div className="h-64">
            <Doughnut 
              data={accountStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;