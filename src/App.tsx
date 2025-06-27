import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';

// Lazy load routes
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AccountsPage = lazy(() => import('./pages/AccountsPage'));
const AccountDetailPage = lazy(() => import('./components/AccountDetailPage'));
const ImportPage = lazy(() => import('./pages/ImportPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const RolesPage = lazy(() => import('./pages/RolesPage'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
);

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const path = window.location.pathname;
  if (path === '/') {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          } />
          <Route path="accounts" element={
            <Suspense fallback={<PageLoader />}>
              <AccountsPage />
            </Suspense>
          } />
          <Route path="accounts/:id" element={
            <Suspense fallback={<PageLoader />}>
              <AccountDetailPage />
            </Suspense>
          } />
          <Route path="documents" element={
            <Suspense fallback={<PageLoader />}>
              <DocumentsPage />
            </Suspense>
          } />
          <Route path="import" element={
            <Suspense fallback={<PageLoader />}>
              <ImportPage />
            </Suspense>
          } />
          <Route path="reports" element={
            <Suspense fallback={<PageLoader />}>
              <ReportsPage />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={<PageLoader />}>
              <UsersPage />
            </Suspense>
          } />
          <Route path="roles" element={
            <Suspense fallback={<PageLoader />}>
              <RolesPage />
            </Suspense>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;