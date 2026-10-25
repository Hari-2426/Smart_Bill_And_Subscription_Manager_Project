import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  id,
  type = 'text',
  style = {},
  containerStyle = {},
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', ...containerStyle }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '0.75rem',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon size={16} />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          style={{
            width: '100%',
            padding: Icon ? '0.55rem 0.85rem 0.55rem 2.25rem' : '0.55rem 0.85rem',
            fontSize: '0.9rem',
            borderRadius: 'var(--radius-md)',
            border: error ? '1px solid var(--status-overdue)' : '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            outline: 'none',
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--status-overdue)' : 'var(--border-focus)';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
              : '0 0 0 3px rgba(99, 102, 241, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--status-overdue)' : 'var(--border-subtle)';
            e.target.style.boxShadow = 'var(--shadow-xs)';
          }}
          {...props}
        />
      </div>

      {error ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--status-overdue)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export default Input;
