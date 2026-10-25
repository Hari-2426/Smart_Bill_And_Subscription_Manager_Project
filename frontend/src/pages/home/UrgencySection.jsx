import React, { useState, useEffect } from 'react';
import RevealOnScroll from '../../components/motion/RevealOnScroll';
import Badge from '../../components/common/Badge';
import { BellRing, AlertCircle, Clock, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

const STAGES = [
  {
    step: '7 DAYS LEFT',
    heading: 'Early Horizon Notice',
    subtext: 'Bill placed on upcoming radar with zero stress.',
    statusColor: '#6366F1',
    statusBg: '#EEF2FF',
    statusBorder: '#C7D2FE',
    billStatus: 'SCHEDULED',
    alertMessage: 'Preview notice: Payment of ₹1,420 due next week.',
  },
  {
    step: '3 DAYS LEFT',
    heading: 'Smart Proximity Warning',
    subtext: 'Automated notification dispatched to email and phone.',
    statusColor: '#F59E0B',
    statusBg: '#FFFBEB',
    statusBorder: '#FDE68A',
    billStatus: 'UPCOMING',
    alertMessage: 'Attention: 3 days remaining before due date.',
  },
  {
    step: 'TOMORROW',
    heading: 'High-Priority Alert',
    subtext: 'Pinned to the top Attention Required dashboard banner.',
    statusColor: '#EA580C',
    statusBg: '#FFF7ED',
    statusBorder: '#FFEDD5',
    billStatus: 'DUE SOON',
    alertMessage: 'Action recommended: Auto-reminder triggered.',
  },
  {
    step: 'DUE TODAY',
    heading: 'Zero-Penalty Action',
    subtext: 'One-click settlement button prevents late surcharge fees.',
    statusColor: '#EF4444',
    statusBg: '#FEF2F2',
    statusBorder: '#FECACA',
    billStatus: 'DUE TODAY',
    alertMessage: 'Due today: Settle now to maintain 100% clean record.',
  },
];

export const UrgencySection = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Auto-cycle through stages every 3.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentStage = STAGES[activeStageIndex];

  return (
    <section
      style={{
        padding: '6rem 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="app-container">
        <RevealOnScroll direction="up">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Due Date Awareness
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Never Miss a Deadline Again
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Watch how SmartBill dynamically adapts its urgency radar as due dates approach, keeping you completely aware before penalties can occur.
            </p>
          </div>
        </RevealOnScroll>

        {/* Dynamic Lifecycle Progression Display */}
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Stage Progress Pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              marginBottom: '2.5rem',
            }}
          >
            {STAGES.map((s, idx) => {
              const isActive = idx === activeStageIndex;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-md)',
                    border: isActive ? `2px solid ${s.statusColor}` : '1px solid var(--border-subtle)',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: isActive ? s.statusColor : 'var(--text-tertiary)',
                      display: 'block',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {s.step}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Animated Transforming Card */}
          <div
            className="interactive-card"
            style={{
              backgroundColor: currentStage.statusBg,
              border: `1.5px solid ${currentStage.statusBorder}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem 2rem',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: currentStage.statusColor,
                    padding: '0.2rem 0.6rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${currentStage.statusBorder}`,
                  }}
                >
                  {currentStage.step}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  State: <strong>{currentStage.billStatus}</strong>
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {currentStage.heading}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                {currentStage.subtext}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  fontSize: '0.85rem',
                  color: currentStage.statusColor,
                  fontWeight: 600,
                }}
              >
                <Mail size={16} />
                <span>{currentStage.alertMessage}</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.75rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Bill Amount
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹1,420
              </div>
              <span style={{ fontSize: '0.75rem', color: currentStage.statusColor, fontWeight: 700 }}>
                {currentStage.step}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrgencySection;
