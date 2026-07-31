'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import OrderDetailSheet from '../components/OrderDetailSheet';

// Mock data
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    date: '2024-01-15',
    items: [
      { image: '👟', name: 'Classic Sneakers', quantity: 1, price: '$89.99' },
    ],
    itemCount: 1,
    total: '$245.99',
    subtotal: '$214.99',
    shipping: '$31.00',
    paymentStatus: 'Completed',
    orderStatus: 'delivered',
    shippingAddress: '123 Main St, New York, NY 10001',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    date: '2024-01-15',
    items: [
      { image: '🎧', name: 'Wireless Headphones', quantity: 1, price: '$199.99' },
    ],
    itemCount: 1,
    total: '$189.50',
    subtotal: '$168.50',
    shipping: '$21.00',
    paymentStatus: 'Completed',
    orderStatus: 'shipped',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    date: '2024-01-14',
    items: [
      { image: '⌚', name: 'Smart Watch', quantity: 1, price: '$299.99' },
      { image: '🎒', name: 'Laptop Backpack', quantity: 1, price: '$79.99' },
    ],
    itemCount: 2,
    total: '$456.00',
    subtotal: '$409.00',
    shipping: '$47.00',
    paymentStatus: 'Pending',
    orderStatus: 'pending',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah@example.com',
    date: '2024-01-14',
    items: [
      { image: '📚', name: 'Reading Lamp', quantity: 2, price: '$49.99' },
    ],
    itemCount: 2,
    total: '$312.75',
    subtotal: '$283.75',
    shipping: '$29.00',
    paymentStatus: 'Completed',
    orderStatus: 'confirmed',
    shippingAddress: '321 Elm St, Houston, TX 77001',
  },
  {
    id: 'ORD-005',
    customerName: 'Tom Brown',
    customerEmail: 'tom@example.com',
    date: '2024-01-13',
    items: [
      { image: '⚽', name: 'Sports Ball', quantity: 3, price: '$29.99' },
    ],
    itemCount: 3,
    total: '$0.00',
    subtotal: '$0.00',
    shipping: '$0.00',
    paymentStatus: 'Cancelled',
    orderStatus: 'cancelled',
    shippingAddress: '555 Maple Dr, Phoenix, AZ 85001',
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [orders, setOrders] = useState(mockOrders);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, orderStatus: newStatus }
          : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  const statuses = [
    'all',
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div>
          <h1
            className="text-3xl font-heading font-bold"
            style={{ color: 'var(--text-dark)' }}
          >
            Orders
          </h1>
          <p className="text-sm mt-2 mb-8" style={{ color: 'var(--text-muted)' }}>
            Manage and track all customer orders
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search by Order ID, customer, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'text-white'
                  : 'border hover:bg-gray-50'
              }`}
              style={{
                backgroundColor:
                  statusFilter === status ? 'var(--primary)' : 'transparent',
                borderColor:
                  statusFilter === status ? 'transparent' : 'var(--border)',
                color:
                  statusFilter === status ? '#ffffff' : 'var(--text-dark)',
              }}
            >
              {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'var(--border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: 'var(--beige-light)',
                    }}
                  >
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ORDER ID
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      CUSTOMER
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      DATE
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ITEMS
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      TOTAL
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      PAYMENT
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      STATUS
                    </th>
                    <th
                      className="text-right py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{
                        borderBottom: '1px solid var(--border)',
                      }}
                      onClick={() => handleViewOrder(order)}
                    >
                      <td
                        className="py-4 px-6 text-sm font-medium"
                        style={{ color: 'var(--primary)' }}
                      >
                        {order.id}
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        <p className="font-medium">{order.customerName}</p>
                        <p style={{ color: 'var(--text-muted)' }} className="text-xs">
                          {order.customerEmail}
                        </p>
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {order.date}
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        {order.itemCount}
                      </td>
                      <td
                        className="py-4 px-6 text-sm font-bold"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        {order.total}
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{
                          color:
                            order.paymentStatus === 'Completed'
                              ? 'var(--primary)'
                              : 'var(--text-muted)',
                        }}
                      >
                        {order.paymentStatus}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge
                          status={order.orderStatus as any}
                          label={
                            order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)
                          }
                        />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order);
                          }}
                          className="px-3 py-1 text-xs font-medium rounded transition-all"
                          style={{
                            backgroundColor: 'var(--beige-light)',
                            color: 'var(--primary)',
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--text-muted)' }}>No orders found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 border rounded-md text-sm font-medium transition-all hover:bg-gray-50"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-dark)',
                }}
              >
                Previous
              </button>
              <button
                className="px-3 py-2 rounded-md text-sm font-medium text-white transition-all"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                1
              </button>
              <button
                className="px-3 py-2 border rounded-md text-sm font-medium transition-all hover:bg-gray-50"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-dark)',
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Sheet */}
      <OrderDetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
