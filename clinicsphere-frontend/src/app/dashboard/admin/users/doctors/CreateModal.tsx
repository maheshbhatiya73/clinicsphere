'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaStethoscope, FaIdCard, FaClock, FaDollarSign, FaMapMarkerAlt, FaInfoCircle, FaImage } from 'react-icons/fa';
import { createAdminDoctor, RegisterPayload } from '@/app/lib/api/api';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedRegisterPayload extends RegisterPayload {
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  appointmentFee: number;
  consultationDuration: number;
  clinicAddress: string;
  bio: string;
  image?: File | null; // Add image field to store the uploaded file
}

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const [formData, setFormData] = useState<ExtendedRegisterPayload>({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
    specialization: '',
    licenseNumber: '',
    experienceYears: 0,
    appointmentFee: 0,
    consultationDuration: 0,
    clinicAddress: '',
    bio: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('https://via.placeholder.com/150?text=Doctor+Profile'); // Default placeholder image
  const fileInputRef = useRef<HTMLInputElement>(null);

  const specializations = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Oncology',
    'Endocrinology',
  ];

  // Handle image selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click when preview is clicked
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      const formDataToSend = new FormData();
      // Append all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formDataToSend.append("file", value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      await createAdminDoctor(formDataToSend, token);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'doctor',
        specialization: '',
        licenseNumber: '',
        experienceYears: 0,
        appointmentFee: 0,
        consultationDuration: 0,
        clinicAddress: '',
        bio: '',
        image: null,
      });
      setPreviewImage('https://via.placeholder.com/150?text=Doctor+Profile'); // Reset to default image
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create doctor profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experienceYears' || name === 'appointmentFee' || name === 'consultationDuration'
        ? Number(value)
        : value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-indigo-200/20"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-900 tracking-tight">Add New Doctor</h2>
              <motion.button
                whileHover={{ rotate: 180, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-indigo-100 transition-colors"
              >
                <FaTimes className="text-indigo-700 text-xl" />
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100/80 text-red-600 rounded-xl p-4 mb-6 text-sm font-medium shadow-inner"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <div className="flex justify-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer"
                  onClick={handleImageClick}
                >
                  <img
                    src={previewImage}
                    alt="Doctor Profile Preview"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-800">Personal Information</h3>
                  <div className="relative">
                    <label className="block text-indigo-700 font-medium mb-2 text-sm">Full Name</label>
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                      <FaUser className="absolute left-3 text-indigo-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                        placeholder="Enter full name"
                        required
                      />
                    </motion.div>
                  </div>
                  <div className="relative">
                    <label className="block text-indigo-700 font-medium mb-2 text-sm">Email Address</label>
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                      <FaEnvelope className="absolute left-3 text-indigo-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                        placeholder="Enter email address"
                        required
                      />
                    </motion.div>
                  </div>
                  <div className="relative">
                    <label className="block text-indigo-700 font-medium mb-2 text-sm">Password</label>
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                      <FaLock className="absolute left-3 text-indigo-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                        placeholder="Enter secure password"
                        required
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-800">Professional Information</h3>
                  <div className="relative">
                    <label className="block text-indigo-700 font-medium mb-2 text-sm">Specialization</label>
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                      <FaStethoscope className="absolute left-3 text-indigo-400" />
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 appearance-none"
                        required
                      >
                        <option value="" disabled>Select specialization</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  </div>
                  <div className="relative">
                    <label className="block text-indigo-700 font-medium mb-2 text-sm">License Number</label>
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                      <FaIdCard className="absolute left-3 text-indigo-400" />
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                        placeholder="Enter license number"
                        required
                      />
                    </motion.div>
                  </div>
                  <div className="relative">
                    <label className="block text-indigo-700 font-medium mb-2 text-sm">Years of Experience</label>
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                      <FaClock className="absolute left-3 text-indigo-400" />
                      <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                        placeholder="Enter years of experience"
                        min="0"
                        required
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-indigo-700 font-medium mb-2 text-sm">Appointment Fee ($)</label>
                  <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                    <FaDollarSign className="absolute left-3 text-indigo-400" />
                    <input
                      type="number"
                      name="appointmentFee"
                      value={formData.appointmentFee}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                      placeholder="Enter fee"
                      min="0"
                      step="0.01"
                      required
                    />
                  </motion.div>
                </div>
                <div className="relative">
                  <label className="block text-indigo-700 font-medium mb-2 text-sm">Consultation Duration (min)</label>
                  <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                    <FaClock className="absolute left-3 text-indigo-400" />
                    <input
                      type="number"
                      name="consultationDuration"
                      value={formData.consultationDuration}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                      placeholder="Enter duration"
                      min="0"
                      required
                    />
                  </motion.div>
                </div>
                <div className="relative">
                  <label className="block text-indigo-700 font-medium mb-2 text-sm">Clinic Address</label>
                  <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center">
                    <FaMapMarkerAlt className="absolute left-3 text-indigo-400" />
                    <input
                      type="text"
                      name="clinicAddress"
                      value={formData.clinicAddress}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                      placeholder="Enter address"
                      required
                    />
                  </motion.div>
                </div>
              </div>

              {/* Bio */}
              <div className="relative">
                <label className="block text-indigo-700 font-medium mb-2 text-sm">Bio</label>
                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  <FaInfoCircle className="absolute left-3 top-3 text-indigo-400" />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 placeholder:text-indigo-400/70"
                    placeholder="Enter doctor bio"
                    rows={5}
                  />
                </motion.div>
              </div>

              <div className="sticky bottom-0 bg-white/90 backdrop-blur-2xl pt-4 -mx-8 px-8 border-t border-indigo-200/20">
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#e0e7ff' }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 bg-indigo-100 text-indigo-900 rounded-xl font-medium text-sm shadow-md transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#4f46e5' }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-indigo-600/30 transition-colors"
                  >
                    Create Doctor
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}