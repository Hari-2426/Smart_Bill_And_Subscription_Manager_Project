import React from 'react';
import RevealOnScroll from '../../components/motion/RevealOnScroll';
import AnimatedNumber from '../../components/motion/AnimatedNumber';
import Badge from '../../components/common/Badge';
import { Calendar, CheckCircle2, Clock, ShieldCheck, Wifi, Zap, Tv, Shield } from 'lucide-react';

const TIMELINE_EVENTS = [
  {
    dateLabel: 'TODAY',
    dateDetail: 'Immediate Settlement',
    title: 'High-speed Internet',
    category: 'Broadband',
    amount: 799,
    status: 'DUE TODAY',
    icon: Wifi,
    color: '#EF4444',
  },
  {
    dateLabel: 'OCT 27',
    dateDetail: 'In 3 Days',
    title: 'Electricity Utility Board',
    category: 'Power & Energy',
    amount: 1240,
    status: 'UPCOMING',
    icon: Zap,
    color: '#F59E0B',
  },
  {
    dateLabel: 'OCT 30',
    dateDetail: 'In 6 Days',
    title: 'Netflix Premium Subscription',
    category: 'Entertainment',
    amount: 649,
    status: 'SCHEDULED',
    icon: Tv,
    color: '#6366F1',
  },
  {
    dateLabel: 'NOV 02',
    dateDetail: 'Next Week',
    title: 'Health & Term Insurance',
    category: 'Policy',
    amount: 2500,
    status: 'SCHEDULED',
    icon: Shield,
    color: '#10B981',
  },
];

export const TimelineSection = () => {
  return (
    <section
      id="timeline-section"
      style={{
        padding: '6rem 0',
        backgroundColor: '#F8FAFC',
        position: 'relative',
      }}
    >
      <div className="app-container">
        <RevealOnScroll direction="up">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Chronological Intelligence
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Upcoming Payment Radar
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A live timeline of pending disbursements that moves naturally as deadlines advance, giving you uninterrupted cash flow predictability.
            </p>
          </div>
        </RevealOnScroll>

        {/* Timeline Container */}
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative' }}>
          {/* Vertical Timeline Guide Line */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              bottom: '20px',
              left: '28px',
              width: '2px',
              background: 'linear-gradient(180deg, #EF4444 0%, #F59E0B 40%, #6366F1 75%, #10B981 100%)',
              opacity: 0.4,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {TIMELINE_EVENTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll key={item.title} direction="right" delay={idx * 0.12} duration={0.6}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.5rem',
                      position: 'relative',
                    }}
                  >
                    {/* Glowing Node on Timeline */}
                    <div
                      style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: '#FFFFFF',
                        border: `2px solid ${item.color}`,
                        boxShadow: `0 0 15px ${item.color}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        zIndex: 2,
                      }}
                    >
                      <Icon size={22} color={item.color} />
                    </div>

                    {/* Timeline Event Card */}
                    <div
                      className="interactive-card"
                      style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-subtle)',
                        padding: '1.25rem 1.5rem',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: item.color, letterSpacing: '0.04em' }}>
                            {item.dateLabel}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            • {item.dateDetail}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.title}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {item.category}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          <AnimatedNumber value={item.amount} prefix="₹" />
                        </div>
                        <Badge variant={item.status} size="sm">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
