import React, { useState } from 'react';
import RevealOnScroll from '../../components/motion/RevealOnScroll';
import Badge from '../../components/common/Badge';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap,
  Tv,
} from 'lucide-react';

export const InteractiveShowcase = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '1. Dashboard Radar', icon: LayoutDashboard },
    { id: 'bills', label: '2. Bills Ledger', icon: Receipt },
    { id: 'details', label: '3. Bill Detail Drilldown', icon: FileText },
    { id: 'history', label: '4. Settlement History', icon: CreditCard },
  ];

  return (
    <section
      id="showcase-section"
      style={{
        padding: '6rem 0',
        backgroundColor: '#F8FAFC',
      }}
    >
      <div className="app-container">
        <RevealOnScroll direction="up">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Product Experience
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Designed for Daily Financial Flow
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Explore how SmartBill unifies schedule tracking, instant settlement records, and deep analytics in one cohesive, responsive interface.
            </p>
          </div>
        </RevealOnScroll>

        {/* Tab Navigation Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--brand-600)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--brand-600)' : '1px solid var(--border-subtle)',
                  boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'var(--shadow-xs)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Interface Preview Window */}
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
          }}
        >
          {/* Window Chrome Header */}
          <div
            style={{
              padding: '0.85rem 1.5rem',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
              smartbill.app/{activeTab}
            </span>
            <div style={{ width: '30px' }} />
          </div>

          {/* Interactive Screen Preview Container */}
          <div style={{ padding: '2rem', minHeight: '380px' }}>
            {/* 1. DASHBOARD PREVIEW */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Good morning, Nandan 👋</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      ₹2,439 due this week across 2 recurring subscriptions
                    </p>
                  </div>
                  <Badge variant="SUCCESS">Database Active</Badge>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1.15rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Pipeline</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>₹18,450</div>
                  </div>
                  <div style={{ padding: '1.15rem', backgroundColor: '#FFFBEB', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
                    <span style={{ fontSize: '0.75rem', color: '#92400E', textTransform: 'uppercase' }}>Next Charge</span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#78350F', marginTop: '0.2rem' }}>Fiber Broadband (Tomorrow)</div>
                  </div>
                  <div style={{ padding: '1.15rem', backgroundColor: '#ECFDF5', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0' }}>
                    <span style={{ fontSize: '0.75rem', color: '#065F46', textTransform: 'uppercase' }}>Paid This Month</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064E3B', marginTop: '0.2rem' }}>₹4,290</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BILLS LEDGER PREVIEW */}
            {activeTab === 'bills' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>All Tracked Subscriptions</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--brand-600)', fontWeight: 600 }}>3 Active Subscriptions</span>
                </div>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#F8FAFC', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    <span>BILL NAME</span>
                    <span>AMOUNT</span>
                    <span>DUE DATE</span>
                    <span>STATUS</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.9rem 1rem', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>Fiber Broadband</span>
                    <span style={{ fontWeight: 700 }}>₹999</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nov 10, 2026</span>
                    <Badge variant="PENDING">PENDING</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.9rem 1rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>Netflix Premium</span>
                    <span style={{ fontWeight: 700 }}>₹649</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nov 15, 2026</span>
                    <Badge variant="PAID">PAID</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* 3. BILL DETAIL DRILLDOWN */}
            {activeTab === 'details' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Utility Bill</span>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>Fiber Broadband Connection</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recurring Monthly • Account #839210</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹999</div>
                    <Badge variant="PENDING">Payment Due</Badge>
                  </div>
                </div>
                <div style={{ padding: '1rem', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Audit log records and historical settlements automatically link to this bill view.
                </div>
              </div>
            )}

            {/* 4. SETTLEMENT HISTORY */}
            {activeTab === 'history' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Settlement Audit Ledger</h3>
                  <Badge variant="PAID">Realtime Synced</Badge>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <CheckCircle2 size={18} color="var(--status-paid)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Fiber Broadband Settlement</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Paid via UPI online</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: 'var(--status-paid-text)', fontSize: '0.95rem' }}>₹999.00</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Oct 24, 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcase;
