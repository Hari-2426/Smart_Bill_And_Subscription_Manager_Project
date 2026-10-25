import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useMailAnimation } from '../../context/MailAnimationContext';
import { authApi } from '../../api/auth';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/dateUtils';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Key,
  Edit,
  Trash2,
  LogOut,
  Check,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const { triggerMailAnimation } = useMailAnimation();

  const [profile, setProfile] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
  });
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  useEffect(() => {
    loadLatestProfile();
  }, []);

  const loadLatestProfile = async () => {
    setIsLoading(true);
    try {
      const data = await authApi.getProfile();
      setProfile(data);
    } catch {
      // fallback to cached context user
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setEditForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      address: profile?.address || '',
      phoneNumber: profile?.phoneNumber ? String(profile.phoneNumber) : '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    try {
      await authApi.updateProfile({
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        address: editForm.address.trim(),
        phoneNumber: editForm.phoneNumber ? Number(editForm.phoneNumber) : 0,
      });
      showToast('Profile updated successfully', 'success');
      triggerMailAnimation({
        to: profile?.email,
        title: 'Profile Updated',
        subtitle: 'Account update confirmation sent to your inbox',
      });
      await refreshProfile();
      await loadLatestProfile();
      setIsEditModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      await authApi.updatePassword(passwordForm);
      showToast('Password updated successfully', 'success');
      triggerMailAnimation({
        to: profile?.email,
        title: 'Security Alert: Password Changed',
        subtitle: 'Security notification dispatched to your inbox',
      });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate your SmartBill account? You will be signed out.'
    );
    if (!confirmed) return;

    try {
      await authApi.deleteAccount();
      showToast('Account deactivated successfully', 'info');
      logout();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const initials = profile?.firstName
    ? `${profile.firstName.charAt(0)}${profile.lastName ? profile.lastName.charAt(0) : ''}`.toUpperCase()
    : 'U';

  return (
    <div className="app-container" style={{ paddingBottom: '3.5rem' }}>
      <div style={{ margin: '2rem 0 1.5rem' }}>
        <h1 style={{ fontSize: '1.65rem', color: 'var(--text-primary)' }}>Account Profile</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Manage your personal details, credentials, and account settings
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Profile Details Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Avatar & Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-100)',
                color: 'var(--brand-700)',
                fontSize: '1.5rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--brand-200)',
              }}
            >
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <Badge variant={profile?.accountStatus || 'ACTIVE'}>
                  {profile?.accountStatus || 'ACTIVE'}
                </Badge>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {profile?.role || 'USER'} Account
              </span>
            </div>
          </div>

          {/* Details List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Mail size={18} color="var(--text-tertiary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>Email</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{profile?.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Phone size={18} color="var(--text-tertiary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>Phone</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {profile?.phoneNumber || 'Not provided'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <MapPin size={18} color="var(--text-tertiary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>Address</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {profile?.address || 'Not specified'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Calendar size={18} color="var(--text-tertiary)" />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>Member Since</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {formatDate(profile?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" icon={Edit} onClick={handleOpenEdit}>
              Edit Profile
            </Button>
            <Button variant="secondary" icon={Key} onClick={() => setIsPasswordModalOpen(true)}>
              Change Password
            </Button>
          </div>
        </div>

        {/* Account Danger Zone Card */}
        <div>
          {/* Danger Zone */}
          <div
            style={{
              backgroundColor: '#FEF2F2',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #FECACA',
              padding: '1.75rem',
            }}
          >
            <h3 style={{ fontSize: '1rem', color: '#991B1B', marginBottom: '0.35rem', fontWeight: 600 }}>Deactivate Account</h3>
            <p style={{ fontSize: '0.85rem', color: '#B91C1C', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Deactivating your account will disable all recurring bill notifications and immediately terminate your active session.
            </p>
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDeleteAccount}>
              Deactivate My Account
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Information"
        description="Update your contact information and display name"
      >
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Input
              label="First Name *"
              value={editForm.firstName}
              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name *"
              value={editForm.lastName}
              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            value={editForm.phoneNumber}
            onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
          />

          <Input
            label="Address"
            value={editForm.address}
            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isSubmittingProfile}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmittingProfile} icon={Check}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        description="Ensure your new password is at least 6 characters long"
      >
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Current Password *"
            type="password"
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            required
          />

          <Input
            label="New Password *"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />

          <Input
            label="Confirm New Password *"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setIsPasswordModalOpen(false)} disabled={isSubmittingPassword}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmittingPassword} icon={Check}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
