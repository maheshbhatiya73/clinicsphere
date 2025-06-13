'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { getDoctorAppointments, Appointment, AppointmentResponse } from '@/app/lib/api/api';
import { useAuth } from '@/app/lib/context/AuthContext';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Fetch appointments
  const fetchAppointments = async () => {
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const response: AppointmentResponse = await getDoctorAppointments(page, limit, token);
      setAppointments(response.appointments);
      setTotal(response.total);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, limit, token]);

  // Filter appointments based on search input
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientId.name.toLowerCase().includes(search.toLowerCase()) ||
      appointment.patientId.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-sky-900">My Appointments</h1>
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
            placeholder="Search by patient name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-sky-50/50 border border-sky-200 text-sky-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300/50 transition-all duration-300 placeholder:text-sky-400/70"
          />
          <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-xl">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-sky-900 font-medium">Loading appointments...</div>
      )}

      {/* Table */}
      {!loading && filteredAppointments.length > 0 && (
        <div className="overflow-x-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-200/30">
          <table className="min-w-full table-auto">
            <thead className="bg-sky-100/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-800">Reason</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAppointments.map((appointment) => (
                  <motion.tr
                    key={appointment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="border-b border-sky-200/30 hover:bg-sky-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sky-900 font-medium">{appointment.patientId.name}</td>
                    <td className="px-6 py-4 text-sky-900">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sky-900">
                      {new Date(appointment.startTime).toLocaleTimeString()} -{' '}
                      {new Date(appointment.endTime).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-sky-900 capitalize">{appointment.status}</td>
                    <td className="px-6 py-4 text-sky-900">{appointment.reason || '-'}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* No Appointments Message */}
      {!loading && filteredAppointments.length === 0 && (
        <div className="text-center text-sky-900 font-medium">
          No appointments found.
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex justify-between items-center mt-8">
          <p className="text-sky-800 font-medium text-sm">
            Showing {filteredAppointments.length} of {total} appointments
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
      )}
    </div>
  );
}