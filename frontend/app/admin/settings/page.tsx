'use client';

import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: 'Admin User',
    email: 'admin@simplestore.com',
    phone: '+1 (555) 123-4567',
  });

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({});

  const handleProfileChange = (e: any) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSecurityChange = (e: any) => {
    const { name, value } = e.target;
    setSecurityForm((prev) => ({ ...prev, [name]: value }));
    if (securityErrors[name]) {
      setSecurityErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProfileSave = () => {
    const errors: Record<string, string> = {};

    if (!profileForm.name.trim()) errors.name = 'Name is required';
    if (!profileForm.email.trim()) errors.email = 'Email is required';
    if (profileForm.email && !profileForm.email.includes('@'))
      errors.email = 'Invalid email';

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSecuritySave = () => {
    const errors: Record<string, string> = {};

    if (!securityForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!securityForm.newPassword) errors.newPassword = 'New password is required';
    if (securityForm.newPassword.length < 8)
      errors.newPassword = 'Password must be at least 8 characters';
    if (securityForm.newPassword !== securityForm.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setSecurityErrors(errors);
      return;
    }

    setSuccessMessage('Password changed successfully!');
    setSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordFields(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-heading font-bold"
            style={{ color: 'var(--text-dark)' }}
          >
            Settings
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Manage your account and security preferences
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            className="flex items-center gap-3 p-4 mb-6 rounded-lg border"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderColor: '#10b981',
            }}
          >
            <CheckCircle size={20} style={{ color: '#10b981' }} />
            <span style={{ color: '#047857' }}>{successMessage}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8">
          {(['profile', 'security'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-all rounded-t-lg border-b-2 ${
                activeTab === tab
                  ? 'border-b-2'
                  : 'border-transparent hover:text-primary'
              }`}
              style={{
                color:
                  activeTab === tab
                    ? 'var(--primary)'
                    : 'var(--text-muted)',
                borderColor:
                  activeTab === tab ? 'var(--primary)' : 'transparent',
              }}
            >
              {tab === 'profile' ? 'Profile' : 'Security'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className="rounded-lg border p-8"
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'var(--border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar */}
              <div>
                <p
                  className="text-sm font-medium mb-4"
                  style={{ color: 'var(--text-dark)' }}
                >
                  PROFILE PICTURE
                </p>
                <div className="flex items-center gap-6">
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl font-bold text-white"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    A
                  </div>
                  <button
                    className="px-4 py-2 border rounded-md font-medium transition-all hover:bg-gray-50"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text-dark)',
                    }}
                  >
                    Upload Photo
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)' }}></div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: profileErrors.name ? 'var(--red)' : 'var(--border)',
                      backgroundColor: '#f9fafb',
                    }}
                  />
                  {profileErrors.name && (
                    <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                      {profileErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: profileErrors.email ? 'var(--red)' : 'var(--border)',
                      backgroundColor: '#f9fafb',
                    }}
                  />
                  {profileErrors.email && (
                    <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                      {profileErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: '#f9fafb',
                    }}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={handleProfileSave}
                  className="px-6 py-2 rounded-md font-medium text-white transition-all"
                  style={{
                    backgroundColor: 'var(--primary)',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-md">
              {/* Password Info */}
              <div
                className="flex gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: 'rgba(245, 197, 24, 0.1)',
                  borderLeft: '3px solid var(--accent)',
                }}
              >
                <AlertCircle
                  size={20}
                  style={{ color: 'var(--accent-dark)', flexShrink: 0 }}
                />
                <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                  Ensure your password is strong and unique for account security.
                </p>
              </div>

              {/* Change Password Button/Form */}
              {!showPasswordFields ? (
                <button
                  onClick={() => setShowPasswordFields(true)}
                  className="w-full px-4 py-2 border rounded-md font-medium transition-all hover:bg-gray-50"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-dark)',
                  }}
                >
                  Change Password
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={securityForm.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2"
                        style={{
                          borderColor: securityErrors.currentPassword
                            ? 'var(--red)'
                            : 'var(--border)',
                          backgroundColor: '#f9fafb',
                        }}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff size={18} style={{ color: 'var(--text-muted)' }} />
                        ) : (
                          <Eye size={18} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>
                    </div>
                    {securityErrors.currentPassword && (
                      <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                        {securityErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={securityForm.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2"
                        style={{
                          borderColor: securityErrors.newPassword
                            ? 'var(--red)'
                            : 'var(--border)',
                          backgroundColor: '#f9fafb',
                        }}
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} style={{ color: 'var(--text-muted)' }} />
                        ) : (
                          <Eye size={18} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>
                    </div>
                    {securityErrors.newPassword && (
                      <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                        {securityErrors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2"
                        style={{
                          borderColor: securityErrors.confirmPassword
                            ? 'var(--red)'
                            : 'var(--border)',
                          backgroundColor: '#f9fafb',
                        }}
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} style={{ color: 'var(--text-muted)' }} />
                        ) : (
                          <Eye size={18} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>
                    </div>
                    {securityErrors.confirmPassword && (
                      <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                        {securityErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowPasswordFields(false);
                        setSecurityForm({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                        setSecurityErrors({});
                      }}
                      className="flex-1 px-4 py-2 border rounded-md font-medium transition-all hover:bg-gray-50"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--text-dark)',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSecuritySave}
                      className="flex-1 px-4 py-2 rounded-md font-medium text-white transition-all"
                      style={{
                        backgroundColor: 'var(--primary)',
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
