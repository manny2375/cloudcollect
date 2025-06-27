import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Building, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [companyCode, setCompanyCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateCompanyCode = (code: string): boolean => {
    return /^\d{4}$/.test(code);
  };

  const handleCompanyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4); // Only allow digits, max 4
    setCompanyCode(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate company code first
      if (!validateCompanyCode(companyCode)) {
        throw new Error('Company code must be exactly 4 digits');
      }

      if (!email.trim() || !password.trim()) {
        throw new Error('Email and password are required');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo credentials check with company isolation
      if (companyCode === '1234' && email === 'admin@example.com' && password === 'password') {
        // Store authentication data with company context
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: 'user-1',
          name: 'Admin User',
          email: email,
          companyId: 'company-1234',
          companyCode: companyCode,
          role: 'Administrator'
        }));
        localStorage.setItem('company', JSON.stringify({
          id: 'company-1234',
          code: companyCode,
          name: 'Demo Company',
          email: 'contact@democompany.com'
        }));
        
        navigate('/dashboard');
      } else {
        throw new Error('Invalid company code, email, or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-200/30 to-accent-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-accent-200/30 to-primary-200/30 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and branding */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">CC</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">CloudCollect</h1>
          <p className="text-neutral-600">Professional Debt Management Platform</p>
          <p className="text-sm text-neutral-500 mt-2">Multi-tenant secure access</p>
        </div>

        {/* Login form */}
        <div className="card-elevated p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Welcome back</h2>
            <p className="text-neutral-600">Sign in to your company account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Code */}
            <div>
              <label htmlFor="company-code" className="block text-sm font-medium text-neutral-700 mb-2">
                Company Code <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="company-code"
                  type="text"
                  value={companyCode}
                  onChange={handleCompanyCodeChange}
                  className={`input pl-10 text-center text-lg font-mono tracking-widest ${
                    companyCode && !validateCompanyCode(companyCode) ? 'input-error' : ''
                  }`}
                  placeholder="0000"
                  maxLength={4}
                  required
                  autoComplete="organization"
                />
                <Building className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-neutral-500">
                  Your unique 4-digit company identifier
                </p>
                {companyCode && (
                  <div className="flex items-center space-x-1">
                    {validateCompanyCode(companyCode) ? (
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-error-500 rounded-full"></div>
                    )}
                    <span className={`text-xs ${
                      validateCompanyCode(companyCode) ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {companyCode.length}/4
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="input pl-10"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-error-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !validateCompanyCode(companyCode)}
              className="btn btn-primary btn-lg w-full group"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Company {companyCode || '****'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Demo credentials */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <h4 className="text-sm font-medium text-neutral-900 mb-2">Demo Credentials</h4>
              <div className="text-xs text-neutral-600 space-y-1">
                <p><strong>Company Code:</strong> <span className="font-mono">1234</span></p>
                <p><strong>Email:</strong> admin@example.com</p>
                <p><strong>Password:</strong> password</p>
              </div>
            </div>

            {/* Footer links */}
            <div className="text-center space-y-2">
              <a href="#" className="text-sm text-primary-600 hover:text-primary-500 font-medium transition-colors">
                Forgot your password?
              </a>
              <div className="text-xs text-neutral-500">
                Need a company account? <a href="#" className="text-primary-600 hover:text-primary-500">Contact sales</a>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-neutral-500">
            © 2025 CloudCollect. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Secure multi-tenant debt management platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;