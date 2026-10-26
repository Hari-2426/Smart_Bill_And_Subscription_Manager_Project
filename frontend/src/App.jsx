import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MailAnimationProvider } from './context/MailAnimationContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/home/HomePage';
import AuthPage from './pages/auth/AuthPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import BillsPage from './pages/bills/BillsPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { Wallet } from 'lucide-react';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState(() => {
    return (window.location.hash === '#admin' || window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')) ? 'admin' : 'home';
  });
  const [authMode, setAuthMode] = useState('login');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('smartbill_admin_token'));
  });

  // Pre-warm Render backend on initial app load to minimize cold starts
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    fetch(`${backendUrl}/error`, { method: 'GET', mode: 'cors' }).catch(() => {});
  }, []);

  // Listen to admin URL entries (e.g. #admin or /admin)
  useEffect(() => {
    const handleRouteCheck = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')) {
        setCurrentTab('admin');
      }
    };
    handleRouteCheck();
    window.addEventListener('hashchange', handleRouteCheck);
    window.addEventListener('popstate', handleRouteCheck);
    return () => {
      window.removeEventListener('hashchange', handleRouteCheck);
      window.removeEventListener('popstate', handleRouteCheck);
    };
  }, []);

  // Once authentication is verified, if the user was on 'auth', send them to dashboard
  useEffect(() => {
    if (isAuthenticated && currentTab === 'auth') {
      setCurrentTab('dashboard');
    }
  }, [isAuthenticated, currentTab]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          backgroundColor: '#F8FAFC',
        }}
      >
        <div
          style={{
            width: '3.2rem',
            height: '3.2rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.35)',
            animation: 'pulseGlow 1.5s ease-in-out infinite',
          }}
        >
          <Wallet size={26} />
        </div>
        <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Synchronizing SmartBill Engine...
        </span>
      </div>
    );
  }

  // Handle Opening Auth from Home Page
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setCurrentTab('auth');
  };

  // Admin Portal (Accessible via #admin or currentTab === 'admin')
  if (currentTab === 'admin') {
    if (isAdminLoggedIn) {
      return (
        <AdminDashboardPage
          onLogout={() => {
            localStorage.removeItem('smartbill_admin_token');
            localStorage.removeItem('smartbill_admin');
            setIsAdminLoggedIn(false);
            window.location.hash = '';
            setCurrentTab('home');
          }}
        />
      );
    }

    return (
      <AdminLoginPage
        onLoginSuccess={(admin) => {
          setIsAdminLoggedIn(true);
        }}
        onBackToHome={() => {
          window.location.hash = '';
          setCurrentTab('home');
        }}
      />
    );
  }

  // 1. Home Page (Publicly accessible)
  if (currentTab === 'home') {
    return (
      <HomePage
        onOpenAuth={handleOpenAuth}
        onGoToDashboard={() => setCurrentTab('dashboard')}
      />
    );
  }

  // 2. Auth Page (Login / Register)
  if (currentTab === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onBackToHome={() => setCurrentTab('home')}
      />
    );
  }

  // If user is not authenticated and trying to view protected tabs, show Auth
  if (!isAuthenticated) {
    return (
      <AuthPage
        initialMode="login"
        onBackToHome={() => setCurrentTab('home')}
      />
    );
  }

  // 3. Authenticated SmartBill Workspace
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Navbar currentTab={currentTab} onNavigate={setCurrentTab} />

      <main style={{ flex: 1 }} className="animate-fade-in">
        {currentTab === 'dashboard' && <DashboardPage />}
        {currentTab === 'bills' && <BillsPage />}
        {currentTab === 'payments' && <PaymentsPage onNavigateToBills={() => setCurrentTab('bills')} />}
        {currentTab === 'profile' && <ProfilePage />}
      </main>

      {/* Workspace Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#FFFFFF',
          padding: '1.25rem 0',
          marginTop: 'auto',
        }}
      >
        <div
          className="app-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--text-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentTab('home')}
              style={{
                fontWeight: 600,
                color: 'var(--brand-600)',
                cursor: 'pointer',
              }}
            >
              SmartBill Home
            </button>
            <span>•</span>
            <span>Never miss a bill. Stay ahead of every payment.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>© 2026 SmartBill Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <MailAnimationProvider>
          <AppContent />
        </MailAnimationProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
