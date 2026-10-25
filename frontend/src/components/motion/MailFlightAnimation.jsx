import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle2, Send, Wallet, Sparkles, X } from 'lucide-react';

export const MailFlightAnimation = ({
  isOpen,
  to = 'your-email@domain.com',
  title = 'Email Dispatched',
  subtitle = 'Sent from SmartBill to your inbox',
  onClose,
  duration = 4200,
}) => {
  const [phase, setPhase] = useState('flying'); // 'flying' | 'delivered' | 'closing'

  useEffect(() => {
    if (!isOpen) {
      setPhase('flying');
      return;
    }

    setPhase('flying');

    // Transition to delivered after envelope completes flight (1.4s)
    const deliverTimer = setTimeout(() => {
      setPhase('delivered');
    }, 1400);

    // Auto close after duration
    const closeTimer = setTimeout(() => {
      setPhase('closing');
      setTimeout(() => {
        if (onClose) onClose();
      }, 350);
    }, duration);

    // ESC key listener to dismiss
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(deliverTimer);
      clearTimeout(closeTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '1.5rem',
        animation: phase === 'closing' ? 'backdropFadeIn 0.3s reverse forwards' : 'backdropFadeIn 0.3s ease-out forwards',
        pointerEvents: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: 'min(94vw, 520px)',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 45px rgba(99, 102, 241, 0.35)',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          animation: phase === 'closing' ? 'modalScaleIn 0.25s reverse forwards' : 'modalScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Ambient Top Glow Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #818CF8, #34D399, transparent)',
          }}
        />

        {/* Ambient Radial Background Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '30%',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              color: 'rgba(255, 255, 255, 0.5)',
              padding: '6px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            }}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        )}

        {/* Header Text & Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: phase === 'delivered' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Sparkles size={16} color={phase === 'delivered' ? '#34D399' : '#818CF8'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: phase === 'delivered' ? '#34D399' : '#A5B4FC',
                  transition: 'color 0.3s ease',
                }}
              >
                {phase === 'delivered' ? 'Delivery Confirmed' : 'Live Email Dispatch'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.45)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: '#E2E8F0', fontWeight: 600 }}>{title}</span>
            </div>
            <div style={{ fontSize: '0.785rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.15rem' }}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* Flight Stage Visualizer Box */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.25rem',
            padding: '1.5rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* 1. App Origin Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', zIndex: 2 }}>
            <div
              style={{
                width: '3.25rem',
                height: '3.25rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4F46E5, #3730A3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(79, 70, 229, 0.7)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <Wallet size={20} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#C7D2FE' }}>SmartBill</span>
          </div>

          {/* 2. Trajectory Track + Flying Envelope */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              height: '44px',
              margin: '0 0.75rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* SVG Flight Path */}
            <svg
              width="100%"
              height="44"
              viewBox="0 0 240 44"
              fill="none"
              style={{ overflow: 'visible' }}
            >
              <path
                d="M 10 22 Q 120 -6 230 22"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
                strokeDasharray="4 4"
                style={{ animation: 'dashFlow 1s linear infinite' }}
              />
              <path
                d="M 10 22 Q 120 -6 230 22"
                stroke="url(#flightGradCenter)"
                strokeWidth="2.5"
                strokeDasharray="12 8"
                style={{ animation: 'dashFlow 0.8s linear infinite' }}
              />
              <defs>
                <linearGradient id="flightGradCenter" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>

            {/* Flying Animated Envelope */}
            {phase === 'flying' && (
              <div
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '10px',
                  animation: 'mailFlight 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: '2.4rem',
                    height: '2.4rem',
                    borderRadius: '50%',
                    backgroundColor: '#F59E0B',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.9), 0 0 35px rgba(245, 158, 11, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <Send size={16} style={{ transform: 'rotate(20deg)' }} />
                </div>
              </div>
            )}
          </div>

          {/* 3. Recipient Mailbox Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', zIndex: 2 }}>
            <div
              style={{
                width: '3.25rem',
                height: '3.25rem',
                borderRadius: '50%',
                background:
                  phase === 'delivered'
                    ? 'linear-gradient(135deg, #059669, #10B981)'
                    : 'linear-gradient(135deg, #1E293B, #334155)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: phase === 'delivered' ? '2px solid #34D399' : '2px solid rgba(255, 255, 255, 0.25)',
                animation: phase === 'delivered' ? 'mailRipple 1.2s ease-out' : 'none',
                boxShadow: phase === 'delivered' ? '0 0 25px rgba(16, 185, 129, 0.6)' : 'none',
                transition: 'all 0.4s ease',
              }}
            >
              {phase === 'delivered' ? (
                <CheckCircle2 size={22} color="#FFFFFF" className="animate-fade-in" />
              ) : (
                <Mail size={20} color="rgba(255, 255, 255, 0.6)" />
              )}
            </div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: phase === 'delivered' ? '#34D399' : 'rgba(255, 255, 255, 0.65)',
                transition: 'color 0.3s ease',
              }}
            >
              {phase === 'delivered' ? 'Delivered' : 'Your Inbox'}
            </span>
          </div>
        </div>

        {/* Footer Info Pill with Recipient Email */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.825rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
            {phase === 'delivered' ? 'Delivered to:' : 'Dispatching to:'}{' '}
            <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>{to}</strong>
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: phase === 'delivered' ? '#34D399' : '#FBBF24',
              fontWeight: 600,
              fontSize: '0.785rem',
            }}
          >
            {phase === 'delivered' ? '✓ In your inbox' : '✈ Flying in background'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MailFlightAnimation;
