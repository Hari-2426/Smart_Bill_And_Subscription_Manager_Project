import React from 'react';
import RevealOnScroll from '../../components/motion/RevealOnScroll';
import MagneticButton from '../../components/motion/MagneticButton';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const FinalCtaSection = ({ onGetStarted }) => {
  return (
    <section
      style={{
        position: 'relative',
        padding: '7rem 0',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Background radial gradient mesh */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
        <RevealOnScroll direction="up">
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 'var(--radius-full)',
                color: '#A5B4FC',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1.75rem',
              }}
            >
              <Sparkles size={14} />
              <span>Full Control, Zero Late Fees</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.035em',
                marginBottom: '1.25rem',
                color: '#FFFFFF',
              }}
            >
              Your bills shouldn’t manage you.{' '}
              <span style={{ background: 'linear-gradient(135deg, #818CF8, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                You should manage them.
              </span>
            </h2>

            <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '580px', margin: '0 auto 2.5rem' }}>
              Join individuals taking command over subscriptions, utility commitments, and payment deadlines with SmartBill.
            </p>

            <MagneticButton
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={onGetStarted}
              style={{
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                padding: '0.95rem 2.25rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                backgroundColor: 'var(--brand-600)',
              }}
            >
              Start Using SmartBill
            </MagneticButton>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem', fontSize: '0.85rem', color: '#64748B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="#34D399" /> Free to get started
              </span>
              <span>•</span>
              <span>No credit card required</span>
              <span>•</span>
              <span>Instant cloud synchronization</span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default FinalCtaSection;
