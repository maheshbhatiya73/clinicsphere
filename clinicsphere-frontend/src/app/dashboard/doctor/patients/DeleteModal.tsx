'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { deleteAdminUser, deleteDoctorPatient } from '@/app/lib/api/api';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function DeleteModal({ isOpen, onClose, userId }: DeleteModalProps) {
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      await deleteDoctorPatient(userId, token);
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
          className="fixed inset-0 bg-gradient-to-b from-sky-900/50 to-sky-600/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-sky-200/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold text-sky-900">Delete User</h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-sky-100 transition-colors"
              >
                <FaTimes className="text-sky-700 text-lg" />
              </motion.button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 bg-red-50/80 rounded-lg p-3 mb-6 text-sm font-medium"
              >
                {error}
              </motion.p>
            )}
            <p className="text-sky-800 mb-8 text-sm font-medium">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#e0f2fe' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-sky-100 text-sky-900 rounded-xl font-medium text-sm transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#dc2626' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-red-600/30 transition-colors"
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