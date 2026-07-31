'use client';

import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import ProductDialog from '../components/ProductDialog';

// Mock data
const mockProducts = [
  {
    id: 1,
    image: '👟',
    name: 'Classic Sneakers',
    category: 'Fashion',
    price: '$89.99',
    stock: 125,
    sku: 'SKU-001',
    status: 'active',
  },
  {
    id: 2,
    image: '🎧',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: '$199.99',
    stock: 45,
    sku: 'SKU-002',
    status: 'active',
  },
  {
    id: 3,
    image: '⌚',
    name: 'Smart Watch',
    category: 'Electronics',
    price: '$299.99',
    stock: 0,
    sku: 'SKU-003',
    status: 'out-of-stock',
  },
  {
    id: 4,
    image: '🎒',
    name: 'Laptop Backpack',
    category: 'Fashion',
    price: '$79.99',
    stock: 89,
    sku: 'SKU-004',
    status: 'active',
  },
  {
    id: 5,
    image: '⚽',
    name: 'Sports Ball',
    category: 'Sports',
    price: '$29.99',
    stock: 34,
    sku: 'SKU-005',
    status: 'active',
  },
  {
    id: 6,
    image: '📚',
    name: 'Reading Lamp',
    category: 'Home',
    price: '$49.99',
    stock: 12,
    sku: 'SKU-006',
    status: 'draft',
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [products, setProducts] = useState(mockProducts);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = (formData: any) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...editingProduct, ...formData } : p
        )
      );
    } else {
      setProducts([
        ...products,
        { ...formData, id: Math.max(...products.map((p) => p.id)) + 1 },
      ]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const categories = ['all', ...new Set(mockProducts.map((p) => p.category))];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-heading font-bold"
              style={{ color: 'var(--text-dark)' }}
            >
              Products
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              Manage your product inventory and details
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white transition-all hover:shadow-lg"
            style={{
              backgroundColor: 'var(--primary)',
            }}
          >
            <Plus size={20} />
            Add Product
          </button>
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
                placeholder="Search products..."
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

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: '#ffffff',
              color: 'var(--text-dark)',
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
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
          {filteredProducts.length > 0 ? (
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
                      IMAGE
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      NAME
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      CATEGORY
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      PRICE
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      STOCK
                    </th>
                    <th
                      className="text-left py-4 px-6 font-medium text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      SKU
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
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <td className="py-4 px-6">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                          style={{ backgroundColor: 'var(--beige-light)' }}
                        >
                          {product.image}
                        </div>
                      </td>
                      <td
                        className="py-4 px-6 text-sm font-medium"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        {product.name}
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {product.category}
                      </td>
                      <td
                        className="py-4 px-6 text-sm font-bold"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        {product.price}
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        {product.stock > 0 ? product.stock : (
                          <span style={{ color: 'var(--red)' }}>Out of stock</span>
                        )}
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {product.sku}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge
                          status={product.status as any}
                          label={
                            product.status === 'out-of-stock'
                              ? 'Out of stock'
                              : product.status.charAt(0).toUpperCase() + product.status.slice(1)
                          }
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Edit2 size={16} style={{ color: 'var(--primary)' }} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Trash2 size={16} style={{ color: 'var(--red)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--text-muted)' }}>No products found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing {filteredProducts.length} of {products.length} products
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

      {/* Product Dialog */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-lg font-heading font-bold mb-2"
              style={{ color: 'var(--text-dark)' }}
            >
              Delete Product
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border rounded-md font-medium transition-all"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-dark)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-md font-medium text-white transition-all"
                style={{ backgroundColor: 'var(--red)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
