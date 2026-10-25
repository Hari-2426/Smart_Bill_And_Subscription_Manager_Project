import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useMailAnimation } from '../../context/MailAnimationContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {
  Wallet,
  ShieldCheck,
  BellRing,
  PieChart,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  KeyRound,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export const AuthPage = ({ initialMode = 'login', onBackToHome }) => {
  const { login, verifyLoginOtp, sendRegisterOtp, resendLoginOtp, register } = useAuth();
  const { showToast } = useToast();
  const { triggerMailAnimation } = useMailAnimation();

  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP Verification Flow State
  // 'none' | 'login_otp' | 'register_otp'
  const [otpStep, setOtpStep] = useState('none');
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register Form State
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNumber: '',
  });

  // Resend Countdown Timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Login Credentials Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginForm.email.trim() || !loginForm.password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await login(loginForm);
      if (data && data.otpRequired) {
        setOtpStep('login_otp');
        setOtpValue('');
        setCountdown(60);
        triggerMailAnimation({
          to: loginForm.email.trim(),
          title: 'Verification Code Dispatched',
          subtitle: 'A 6-digit login OTP was sent to your inbox',
        });
        showToast('Verification code sent to your email! Please enter it to sign in.', 'info');
      } else {
        showToast('Welcome back to SmartBill!', 'success');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify Login OTP
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (otpValue.trim().length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyLoginOtp(loginForm.email.trim(), otpValue.trim());
      showToast('Login verified! Welcome to SmartBill.', 'success');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Login OTP
  const handleResendLoginOtp = async () => {
    setErrorMessage('');
    setIsResending(true);
    try {
      await resendLoginOtp(loginForm.email.trim());
      setCountdown(60);
      triggerMailAnimation({
        to: loginForm.email.trim(),
        title: 'New Verification Code',
        subtitle: 'A fresh 6-digit OTP was sent to your inbox',
      });
      showToast('A new verification code has been dispatched to your email.', 'info');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Handle Register Initiate (Sends OTP to Email)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!registerForm.firstName.trim() || !registerForm.lastName.trim()) {
      setErrorMessage('Please provide your first and last name.');
      return;
    }
    if (!registerForm.email.trim()) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (registerForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await sendRegisterOtp(registerForm.email.trim(), registerForm.firstName.trim());
      setOtpStep('register_otp');
      setOtpValue('');
      setCountdown(60);
      triggerMailAnimation({
        to: registerForm.email.trim(),
        title: 'Verification Code Dispatched',
        subtitle: 'Enter OTP to complete registration',
      });
      showToast('Verification code sent to your email!', 'info');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send verification code. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify Register OTP & Create Account
  const handleVerifyRegisterOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (otpValue.trim().length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        address: registerForm.address.trim() || 'Not specified',
        phoneNumber: registerForm.phoneNumber ? Number(registerForm.phoneNumber) : 9876543210,
        otp: otpValue.trim(),
      });

      triggerMailAnimation({
        to: registerForm.email.trim(),
        title: 'Welcome to SmartBill',
        subtitle: 'Account verified and confirmation sent',
      });
      showToast('Account successfully verified & created! Welcome to SmartBill.', 'success');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Register OTP
  const handleResendRegisterOtp = async () => {
    setErrorMessage('');
    setIsResending(true);
    try {
      await sendRegisterOtp(registerForm.email.trim(), registerForm.firstName.trim());
      setCountdown(60);
      triggerMailAnimation({
        to: registerForm.email.trim(),
        title: 'New Verification Code',
        subtitle: 'A fresh 6-digit OTP was sent to your inbox',
      });
      showToast('A new verification code has been dispatched to your email.', 'info');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const activeEmail = otpStep === 'login_otp' ? loginForm.email : registerForm.email;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundColor: '#F8FAFC',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        {/* Left Side: Brand Visual & Value Proposition */}
        <div
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle geometric background glow */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              right: '-10%',
              width: '300px',
              height: '300px',
              borderRadius: 'var(--radius-full)',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <img
                src="/smart-bill-logo.png"
                alt="SmartBill Logo"
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                }}
              />
              <span style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
                Smart<span style={{ color: '#818CF8' }}>Bill</span>
              </span>
            </div>

            <h2 style={{ fontSize: '1.85rem', lineHeight: 1.25, fontWeight: 700, marginBottom: '1rem', color: '#FFFFFF' }}>
              Never miss a bill. Stay ahead of every payment.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Gain total financial clarity over all your recurring utility bills, OTT subscriptions, rent, and monthly commitments from one elegant hub.
            </p>

            {/* Feature Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8' }}>
                  <BellRing size={16} />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                  Smart upcoming due date tracking
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
                  <ShieldCheck size={16} />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                  2FA Email OTP Verification & Complete Security
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
                  <PieChart size={16} />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0' }}>
                  Categorized recurring outflow insights
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.8rem', color: '#64748B' }}>
            SmartBill Intelligent Workspace • Encrypted & Secure
          </div>
        </div>

        {/* Right Side: Form Card / OTP Card */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {onBackToHome && otpStep === 'none' && (
            <button
              type="button"
              onClick={onBackToHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--brand-600)',
                marginBottom: '1.25rem',
                alignSelf: 'flex-start',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
          )}

          {/* Render Step 1: Normal Credentials Forms */}
          {otpStep === 'none' && (
            <>
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {isLogin ? 'Sign in to SmartBill' : 'Create your account'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {isLogin
                    ? 'Enter your credentials to receive your verification code'
                    : 'Get started tracking your subscriptions and bills in seconds'}
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div
                  className="animate-slide-down"
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--status-overdue-bg)',
                    border: '1px solid var(--status-overdue-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--status-overdue-text)',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    lineHeight: 1.4,
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {isLogin ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    icon={Mail}
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />

                  <div style={{ position: 'relative' }}>
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      icon={Lock}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        top: '2.15rem',
                        color: 'var(--text-tertiary)',
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    icon={ArrowRight}
                  >
                    Continue to Verification
                  </Button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Input
                      label="First Name *"
                      placeholder="John"
                      icon={User}
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                      required
                    />
                    <Input
                      label="Last Name *"
                      placeholder="Doe"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="john@example.com"
                    icon={Mail}
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Input
                      label="Password *"
                      type="password"
                      placeholder="Min 6 chars"
                      icon={Lock}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                    <Input
                      label="Confirm Password *"
                      type="password"
                      placeholder="Repeat password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="9876543210"
                      icon={Phone}
                      value={registerForm.phoneNumber}
                      onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })}
                    />
                    <Input
                      label="Address"
                      placeholder="City, State"
                      icon={MapPin}
                      value={registerForm.address}
                      onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    icon={ArrowRight}
                  >
                    Send Verification Code
                  </Button>
                </form>
              )}

              {/* Toggle Between Login & Register */}
              <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {isLogin ? (
                  <>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(false);
                        setErrorMessage('');
                      }}
                      style={{ color: 'var(--brand-600)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Create one now
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(true);
                        setErrorMessage('');
                      }}
                      style={{ color: 'var(--brand-600)', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Render Step 2: OTP Verification Card */}
          {otpStep !== 'none' && (
            <div className="animate-slide-down">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                  style={{
                    width: '3.75rem',
                    height: '3.75rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--brand-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
                  }}
                >
                  <ShieldCheck size={32} />
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.85rem',
                    backgroundColor: '#EEF2FF',
                    color: 'var(--brand-700)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                  }}
                >
                  <Mail size={13} />
                  <span>OTP Sent to Mail</span>
                </div>

                <h3 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {otpStep === 'login_otp' ? 'Sign In Verification' : 'Verify Your Email'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  We sent a 6-digit verification code to<br />
                  <strong style={{ color: 'var(--text-primary)' }}>{activeEmail}</strong>
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div
                  className="animate-slide-down"
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--status-overdue-bg)',
                    border: '1px solid var(--status-overdue-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--status-overdue-text)',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    lineHeight: 1.4,
                  }}
                >
                  {errorMessage}
                </div>
              )}

              {/* OTP Form */}
              <form
                onSubmit={otpStep === 'login_otp' ? handleVerifyLoginOtp : handleVerifyRegisterOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="000000"
                    value={otpValue}
                    onChange={(e) => {
                      setErrorMessage('');
                      setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6));
                    }}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      fontSize: '1.85rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      letterSpacing: '0.45em',
                      fontFamily: 'monospace',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-medium)',
                      backgroundColor: '#F8FAFC',
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                    }}
                    autoFocus
                  />
                  <span style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.4rem' }}>
                    Code valid for 10 minutes
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  disabled={otpValue.length !== 6 || isLoading}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  icon={ArrowRight}
                >
                  {otpStep === 'login_otp' ? 'Verify & Sign In' : 'Confirm & Create Account'}
                </Button>
              </form>

              {/* Resend Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1.25rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {countdown > 0 ? (
                  <span>
                    Resend code in <strong style={{ color: 'var(--brand-600)' }}>{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isResending}
                    onClick={otpStep === 'login_otp' ? handleResendLoginOtp : handleResendRegisterOtp}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--brand-600)',
                      fontWeight: 600,
                      background: 'none',
                      border: 'none',
                      cursor: isResending ? 'not-allowed' : 'pointer',
                      padding: 0,
                    }}
                  >
                    <RefreshCw size={14} style={{ animation: isResending ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{isResending ? 'Dispatching code...' : 'Resend verification code'}</span>
                  </button>
                )}
              </div>

              {/* Back to Edit / Credentials */}
              <button
                type="button"
                onClick={() => {
                  setOtpStep('none');
                  setOtpValue('');
                  setErrorMessage('');
                }}
                style={{
                  marginTop: '1.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-tertiary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <ArrowLeft size={14} />
                <span>
                  {otpStep === 'login_otp' ? 'Back to sign in' : 'Back to edit registration details'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
