'use client';

import { X, MapPin, Package, Truck, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from './StatusBadge';

interface OrderDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  order?: any;
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

export default function OrderDetailSheet({
  isOpen,
  onClose,
  order,
  onStatusChange,
}: OrderDetailSheetProps) {
  const [newStatus, setNewStatus] = useState(order?.status || '');

  if (!isOpen || !order) return null;

  const timelineSteps = [
    { status: 'pending', label: 'Pending', icon: Package },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = timelineSteps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Sheet */}
      <div
        className="absolute right-0 top-0 h-screen w-full max-w-md shadow-lg overflow-y-auto flex flex-col"
        style={{
          backgroundColor: '#ffffff',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b sticky top-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className="text-lg font-heading font-bold"
            style={{ color: 'var(--text-dark)' }}
          >
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Order ID & Status */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              ORDER ID
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: 'var(--primary)' }}
            >
              {order.id}
            </p>
          </div>

          {/* Customer Info */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              CUSTOMER
            </p>
            <p
              className="font-medium"
              style={{ color: 'var(--text-dark)' }}
            >
              {order.customerName}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {order.customerEmail}
            </p>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                SHIPPING ADDRESS
              </p>
            </div>
            <p
              className="text-sm"
              style={{ color: 'var(--text-dark)' }}
            >
              {order.shippingAddress}
            </p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              ORDER ITEMS ({order.items?.length || 0})
            </p>
            <div className="space-y-2">
              {order.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-3 p-2 rounded-md hover:bg-gray-50"
                >
                  <div
                    className="w-12 h-12 rounded-md flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: 'var(--beige-light)' }}
                  >
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item.quantity} x {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <p className="text-xs font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
              ORDER TIMELINE
            </p>
            <div className="space-y-3">
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const StepIcon = step.icon;
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                        style={{
                          backgroundColor: isCompleted
                            ? 'var(--primary)'
                            : 'var(--beige)',
                          color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                        }}
                      >
                        <StepIcon size={16} />
                      </div>
                      {idx < timelineSteps.length - 1 && (
                        <div
                          className="w-0.5 h-8"
                          style={{
                            backgroundColor: isCompleted
                              ? 'var(--primary)'
                              : 'var(--border)',
                          }}
                        ></div>
                      )}
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: isCompleted ? 'var(--primary)' : 'var(--text-muted)',
                        }}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: 'var(--beige-light)',
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ color: 'var(--text-dark)' }}>{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ color: 'var(--text-dark)' }}>{order.shipping}</span>
              </div>
              <div
                className="border-t pt-2 flex justify-between font-bold"
                style={{ borderColor: 'var(--border)' }}
              >
                <span style={{ color: 'var(--text-dark)' }}>Total</span>
                <span style={{ color: 'var(--primary)' }}>{order.total}</span>
              </div>
            </div>
          </div>

          {/* Status Change */}
          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              UPDATE STATUS
            </label>
            <select
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value);
                onStatusChange?.(order.id, e.target.value);
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: '#ffffff',
                color: 'var(--text-dark)',
              }}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
