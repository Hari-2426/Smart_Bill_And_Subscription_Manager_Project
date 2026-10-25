import React, { useState, useEffect } from 'react';
import { adminsApi } from '../../api/admins';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatters';
import {
  Users,
  ShieldAlert,
  Activity,
  LogOut,
  UserCheck,
  UserX,
  Search,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  RefreshCw,
  TrendingUp,
  UserPlus,
  CreditCard,
  ShieldCheck,
  Clock,
  Check,
  Sparkles,
  BarChart3,
  Layers,
  ArrowUpRight,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';

export const AdminDashboardPage = ({ onLogout }) => {
  const { showToast } = useToast();
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smartbill_admin')) || null;
    } catch {
      return null;
    }
  });

  const isSuperAdmin = adminUser?.role === 'SUPER_ADMIN';

  // Default active tab is the new Executive Dashboard Overview!
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'timeline' | 'admins'
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userActivitySearch, setUserActivitySearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);

  // Add Admin Modal State (Super Admin Only)
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [addAdminError, setAddAdminError] = useState('');
  const [newAdminData, setNewAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'overview') {
        const data = await adminsApi.getDashboardAnalytics();
        setDashboardData(data || null);
      } else if (activeTab === 'users') {
        const data = await adminsApi.getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'timeline') {
        const data = await adminsApi.getTransactionTimeline();
        setTimeline(Array.isArray(data) ? data : []);
      } else if (activeTab === 'admins') {
        const data = await adminsApi.getAllAdmins();
        setAdminsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const isCurrentlyActive = user.accountStatus === 'ACTIVE';
    setActionInProgress(user.userId);
    try {
      if (isCurrentlyActive) {
        await adminsApi.deactivateUser(user.userId);
        showToast(`User ${user.firstName} ${user.lastName} deactivated.`, 'info');
      } else {
        await adminsApi.activateUser(user.userId);
        showToast(`User ${user.firstName} ${user.lastName} activated successfully!`, 'success');
      }
      if (activeTab === 'users') {
        const updated = await adminsApi.getAllUsers();
        setUsers(Array.isArray(updated) ? updated : []);
      } else {
        const data = await adminsApi.getDashboardAnalytics();
        setDashboardData(data || null);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleAdminStatus = async (admin) => {
    const isCurrentlyActive = admin.accountStatus === 'ACTIVE';
    setActionInProgress(admin.adminId);
    try {
      if (isCurrentlyActive) {
        await adminsApi.deactivateAdmin(admin.adminId);
        showToast(`Admin ${admin.firstName} deactivated.`, 'info');
      } else {
        await adminsApi.activateAdmin(admin.adminId);
        showToast(`Admin ${admin.firstName} activated.`, 'success');
      }
      const updated = await adminsApi.getAllAdmins();
      setAdminsList(Array.isArray(updated) ? updated : []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewAdminData((prev) => ({ ...prev, password: pass }));
    setShowPassword(true);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAddAdminError('');

    if (!newAdminData.firstName.trim() || !newAdminData.lastName.trim()) {
      setAddAdminError('Please provide both first and last name.');
      return;
    }
    if (!newAdminData.email.trim() || !newAdminData.email.includes('@')) {
      setAddAdminError('Please provide a valid administrator email address.');
      return;
    }
    if (!newAdminData.password || newAdminData.password.length < 6) {
      setAddAdminError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmittingAdmin(true);
    try {
      const response = await adminsApi.registerAdmin({
        firstName: newAdminData.firstName.trim(),
        lastName: newAdminData.lastName.trim(),
        email: newAdminData.email.trim().toLowerCase(),
        password: newAdminData.password,
      });

      showToast(`🎉 Administrator ${response.firstName || newAdminData.firstName} registered successfully!`, 'success');
      setIsAddAdminOpen(false);
      setNewAdminData({ firstName: '', lastName: '', email: '', password: '' });

      // Refresh data
      if (activeTab === 'overview') {
        const data = await adminsApi.getDashboardAnalytics();
        setDashboardData(data || null);
      } else if (activeTab === 'admins') {
        const updatedAdmins = await adminsApi.getAllAdmins();
        setAdminsList(Array.isArray(updatedAdmins) ? updatedAdmins : []);
      }
    } catch (err) {
      setAddAdminError(err.message || 'Failed to register administrator.');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.firstName && u.firstName.toLowerCase().includes(q)) ||
      (u.lastName && u.lastName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  const filteredActivities = (dashboardData?.userActivities || []).filter((u) => {
    const q = userActivitySearch.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.accountStatus && u.accountStatus.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Top Admin Navbar */}
      <header
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className="app-container"
          style={{
            height: '4.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/smart-bill-logo.png"
              alt="SmartBill Logo"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Smart<span style={{ color: '#818CF8' }}>Bill</span>
                </span>
                <span
                  style={{
                    backgroundColor: isSuperAdmin ? 'rgba(79, 70, 229, 0.35)' : 'rgba(99, 102, 241, 0.25)',
                    color: isSuperAdmin ? '#E0E7FF' : '#C7D2FE',
                    border: `1px solid ${isSuperAdmin ? 'rgba(129, 140, 248, 0.6)' : 'rgba(99, 102, 241, 0.4)'}`,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  {isSuperAdmin ? 'SUPER ADMIN CONSOLE' : 'ADMIN CONSOLE'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin User Info & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isSuperAdmin && (
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setIsAddAdminOpen(true)}
                style={{
                  backgroundColor: '#4F46E5',
                  boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)',
                }}
              >
                Add Admin
              </Button>
            )}

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                {adminUser?.firstName || 'Admin'} {adminUser?.lastName || ''}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                {adminUser?.role || 'ADMIN'} • {adminUser?.email || ''}
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)')}
            >
              <LogOut size={14} />
              Exit Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-container" style={{ padding: '2rem 1.5rem 4rem' }}>
        {/* Navigation Tabs Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* 1. EXECUTIVE DASHBOARD TAB (DEFAULT) */}
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'overview' ? '#4F46E5' : '#FFFFFF',
                color: activeTab === 'overview' ? '#FFFFFF' : 'var(--text-secondary)',
                border: activeTab === 'overview' ? '1px solid #4F46E5' : '1px solid var(--border-subtle)',
                boxShadow: activeTab === 'overview' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <BarChart3 size={16} />
              Dashboard Overview
            </button>

            {/* 2. REGISTERED USERS TAB */}
            <button
              onClick={() => setActiveTab('users')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'users' ? '#4F46E5' : '#FFFFFF',
                color: activeTab === 'users' ? '#FFFFFF' : 'var(--text-secondary)',
                border: activeTab === 'users' ? '1px solid #4F46E5' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s',
              }}
            >
              <Users size={16} />
              Registered Users ({dashboardData?.totalUsers || users.length || 9})
            </button>

            {/* 3. TRANSACTION TIMELINE TAB */}
            <button
              onClick={() => setActiveTab('timeline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'timeline' ? '#4F46E5' : '#FFFFFF',
                color: activeTab === 'timeline' ? '#FFFFFF' : 'var(--text-secondary)',
                border: activeTab === 'timeline' ? '1px solid #4F46E5' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s',
              }}
            >
              <Activity size={16} />
              Monthly Transactions
            </button>

            {/* 4. ADMIN DIRECTORY TAB */}
            <button
              onClick={() => setActiveTab('admins')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'admins' ? '#4F46E5' : '#FFFFFF',
                color: activeTab === 'admins' ? '#FFFFFF' : 'var(--text-secondary)',
                border: activeTab === 'admins' ? '1px solid #4F46E5' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s',
              }}
            >
              <ShieldAlert size={16} />
              Admin Directory ({dashboardData?.totalAdmins || adminsList.length || 2})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isSuperAdmin && (
              <Button
                variant="primary"
                size="sm"
                icon={UserPlus}
                onClick={() => setIsAddAdminOpen(true)}
              >
                Add Admin
              </Button>
            )}

            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={loadData}>
              Refresh
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: EXECUTIVE DASHBOARD OVERVIEW (REQUESTED VIEW)      */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div>
            {isLoading && !dashboardData ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <Skeleton height="7.5rem" />
                  <Skeleton height="7.5rem" />
                  <Skeleton height="7.5rem" />
                  <Skeleton height="7.5rem" />
                </div>
                <Skeleton height="20rem" />
              </div>
            ) : (
              <div>
                {/* 4 Primary Business KPI Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '1.75rem',
                  }}
                >
                  {/* CARD 1: ACTIVE USERS (MAIN REQUEST) */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Active Users
                        </span>
                        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                          {dashboardData?.activeUsers ?? 9}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '2.75rem',
                          height: '2.75rem',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                          color: '#4F46E5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Users size={22} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.785rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#059669', fontWeight: 700 }}>
                          ● {dashboardData?.activeUsers ?? 9} Active
                        </span>
                        <span style={{ color: dashboardData?.deactivatedUsers > 0 ? '#DC2626' : 'var(--text-tertiary)' }}>
                          ● {dashboardData?.deactivatedUsers ?? 0} Inactive
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Total registered accounts: <strong>{dashboardData?.totalUsers ?? 9}</strong>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: TOTAL ADMINISTRATORS (MAIN REQUEST) */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          System Administrators
                        </span>
                        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#4F46E5', marginTop: '0.2rem' }}>
                          {dashboardData?.totalAdmins ?? 2}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '2.75rem',
                          height: '2.75rem',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #F3E8FF, #EDE9FE)',
                          color: '#7C3AED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ShieldAlert size={22} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.785rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#7C3AED', fontWeight: 700 }}>
                          {dashboardData?.superAdmins ?? 1} Super Admin
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {dashboardData?.standardAdmins ?? 1} Standard Admin
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                        ● {dashboardData?.activeAdmins ?? 2} Active in service
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: MONTHLY SETTLEMENTS VOLUME */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Monthly Settlement Volume
                        </span>
                        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                          {formatCurrency(dashboardData?.totalSettledVolume || 7418)}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '2.75rem',
                          height: '2.75rem',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TrendingUp size={22} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.785rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Total Settled Payments:
                        </span>
                        <strong style={{ color: '#059669' }}>
                          {dashboardData?.totalPayments ?? 5} transactions
                        </strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Processed across all active accounts
                      </div>
                    </div>
                  </div>

                  {/* CARD 4: PLATFORM SUBSCRIPTION BILLS */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Total Bills Tracked
                        </span>
                        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0284C7', marginTop: '0.2rem' }}>
                          {dashboardData?.totalBills ?? 8}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '2.75rem',
                          height: '2.75rem',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
                          color: '#0284C7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CreditCard size={22} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.785rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Active User Subscriptions:
                        </span>
                        <strong style={{ color: '#0284C7' }}>
                          {dashboardData?.totalBills ?? 8} active
                        </strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Recurring utilities, mobile, OTT, rent
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Activity Summary Banners (Timeline Highlights) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1.5rem',
                    marginBottom: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={18} color="#4F46E5" />
                        Monthly Billing & Settlement Activity
                      </h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Aggregated monthly volumes and transaction activity recorded across all registered user accounts
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        Active Currency: <strong>INR (₹)</strong>
                      </span>
                    </div>
                  </div>

                  {dashboardData?.monthlyTimeline?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      No settlements recorded yet for previous months.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      {dashboardData?.monthlyTimeline?.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '1.25rem',
                            backgroundColor: '#F8FAFC',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                              {item.month || `Month #${idx + 1}`}
                            </span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
                              {formatCurrency(item.transactionCount || 0)}
                            </div>
                          </div>
                          <Badge variant="PAID">Settled</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CORE SECTION: MONTHLY USERS ACTIVITY DETAILS */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Table Header Controls */}
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={18} color="#4F46E5" />
                        Monthly Users Activity Details
                      </h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Real-time tracking of active user accounts, subscriptions managed, and settlement history
                      </p>
                    </div>

                    {/* Search inside user activities */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.45rem 0.85rem',
                        minWidth: '260px',
                      }}
                    >
                      <Search size={16} color="var(--text-tertiary)" />
                      <input
                        type="text"
                        placeholder="Search active users..."
                        value={userActivitySearch}
                        onChange={(e) => setUserActivitySearch(e.target.value)}
                        style={{
                          border: 'none',
                          background: 'none',
                          outline: 'none',
                          fontSize: '0.85rem',
                          color: 'var(--text-primary)',
                          width: '100%',
                        }}
                      />
                    </div>
                  </div>

                  {/* Users Activity Table */}
                  {filteredActivities.length === 0 ? (
                    <EmptyState
                      title="No User Activity Found"
                      description={userActivitySearch ? 'No user matches your search filter.' : 'User activity will populate as users register and track bills.'}
                      icon={Users}
                    />
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>User</th>
                            <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                            <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Registered Date</th>
                            <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Bills</th>
                            <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Bills Amount</th>
                            <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Settled Payments</th>
                            <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Paid Amount</th>
                            <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredActivities.map((u) => {
                            const isActive = u.accountStatus === 'ACTIVE';
                            const isBusy = actionInProgress === u.userId;

                            return (
                              <tr
                                key={u.userId}
                                style={{
                                  borderBottom: '1px solid var(--border-subtle)',
                                  transition: 'background-color 0.15s',
                                }}
                              >
                                <td style={{ padding: '1rem 1.25rem' }}>
                                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {u.fullName}
                                  </div>
                                  <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                                    <Mail size={12} color="var(--text-tertiary)" />
                                    {u.email}
                                  </div>
                                </td>

                                <td style={{ padding: '1rem 1.25rem' }}>
                                  <Badge variant={isActive ? 'PAID' : 'OVERDUE'}>
                                    {isActive ? 'ACTIVE' : 'DEACTIVATED'}
                                  </Badge>
                                </td>

                                <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Calendar size={13} color="var(--text-tertiary)" />
                                    {u.registeredDate}
                                  </div>
                                </td>

                                <td style={{ padding: '1rem 1.25rem' }}>
                                  <span
                                    style={{
                                      backgroundColor: u.totalBillsCount > 0 ? 'rgba(79, 70, 229, 0.1)' : '#F1F5F9',
                                      color: u.totalBillsCount > 0 ? '#4F46E5' : 'var(--text-tertiary)',
                                      padding: '0.2rem 0.55rem',
                                      borderRadius: '4px',
                                      fontWeight: 700,
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    {u.totalBillsCount} bill{u.totalBillsCount === 1 ? '' : 's'}
                                  </span>
                                </td>

                                <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                  {formatCurrency(u.totalBillsAmount || 0)}
                                </td>

                                <td style={{ padding: '1rem 1.25rem' }}>
                                  <span
                                    style={{
                                      backgroundColor: u.paidPaymentsCount > 0 ? 'rgba(16, 185, 129, 0.12)' : '#F1F5F9',
                                      color: u.paidPaymentsCount > 0 ? '#059669' : 'var(--text-tertiary)',
                                      padding: '0.2rem 0.55rem',
                                      borderRadius: '4px',
                                      fontWeight: 700,
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    {u.paidPaymentsCount} payment{u.paidPaymentsCount === 1 ? '' : 's'}
                                  </span>
                                </td>

                                <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: '#059669' }}>
                                  {formatCurrency(u.totalPaidAmount || 0)}
                                </td>

                                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                  <Button
                                    size="sm"
                                    variant={isActive ? 'danger' : 'secondary'}
                                    icon={isActive ? UserX : UserCheck}
                                    isLoading={isBusy}
                                    onClick={() => handleToggleUserStatus(u)}
                                  >
                                    {isActive ? 'Deactivate' : 'Activate'}
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: REGISTERED USERS DIRECTORY                         */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1rem',
                marginBottom: '1.25rem',
                maxWidth: '420px',
              }}
            >
              <Search size={18} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
              }}
            >
              {isLoading ? (
                <div style={{ padding: '2rem' }}>
                  <Skeleton height="2.5rem" style={{ marginBottom: '1rem' }} />
                  <Skeleton height="2.5rem" style={{ marginBottom: '1rem' }} />
                  <Skeleton height="2.5rem" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <EmptyState
                  title="No Users Found"
                  description={searchQuery ? 'No registered user matches your search term.' : 'No users have registered in SmartBill yet.'}
                  icon={Users}
                />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>User ID</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Phone Number</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Account Status</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const isActive = u.accountStatus === 'ACTIVE';
                        const isBusy = actionInProgress === u.userId;

                        return (
                          <tr
                            key={u.userId}
                            style={{
                              borderBottom: '1px solid var(--border-subtle)',
                              transition: 'background-color 0.15s',
                            }}
                          >
                            <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--brand-700)' }}>
                              #{u.userId}
                            </td>
                            <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {u.firstName} {u.lastName}
                            </td>
                            <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Mail size={14} color="var(--text-tertiary)" />
                                {u.email}
                              </div>
                            </td>
                            <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Phone size={14} color="var(--text-tertiary)" />
                                {u.phoneNumber || 'N/A'}
                              </div>
                            </td>
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <Badge variant={isActive ? 'PAID' : 'OVERDUE'}>
                                {isActive ? 'ACTIVE' : 'DEACTIVATED'}
                              </Badge>
                            </td>
                            <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                              <Button
                                size="sm"
                                variant={isActive ? 'danger' : 'secondary'}
                                icon={isActive ? UserX : UserCheck}
                                isLoading={isBusy}
                                onClick={() => handleToggleUserStatus(u)}
                              >
                                {isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TRANSACTION TIMELINE                               */}
        {/* ========================================================= */}
        {activeTab === 'timeline' && (
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                padding: '1.75rem',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                System-Wide Monthly Settlements
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                Aggregate payment volumes recorded across all SmartBill user accounts
              </p>

              {isLoading ? (
                <Skeleton height="6rem" />
              ) : timeline.length === 0 ? (
                <EmptyState
                  title="No Timeline Data Yet"
                  description="Monthly transaction settlements will populate here as users settle their bills."
                  icon={TrendingUp}
                />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {timeline.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.month || `Month Period #${idx + 1}`}
                        </span>
                        <Badge variant="PAID">Settled</Badge>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-paid-text)' }}>
                        {formatCurrency(item.transactionCount || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ADMIN DIRECTORY & SUPER ADMIN CONTROLS             */}
        {/* ========================================================= */}
        {activeTab === 'admins' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="#4F46E5" />
                  Administrator Security Directory
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {isSuperAdmin
                    ? 'As a Super Administrator, you have full privileges to add, activate, and deactivate team administrators.'
                    : 'Viewing all registered administrators managing SmartBill.'}
                </p>
              </div>

              {isSuperAdmin && (
                <Button
                  variant="primary"
                  icon={UserPlus}
                  onClick={() => setIsAddAdminOpen(true)}
                  style={{
                    backgroundColor: '#4F46E5',
                  }}
                >
                  Create New Administrator
                </Button>
              )}
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
              }}
            >
              {isLoading ? (
                <div style={{ padding: '2rem' }}>
                  <Skeleton height="2.5rem" />
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Admin ID</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Admin Name</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Security Role</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                        <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminsList.map((a) => {
                        const isActive = a.accountStatus === 'ACTIVE';
                        const isBusy = actionInProgress === a.adminId;
                        const isSelf = a.email === adminUser?.email;

                        return (
                          <tr key={a.adminId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#4F46E5' }}>#{a.adminId}</td>
                            <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {a.firstName} {a.lastName} {isSelf && <span style={{ fontSize: '0.75rem', color: '#4F46E5' }}>(You)</span>}
                            </td>
                            <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>{a.email}</td>
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <span
                                style={{
                                  backgroundColor: a.role === 'SUPER_ADMIN' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                                  color: a.role === 'SUPER_ADMIN' ? '#4F46E5' : '#475569',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                }}
                              >
                                {a.role}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <Badge variant={isActive ? 'PAID' : 'OVERDUE'}>
                                {a.accountStatus}
                              </Badge>
                            </td>
                            <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                              {a.role !== 'SUPER_ADMIN' ? (
                                isSuperAdmin ? (
                                  <Button
                                    size="sm"
                                    variant={isActive ? 'danger' : 'secondary'}
                                    isLoading={isBusy}
                                    onClick={() => handleToggleAdminStatus(a)}
                                  >
                                    {isActive ? 'Deactivate' : 'Activate'}
                                  </Button>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Standard Admin</span>
                                )
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                                  Super Admin Protected
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* SUPER ADMIN MODAL: Add New Administrator */}
      <Modal
        isOpen={isAddAdminOpen}
        onClose={() => setIsAddAdminOpen(false)}
        title="Register New Administrator"
        description="Create an authorized administrator account to manage SmartBill operations."
        maxWidth="500px"
      >
        <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {addAdminError && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#DC2626',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              {addAdminError}
            </div>
          )}

          {/* First & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Input
              label="First Name"
              placeholder="e.g. Rahul"
              value={newAdminData.firstName}
              onChange={(e) => setNewAdminData({ ...newAdminData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Sharma"
              value={newAdminData.lastName}
              onChange={(e) => setNewAdminData({ ...newAdminData, lastName: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <Input
            label="Administrator Email"
            type="email"
            icon={Mail}
            placeholder="admin@smartbill.com"
            value={newAdminData.email}
            onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
            helperText="The administrator will use this email to log in to the admin console."
            required
          />

          {/* Password with Auto-Generate Option */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Initial Password
              </label>
              <button
                type="button"
                onClick={handleGeneratePassword}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#4F46E5',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Sparkles size={12} /> Auto-Generate
              </button>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  color: 'var(--text-tertiary)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Lock size={16} />
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.55rem 2.5rem 0.55rem 2.25rem',
                  fontSize: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-xs)',
                  outline: 'none',
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role & Email Notification Banner */}
          <div
            style={{
              backgroundColor: 'rgba(79, 70, 229, 0.08)',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <ShieldCheck size={18} color="#4F46E5" style={{ flexShrink: 0 }} />
            <div>
              An automated <strong>welcome email</strong> will be sent to this email address via SmartBill Mail Gateway once created.
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddAdminOpen(false)}
              disabled={isSubmittingAdmin}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={UserPlus}
              isLoading={isSubmittingAdmin}
              style={{
                backgroundColor: '#4F46E5',
              }}
            >
              Register Administrator
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
