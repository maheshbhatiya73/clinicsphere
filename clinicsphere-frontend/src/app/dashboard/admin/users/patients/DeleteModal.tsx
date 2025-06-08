// app/admin/users/DeleteModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { deleteAdminUser } from '@/app/lib/api/api';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function DeleteModal({ isOpen, onClose, userId }: DeleteModalProps) {
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token') || ''; // Adjust token retrieval
      await deleteAdminUser(userId, token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
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
              <h2 className="text-2xl font-bold text-gray-800">Delete User</h2>
              <button onClick={onClose}>
                <FaTimes className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
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
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}