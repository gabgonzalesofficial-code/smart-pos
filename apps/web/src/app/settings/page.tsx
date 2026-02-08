'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/auth-store';
import { useUpdateProfile, useUpdatePassword } from '@/hooks/use-api';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // Profile form
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '' });
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  useEffect(() => {
    if (user) {
      setProfile({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '' });
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      const updated = await updateProfile.mutateAsync(profile);
      // Update the local auth store so the sidebar and header reflect the change
      setUser({ ...user!, firstName: updated.firstName, lastName: updated.lastName, email: updated.email });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.response?.data?.message || err.message || 'Failed to update profile' });
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    try {
      await updatePassword.mutateAsync({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err?.response?.data?.message || err.message || 'Failed to update password' });
    }
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="max-w-3xl space-y-6">
        {/* Profile Section */}
        <form onSubmit={handleProfileSave} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Profile Information</h3>
          {profileMsg && (
            <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {profileMsg.text}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input type="text" value={user?.role || ''} disabled
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
            </div>
          </div>
          <button type="submit" disabled={updateProfile.isPending}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Security Section */}
        <form onSubmit={handlePasswordSave} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Security</h3>
          {passwordMsg && (
            <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium ${passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {passwordMsg.text}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="Enter current password" required
                className="w-full max-w-md px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="Enter new password (min 6 characters)" required
                className="w-full max-w-md px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Confirm new password" required
                className="w-full max-w-md px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <button type="submit" disabled={updatePassword.isPending}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
            {updatePassword.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
