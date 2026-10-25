import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { billsApi } from '../../api/bills';
import AttentionBanner from '../../components/dashboard/AttentionBanner';
import UpcomingTimeline from '../../components/dashboard/UpcomingTimeline';
import SpendingSummary from '../../components/dashboard/SpendingSummary';
import BillModal from '../../components/bills/BillModal';
import PayModal from '../../components/bills/PayModal';
import BillDetailsModal from '../../components/bills/BillDetailsModal';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { formatDate, getDaysRemaining } from '../../utils/dateUtils';
import {
  Plus,
  Receipt,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Wallet,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [overdueBills, setOverdueBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [billToPay, setBillToPay] = useState(null);
  const [selectedBillForDetails, setSelectedBillForDetails] = useState(null);
  const [billToEdit, setBillToEdit] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [allData, overdueData] = await Promise.all([
        billsApi.getAllBills().catch(() => []),
        billsApi.getOverdueBills().catch(() => []),
      ]);
      setBills(Array.isArray(allData) ? allData : []);
      setOverdueBills(Array.isArray(overdueData) ? overdueData : []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter bills due within 2 days
  const dueSoonBills = bills.filter((b) => {
    if (b.status === 'PAID') return false;
    const days = getDaysRemaining(b.dueDate);
    return days >= 0 && days <= 2;
  });

  // Calculate metrics
  const pendingBills = bills.filter((b) => b.status !== 'PAID');
  const paidBills = bills.filter((b) => b.status === 'PAID');

  const totalPendingAmount = pendingBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const totalPaidAmount = paidBills.reduce((acc, b) => acc + (Number(b.amount) || 0), 0);

  // Next payment
  const nextPayment = [...pendingBills].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="app-container" style={{ paddingBottom: '3.5rem' }}>
      {/* Top Header / Greeting */}
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
          <h1 style={{ fontSize: '1.65rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {getGreeting()}, {user?.firstName || 'there'} 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Here is your financial overview and upcoming billing schedule.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          Add New Bill
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : bills.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Your bills and subscriptions are waiting"
          description="Add your first recurring utility bill or subscription. SmartBill will monitor due dates, track payment history, and keep you organized."
          actionLabel="Add Your First Bill"
          actionIcon={Plus}
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Key Metric Highlights (Attention-First, Not Generic Cards) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            {/* Metric 1: Pending Balance */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Pending Due
                </span>
                <div style={{ color: 'var(--status-upcoming)', backgroundColor: 'var(--status-upcoming-bg)', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
                  <Clock size={16} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatCurrency(totalPendingAmount)}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                across {pendingBills.length} unpaid bill{pendingBills.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Metric 2: Next Charge */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Next Payment
                </span>
                <div style={{ color: 'var(--brand-600)', backgroundColor: 'var(--brand-50)', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
                  <Calendar size={16} />
                </div>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nextPayment ? nextPayment.title : 'None pending'}
              </div>
              <span style={{ fontSize: '0.8rem', color: nextPayment ? 'var(--brand-600)' : 'var(--text-tertiary)', fontWeight: 500 }}>
                {nextPayment ? `${formatCurrency(nextPayment.amount)} on ${formatDate(nextPayment.dueDate)}` : 'All caught up'}
              </span>
            </div>

            {/* Metric 3: Total Settled */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Paid
                </span>
                <div style={{ color: 'var(--status-paid-text)', backgroundColor: 'var(--status-paid-bg)', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatCurrency(totalPaidAmount)}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                {paidBills.length} settled bill{paidBills.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Attention Required Banner (if any bills are overdue or due soon) */}
          <AttentionBanner
            overdueBills={overdueBills}
            dueSoonBills={dueSoonBills}
            onPayBill={(bill) => setBillToPay(bill)}
          />

          {/* Two-Column Responsive Section: Upcoming Timeline + Spending Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <UpcomingTimeline
              bills={bills}
              onPayBill={(bill) => setBillToPay(bill)}
              onSelectBill={(bill) => setSelectedBillForDetails(bill)}
            />

            <SpendingSummary bills={bills} />
          </div>
        </>
      )}

      {/* Add New Bill Modal */}
      <BillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      {/* Edit Bill Modal */}
      <BillModal
        isOpen={!!billToEdit}
        onClose={() => setBillToEdit(null)}
        billToEdit={billToEdit}
        onSuccess={fetchDashboardData}
      />

      {/* Pay Modal */}
      <PayModal
        isOpen={!!billToPay}
        onClose={() => setBillToPay(null)}
        bill={billToPay}
        onSuccess={fetchDashboardData}
      />

      {/* Details Modal */}
      <BillDetailsModal
        isOpen={!!selectedBillForDetails}
        onClose={() => setSelectedBillForDetails(null)}
        bill={selectedBillForDetails}
        onEdit={(bill) => setBillToEdit(bill)}
        onPay={(bill) => setBillToPay(bill)}
        onDeleted={fetchDashboardData}
      />
    </div>
  );
};

export default DashboardPage;
