import React, { useState, useEffect, useMemo } from 'react';
import { billsApi } from '../../api/bills';
import { useToast } from '../../context/ToastContext';
import BillModal from '../../components/bills/BillModal';
import PayModal from '../../components/bills/PayModal';
import BillDetailsModal from '../../components/bills/BillDetailsModal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatCategoryName, formatRecurrence } from '../../utils/formatters';
import { formatDate, getRelativeDueText, getDaysRemaining } from '../../utils/dateUtils';
import {
  Search,
  Filter,
  Plus,
  Receipt,
  MoreVertical,
  CreditCard,
  Edit,
  Trash2,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

const CATEGORIES = ['ALL', 'ELECTRICITY', 'WATER', 'INTERNET', 'MOBILE', 'GAS', 'RENT', 'SUBSCRIPTION', 'INSURANCE', 'CREDIT_CARD', 'OTHER'];
const STATUSES = ['ALL', 'PENDING', 'PAID', 'OVERDUE'];

export const BillsPage = () => {
  const { showToast } = useToast();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'amountDesc' | 'amountAsc' | 'title'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);
  const [billToPay, setBillToPay] = useState(null);
  const [selectedBillForDetails, setSelectedBillForDetails] = useState(null);

  const fetchBills = async () => {
    setIsLoading(true);
    try {
      const data = await billsApi.getAllBills();
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch bills', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (bill, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${bill.title}"?`)) return;
    try {
      await billsApi.deleteBill(bill.billId);
      showToast('Bill removed successfully', 'success');
      fetchBills();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Filtered and Sorted Bills
  const filteredBills = useMemo(() => {
    return bills
      .filter((b) => {
        const matchesSearch =
          b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
        const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sortBy === 'amountDesc') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
        if (sortBy === 'amountAsc') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [bills, searchTerm, categoryFilter, statusFilter, sortBy]);

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
          <h1 style={{ fontSize: '1.65rem', color: 'var(--text-primary)' }}>Bills & Subscriptions</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Manage recurring payments, schedule tracking, and billing status
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add New Bill
        </Button>
      </div>

      {/* Filter & Search Bar */}
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
        <div style={{ flex: '1 1 260px' }}>
          <Input
            placeholder="Search bills, subscriptions, notes..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : formatCategoryName(c)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
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
            <option value="PENDING">Pending Only</option>
            <option value="PAID">Paid Only</option>
            <option value="OVERDUE">Overdue Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
            <option value="dueDate">Sort by Due Date</option>
            <option value="amountDesc">Amount: High to Low</option>
            <option value="amountAsc">Amount: Low to High</option>
            <option value="title">Title: A to Z</option>
          </select>
        </div>
      </div>

      {/* Bill List Table / Cards */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filteredBills.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={bills.length === 0 ? 'No bills added yet' : 'No matching bills found'}
          description={
            bills.length === 0
              ? 'Start tracking your monthly bills and recurring subscriptions.'
              : 'Try clearing your search query or filters.'
          }
          actionLabel={bills.length === 0 ? 'Add Your First Bill' : 'Clear Filters'}
          onAction={() => {
            if (bills.length === 0) {
              setIsAddModalOpen(true);
            } else {
              setSearchTerm('');
              setCategoryFilter('ALL');
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
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Due Date</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Cycle</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => {
                  const days = getDaysRemaining(bill.dueDate);
                  const isOverdue = days < 0 && bill.status !== 'PAID';

                  return (
                    <tr
                      key={bill.billId}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background var(--transition-fast)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedBillForDetails(bill)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      {/* Title & Notes */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {bill.title}
                        </div>
                        {bill.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
                            {bill.description}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem' }}>
                        <Badge variant={bill.category} size="sm">
                          {formatCategoryName(bill.category)}
                        </Badge>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          {formatCurrency(bill.amount)}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{formatDate(bill.dueDate)}</div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: isOverdue ? 'var(--status-overdue)' : days <= 2 ? 'var(--status-upcoming)' : 'var(--text-tertiary)',
                            fontWeight: 500,
                          }}
                        >
                          {bill.status === 'PAID' ? 'Settled' : getRelativeDueText(bill.dueDate)}
                        </div>
                      </td>

                      {/* Recurrence */}
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        {formatRecurrence(bill.recurrence)}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem' }}>
                        <Badge variant={bill.status}>{bill.status}</Badge>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {bill.status !== 'PAID' && (
                            <Button
                              variant="success"
                              size="sm"
                              icon={CreditCard}
                              onClick={() => setBillToPay(bill)}
                            >
                              Pay
                            </Button>
                          )}

                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Eye}
                            onClick={() => setSelectedBillForDetails(bill)}
                          >
                            Details
                          </Button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBillToEdit(bill);
                            }}
                            title="Edit Bill"
                            style={{
                              padding: '0.4rem',
                              color: 'var(--text-secondary)',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                            }}
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={(e) => handleDelete(bill, e)}
                            title="Delete Bill"
                            style={{
                              padding: '0.4rem',
                              color: 'var(--status-overdue)',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <BillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchBills}
      />

      {/* Edit Modal */}
      <BillModal
        isOpen={!!billToEdit}
        onClose={() => setBillToEdit(null)}
        billToEdit={billToEdit}
        onSuccess={fetchBills}
      />

      {/* Pay Modal */}
      <PayModal
        isOpen={!!billToPay}
        onClose={() => setBillToPay(null)}
        bill={billToPay}
        onSuccess={fetchBills}
      />

      {/* Details Modal */}
      <BillDetailsModal
        isOpen={!!selectedBillForDetails}
        onClose={() => setSelectedBillForDetails(null)}
        bill={selectedBillForDetails}
        onEdit={(bill) => setBillToEdit(bill)}
        onPay={(bill) => setBillToPay(bill)}
        onDeleted={fetchBills}
      />
    </div>
  );
};

export default BillsPage;
