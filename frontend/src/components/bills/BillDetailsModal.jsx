import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { paymentsApi } from '../../api/payments';
import { billsApi } from '../../api/bills';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatCategoryName, formatRecurrence } from '../../utils/formatters';
import { formatDate, getRelativeDueText } from '../../utils/dateUtils';
import { CreditCard, Edit, Trash2, Calendar, Tag, Clock, CheckCircle2 } from 'lucide-react';

export const BillDetailsModal = ({
  isOpen,
  onClose,
  bill,
  onEdit,
  onPay,
  onDeleted,
}) => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (bill && isOpen) {
      loadPayments();
    }
  }, [bill, isOpen]);

  const loadPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const data = await paymentsApi.getPaymentsByBillId(bill.billId);
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      setPayments([]);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${bill.title}"?`)) return;
    setIsDeleting(true);
    try {
      await billsApi.deleteBill(bill.billId);
      showToast('Bill deleted successfully', 'success');
      onDeleted();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!bill) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bill.title}
      description={`Added ${formatDate(bill.createdAt)}`}
      maxWidth="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Highlight Banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bill Amount</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCurrency(bill.amount)}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              {formatRecurrence(bill.recurrence)} cycle
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <Badge variant={bill.status}>{bill.status}</Badge>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {getRelativeDueText(bill.dueDate)}
            </span>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>Category</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCategoryName(bill.category)}</span>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>Due Date</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatDate(bill.dueDate)}</span>
          </div>
        </div>

        {bill.description && (
          <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.2rem' }}>
              Notes & Reference
            </span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{bill.description}</p>
          </div>
        )}

        {/* Payment History for this bill */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
            Payment History for this Bill
          </h4>
          {isLoadingPayments ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Loading records...</p>
          ) : payments.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
              No payments recorded yet for this bill.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
              {payments.map((p) => (
                <div
                  key={p.paymentId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--status-paid)" />
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(p.amountPaid)}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '0.5rem' }}>
                        {formatDate(p.paymentDate)}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.remarks || 'Paid'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <Button variant="danger" size="sm" onClick={handleDelete} isLoading={isDeleting} icon={Trash2}>
            Delete Bill
          </Button>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <Button
              variant="secondary"
              size="sm"
              icon={Edit}
              onClick={() => {
                onClose();
                onEdit(bill);
              }}
            >
              Edit
            </Button>
            {bill.status !== 'PAID' && (
              <Button
                variant="success"
                size="sm"
                icon={CreditCard}
                onClick={() => {
                  onClose();
                  onPay(bill);
                }}
              >
                Mark as Paid
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BillDetailsModal;
