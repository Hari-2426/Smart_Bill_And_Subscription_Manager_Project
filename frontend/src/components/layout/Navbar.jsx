import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Wallet,
} from 'lucide-react';

export const Navbar = ({ currentTab, onNavigate }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'bills', label: 'Bills & Subscriptions', icon: Receipt },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId) => {
    onNavigate(tabId);
    setIsMobileMenuOpen(false);
  };

  const userInitials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase()
    : 'U';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => handleTabClick('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
          }}
        >
          <img
            src="/smart-bill-logo.png"
            alt="SmartBill Logo"
            style={{
              width: '2.4rem',
              height: '2.4rem',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                }}
              >
                Smart<span style={{ color: 'var(--brand-600)' }}>Bill</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.35rem',
                  backgroundColor: 'var(--brand-50)',
                  color: 'var(--brand-700)',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.04em',
                }}
              >
                SaaS
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', lineHeight: 1 }}>
              Never miss a bill
            </p>
          </div>
        </div>

        {/* Desktop Navigation Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--brand-600)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--brand-50)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={17} color={isActive ? 'var(--brand-600)' : 'currentColor'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            onClick={() => handleTabClick('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div
              style={{
                width: '2.1rem',
                height: '2.1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-100)',
                color: 'var(--brand-700)',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--brand-200)',
              }}
            >
              {userInitials}
            </div>
            <div style={{ display: 'none' }} className="user-text-info">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', lineHeight: 1.2 }}>
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'My Account'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>
                {user?.email || ''}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)',
            }}
            title="Log out"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--status-overdue-bg)';
              e.currentTarget.style.color = 'var(--status-overdue)';
              e.currentTarget.style.borderColor = 'var(--status-overdue-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <LogOut size={16} />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
          className="mobile-drawer"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--brand-600)' : 'var(--text-primary)',
                  backgroundColor: isActive ? 'var(--brand-50)' : 'transparent',
                  textAlign: 'left',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--brand-600)' : 'currentColor'} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Responsive Media Query Styles */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .user-text-info {
            display: block !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
