import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { billsApi } from '../../api/bills';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useMailAnimation } from '../../context/MailAnimationContext';
import { DollarSign, Tag, Calendar, Repeat, FileText, Check } from 'lucide-react';

const CATEGORIES = [
  { value: 'ELECTRICITY', label: 'Electricity' },
  { value: 'WATER', label: 'Water' },
  { value: 'INTERNET', label: 'Internet / Broadband' },
  { value: 'MOBILE', label: 'Mobile Postpaid / Recharge' },
  { value: 'GAS', label: 'Gas / Fuel' },
  { value: 'RENT', label: 'House / Office Rent' },
  { value: 'SUBSCRIPTION', label: 'Digital Subscription (OTT, Cloud)' },
  { value: 'INSURANCE', label: 'Insurance Policy' },
  { value: 'CREDIT_CARD', label: 'Credit Card Bill' },
  { value: 'OTHER', label: 'Other Recurring Expense' },
];

const RECURRENCES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'ONE_TIME', label: 'One-time Payment' },
];

export const BillModal = ({ isOpen, onClose, billToEdit = null, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { triggerMailAnimation } = useMailAnimation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SUBSCRIPTION',
    amount: '',
    recurrence: 'MONTHLY',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (billToEdit) {
      setFormData({
        title: billToEdit.title || '',
        description: billToEdit.description || '',
        category: billToEdit.category || 'SUBSCRIPTION',
        amount: billToEdit.amount || '',
        recurrence: billToEdit.recurrence || 'MONTHLY',
        dueDate: billToEdit.dueDate ? billToEdit.dueDate.split('T')[0] : '',
      });
    } else {
      // Default due date to 7 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setFormData({
        title: '',
        description: '',
        category: 'SUBSCRIPTION',
        amount: '',
        recurrence: 'MONTHLY',
        dueDate: defaultDate.toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [billToEdit, isOpen]);

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Title is required';
    if (!formData.amount || Number(formData.amount) <= 0) err.amount = 'Enter a valid amount';
    if (!formData.dueDate) err.dueDate = 'Due date is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        amount: Number(formData.amount),
        recurrence: formData.recurrence,
        dueDate: formData.dueDate,
      };

      if (billToEdit) {
        await billsApi.updateBill(billToEdit.billId, payload);
        showToast('Bill updated successfully', 'success');
      } else {
        await billsApi.createBill(payload);
        showToast('Bill registered successfully', 'success');
        triggerMailAnimation({
          to: user?.email,
          title: `Bill Registered: ${payload.title}`,
          subtitle: `Confirmation email dispatched to your inbox`,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={billToEdit ? 'Edit Bill / Subscription' : 'Add New Bill'}
      description={billToEdit ? 'Update payment schedule and bill details' : 'Track a new recurring expense or utility payment'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title */}
        <Input
          label="Bill / Service Name *"
          placeholder="e.g. Netflix Premium, Electricity, Fiber Broadband"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
        />

        {/* Category & Amount in 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Amount (₹) *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
          />
        </div>

        {/* Due Date & Recurrence */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Input
            label="Next Due Date *"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            error={errors.dueDate}
          />

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Recurrence Cycle *
            </label>
            <select
              value={formData.recurrence}
              onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              {RECURRENCES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description / Notes */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
            Notes / Account Reference (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Account No: 83920192, shared with family"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              color: 'var(--text-primary)',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} icon={Check}>
            {billToEdit ? 'Save Changes' : 'Create Bill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BillModal;
