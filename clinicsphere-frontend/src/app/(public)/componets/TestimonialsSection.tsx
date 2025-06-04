import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaPlay, FaStar, FaRegStar, FaHeartbeat, FaUserInjured, FaLaptopMedical } from 'react-icons/fa';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const testimonials = [
    {
      id: 1,
      name: "Robert Johnson",
      role: "Heart Surgery Patient",
      quote: "The care I received at ClinicSphere was exceptional. Dr. Johnson's expertise gave me a second chance at life. The entire team made me feel safe and supported throughout my recovery journey.",
      rating: 5,
      videoId: "dQw4w9WgXcQ",
      before: "Severe heart condition",
      after: "Full recovery in 6 months",
      image: "/images/patient1.jpg"
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Neurology Patient",
      quote: "After struggling with migraines for years, the neurology team at ClinicSphere finally found the root cause. Their personalized approach changed my life. I'm now migraine-free for the first time in a decade!",
      rating: 5,
      videoId: "dQw4w9WgXcQ",
      before: "Chronic migraines",
      after: "Migraine-free for 1 year",
      image: "/images/patient2.jpg"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Orthopedics Patient",
      quote: "The knee replacement surgery and rehabilitation program at ClinicSphere got me back to hiking in just 4 months. The physical therapists were amazing - they pushed me just enough to make progress without pain.",
      rating: 4.5,
      videoId: "dQw4w9WgXcQ",
      before: "Severe knee arthritis",
      after: "Back to hiking in 4 months",
      image: "/images/patient3.jpg"
    },
  ];

  const stats = [
    { value: "98%", label: "Patient Satisfaction", icon: <FaHeartbeat className="text-3xl" /> },
    { value: "24/7", label: "Patient Support", icon: <FaUserInjured className="text-3xl" /> },
    { value: "95%", label: "Telehealth Success", icon: <FaLaptopMedical className="text-3xl" /> },
  ];

  const renderStars = (rating) => {
    const stars = [];
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

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Patient Success Stories
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hear from our patients about their healthcare journeys and outcomes
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 h-full">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Patient Testimonials</h3>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full ${
                        activeTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col md:flex-row gap-8"
                >
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-40 h-40 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        <FaUserInjured className="text-6xl text-blue-600" />
                      </div>
                      
                      <button 
                        onClick={() => setShowVideo(true)}
                        className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
                      >
                        <FaPlay />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex mb-4">
                      {renderStars(testimonials[activeTestimonial].rating)}
                    </div>
                    
                    <div className="text-2xl text-gray-800 mb-4">
                      <FaQuoteLeft className="text-blue-200 mb-2" />
                      <p className="italic">{testimonials[activeTestimonial].quote}</p>
                    </div>
                    
                    <div className="mt-6">
                      <div className="font-bold text-gray-800 text-lg">
                        {testimonials[activeTestimonial].name}
                      </div>
                      <div className="text-blue-600">
                        {testimonials[activeTestimonial].role}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Before</div>
                        <div className="font-bold">{testimonials[activeTestimonial].before}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">After</div>
                        <div className="font-bold text-green-700">{testimonials[activeTestimonial].after}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">By the Numbers</h3>
              
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-blue-100">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 text-center border border-blue-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready for Your Success Story?</h3>
              <p className="text-gray-600 mb-6">
                Begin your journey to better health with our expert team
              </p>
              
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all">
                  Book Appointment
                </button>
                <button className="w-full bg-white text-blue-600 border border-blue-200 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all">
                  Call Now: (123) 456-7890
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        <AnimatePresence>
          {showVideo && (
            <motion.div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideo(false)}
            >
              <motion.div 
                className="bg-black rounded-xl overflow-hidden w-full max-w-4xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="aspect-video w-full bg-gray-900 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-5xl mb-4">🎥</div>
                    <p>Patient testimonial video would play here</p>
                    <p className="text-gray-400 mt-2">Click outside to close</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TestimonialsSection;