import { JSX, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaStethoscope, FaStar, FaRegStar, FaCalendarAlt, FaClock, FaArrowRight, FaHeart, FaRegHeart, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { getAllDoctors } from '@/app/lib/api/api';

// Define the Doctor type based on API response
interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  appointmentFee: number;
  consultationDuration: number;
  clinicAddress: string;
  bio: string;
  // Fields not in API but required by component
  rating: number;
  reviews: number;
  availability: string;
  nextAvailable: string;
  isFeatured?: boolean;
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

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await getAllDoctors();
        // Filter valid doctors and map to component's Doctor type
        const validDoctors: Doctor[] = response
          .filter((item: any) => item.specialization && item.role === 'doctor') // Only include actual doctors
          .map((item: any) => ({
            _id: item._id,
            name: item.name,
            specialization: item.specialization,
            experienceYears: item.experienceYears,
            appointmentFee: item.appointmentFee,
            consultationDuration: item.consultationDuration,
            clinicAddress: item.clinicAddress,
            bio: item.bio,
            // Default or derived values for missing fields
            rating: 4.0, // Placeholder: Replace with actual rating if available
            reviews: 0, // Placeholder: Replace with actual reviews if available
            availability: 'Mon-Fri, 9 AM - 5 PM', // Placeholder: Adjust as needed
            nextAvailable: 'Tomorrow, 10:00 AM', // Placeholder: Adjust as needed
            isFeatured: false, // Placeholder: Adjust based on criteria
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

  const renderStars = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaRegStar key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  const filteredDoctors =
    activeFilter === 'all'
      ? doctors
      : doctors.filter((doctor) => doctor.specialization.toLowerCase() === activeFilter);

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Medical Experts
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our team of experienced specialists is dedicated to providing the highest quality care
          </motion.p>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => setActiveFilter(specialty.id)}
              className={`px-5 py-2.5 rounded-full flex items-center transition-all duration-300 ${
                activeFilter === specialty.id
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
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-white/50 transition-all duration-300 ${
                  hoveredCard === doctor._id ? 'shadow-2xl scale-[1.02] border-blue-200' : ''
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
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <FaUserMd className="text-6xl text-blue-600" />
                      </div>
                      {doctor.isFeatured && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          TOP RATED
                        </div>
                      )}
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
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {doctor.experienceYears}+ years
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">{renderStars(doctor.rating)}</div>
                    <span className="text-gray-600">
                      {doctor.rating} ({doctor.reviews} reviews)
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2" />
                        <span>Availability:</span>
                      </div>
                      <span className="font-medium">{doctor.availability}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      <span>appointmentFee:</span>
                      <span className="ml-2 font-medium text-blue-600">{doctor.appointmentFee}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center">
                      Book Appointment
                      <FaArrowRight className="ml-2 text-sm" />
                    </button>
                    <div className="flex space-x-2">
                      <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                        <FaLinkedinIn />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors">
                        <FaTwitter />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50+', label: 'Medical Experts' },
              { value: '24/7', label: 'Emergency Care' },
              { value: '98%', label: 'Patient Satisfaction' },
              { value: '50k+', label: 'Patients Treated' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Ready to book your appointment?</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Our team is ready to provide you with exceptional care. Book online now or contact our friendly staff.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              Book Appointment Online
              <FaArrowRight className="ml-3" />
            </button>
            <button className="bg-white text-blue-600 border-2 border-blue-200 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all duration-300">
              Call Now: (123) 456-7890
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorsSection;