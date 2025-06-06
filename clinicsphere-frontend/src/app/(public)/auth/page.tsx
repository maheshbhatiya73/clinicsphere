"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaUserInjured, FaLock, FaEnvelope, FaUser, FaSignInAlt, FaUserPlus, FaHospital, FaHeartbeat, FaStethoscope } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/app/lib/context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isDoctorSignup, setIsDoctorSignup] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });

    const { login, register, loading, error } = useAuth(); 
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        if (isLogin) {
            try {
                await login(formData.email, formData.password);
            } catch (err) {
            }
        } else {
            if (formData.password !== formData.confirmPassword) {
                return;
            }
            try {
                await register(formData.name, formData.email, formData.password, isDoctorSignup ? 'doctor' : 'patient');
              
            } catch (err) {
            }
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ email: '', password: '', confirmPassword: '', name: '' }); 
    };

    const toggleSignupType = (isDoctor: boolean) => {
        setIsDoctorSignup(isDoctor);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                <Image
                    src="/images/auth.jpg"
                    alt="Healthcare background"
                    fill
                    style={{ objectFit: 'cover', filter: 'blur(8px)' }}
                    priority={true}
                    className="z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-indigo-700/30 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20 p-12">
                    <div className="text-white max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8"
                        >
                            <div className="flex items-center mb-4">
                                <div className="bg-white/20 p-3 rounded-full mr-4">
                                    <FaHospital className="text-3xl" />
                                </div>
                                <h1 className="text-4xl font-bold">ClinicSphere</h1>
                            </div>
                            <p className="text-xl">Your journey to better health starts here</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="space-y-6"
                        >
                            {[
                                { icon: <FaUserMd />, text: "Access to top medical specialists" },
                                { icon: <FaStethoscope />, text: "Manage appointments online" },
                                { icon: <FaUserInjured />, text: "Secure health records portal" },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="bg-white/20 p-3 rounded-full mr-4">
                                        {item.icon}
                                    </div>
                                    <p>{item.text}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    className="absolute top-20 left-20 w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <FaUserMd className="text-white text-xl" />
                </motion.div>
                <motion.div
                    className="absolute bottom-40 right-40 w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <FaHeartbeat className="text-white text-2xl" />
                </motion.div>
                <motion.div
                    className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center"
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <FaStethoscope className="text-white text-xl" />
                </motion.div>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-full p-1 flex border border-gray-200 shadow-sm">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${isLogin
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <FaSignInAlt className="mr-2" />
                                    Login
                                </div>
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${!isLogin
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <FaUserPlus className="mr-2" />
                                    Sign Up
                                </div>
                            </button>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isLogin ? (
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                                        <p className="text-gray-600">Sign in to access your account</p>
                                    </div>
                                    {error && (
                                        <div className="mb-4 text-red-600 text-center text-sm">
                                            {error}
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email address"
                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaLock className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Password"
                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                        disabled={loading}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                                </label>
                                                <a href="#" className="text-sm text-blue-600 hover:underline">
                                                    Forgot password?
                                                </a>
                                            </div>
                                            <button
                                                type="submit"
                                                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={loading}
                                            >
                                                {loading ? 'Signing In...' : 'Sign In'}
                                            </button>
                                        </div>
                                    </form>
                                    <div className="mt-6 text-center">
                                        <p className="text-gray-600">
                                            Don't have an account?{' '}
                                            <button
                                                onClick={toggleForm}
                                                className="text-blue-600 font-medium hover:underline"
                                                disabled={loading}
                                            >
                                                Create account
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                                        <p className="text-gray-600">Join our healthcare community</p>
                                    </div>
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-gray-100 rounded-full p-1 flex">
                                            <button
                                                onClick={() => toggleSignupType(false)}
                                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isDoctorSignup
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                                disabled={loading}
                                            >
                                                <div className="flex items-center">
                                                    <FaUserInjured className="mr-2" />
                                                    Patient
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => toggleSignupType(true)}
                                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isDoctorSignup
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                                disabled={loading}
                                            >
                                                <div className="flex items-center">
                                                    <FaUserMd className="mr-2" />
                                                    Doctor
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="mb-4 text-red-600 text-center text-sm">
                                            {error}
                                        </div>
                                    )}
                                    {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                                        <div className="mb-4 text-red-600 text-center text-sm">
                                            Passwords do not match
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaUser className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Full name"
                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email address"
                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaLock className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Password"
                                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FaLock className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        placeholder="Confirm password"
                                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                        required
                                                        disabled={loading}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                                                    </span>
                                                </label>
                                            </div>
                                            <button
                                                type="submit"
                                                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={loading}
                                            >
                                                {loading ? 'Creating Account...' : 'Create Account'}
                                            </button>
                                        </div>
                                    </form>
                                    <div className="mt-6 text-center">
                                        <p className="text-gray-600">
                                            Already have an account?{' '}
                                            <button
                                                onClick={toggleForm}
                                                className="text-blue-600 font-medium hover:underline"
                                                disabled={loading}
                                            >
                                                Sign in
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;