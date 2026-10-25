import React from 'react';
import RevealOnScroll from '../../components/motion/RevealOnScroll';
import {
  Receipt,
  CreditCard,
  BellRing,
  Repeat,
  LayoutDashboard,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Receipt,
    title: 'Bill Management',
    description: 'Centralize utility invoices, telecommunication bills, rent, and household expenses in one structured hub.',
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    icon: CreditCard,
    title: 'Payment Tracking',
    description: 'Instant settlement logging with custom payment notes, timestamps, and an auditable transaction history.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: BellRing,
    title: 'Due Date Awareness',
    description: 'Predictive proximity radar warns you 7 days, 3 days, and 24 hours prior to due dates via automated alerts.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: Repeat,
    title: 'Subscription Visibility',
    description: 'Surface hidden recurring OTT, cloud SaaS, and membership costs so renewals never catch you off guard.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: LayoutDashboard,
    title: 'Attention-First Dashboard',
    description: 'Immediately highlights which bills require action today, without cluttered or confusing widgets.',
    color: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    description: 'Secured with end-to-end token encryption, automated redundancy, and 99.9% high-availability cloud infrastructure.',
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
];

export const FeaturesSection = () => {
  return (
    <section
      id="features-section"
      style={{
        padding: '6rem 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="app-container">
        <RevealOnScroll direction="up">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Engineered Capabilities
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Every Tool for Personal Financial Mastery
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Purpose-built capabilities that replace spreadsheets and calendar reminders with intelligent automation.
            </p>
          </div>
        </RevealOnScroll>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <RevealOnScroll key={feat.title} direction="up" delay={idx * 0.08} duration={0.5}>
                <div
                  className="interactive-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2rem 1.75rem',
                    boxShadow: 'var(--shadow-xs)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '3.25rem',
                        height: '3.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: feat.bg,
                        color: feat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {feat.description}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
