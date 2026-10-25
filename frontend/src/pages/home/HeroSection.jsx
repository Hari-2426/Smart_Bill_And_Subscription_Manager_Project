import React, { useState } from 'react';
import MagneticButton from '../../components/motion/MagneticButton';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  Tv,
  Wifi,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const HeroSection = ({ onGetStarted, onExplore }) => {
  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '8.5rem',
        paddingBottom: '5.5rem',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), rgba(248, 250, 252, 0))',
      }}
    >
      <div className="app-container">
        {/* Top Hero Text Grid */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto 4rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Release Badge */}
          <div
            className="animate-slide-down"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: 'var(--brand-50)',
              border: '1px solid var(--brand-200)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--brand-700)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} color="var(--brand-600)" />
            <span>Modern Recurring Financial Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1
            className="animate-fade-in"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Take Control of <span style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every Bill.</span>
          </h1>

          {/* Supporting Subtitle */}
          <p
            className="animate-fade-in"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '620px',
              marginBottom: '2.25rem',
            }}
          >
            SmartBill keeps your bills, subscriptions, payments and due dates organized in one intelligent workspace.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <MagneticButton
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={onGetStarted}
              style={{
                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Get Started Free
            </MagneticButton>

            <Button
              variant="secondary"
              size="lg"
              onClick={onExplore}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
              }}
            >
              Explore SmartBill
            </Button>
          </div>
        </div>

        {/* HERO PRODUCT VISUALIZATION (Layered 3D Floating Dashboard) */}
        <div
          className="perspective-container"
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Ambient Glow Background */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '60%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 70%)',
              filter: 'blur(50px)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Main Mock Interface */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.05)',
              padding: '1.75rem 2rem 2.25rem',
              transform: 'rotateX(4deg)',
              transition: 'transform 0.4s ease',
            }}
          >
            {/* Window chrome / dots */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                SMARTBILL FINANCIAL ENGINE • LIVE
              </div>
              <div style={{ width: '40px' }} />
            </div>

            {/* Dashboard Inner Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Financial Balance Summary */}
              <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Pipeline
                </span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  ₹28,688
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--status-paid-text)' }}>
                  <CheckCircle2 size={14} />
                  <span>8 bills under automated surveillance</span>
                </div>
              </div>

              {/* Due This Week Alert Box */}
              <div style={{ padding: '1.25rem', backgroundColor: '#FFFBEB', borderRadius: 'var(--radius-lg)', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 600, textTransform: 'uppercase' }}>
                  Attention Required
                </span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#78350F', marginTop: '0.25rem' }}>
                  2 Upcoming
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#B45309' }}>
                  <Clock size={14} />
                  <span>Earliest charge due in 24 hours</span>
                </div>
              </div>

              {/* Settled Ratio */}
              <div style={{ padding: '1.25rem', backgroundColor: '#ECFDF5', borderRadius: 'var(--radius-lg)', border: '1px solid #A7F3D0' }}>
                <span style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 600, textTransform: 'uppercase' }}>
                  Settlement Rate
                </span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#064E3B', marginTop: '0.25rem' }}>
                  92.4%
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#047857' }}>
                  <ShieldCheck size={14} />
                  <span>Zero late penalties incurred</span>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 1: Netflix (Top Left) */}
          <div
            className="animate-float-slow"
            style={{
              position: 'absolute',
              top: '-2.5rem',
              left: '-2rem',
              zIndex: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              minWidth: '220px',
            }}
          >
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tv size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Upcoming Payment
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Netflix Premium
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>₹649</span>
                <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600, backgroundColor: '#FEF3C7', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                  Due Tomorrow
                </span>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 2: Electricity (Top Right) */}
          <div
            className="animate-float-reverse"
            style={{
              position: 'absolute',
              top: '-1.5rem',
              right: '-2rem',
              zIndex: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              minWidth: '220px',
            }}
          >
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Electricity Bill
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                ₹1,240.00
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Due in 3 days • Automatic Reminder
              </span>
            </div>
          </div>

          {/* FLOATING CARD 3: Payment Successful (Bottom Right) */}
          <div
            className="animate-float-delayed"
            style={{
              position: 'absolute',
              bottom: '-2rem',
              right: '2rem',
              zIndex: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '0.95rem 1.25rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              minWidth: '240px',
            }}
          >
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)', backgroundColor: '#ECFDF5', color: 'var(--status-paid-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={22} color="var(--status-paid)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--status-paid-text)' }}>
                  Payment Successful
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Just now</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                ₹799 • Fiber Broadband
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
