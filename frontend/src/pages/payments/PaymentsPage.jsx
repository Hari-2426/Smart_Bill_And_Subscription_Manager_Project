import React, { useState, useEffect, useMemo } from 'react';
import { paymentsApi } from '../../api/payments';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  FileText,
  Clock,
} from 'lucide-react';

export const PaymentsPage = ({ onNavigateToBills }) => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await paymentsApi.getPaymentHistory();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || 'Failed to load payment history', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalVolume = payments.reduce((acc, p) => acc + (Number(p.amountPaid) || 0), 0);

  const filteredPayments = useMemo(() => {
    return payments
      .filter((p) => {
        const title = p.bill?.title || '';
        const remarks = p.remarks || '';
        const matchesSearch =
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          remarks.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'ALL' ||
          (p.paymentStatus || '').toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
  }, [payments, searchTerm, statusFilter]);

  return (
    <div className="app-container" style={{ paddingBottom: '3.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          margin: '2rem 0 1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', color: 'var(--text-primary)' }}>Payment History</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Permanent settlement records and audit logs for your bills
          </p>
        </div>

        {/* Volume Summary Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1.15rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--status-paid-bg)',
              color: 'var(--status-paid-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Total Settled
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCurrency(totalVolume)}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1 1 280px' }}>
          <Input
            placeholder="Search payments by bill title or note..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.55rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            backgroundColor: '#FFFFFF',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="COMPLETED">Completed Only</option>
          <option value="NOT_COMPLETED">Pending / Incomplete</option>
        </select>
      </div>

      {/* Payment Records Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filteredPayments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title={payments.length === 0 ? 'No payments recorded yet' : 'No matching payment records'}
          description={
            payments.length === 0
              ? 'When you settle any bill in SmartBill, the transaction details and timestamps will appear here.'
              : 'Try clearing your search query or status filter.'
          }
          actionLabel={payments.length === 0 ? 'View Bills to Pay' : 'Clear Filters'}
          onAction={() => {
            if (payments.length === 0) {
              if (onNavigateToBills) onNavigateToBills();
            } else {
              setSearchTerm('');
              setStatusFilter('ALL');
            }
          }}
        />
      ) : (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '0.85rem 1.25rem' }}>Bill Details</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Payment Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Amount Settled</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Notes / Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => {
                  const bill = p.bill || {};
                  return (
                    <tr
                      key={p.paymentId}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      {/* Bill details */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {bill.title || 'Settlement'}
                        </div>
                        {bill.category && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
                            {formatCategoryName(bill.category)}
                          </div>
                        )}
                      </td>

                      {/* Payment Date */}
                      <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>
                        <div style={{ fontWeight: 500 }}>{formatDate(p.paymentDate)}</div>
                      </td>

                      {/* Amount Paid */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--status-paid-text)', fontSize: '0.95rem' }}>
                          {formatCurrency(p.amountPaid)}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem' }}>
                        <Badge variant={p.paymentStatus || 'COMPLETED'}>
                          {p.paymentStatus || 'COMPLETED'}
                        </Badge>
                      </td>

                      {/* Notes / Remarks */}
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                        {p.remarks || 'Standard settlement'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
