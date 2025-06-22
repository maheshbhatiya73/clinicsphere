'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import CreateModel from './CreateModel';
import UpdateModel from './UpdateModel';
import DeleteModel from './DeleteModel';
import { getAllAdminClinics, createAdminClinic, updateAdminClinic, deleteAdminClinic } from '@/app/lib/api/api';


interface Clinic {
  id: string;
  name: string;
  contact: { phone: string; email: string };
  address: { line1: string; city: string; state: string; postal_code: string; country: string; location: { lat: number; lng: number } };
  working_hours: { monday: { open: string; close: string } };
  settings: { time_zone: string; currency: string; language: string; telemedicine_enabled: boolean };
}

const ClinicPage: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [token, setToken] = useState<string>(''); 


useEffect(() => {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    setToken(storedToken);
  }
}, []);
const fetchClinics = async () => {
  if (!token) return
      try {
        const data = await getAllAdminClinics(token);
        setClinics(data);
      } catch (error) {
        console.error('Fetch clinics error:', error);
      }
    };

  useEffect(() => {
    
    fetchClinics();
  }, [token]);

  const handleCreate = async (data: Clinic) => {  
    try {
      const newClinic = await createAdminClinic(data, token);
      if(newClinic){
      fetchClinics()

      }
    } catch (error) {
      console.error('Create clinic error:', error);
    }
  };

  const handleUpdate = async (data: Clinic) => {
    if (!selectedClinic) return;
    try {
      const updatedClinic = await updateAdminClinic(selectedClinic._id, data, token);
      setClinics(clinics.map((clinic) => (clinic.id === selectedClinic._id ? updatedClinic : clinic)));
    } catch (error) {
      console.error('Update clinic error:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedClinic) return;
    try {
      await deleteAdminClinic(selectedClinic._id, token);
      setClinics(clinics.filter((clinic) => clinic._id !== selectedClinic._id));
    } catch (error) {
      console.error('Delete clinic error:', error);
    }
  };

  const filteredClinics = clinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || clinic.address.city.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-sky-600 mb-6">Clinic Management</h1>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500" />
            <input
              type="text"
              placeholder="Search clinics by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Cities</option>
            <option value="delhi">Delhi</option>
            <option value="mumbai">Mumbai</option>
            {/* Add more cities as needed */}
          </select>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition"
          >
            <FaPlus />
            <span>Add Clinic</span>
          </button>
        </div>

        {/* Clinic List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 rounded-lg shadow-md border border-sky-200"
            >
              <h3 className="text-lg font-semibold text-sky-600">{clinic.name}</h3>
              <div className="text-gray-600 space-y-2">
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-sky-500" />
                  {clinic.address.line1}, {clinic.address.city}, {clinic.address.state}, {clinic.address.postal_code}, {clinic.address.country}
                </p>
                <p className="flex items-center">
                  <FaPhone className="mr-2 text-sky-500" />
                  {clinic.contact.phone}
                </p>
                <p className="flex items-center">
                  <FaEnvelope className="mr-2 text-sky-500" />
                  {clinic.contact.email}
                </p>
                <p className="flex items-center">
                  <FaClock className="mr-2 text-sky-500" />
                  Monday: {clinic.working_hours.monday.open} - {clinic.working_hours.monday.close}
                </p>
                <p>
                  Telemedicine: {clinic.settings.telemedicine_enabled ? 'Enabled' : 'Disabled'}
                </p>
                <p>Time Zone: {clinic.settings.time_zone}</p>
                <p>Currency: {clinic.settings.currency}</p>
                <p>Language: {clinic.settings.language}</p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedClinic(clinic);
                    setIsUpdateOpen(true);
                  }}
                  className="text-sky-500 hover:text-sky-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setSelectedClinic(clinic);
                    setIsDeleteOpen(true);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modals */}
      <CreateModel isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} />
      <UpdateModel
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        onUpdate={handleUpdate}
        clinicId={selectedClinic?._id || ''}
        token={token}
      />
      <DeleteModel
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={handleDelete}
        clinicName={selectedClinic?.name || ''}
      />
    </div>
  );
};

export default ClinicPage;