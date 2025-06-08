// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getAllAdminUsers, User } from '@/app/lib/api/api';
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
  const { token } = useAuth()
  // Fetch users

   const fetchUsers = async () => {

    if(!token) {
        console.error('No token found. Please log in.');
        return;
    }
   
      try {
        const response = await getAllAdminUsers(token, page, limit);
        setUsers(response.users);
        setTotal(response.total);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

  useEffect(() => {
    alert('Fetching users with token: ' + token);

    fetchUsers();
  }, [page, limit]);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsCreateOpen(true)}
        >
          <FaPlus /> Add User
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-gray-800">{user.email}</td>
                  <td className="px-6 py-4 text-gray-800">{user.role}</td>
                  <td className="px-6 py-4 text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsUpdateOpen(true);
                      }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-600 hover:underline"
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
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">
          Showing {filteredUsers.length} of {total} users
        </p>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </motion.button>
        </div>
      </div>

      {/* Modals */}
      <CreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <UpdateModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        user={selectedUser}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        userId={selectedUser?._id || ''}
      />
    </div>
  );
}