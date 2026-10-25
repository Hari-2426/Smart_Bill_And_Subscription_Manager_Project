import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { paymentsApi } from '../../api/payments';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useMailAnimation } from '../../context/MailAnimationContext';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';
import { CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';

export const PayModal = ({ isOpen, onClose, bill, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { triggerMailAnimation } = useMailAnimation();
  const [amountPaid, setAmountPaid] = useState('');
  const [remarks, setRemarks] = useState('Payment completed online');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bill) {
      setAmountPaid(bill.amount ? String(bill.amount) : '');
      setRemarks(`Payment for ${bill.title}`);
    }
  }, [bill, isOpen]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amountPaid || Number(amountPaid) <= 0) {
      showToast('Please enter a valid payment amount', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await paymentsApi.payBill({
        billId: bill.billId,
        amountPaid: Number(amountPaid),
        remarks: remarks.trim() || 'Paid',
      });

      // Celebration micro-interaction!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#6366F1', '#34D399'],
        });
      } catch (cErr) {
        // Ignore confetti if not supported in environment
      }

      showToast(`Payment of ${formatCurrency(amountPaid)} recorded successfully!`, 'success');
      triggerMailAnimation({
        to: user?.email,
        title: `Payment Receipt: ${bill.title}`,
        subtitle: `Payment confirmation of ${formatCurrency(amountPaid)} sent to your inbox`,
      });
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bill) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment"
      description="Record a settlement for this bill and update your balance"
      maxWidth="460px"
    >
      <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Bill Summary Banner */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--brand-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--brand-100)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {formatCategoryName(bill.category)}
            </span>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
              {bill.title}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Due: {formatDate(bill.dueDate)}
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Due</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-900)' }}>
              {formatCurrency(bill.amount)}
            </div>
          </div>
        </div>

        {/* Amount Paid Field */}
        <Input
          label="Amount to Pay (₹) *"
          type="number"
          step="0.01"
          min="1"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          placeholder="0.00"
          required
        />

        {/* Remarks */}
        <Input
          label="Payment Note / Reference"
          placeholder="e.g. Paid via UPI, Bank Card, Cash"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-paid-text)', fontSize: '0.8rem' }}>
          <ShieldCheck size={16} />
          <span>Status will be updated to PAID in your dashboard</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="success" isLoading={isSubmitting} icon={CreditCard}>
            Confirm Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PayModal;
