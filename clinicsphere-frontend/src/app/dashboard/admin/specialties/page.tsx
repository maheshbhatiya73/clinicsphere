'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaStar, FaClock, FaDollarSign } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { getAllAdminSpecialties } from '@/app/lib/api/api';
import CreateModal from './CreateModel';
import DeleteModal from './DeleteModel';
import UpdateModal from './UpdateModel'

interface Specialty {
  _id: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  duration: string;
  price: string;
}

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    fetchSpecialties();
  }, [page]);

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }
      const data = await getAllAdminSpecialties(token, page, limit);
      setSpecialties(data);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch specialties');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsUpdateOpen(true);
  };

  const handleDelete = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsDeleteOpen(true);
  };

  return (
    <div className="">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sky-800">Specialties Management</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg shadow hover:bg-sky-600 transition"
          >
            <FaPlus /> Add Specialty
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-sky-500 text-4xl" />
          </div>
        ) : specialties.length === 0 ? (
          <p className="text-center text-sky-700 text-lg">No specialties found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {specialties.map((specialty) => (
              <motion.div
                key={specialty._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition border border-gray-100"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold text-sky-800">{specialty.title}</h2>
                <p className="text-sky-600 mt-2 line-clamp-3">{specialty.description}</p>

                <div className="mt-4 flex flex-col gap-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" /> {specialty.rating} ({specialty.reviews} reviews)
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-sky-500" /> Duration: {specialty.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="text-green-600" /> Price: {specialty.price}
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleEdit(specialty)}
                    className="text-sky-500 hover:text-sky-700"
                  >
                    <FaEdit size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(specialty)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-sky-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sky-800">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-sky-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isCreateOpen && (
          <CreateModal
            onClose={() => setIsCreateOpen(false)}
            onSuccess={() => {
              fetchSpecialties();
              setIsCreateOpen(false);
            }}
          />
        )}
        {isUpdateOpen && selectedSpecialty && (
          <UpdateModal
            specialtyId={selectedSpecialty._id} 
            specialty={selectedSpecialty}
            onClose={() => setIsUpdateOpen(false)}
            onSuccess={() => {
              fetchSpecialties();
              setIsUpdateOpen(false);
            }}
          />
        )}

        {isDeleteOpen && selectedSpecialty && (
          <DeleteModal
            specialty={selectedSpecialty}
            onClose={() => setIsDeleteOpen(false)}
            onSuccess={() => {
              fetchSpecialties();
              setIsDeleteOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
