'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getAllAdminDoctors, getAllAdminUsers, getAllDoctorPatients, User } from '@/app/lib/api/api';
import CreateModal from './CreateModal';
import UpdateModal from './UpdateModal';
import DeleteModal from './DeleteModal';
import { useAuth } from '@/app/lib/context/AuthContext';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { token } = useAuth();

  const fetchUsers = async () => {
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }
    try {
      const response = await getAllDoctorPatients(token, page, limit);
      setUsers(response);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, token]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto p-6  min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-sky-900">Patients Management</h1>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#0284c7' }}
          whileTap={{ scale: 0.95 }}
          className="bg-sky-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium text-sm shadow-lg shadow-sky-600/30 transition-colors"
          onClick={() => setIsCreateOpen(true)}
        >
          <FaPlus /> Add User
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative"
        >
          <FaSearch className="absolute top-3.5 left-4 text-sky-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border border-sky-200 text-sky-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300/50 transition-all duration-300 placeholder:text-sky-400/70"
          />
          <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
        </motion.div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-200/30">
        <table className="min-w-full table-auto">
          <thead className="bg-sky-100/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Created At</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                  className="border-b border-sky-200/30 hover:bg-sky-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sky-900 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sky-900">{user.email}</td>
                  <td className="px-6 py-4 text-sky-900">{user.role}</td>
                  <td className="px-6 py-4 text-sky-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1, color: '#0284c7' }}
                      whileTap={{ scale: 0.9 }}
                      className="text-sky-600 font-medium hover:underline"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsUpdateOpen(true);
                      }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, color: '#dc2626' }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-600 font-medium hover:underline"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteOpen(true);
                      }}
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <p className="text-sky-800 font-medium text-sm">
          Showing {filteredUsers.length} of {total} users
        </p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#e0f2fe' }}
            whileTap={{ scale: 0.95 }}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-6 py-2.5 bg-sky-100 text-sky-900 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#e0f2fe' }}
            whileTap={{ scale: 0.95 }}
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-6 py-2.5 bg-sky-100 text-sky-900 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </motion.button>
        </div>
      </div>

      {/* Modals */}
      <CreateModal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); fetchUsers(); }} />
      <UpdateModal
        isOpen={isUpdateOpen}
        onClose={() => { setIsUpdateOpen(false); fetchUsers(); }}
        user={selectedUser}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); fetchUsers(); }}
        userId={selectedUser?._id || ''}
      />
    </div>
  );
}