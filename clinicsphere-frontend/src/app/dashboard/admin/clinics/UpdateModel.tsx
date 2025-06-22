import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { getAdminClinicById } from '@/app/lib/api/api';

interface ClinicFormData {
  name: string;
  contact: { phone: string; email: string };
  address: { line1: string; city: string; state: string; postal_code: string; country: string; location: { lat: number; lng: number } };
  working_hours: { monday: { open: string; close: string } };
  settings: { time_zone: string; currency: string; language: string; telemedicine_enabled: boolean };
}

interface UpdateModelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: ClinicFormData) => Promise<void>;
  clinicId: string;
  token: string;
}

const UpdateModel: React.FC<UpdateModelProps> = ({ isOpen, onClose, onUpdate, clinicId, token }) => {
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    contact: { phone: '', email: '' },
    address: { line1: '', city: '', state: '', postal_code: '', country: '', location: { lat: 0, lng: 0 } },
    working_hours: { monday: { open: '', close: '' } },
    settings: { time_zone: 'Asia/Kolkata', currency: 'INR', language: 'en', telemedicine_enabled: false },
  });

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const clinic = await getAdminClinicById(clinicId, token);
        setFormData({
          name: clinic.name,
          contact: clinic.contact,
          address: clinic.address,
          working_hours: clinic.working_hours,
          settings: clinic.settings,
        });
      } catch (error) {
        console.error('Fetch clinic error:', error);
      }
    };
    if (isOpen && clinicId) fetchClinic();
  }, [isOpen, clinicId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-white p-6 rounded-lg w-full max-w-lg overflow-y-auto max-h-[80vh]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-sky-600">Update Clinic</h2>
          <FaTimes className="text-sky-600 cursor-pointer" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Clinic Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="tel"
            placeholder="Contact Phone"
            value={formData.contact.phone}
            onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="email"
            placeholder="Contact Email"
            value={formData.contact.email}
            onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            placeholder="Address Line 1"
            value={formData.address.line1}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={formData.address.city}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={formData.address.state}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={formData.address.postal_code}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postal_code: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={formData.address.country}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="number"
            placeholder="Latitude"
            value={formData.address.location.lat}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, location: { ...formData.address.location, lat: parseFloat(e.target.value) } } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="number"
            placeholder="Longitude"
            value={formData.address.location.lng}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, location: { ...formData.address.location, lng: parseFloat(e.target.value) } } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="time"
            placeholder="Monday Open"
            value={formData.working_hours.monday.open}
            onChange={(e) => setFormData({ ...formData, working_hours: { monday: { ...formData.working_hours.monday, open: e.target.value } } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="time"
            placeholder="Monday Close"
            value={formData.working_hours.monday.close}
            onChange={(e) => setFormData({ ...formData, working_hours: { monday: { ...formData.working_hours.monday, close: e.target.value } } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <select
            value={formData.settings.time_zone}
            onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, time_zone: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            {/* Add more time zones as needed */}
          </select>
          <select
            value={formData.settings.currency}
            onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, currency: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            {/* Add more currencies as needed */}
          </select>
          <select
            value={formData.settings.language}
            onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, language: e.target.value } })}
            className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            {/* Add more languages as needed */}
          </select>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.settings.telemedicine_enabled}
              onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, telemedicine_enabled: e.target.checked } })}
              className="h-4 w-4 text-sky-500 focus:ring-sky-500 border-sky-300 rounded"
            />
            <span>Enable Telemedicine</span>
          </label>
          <button
            type="submit"
            className="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-600 transition"
          >
            Update
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateModel;