'use client';

import { Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function AdminTopBar() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div
      className="h-16 flex items-center justify-between px-8 border-b"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'var(--border)',
      }}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-md border"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: '#f9fafb',
            color: 'var(--text-dark)',
          }}
        />
      </div>

      {/* Right side: Notification & Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <Bell size={20} style={{ color: 'var(--text-dark)' }} />
          <div
            className="absolute top-0 right-0 w-3 h-3 rounded-full"
            style={{ backgroundColor: 'var(--accent)' }}
          ></div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              A
            </div>
            <ChevronDown size={16} style={{ color: 'var(--text-dark)' }} />
          </button>

          {/* Dropdown Menu */}
          {showProfile && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg border"
              style={{
                backgroundColor: '#ffffff',
                borderColor: 'var(--border)',
              }}
            >
              <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                  Admin User
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  admin@simplestore.com
                </p>
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                style={{ color: 'var(--text-dark)' }}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors border-t"
                style={{ color: 'var(--red)', borderColor: 'var(--border)' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
