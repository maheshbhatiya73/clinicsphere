"use client";
import { fetchUserProfile } from '@/app/lib/api/api';
import { useAuth } from '@/app/lib/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaUserTag, FaHistory, FaSignOutAlt, FaRedo } from 'react-icons/fa';
import Image from 'next/image';
import DefaultAvatar from '../../../../../public/placeholder-profile.png'

interface ActivityLog {
  _id: string;
  action: string;
  timestamp: string;
}

interface UserProfile {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  activityLog?: ActivityLog[];
  createdAt?: string;
  updatedAt?: string;
}

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { token, logout } = useAuth();
  const maxRetries = 3;

  const fetchProfile = async () => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching profile with token:', token.substring(0, 10) + '...');
      const data = await fetchUserProfile(token);
      console.log('Fetched profile data:', data);
      setProfile(data);
    } catch (error: any) {
      console.error('Fetch error:', error.message);
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setError(`Failed to fetch profile. Retrying (${retryCount + 1}/${maxRetries})...`);
        setTimeout(fetchProfile, 2000);
      } else {
        setError('Failed to fetch profile after multiple attempts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleRetry = () => {
    setRetryCount(0);
    fetchProfile();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl max-w-8xl w-full p-10"
      >
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg font-medium mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-105"
            >
              <FaRedo /> Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-1 flex flex-col items-center bg-gradient-to-b from-indigo-50 to-white rounded-2xl p-8 shadow-lg"
            >
              <div className="relative w-40 h-40 mb-6">
                <Image
                  src={DefaultAvatar}
                  alt="Profile"
                  width={160}
                  height={160}
                  className="rounded-full object-cover border-4 border-indigo-200 shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                  {profile.role || 'N/A'}
                </div>
              </div>
              <h2 className="text-3xl font-bold text-indigo-900">{profile.name || 'N/A'}</h2>
              <p className="text-indigo-700 flex items-center gap-2 mt-2">
                <FaEnvelope className="text-indigo-500" /> {profile.email || 'N/A'}
              </p>
              <button
                onClick={logout}
                className="mt-6 flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-105"
              >
                <FaSignOutAlt /> Logout
              </button>
            </motion.div>

            {/* Profile Details & Activity Log */}
            <div className="col-span-2 space-y-8">
              {/* Profile Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-indigo-50 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-indigo-900 flex items-center gap-3">
                  <FaUserTag className="text-indigo-500" /> Profile Details
                </h3>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p className="text-indigo-800">
                    <span className="font-medium">User ID:</span> {profile._id || 'N/A'}
                  </p>
                  <p className="text-indigo-800">
                    <span className="font-medium">Created:</span> {formatDate(profile.createdAt)}
                  </p>
                  <p className="text-indigo-800">
                    <span className="font-medium">Last Updated:</span> {formatDate(profile.updatedAt)}
                  </p>
                </div>
              </motion.div>

              {/* Activity Log */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-indigo-50 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-indigo-900 flex items-center gap-3">
                  <FaHistory className="text-indigo-500" /> Activity Log
                </h3>
                <div className="mt-6 max-h-80 overflow-y-auto pr-4">
                  <AnimatePresence>
                    {profile.activityLog?.length ? (
                      profile.activityLog.map((log) => (
                        <motion.div
                          key={log._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-indigo-200 py-4"
                        >
                          <p className="text-indigo-800 font-medium">{log.action}</p>
                          <p className="text-sm text-indigo-600">{formatDate(log.timestamp)}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-indigo-600">No activity logs available.</p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminProfile;