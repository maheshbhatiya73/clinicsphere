'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { createAdminUser, createDoctorPatient, RegisterPayload } from '@/app/lib/api/api';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const [formData, setFormData] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      await createDoctorPatient(formData, token);
      setFormData({ name: '', email: '', password: '', role: 'patient' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
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
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-sky-200/30"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold text-sky-900">Create New User</h2>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sky-800 font-medium mb-2 text-sm">Full Name</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-sky-50/50 border border-sky-200 text-sky-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300/50 transition-all duration-300 placeholder:text-sky-400/70"
                    placeholder="Enter full name"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
                </motion.div>
              </div>
              <div>
                <label className="block text-sky-800 font-medium mb-2 text-sm">Email Address</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-sky-50/50 border border-sky-200 text-sky-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300/50 transition-all duration-300 placeholder:text-sky-400/70"
                    placeholder="Enter email address"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
                </motion.div>
              </div>
              <div>
                <label className="block text-sky-800 font-medium mb-2 text-sm">Password</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-sky-50/50 border border-sky-200 text-sky-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300/50 transition-all duration-300 placeholder:text-sky-400/70"
                    placeholder="Enter secure password"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
                </motion.div>
              </div>
           
              <div className="flex justify-end gap-3 pt-2">
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
                  whileHover={{ scale: 1.05, backgroundColor: '#0284c7' }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-sky-600/30 transition-colors"
                >
                  Create User
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}