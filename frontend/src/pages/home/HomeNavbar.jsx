import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, ArrowRight, Menu, X } from 'lucide-react';
import MagneticButton from '../../components/motion/MagneticButton';
import Button from '../../components/common/Button';

export const HomeNavbar = ({ onOpenAuth, onGoToDashboard }) => {
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        boxShadow: isScrolled ? 'var(--shadow-xs)' : 'none',
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: isScrolled ? '4rem' : '4.75rem',
          transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
          }}
        >
          <img
            src="/smart-bill-logo.png"
            alt="SmartBill Logo"
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            }}
          />
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Smart<span style={{ color: 'var(--brand-600)' }}>Bill</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
          className="desktop-links"
        >
          <span
            onClick={() => scrollToSection('problem-section')}
            style={{ cursor: 'pointer', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--brand-600)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            Why SmartBill
          </span>
          <span
            onClick={() => scrollToSection('timeline-section')}
            style={{ cursor: 'pointer', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--brand-600)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            Schedule
          </span>
          <span
            onClick={() => scrollToSection('features-section')}
            style={{ cursor: 'pointer', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--brand-600)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            Capabilities
          </span>
          <span
            onClick={() => scrollToSection('showcase-section')}
            style={{ cursor: 'pointer', transition: 'color var(--transition-fast)' }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--brand-600)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
          >
            Interactive Demo
          </span>
        </nav>

        {/* CTA Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.85rem' }} className="desktop-actions">
          {isAuthenticated ? (
            <MagneticButton variant="primary" icon={ArrowRight} onClick={onGoToDashboard}>
              Open Dashboard ({user?.firstName || 'Account'})
            </MagneticButton>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
              >
                Sign In
              </button>
              <MagneticButton variant="primary" icon={ArrowRight} onClick={() => onOpenAuth('register')}>
                Get Started
              </MagneticButton>
            </>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            color: 'var(--text-primary)',
          }}
          className="mobile-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '1.25rem 1.5rem 1.5rem',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <span onClick={() => scrollToSection('problem-section')} style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            Why SmartBill
          </span>
          <span onClick={() => scrollToSection('timeline-section')} style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            Schedule
          </span>
          <span onClick={() => scrollToSection('features-section')} style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            Capabilities
          </span>
          <span onClick={() => scrollToSection('showcase-section')} style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            Interactive Demo
          </span>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {isAuthenticated ? (
              <Button variant="primary" icon={ArrowRight} onClick={onGoToDashboard}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => onOpenAuth('login')}>
                  Sign In
                </Button>
                <Button variant="primary" icon={ArrowRight} onClick={() => onOpenAuth('register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-links { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default HomeNavbar;
