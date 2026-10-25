import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';
import { formatDate, getDaysRemaining, getRelativeDueText } from '../../utils/dateUtils';
import { CreditCard, Calendar, ArrowRight } from 'lucide-react';

export const UpcomingTimeline = ({ bills = [], onPayBill, onSelectBill }) => {
  // Filter for pending/unpaid bills and sort by dueDate ascending
  const upcomingBills = bills
    .filter((b) => b.status !== 'PAID')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (upcomingBills.length === 0) {
    return (
      <div
        style={{
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Calendar size={32} color="var(--status-paid)" style={{ margin: '0 auto 0.75rem' }} />
        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          All caught up!
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          You have no pending bills scheduled right now.
        </p>
      </div>
    );
  }

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
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Upcoming Payment Schedule</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Next scheduled charges ordered by due date
          </p>
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-600)' }}>
          {upcomingBills.length} pending
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {upcomingBills.slice(0, 6).map((bill) => {
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
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Left Info */}
              <div
                onClick={() => onSelectBill && onSelectBill(bill)}
                style={{ cursor: 'pointer', flex: 1, minWidth: 0, paddingRight: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bill.title}
                  </span>
                  <Badge variant={bill.category} size="sm">
                    {formatCategoryName(bill.category)}
                  </Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                  <span>Due {formatDate(bill.dueDate)}</span>
                  <span>•</span>
                  <span style={{ color: isOverdue ? 'var(--status-overdue)' : days <= 2 ? 'var(--status-upcoming)' : 'inherit', fontWeight: 500 }}>
                    {getRelativeDueText(bill.dueDate)}
                  </span>
                </div>
              </div>

              {/* Right: Amount & Pay Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatCurrency(bill.amount)}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={CreditCard}
                  onClick={() => onPayBill(bill)}
                >
                  Pay
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingTimeline;
