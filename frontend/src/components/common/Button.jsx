import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  onClick,
  style = {},
  className = '',
  ...props
}) => {
  // Styles based on variant
  let bg = 'var(--brand-600)';
  let color = '#FFFFFF';
  let border = '1px solid var(--brand-600)';
  let hoverBg = 'var(--brand-700)';

  if (variant === 'secondary') {
    bg = '#FFFFFF';
    color = 'var(--text-primary)';
    border = '1px solid var(--border-subtle)';
    hoverBg = 'var(--surface-hover)';
  } else if (variant === 'danger') {
    bg = 'var(--status-overdue)';
    color = '#FFFFFF';
    border = '1px solid var(--status-overdue)';
    hoverBg = '#DC2626';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    color = 'var(--text-secondary)';
    border = '1px solid transparent';
    hoverBg = 'var(--surface-hover)';
  } else if (variant === 'success') {
    bg = 'var(--status-paid)';
    color = '#FFFFFF';
    border = '1px solid var(--status-paid)';
    hoverBg = '#059669';
  }

  // Size styles
  let padding = '0.55rem 1rem';
  let fontSize = '0.875rem';
  if (size === 'sm') {
    padding = '0.35rem 0.75rem';
    fontSize = '0.8rem';
  } else if (size === 'lg') {
    padding = '0.75rem 1.35rem';
    fontSize = '0.95rem';
  }

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding,
        fontSize,
        fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        backgroundColor: isHovered && !disabled && !isLoading ? hoverBg : bg,
        color,
        border,
        boxShadow: variant === 'ghost' ? 'none' : 'var(--shadow-xs)',
        opacity: disabled || isLoading ? 0.6 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
