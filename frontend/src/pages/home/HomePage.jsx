import React from 'react';
import ScrollProgress from '../../components/motion/ScrollProgress';
import HomeNavbar from './HomeNavbar';
import HeroSection from './HeroSection';
import ChaosToOrderSection from './ChaosToOrderSection';
import TimelineSection from './TimelineSection';
import UrgencySection from './UrgencySection';
import InteractiveShowcase from './InteractiveShowcase';
import FeaturesSection from './FeaturesSection';
import FinalCtaSection from './FinalCtaSection';
import { Wallet } from 'lucide-react';

export const HomePage = ({ onOpenAuth, onGoToDashboard }) => {
  const handleScrollToExplore = () => {
    const el = document.getElementById('problem-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Public Navigation */}
      <HomeNavbar
        onOpenAuth={onOpenAuth}
        onGoToDashboard={onGoToDashboard}
      />

      <main style={{ flex: 1 }}>
        {/* 1. Cinematic Hero with 3D Floating Dashboard */}
        <HeroSection
          onGetStarted={() => onOpenAuth('register')}
          onExplore={handleScrollToExplore}
        />

        {/* 2. Signature Storytelling: Chaos → Organization */}
        <ChaosToOrderSection />

        {/* 3. Progressive Payment Radar Timeline */}
        <TimelineSection />

        {/* 4. Due Date Urgency & Awareness Lifecycle */}
        <UrgencySection />

        {/* 5. Interactive Live Tabbed Showcase */}
        <InteractiveShowcase />

        {/* 6. Product Capabilities & Feature Cards */}
        <FeaturesSection />

        {/* 7. Final High-Impact CTA */}
        <FinalCtaSection onGetStarted={() => onOpenAuth('register')} />
      </main>

      {/* Public Footer */}
      <footer
        style={{
          backgroundColor: '#090D16',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '3rem 0',
          color: '#64748B',
          fontSize: '0.85rem',
        }}
      >
        <div
          className="app-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img
              src="/smart-bill-logo.png"
              alt="SmartBill"
              style={{
                width: '2.2rem',
                height: '2.2rem',
                borderRadius: 'var(--radius-sm)',
                objectFit: 'cover',
              }}
            />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Smart<span style={{ color: '#818CF8' }}>Bill</span>
            </span>
          </div>

          <div>
            Never miss a bill. Stay ahead of every payment.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', alignItems: 'center' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>© 2026 SmartBill Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
