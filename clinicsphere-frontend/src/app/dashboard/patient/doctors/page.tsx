'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUserMd, FaStethoscope, FaCalendarAlt,
  FaClock, FaArrowRight, FaHeart, FaRegHeart,
  FaLinkedinIn, FaTwitter,
  FaMoneyBill
} from 'react-icons/fa';
import { getAllDoctors } from '@/app/lib/api/api';

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

  const specialties = [
    { id: 'all', name: 'All Specialties' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'neurology', name: 'Neurology' },
    { id: 'pediatrics', name: 'Pediatrics' },
    { id: 'orthopedics', name: 'Orthopedics' },
    { id: 'dermatology', name: 'Dermatology' },
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

  const filteredDoctors =
    activeFilter === 'all'
      ? doctors
      : doctors.filter((doctor) => doctor.specialization.toLowerCase() === activeFilter);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => setActiveFilter(specialty.id)}
              className={`px-5 py-2.5 rounded-full flex items-center transition-all duration-300 ${activeFilter === specialty.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
            >
              <FaStethoscope className="mr-2" />
              {specialty.name}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="text-center text-xl text-gray-600">Loading doctors...</div>
        ) : error ? (
          <div className="text-center text-xl text-red-600">{error}</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center text-xl text-gray-600">No doctors found for this specialty.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor._id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-white/50 transition-all duration-300 ${hoveredCard === doctor._id ? 'shadow-2xl scale-[1.02] border-blue-200' : ''
                  }`}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredCard(doctor._id)}
                onHoverEnd={() => setHoveredCard(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-56 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <FaUserMd className="text-6xl text-blue-600" />
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(doctor._id)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-pink-50 text-pink-500 transition-all"
                  >
                    {favorites[doctor._id] ? (
                      <FaHeart className="text-xl" />
                    ) : (
                      <FaRegHeart className="text-xl" />
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{doctor.specialization}</p>
                  <p className="text-sm text-gray-500 mb-4">{doctor.bio}</p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2" />
                        Experience:
                      </div>
                      <span className="font-medium">{doctor.experienceYears} years</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMoneyBill className="mr-2" />
                      Fee:
                      <span className="ml-2 font-medium text-blue-600">₹{doctor.appointmentFee}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <FaClock className="mr-2" />
                      Duration:
                      <span className="ml-2 font-medium text-indigo-600">{doctor.consultationDuration} min</span>
                    </div>

                  </div>

                  <div className="flex justify-between">
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center">
                      Book Appointment
                      <FaArrowRight className="ml-2 text-sm" />
                    </button>
                    <div className="flex space-x-2">
                      <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-600 hover:bg-blue-100">
                        <FaLinkedinIn />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-400 hover:bg-blue-100">
                        <FaTwitter />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;
