'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage } from 'react-icons/fa';
import { updateDoctorPatient, UpdateUserPayload, User } from '@/app/lib/api/api';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UpdateModal({ isOpen, onClose, user }: UpdateModalProps) {
  const [formData, setFormData] = useState<UpdateUserPayload>({});
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('/default-profile.png');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setPreviewImage(user.profilePicUrl || '/default-profile.png');
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || '';
      if (user?._id) {
        const payload = new FormData();
        if (formData.name) payload.append('name', formData.name);
        if (formData.email) payload.append('email', formData.email);
        if (formData.role) payload.append('role', formData.role);
        if (selectedFile) payload.append('file', selectedFile); // Match backend field name

        await updateDoctorPatient(user._id, payload, token);
        setSelectedFile(null);
        setPreviewImage(user.profilePicUrl || '/default-profile.png');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
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
              <h2 className="text-3xl font-extrabold text-sky-900">Update User</h2>
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
              <div className="flex justify-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer"
                  onClick={handleImageClick}
                >
                  <img
                    src={previewImage}
                    alt="User Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                    <FaImage className="text-white text-2xl" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </motion.div>
              </div>
              <div>
                <label className="block text-sky-800 font-medium mb-2 text-sm">Full Name</label>
                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-sky-50/50 border border-sky-200 text-sky-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300/50 transition-all duration-300 placeholder:text-sky-400/70"
                    placeholder="Enter full name"
                  />
                  <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
                </motion.div>
              </div>
              <div>
                <label className="block text-sky-800 font-medium mb-2 text-sm">Email Address</label>
                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-sky-50/50 border border-sky-200 text-sky-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300/50 transition-all duration-300 placeholder:text-sky-400/70"
                    placeholder="Enter email address"
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
                  disabled={isLoading}
                  className={`px-6 py-2.5 bg-sky-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-sky-600/30 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Updating...' : 'Update User'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}