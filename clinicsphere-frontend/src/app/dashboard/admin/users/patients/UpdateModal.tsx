// app/admin/users/UpdateModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { updateAdminUser, UpdateUserPayload, User } from '@/app/lib/api/api';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UpdateModal({ isOpen, onClose, user }: UpdateModalProps) {
  const [formData, setFormData] = useState<UpdateUserPayload>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || ''; // Adjust token retrieval
      if (user?._id) {
        await updateAdminUser(user._id, formData, token);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Update User</h2>
              <button onClick={onClose}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Password (optional)</label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role || 'user'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}