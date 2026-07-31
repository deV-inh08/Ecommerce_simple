'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (product: any) => void;
  product?: any;
}

export default function ProductDialog({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductDialogProps) {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      sku: '',
      status: 'active',
    }
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-heading font-bold"
            style={{ color: 'var(--text-dark)' }}
          >
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Product Name */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-dark)' }}
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--border)',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-dark)' }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 h-24 resize-none"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-dark)' }}
            >
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Sports">Sports</option>
              <option value="Home">Home</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-dark)' }}
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)' }}
              placeholder="0.00"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-dark)' }}
            >
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          {/* SKU */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-dark)' }}
            >
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)' }}
              placeholder="SKU-001"
            />
          </div>

          {/* Status */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-dark)' }}
            >
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-md border font-medium transition-all"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-dark)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-md font-medium text-white transition-all"
            style={{
              backgroundColor: 'var(--primary)',
            }}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
