import React from 'react';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';
import { PieChart, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export const SpendingSummary = ({ bills = [] }) => {
  const totalAmount = bills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const paidAmount = bills
    .filter((b) => b.status === 'PAID')
    .reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const pendingAmount = totalAmount - paidAmount;

  const paidPercent = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
  const pendingPercent = 100 - paidPercent;

  // Group by category
  const categoryMap = bills.reduce((acc, b) => {
    const cat = b.category || 'OTHER';
    acc[cat] = (acc[cat] || 0) + (Number(b.amount) || 0);
    return acc;
  }, {});

  const categoryList = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const categoryColors = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        padding: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Spending Breakdown</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Financial commitments and settlement progress
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Pipeline
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>

      {/* Progress Bar (Paid vs Pending) */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--status-paid-text)', fontWeight: 600 }}>
            <CheckCircle2 size={14} /> Paid: {formatCurrency(paidAmount)} ({paidPercent}%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--status-upcoming-text)', fontWeight: 600 }}>
            <Clock size={14} /> Pending: {formatCurrency(pendingAmount)} ({pendingPercent}%)
          </span>
        </div>

        <div
          style={{
            height: '10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#F1F5F9',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: `${paidPercent}%`,
              backgroundColor: 'var(--status-paid)',
              transition: 'width 0.4s ease',
            }}
          />
          <div
            style={{
              width: `${pendingPercent}%`,
              backgroundColor: 'var(--status-upcoming)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Category breakdown rows */}
      <div>
        <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
          Top Expense Categories
        </h4>
        {categoryList.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            No expenses categorized yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {categoryList.map(([cat, amt], idx) => {
              const catPercent = totalAmount > 0 ? Math.round((amt / totalAmount) * 100) : 0;
              const barColor = categoryColors[idx % categoryColors.length];

              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{formatCategoryName(cat)}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {formatCurrency(amt)} <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>({catPercent}%)</span>
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#F1F5F9',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${catPercent}%`,
                        height: '100%',
                        backgroundColor: barColor,
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingSummary;
