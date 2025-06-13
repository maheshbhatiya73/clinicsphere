'use client';
import { JSX, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserMd, FaStethoscope, FaCalendarAlt, FaClock, FaArrowRight,
  FaHeart, FaRegHeart, FaLinkedinIn, FaTwitter, FaMoneyBill, FaTimes,
  FaBrain,
  FaChild,
  FaBone,
  FaSpa
} from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { getAllDoctors, createPatientAppointment } from '@/app/lib/api/api';
import { useAuth } from '@/app/lib/context/AuthContext';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  appointmentFee: number;
  consultationDuration: number;
  clinicAddress: string;
  bio: string;
}

const DoctorsSection = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    startTime: '',
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const { token } = useAuth();

  // Specialty icons mapping
  const specialtyIcons: Record<string, JSX.Element> = {
    cardiology: <FaHeart className="mr-2 text-red-500" />,
    neurology: <FaBrain className="mr-2 text-blue-500" />,
    pediatrics: <FaChild className="mr-2 text-pink-500" />,
    orthopedics: <FaBone className="mr-2 text-gray-500" />,
    dermatology: <FaSpa className="mr-2 text-green-500" />,
    all: <FaStethoscope className="mr-2" />,
  };

  const specialties = [
    { id: 'all', name: 'All Specialties', icon: specialtyIcons.all },
    { id: 'cardiology', name: 'Cardiology', icon: specialtyIcons.cardiology },
    { id: 'neurology', name: 'Neurology', icon: specialtyIcons.neurology },
    { id: 'pediatrics', name: 'Pediatrics', icon: specialtyIcons.pediatrics },
    { id: 'orthopedics', name: 'Orthopedics', icon: specialtyIcons.orthopedics },
    { id: 'dermatology', name: 'Dermatology', icon: specialtyIcons.dermatology },
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await getAllDoctors();
        const currentYear = new Date().getFullYear();

        const validDoctors: Doctor[] = response
          .filter((item: any) => item.specialization && item.role === 'doctor')
          .map((item: any) => ({
            _id: item._id,
            name: item.name,
            specialization: item.specialization,
            experienceYears: currentYear - item.experienceYears,
            appointmentFee: item.appointmentFee,
            consultationDuration: item.consultationDuration,
            clinicAddress: item.clinicAddress,
            bio: item.bio,
          }));

        setDoctors(validDoctors);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch doctors. Please try again later.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const toggleFavorite = (_id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [_id]: !prev[_id],
    }));
  };

  const openModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentForm({ date: '', startTime: '', reason: '' });
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setAppointmentForm({ date: '', startTime: '', reason: '' });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setAppointmentForm((prev) => ({ ...prev, date: formattedDate }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setFormError('Please log in to book an appointment.');
      return;
    }
    if (!selectedDoctor) {
      setFormError('No doctor selected.');
      return;
    }
    if (!appointmentForm.date || !appointmentForm.startTime || !appointmentForm.reason) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      const startDateTime = new Date(`${appointmentForm.date}T${appointmentForm.startTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + selectedDoctor.consultationDuration * 60 * 1000);

      const appointmentData = {
        doctorId: selectedDoctor._id,
        appointmentDate: appointmentForm.date,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        reason: appointmentForm.reason,
        status: 'scheduled',
      };

      await createPatientAppointment(appointmentData, token);
      setFormSuccess('Appointment booked successfully!');
      setAppointmentForm({ date: '', startTime: '', reason: '' });
      setTimeout(closeModal, 2000);
    } catch (error: any) {
      setFormError(error.message || 'Failed to book appointment. Please try again.');
    }
  };

  const filteredDoctors =
    activeFilter === 'all'
      ? doctors
      : doctors.filter((doctor) => doctor.specialization.toLowerCase() === activeFilter);

  // Animation variants for staggered card animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Specialty Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {specialties.map((specialty) => (
            <motion.button
              key={specialty.id}
              onClick={() => setActiveFilter(specialty.id)}
              className={`px-6 py-3 rounded-full flex items-center transition-all duration-300 text-sm font-medium ${activeFilter === specialty.id
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg'
                  : 'bgexplosion-2 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {specialty.icon}
              {specialty.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="text-center text-xl text-gray-600 dark:text-gray-300 animate-pulse">
            Loading doctors...
          </div>
        ) : error ? (
          <div className="text-center text-xl text-red-600 dark:text-red-400">{error}</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center text-xl text-gray-600 dark:text-gray-300">
            No doctors found for this specialty.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor._id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 ${hoveredCard === doctor._id ? 'shadow-2xl scale-[1.02] border-indigo-300 dark:border-indigo-600' : ''
                  } backdrop-blur-sm bg-opacity-80`}
                variants={cardVariants}
                onHoverStart={() => setHoveredCard(doctor._id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 h-60 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-lg">
                      <FaUserMd className="text-7xl text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <motion.button
                    onClick={() => toggleFavorite(doctor._id)}
                    className="absolute top-4 right-4 bg-white dark:bg-gray-700 p-2.5 rounded-full shadow-md hover:bg-pink-50 dark:hover:bg-pink-900 text-pink-500 dark:text-pink-400 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {favorites[doctor._id] ? (
                      <FaHeart className="text-xl" />
                    ) : (
                      <FaRegHeart className="text-xl" />
                    )}
                  </motion.button>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{doctor.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">{doctor.bio}</p>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        Experience:
                      </div>
                      <span className="font-medium">{doctor.experienceYears} years</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <FaMoneyBill className="mr-2" />
                      Fee:
                      <span className="ml-2 font-medium text-indigo-600 dark:text-indigo-400">₹{doctor.appointmentFee}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <FaClock className="mr-2" />
                      Duration:
                      <span className="ml-2 font-medium text-indigo-600 dark:text-indigo-400">{doctor.consultationDuration} min</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <motion.button
                      onClick={() => openModal(doctor)}
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Appointment
                      <FaArrowRight className="ml-2 text-sm" />
                    </motion.button>
                    <div className="flex space-x-3">
                      <motion.button
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaLinkedinIn />
                      </motion.button>
                      <motion.button
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-blue-400 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTwitter />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Appointment Booking Modal */}
        <AnimatePresence>
          {isModalOpen && selectedDoctor && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 h-170 rounded-2xl p-8 max-w-3xl w-full relative shadow-2xl backdrop-blur-sm bg-opacity-90"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              >
                <motion.button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-xl" />
                </motion.button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Book Appointment with {selectedDoctor.name}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Appointment Date
                    </label>
                    <DayPicker
                      mode="single"
                      selected={appointmentForm.date ? new Date(appointmentForm.date) : undefined}
                      onSelect={handleDateSelect}
                      disabled={{ before: new Date() }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 w-full max-w-md sm:max-w-lg mx-auto"
                      classNames={{
                        day: 'p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900',
                        day_selected: 'bg-indigo-500 text-white',
                        day_disabled: 'text-gray-400 dark:text-gray-600',
                      }}
                    />

                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={appointmentForm.startTime}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for Appointment
                    </label>
                    <textarea
                      name="reason"
                      value={appointmentForm.reason}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-700"
                      rows={4}
                      required
                    />
                  </div>
                  {formError && (
                    <motion.div
                      className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formError}
                    </motion.div>
                  )}
                  {formSuccess && (
                    <motion.div
                      className="mb-4 p-3 bg-green-100 darkබ dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formSuccess}
                    </motion.div>
                  )}
                  <div className="flex justify-end gap-3">
                    <motion.button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full font-medium hover:from-indigo-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Confirm Appointment
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DoctorsSection;
