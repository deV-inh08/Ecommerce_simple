'use client';

import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { useState } from 'react';
import StatCard from './components/StatCard';
import SimpleChart from './components/SimpleChart';
import StatusBadge from './components/StatusBadge';

// Mock data
const mockRevenueData = [
  { label: 'Mon', value: 2400 },
  { label: 'Tue', value: 1398 },
  { label: 'Wed', value: 2210 },
  { label: 'Thu', value: 2290 },
  { label: 'Fri', value: 2000 },
  { label: 'Sat', value: 2181 },
  { label: 'Sun', value: 2500 },
];

const mockOrdersData = [
  { label: 'Pending', value: 24 },
  { label: 'Confirmed', value: 45 },
  { label: 'Shipped', value: 18 },
  { label: 'Delivered', value: 87 },
  { label: 'Cancelled', value: 6 },
];

const mockRecentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    date: '2024-01-15',
    status: 'delivered',
    total: '$245.99',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    date: '2024-01-15',
    status: 'shipped',
    total: '$189.50',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    date: '2024-01-14',
    status: 'pending',
    total: '$456.00',
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Williams',
    date: '2024-01-14',
    status: 'confirmed',
    total: '$312.75',
  },
  {
    id: 'ORD-005',
    customer: 'Tom Brown',
    date: '2024-01-13',
    status: 'cancelled',
    total: '$0.00',
  },
];

const mockTopProducts = [
  {
    id: 1,
    name: 'Classic Sneakers',
    image: '👟',
    unitsSold: 245,
    revenue: '$12,245',
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    image: '🎧',
    unitsSold: 189,
    revenue: '$9,450',
  },
  {
    id: 3,
    name: 'Smart Watch',
    image: '⌚',
    unitsSold: 156,
    revenue: '$7,800',
  },
  {
    id: 4,
    name: 'Laptop Backpack',
    image: '🎒',
    unitsSold: 132,
    revenue: '$3,960',
  },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-heading font-bold"
            style={{ color: 'var(--text-dark)' }}
          >
            Dashboard
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Welcome back, Admin. Here&apos;s your store performance at a glance.
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="$54,231"
            icon={DollarSign}
            trend={12}
            trendLabel="vs. last month"
          />
          <StatCard
            title="Total Orders"
            value="1,245"
            icon={ShoppingCart}
            trend={8}
            trendLabel="vs. last month"
          />
          <StatCard
            title="Total Products"
            value="348"
            icon={Package}
            trend={-3}
            trendLabel="vs. last month"
          />
          <StatCard
            title="Total Customers"
            value="892"
            icon={Users}
            trend={15}
            trendLabel="vs. last month"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-lg font-heading font-bold"
                style={{ color: 'var(--text-dark)' }}
              >
                Revenue Overview
              </h2>
              <div className="flex gap-2">
                {(['7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      timeRange === range
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor:
                        timeRange === range ? 'var(--primary)' : 'transparent',
                      color: timeRange === range ? '#ffffff' : 'var(--text-muted)',
                    }}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <SimpleChart title="" data={mockRevenueData} type="bar" />
          </div>

          {/* Orders by Status */}
          <SimpleChart title="Orders by Status" data={mockOrdersData} type="donut" />
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2">
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: '#ffffff',
                borderColor: 'var(--border)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <h3
                className="text-lg font-heading font-bold mb-6"
                style={{ color: 'var(--text-dark)' }}
              >
                Recent Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <th
                        className="text-left py-3 px-4 font-medium text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Order ID
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Customer
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Date
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Status
                      </th>
                      <th
                        className="text-right py-3 px-4 font-medium text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentOrders.map((order) => (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <td
                          className="py-4 px-4 text-sm font-medium"
                          style={{ color: 'var(--primary)' }}
                        >
                          {order.id}
                        </td>
                        <td
                          className="py-4 px-4 text-sm"
                          style={{ color: 'var(--text-dark)' }}
                        >
                          {order.customer}
                        </td>
                        <td
                          className="py-4 px-4 text-sm"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {order.date}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge
                            status={order.status as any}
                            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          />
                        </td>
                        <td
                          className="py-4 px-4 text-right text-sm font-bold"
                          style={{ color: 'var(--text-dark)' }}
                        >
                          {order.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: '#ffffff',
              borderColor: 'var(--border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <h3
              className="text-lg font-heading font-bold mb-6"
              style={{ color: 'var(--text-dark)' }}
            >
              Top Selling Products
            </h3>
            <div className="space-y-4">
              {mockTopProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: 'var(--beige-light)' }}
                  >
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {product.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {product.unitsSold} units
                    </p>
                  </div>
                  <p
                    className="text-sm font-bold text-right"
                    style={{ color: 'var(--primary)' }}
                  >
                    {product.revenue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
