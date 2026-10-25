import React, { useState } from 'react';
import RevealOnScroll from '../../components/motion/RevealOnScroll';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Zap,
  Tv,
  Wifi,
  Phone,
  Shield,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

const CHAOTIC_BILLS = [
  {
    id: 1,
    title: 'Electricity Board',
    amount: '₹1,420',
    category: 'Utility',
    due: '2 days overdue!',
    icon: Zap,
    chaosStyle: { transform: 'rotate(-5deg) translate(-25px, 10px)', border: '1px solid #FCA5A5', bg: '#FFF5F5' },
    orderStyle: { transform: 'rotate(0deg) translate(0, 0)', border: '1px solid #E2E8F0', bg: '#FFFFFF' },
  },
  {
    id: 2,
    title: 'Netflix 4K UHD',
    amount: '₹649',
    category: 'OTT',
    due: 'Due tomorrow',
    icon: Tv,
    chaosStyle: { transform: 'rotate(4deg) translate(20px, -15px)', border: '1px solid #FDE68A', bg: '#FFFBEB' },
    orderStyle: { transform: 'rotate(0deg) translate(0, 0)', border: '1px solid #E2E8F0', bg: '#FFFFFF' },
  },
  {
    id: 3,
    title: 'Airtel Broadband',
    amount: '₹999',
    category: 'Internet',
    due: 'Due in 3 days',
    icon: Wifi,
    chaosStyle: { transform: 'rotate(-3deg) translate(-15px, 20px)', border: '1px solid #CBD5E1', bg: '#F8FAFC' },
    orderStyle: { transform: 'rotate(0deg) translate(0, 0)', border: '1px solid #E2E8F0', bg: '#FFFFFF' },
  },
  {
    id: 4,
    title: 'HDFC Credit Card',
    amount: '₹14,500',
    category: 'Finance',
    due: 'Penalty applies soon!',
    icon: CreditCard,
    chaosStyle: { transform: 'rotate(6deg) translate(30px, 15px)', border: '1px solid #FCA5A5', bg: '#FFF5F5' },
    orderStyle: { transform: 'rotate(0deg) translate(0, 0)', border: '1px solid #E2E8F0', bg: '#FFFFFF' },
  },
  {
    id: 5,
    title: 'Health Insurance',
    amount: '₹3,200',
    category: 'Insurance',
    due: 'Due Nov 05',
    icon: Shield,
    chaosStyle: { transform: 'rotate(-4deg) translate(-10px, -20px)', border: '1px solid #CBD5E1', bg: '#F8FAFC' },
    orderStyle: { transform: 'rotate(0deg) translate(0, 0)', border: '1px solid #E2E8F0', bg: '#FFFFFF' },
  },
  {
    id: 6,
    title: 'Jio Postpaid Family',
    amount: '₹799',
    category: 'Mobile',
    due: 'Due Nov 12',
    icon: Phone,
    chaosStyle: { transform: 'rotate(3deg) translate(15px, -5px)', border: '1px solid #CBD5E1', bg: '#F8FAFC' },
    orderStyle: { transform: 'rotate(0deg) translate(0, 0)', border: '1px solid #E2E8F0', bg: '#FFFFFF' },
  },
];

export const ChaosToOrderSection = () => {
  const [isOrganized, setIsOrganized] = useState(true);

  return (
    <section
      id="problem-section"
      style={{
        padding: '6rem 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
      }}
    >
      <div className="app-container">
        {/* Section Heading */}
        <RevealOnScroll direction="up">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              The Problem & Solution
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              From Financial Chaos to Automated Clarity
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Multiple cards, overlapping due dates, and surprise renewal deductions drain time and incur penalties. Watch how SmartBill reorganizes your entire commitments pipeline.
            </p>

            {/* Interactive Transformation Switch */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem',
                backgroundColor: '#F1F5F9',
                borderRadius: 'var(--radius-full)',
                marginTop: '1.5rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                onClick={() => setIsOrganized(false)}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  backgroundColor: !isOrganized ? '#EF4444' : 'transparent',
                  color: !isOrganized ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: !isOrganized ? '0 2px 8px rgba(239, 68, 68, 0.3)' : 'none',
                }}
              >
                Without SmartBill (Chaos)
              </button>

              <button
                type="button"
                onClick={() => setIsOrganized(true)}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  backgroundColor: isOrganized ? 'var(--brand-600)' : 'transparent',
                  color: isOrganized ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: isOrganized ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none',
                }}
              >
                With SmartBill (Organized)
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* Visual Transformation Playground */}
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            minHeight: '380px',
            padding: '2rem',
            backgroundColor: isOrganized ? '#F8FAFC' : '#FFF5F5',
            borderRadius: 'var(--radius-xl)',
            border: isOrganized ? '1px solid var(--border-subtle)' : '1px solid #FECACA',
            transition: 'background-color 0.5s ease, border-color 0.5s ease',
            position: 'relative',
          }}
        >
          {/* Status Message */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: isOrganized ? '1px solid var(--border-subtle)' : '1px solid #FED7AA',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isOrganized ? (
                <CheckCircle2 size={18} color="var(--status-paid)" />
              ) : (
                <AlertTriangle size={18} color="var(--status-overdue)" />
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isOrganized ? 'var(--status-paid-text)' : 'var(--status-overdue-text)' }}>
                {isOrganized ? 'Structured Ledger Pipeline • 100% Tracking' : 'Scattered Due Dates & Unnoticed Overdues'}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              {isOrganized ? 'Auto-synchronized in real-time' : 'Missed alerts risk: HIGH'}
            </span>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isOrganized ? 'repeat(auto-fit, minmax(260px, 1fr))' : 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: isOrganized ? '0.85rem' : '1.25rem',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {CHAOTIC_BILLS.map((bill) => {
              const Icon = bill.icon;
              const activeStyle = isOrganized ? bill.orderStyle : bill.chaosStyle;

              return (
                <div
                  key={bill.id}
                  style={{
                    backgroundColor: activeStyle.bg,
                    border: activeStyle.border,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    boxShadow: isOrganized ? 'var(--shadow-xs)' : 'var(--shadow-md)',
                    transform: activeStyle.transform,
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-color 0.4s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isOrganized ? 'var(--brand-50)' : '#FEE2E2',
                        color: isOrganized ? 'var(--brand-600)' : '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.4s ease',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {bill.title}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: isOrganized ? 'var(--text-tertiary)' : '#DC2626', fontWeight: isOrganized ? 400 : 600 }}>
                        {isOrganized ? `Category: ${bill.category}` : bill.due}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {bill.amount}
                    </div>
                    {isOrganized && (
                      <Badge variant="PAID" size="sm">
                        Tracked
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChaosToOrderSection;
