'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { deleteAdminSpecialty } from '@/app/lib/api/api';

interface DeleteModalProps {
  specialty: { _id: string; name: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteModal({ specialty, onClose, onSuccess }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        setLoading(false);
        return;
      }

      await deleteAdminSpecialty(specialty._id, token);
      toast.success('Specialty deleted successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete specialty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
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
          className="bg-white rounded-xl p-6 w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-sky-800">Delete Specialty</h2>
            <button onClick={onClose} className="text-sky-500 hover:text-sky-700">
              <FaTimes size={20} />
            </button>
          </div>
          <p className="text-sky-700 mb-4">
            Are you sure you want to delete <span className="font-semibold">{specialty.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleDelete}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2 disabled:bg-red-300"
            >
              {loading && <FaSpinner className="animate-spin" />}
              Delete
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}