import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart2, 
  Settings, 
  FileUp,
  Shield,
  ChevronLeft, 
  ChevronRight,
  CreditCard,
  Activity
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: Home,
      description: 'Overview & analytics'
    },
    { 
      name: 'Accounts', 
      path: '/dashboard/accounts', 
      icon: Users,
      description: 'Manage debtors'
    },
    { 
      name: 'Payments', 
      path: '/dashboard/payments', 
      icon: CreditCard,
      description: 'Process payments'
    },
    { 
      name: 'Documents', 
      path: '/dashboard/documents', 
      icon: FileText,
      description: 'File management'
    },
    { 
      name: 'Import', 
      path: '/dashboard/import', 
      icon: FileUp,
      description: 'Bulk import data'
    },
    { 
      name: 'Reports', 
      path: '/dashboard/reports', 
      icon: BarChart2,
      description: 'Analytics & reports'
    },
    { 
      name: 'Activity', 
      path: '/dashboard/activity', 
      icon: Activity,
      description: 'System activity'
    },
  ];

  const adminItems = [
    { 
      name: 'Users', 
      path: '/dashboard/users', 
      icon: Users,
      description: 'User management'
    },
    { 
      name: 'Roles', 
      path: '/dashboard/roles', 
      icon: Shield,
      description: 'Role permissions'
    },
    { 
      name: 'Settings', 
      path: '/dashboard/settings', 
      icon: Settings,
      description: 'System settings'
    },
  ];
  
  return (
    <aside 
      className={`bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out h-screen sticky top-0 shadow-sm ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <div>
                <h2 className="font-bold text-neutral-900">CloudCollect</h2>
                <p className="text-xs text-neutral-500">v2.0</p>
              </div>
            </div>
          )}
          <button 
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-700"
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <div className="px-3">
            {!collapsed && (
              <div className="mb-4">
                <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Main
                </h3>
              </div>
            )}
            
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                      }`}
                      title={collapsed ? item.name : ''}
                    >
                      <item.icon className={`flex-shrink-0 w-5 h-5 ${
                        isActive ? 'text-primary-600' : 'text-neutral-500 group-hover:text-neutral-700'
                      }`} />
                      {!collapsed && (
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
                        </div>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Admin Section */}
            <div className="mt-8">
              {!collapsed && (
                <div className="mb-4">
                  <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Administration
                  </h3>
                </div>
              )}
              
              <ul className="space-y-1">
                {adminItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                        }`}
                        title={collapsed ? item.name : ''}
                      >
                        <item.icon className={`flex-shrink-0 w-5 h-5 ${
                          isActive ? 'text-primary-600' : 'text-neutral-500 group-hover:text-neutral-700'
                        }`} />
                        {!collapsed && (
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <span>{item.name}</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">{item.description}</p>
                          </div>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-neutral-100">
          {!collapsed ? (
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">System Status</p>
                  <p className="text-xs text-neutral-600">All systems operational</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;