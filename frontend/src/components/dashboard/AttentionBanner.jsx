import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';
import { formatDate, getDaysRemaining } from '../../utils/dateUtils';
import { AlertCircle, CreditCard, Clock } from 'lucide-react';

export const AttentionBanner = ({ overdueBills = [], dueSoonBills = [], onPayBill }) => {
  const needsAttention = [...overdueBills, ...dueSoonBills];

  if (needsAttention.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#FEE2E2',
            color: 'var(--status-overdue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', color: '#991B1B' }}>
            Attention Required ({needsAttention.length} bill{needsAttention.length === 1 ? '' : 's'})
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#B91C1C' }}>
            Action needed on overdue or immediate due dates to avoid penalty fees
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
        {needsAttention.slice(0, 4).map((bill) => {
          const days = getDaysRemaining(bill.dueDate);
          const isOverdue = days < 0;

          return (
            <div
              key={bill.billId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: isOverdue ? '1px solid #FCA5A5' : '1px solid #FED7AA',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  {bill.title}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isOverdue ? '#DC2626' : '#D97706' }}>
                    {formatCurrency(bill.amount)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    • {isOverdue ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : 'Due tomorrow'}
                  </span>
                </div>
              </div>

              <Button
                variant={isOverdue ? 'danger' : 'primary'}
                size="sm"
                icon={CreditCard}
                onClick={() => onPayBill(bill)}
              >
                Pay Now
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttentionBanner;
