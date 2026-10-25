import React, { useState } from 'react';
import { adminsApi } from '../../api/admins';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ShieldAlert, Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLoginPage = ({ onLoginSuccess, onBackToHome }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: 'smartadmin4@gmail.com',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please provide both admin email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminsApi.loginAdmin({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Spring Boot backend returns AdminLoginResponseDTO: { token, adminId, firstName, lastName, email, role, ... }
      if (response && response.token) {
        localStorage.setItem('smartbill_admin_token', response.token);
        localStorage.setItem('smartbill_admin', JSON.stringify(response));
        showToast(`Welcome back Administrator, ${response.firstName || 'Admin'}!`, 'success');
        if (onLoginSuccess) {
          onLoginSuccess(response);
        }
      } else {
        throw new Error('Authentication succeeded but no authorization token was returned.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setFormData({
      email: 'smartadmin4@gmail.com',
      password: 'NANDAN@2005',
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0B0F19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Cyber Grid & Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '15%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="animate-slide-down"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '1.5rem',
          padding: '2.5rem 2.25rem',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(79, 70, 229, 0.25)',
          color: '#FFFFFF',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Back to Home Button */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.825rem',
              color: 'rgba(255, 255, 255, 0.55)',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)')}
          >
            <ArrowLeft size={16} />
            Back to Public Home
          </button>
        )}

        {/* Admin Badge Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: 'var(--radius-lg)',
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)',
              overflow: 'hidden',
            }}
          >
            <img
              src="/smart-bill-logo.png"
              alt="SmartBill"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#818CF8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '0.65rem',
            }}
          >
            <Lock size={12} />
            Privileged Access
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
            SmartBill Admin Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
            System Administration & User Management Console
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@smartbill.com"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.5rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#818CF8')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
              />
              <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
              Master Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password..."
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.5rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#818CF8')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
              />
              <KeyRound size={16} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Quick-fill Button for Convenience */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleQuickFill}
              style={{
                fontSize: '0.785rem',
                color: '#818CF8',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                textDecoration: 'underline',
              }}
            >
              Fill Seeded SuperAdmin Credentials
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            icon={ArrowRight}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              backgroundColor: '#4F46E5',
              borderColor: '#6366F1',
            }}
          >
            Authenticate Administrator
          </Button>
        </form>

        {/* Security Note Footer */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.75rem',
            color: '#64748B',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
          }}
        >
          <ShieldCheck size={14} color="#10B981" />
          <span>Spring Boot Role-Based JWT Security • Neon PostgreSQL</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
