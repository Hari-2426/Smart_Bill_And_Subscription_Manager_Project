import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md' }) => {
  let bg = '#F1F5F9';
  let text = '#475569';
  let border = '#E2E8F0';

  const normalized = (variant || '').toUpperCase();

  if (normalized === 'PAID' || normalized === 'COMPLETED' || normalized === 'SUCCESS' || normalized === 'ACTIVE') {
    bg = 'var(--status-paid-bg)';
    text = 'var(--status-paid-text)';
    border = 'var(--status-paid-border)';
  } else if (normalized === 'PENDING' || normalized === 'UPCOMING' || normalized === 'WARNING') {
    bg = 'var(--status-upcoming-bg)';
    text = 'var(--status-upcoming-text)';
    border = 'var(--status-upcoming-border)';
  } else if (normalized === 'OVERDUE' || normalized === 'NOT_COMPLETED' || normalized === 'DANGER' || normalized === 'INACTIVE') {
    bg = 'var(--status-overdue-bg)';
    text = 'var(--status-overdue-text)';
    border = 'var(--status-overdue-border)';
  } else if (normalized === 'PRIMARY' || normalized === 'SUBSCRIPTION') {
    bg = 'var(--brand-50)';
    text = 'var(--brand-700)';
    border = 'var(--brand-200)';
  }

  const padding = size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.65rem';
  const fontSize = size === 'sm' ? '0.7rem' : '0.75rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding,
        fontSize,
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        lineHeight: 1.2,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
