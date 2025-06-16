'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { updateAdminSpecialty } from '@/app/lib/api/api';

interface UpdateModalProps {
  onClose: () => void;
  onSuccess: () => void;
  specialtyId: string;
  specialty: {
    title: string;
    description: string;
    rating?: number;
    reviews?: number;
    duration?: string;
    price?: string;
  };
}

export default function UpdateModal({
  onClose,
  onSuccess,
  specialtyId,
  specialty,
}: UpdateModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    reviews: '',
    duration: '',
    price: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (specialty) {
      setFormData({
        title: specialty.title || '',
        description: specialty.description || '',
        rating: specialty.rating?.toString() || '',
        reviews: specialty.reviews?.toString() || '',
        duration: specialty.duration || '',
        price: specialty.price || '',
      });
    }
  }, [specialty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        setLoading(false);
        return;
      }

      const payload: any = {
        title: formData.title,
        description: formData.description,
      };
      if (formData.rating.trim()) payload.rating = parseFloat(formData.rating);
      if (formData.reviews.trim()) payload.reviews = parseInt(formData.reviews, 10);
      if (formData.duration.trim()) payload.duration = formData.duration;
      if (formData.price.trim()) payload.price = formData.price;

      await updateAdminSpecialty(specialtyId, payload, token);
      toast.success('Specialty updated successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update specialty');
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
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-2xl border border-sky-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-sky-800">Update Specialty</h2>
            <button onClick={onClose} className="text-sky-600 hover:text-red-500 transition">
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'title', label: 'Title', type: 'text' },
              { id: 'description', label: 'Description', type: 'textarea' },
              { id: 'rating', label: 'Rating (e.g. 4.8)', type: 'number', step: '0.1' },
              { id: 'reviews', label: 'Reviews (e.g. 124)', type: 'number' },
              { id: 'duration', label: 'Duration (e.g. 30 min)', type: 'text' },
              { id: 'price', label: 'Price (e.g. $120)', type: 'text' },
            ].map(({ id, label, type, step }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sky-700 font-medium mb-1">
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    id={id}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md border border-sky-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                    required={id === 'title' || id === 'description'}
                  />
                ) : (
                  <input
                    id={id}
                    type={type}
                    step={step}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    className="w-full rounded-md border border-sky-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                    required={id === 'title' || id === 'description'}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition flex items-center gap-2 disabled:bg-sky-300"
              >
                {loading && <FaSpinner className="animate-spin" />}
                Update
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
