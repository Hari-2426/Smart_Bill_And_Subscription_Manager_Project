import React from 'react';

export const Skeleton = ({ width = '100%', height = '1.25rem', borderRadius = 'var(--radius-sm)', style = {} }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#E2E8F0',
        animation: 'pulseGlow 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '40%' }}>
            <Skeleton width="2.5rem" height="2.5rem" borderRadius="var(--radius-md)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '70%' }}>
              <Skeleton width="80%" height="1rem" />
              <Skeleton width="50%" height="0.75rem" />
            </div>
          </div>
          <Skeleton width="15%" height="1rem" />
          <Skeleton width="15%" height="1.5rem" borderRadius="var(--radius-full)" />
          <Skeleton width="10%" height="2rem" borderRadius="var(--radius-md)" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
