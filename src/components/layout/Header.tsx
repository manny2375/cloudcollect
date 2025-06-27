import React, { useState } from 'react';
import { Bell, User, ChevronDown, Search, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlobalSearch from '../search/GlobalSearch';

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState(3);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient">CloudCollect</h1>
                <p className="text-xs text-neutral-500 -mt-1">Debt Management</p>
              </div>
            </Link>
          </div>
          
          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <GlobalSearch />
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile search */}
            <button className="md:hidden p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
                  {username.slice(0, 1).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-neutral-900">{username}</p>
                  <p className="text-xs text-neutral-500">Administrator</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 animate-scale-in">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-medium text-neutral-900">{username}</p>
                    <p className="text-xs text-neutral-500">admin@example.com</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-neutral-500" />
                      Settings
                    </Link>
                    <Link
                      to="/dashboard/users"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3 text-neutral-500" />
                      Profile
                    </Link>
                  </div>
                  
                  <div className="border-t border-neutral-100 py-1">
                    <button
                      onClick={() => {
                        localStorage.removeItem('isAuthenticated');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;