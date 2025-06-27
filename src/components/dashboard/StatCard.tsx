import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  trend = 'neutral'
}) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100/50',
      text: 'text-blue-700',
      iconBg: 'bg-blue-500',
      border: 'border-blue-200',
    },
    green: {
      bg: 'from-emerald-50 to-emerald-100/50',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    amber: {
      bg: 'from-amber-50 to-amber-100/50',
      text: 'text-amber-700',
      iconBg: 'bg-amber-500',
      border: 'border-amber-200',
    },
    red: {
      bg: 'from-red-50 to-red-100/50',
      text: 'text-red-700',
      iconBg: 'bg-red-500',
      border: 'border-red-200',
    },
    purple: {
      bg: 'from-purple-50 to-purple-100/50',
      text: 'text-purple-700',
      iconBg: 'bg-purple-500',
      border: 'border-purple-200',
    },
  };
  
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClasses[color].bg} border ${colorClasses[color].border} p-6 shadow-sm hover:shadow-md transition-all duration-200 hover-lift`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-current"></div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-current"></div>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
            <p className={`text-3xl font-bold ${colorClasses[color].text} mb-2`}>
              {value}
            </p>
            
            {change && (
              <div className="flex items-center space-x-1">
                {change.type === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  change.type === 'increase' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                </span>
                <span className="text-sm text-neutral-500">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={`${colorClasses[color].iconBg} p-3 rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;