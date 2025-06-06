import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserMd, FaPhone, FaStethoscope, FaUserFriends, FaInfoCircle, FaEnvelope, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        interface DropdownRef {
            contains(node: Node): boolean;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                (dropdownRef.current as unknown as DropdownRef).contains(event.target as Node)
            ) {
            } else {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { name: 'Home', href: '/', icon: <FaUserMd /> },
        { name: 'Services', href: '/services', icon: <FaStethoscope /> },
        {
            name: 'Specialties',
            subItems: [
                { name: 'Cardiology', href: '/cardiology' },
                { name: 'Pediatrics', href: '/pediatrics' },
                { name: 'Neurology', href: '/neurology' },
                { name: 'Orthopedics', href: '/orthopedics' },
            ]
        },
        { name: 'Doctors', href: '/doctors', icon: <FaUserFriends /> },
        { name: 'About', href: '/about', icon: <FaInfoCircle /> },
        { name: 'Contact', href: '/contact', icon: <FaEnvelope /> },
    ];

    const menuVariants = {
        closed: {
            y: '-100%',
            opacity: 0,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.05,
                when: "afterChildren"
            }
        },
        open: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: {
            y: 20,
            opacity: 0,
            transition: { duration: 0.3 }
        },
        open: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const hoverVariants = {
        hover: {
            scale: 1.05,
            y: -3,
            textShadow: "0px 0px 8px rgba(11, 163, 80, 0.6)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15
            }
        }
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-6 bg-white/90 backdrop-blur-xl shadow-xl' : 'py-4 bg-transparent'}`}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-3 group relative">
                    <motion.div
                        className="relative flex items-center justify-center"

                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <FaUserMd className="relative text-[#0ba350] text-5xl drop-shadow-xl group-hover:drop-shadow-2xl transition-all duration-300" />
                    </motion.div>
                    <motion.span
                        className="text-4xl font-black bg-gradient-to-r from-[#0ba350] to-[#0e7c3a] bg-clip-text text-transparent tracking-tight drop-shadow"

                    >
                        ClinicSphere
                    </motion.span>
                </Link>
                <nav className="hidden lg:flex space-x-1 items-center">
                    {navItems.map((item: any, index: any) => (
                        <div key={index} className="relative" onMouseEnter={() => setHoveredItem(index)} onMouseLeave={() => setHoveredItem(null)}>
                            {item.href ? (
                                <Link href={item.href}>
                                    <motion.div
                                        className="relative px-5 py-3 rounded-lg"
                                        variants={hoverVariants}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="flex items-center gap-2 text-gray-700 font-medium group">
                                            {item.icon && <span className="text-[#0ba350]">{item.icon}</span>}
                                            <span>{item.name}</span>
                                        </span>
                                        {hoveredItem === index && (
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0ba350] to-[#0e7c3a] rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                layoutId="hoverIndicator"
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            ) : (
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-2 px-5 py-3 text-gray-700 font-medium rounded-lg"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span>{item.name}</span>
                                        <motion.span
                                            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <FaChevronDown className="text-xs" />
                                        </motion.span>
                                    </button>
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                ref={dropdownRef}
                                                className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            >
                                                {item.subItems.map((subItem: any, subIndex: number) => (
                                                    <Link key={subIndex} href={subItem.href}>
                                                        <motion.div
                                                            className="px-5 py-3 hover:bg-[#0ba350]/10 flex items-center gap-3 group"
                                                            whileHover={{ x: 5 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <span className="h-2 w-2 bg-[#0ba350] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                            <span className="text-gray-700 group-hover:text-[#0e7c3a] font-medium">
                                                                {subItem.name}
                                                            </span>
                                                        </motion.div>
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    ))}

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="ml-4"
                    >
                        <Link
                            href="/appointment"
                            className="relative bg-gradient-to-r from-[#0ba350] to-[#0e7c3a] text-white px-7 py-3 rounded-full shadow-lg flex items-center space-x-2 font-semibold text-lg overflow-hidden group"
                        >
                            <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-[#0e7c3a] to-[#0ba350] opacity-0 group-hover:opacity-100 transition-all duration-500"
                                animate={{
                                    x: ["-100%", "100%"],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <span className="relative flex items-center gap-2">
                                <FaPhone className="text-white" />
                                <span>Book Appointment</span>
                            </span>
                        </Link>
                        

                    </motion.div>
                    <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="ml-2"
                        >
                            <Link
                                href="/login"
                                className="border border-[#0ba350] text-[#0ba350] px-6 py-3 rounded-full font-semibold transition-all hover:bg-[#0ba350] hover:text-white shadow-md"
                            >
                                Login
                            </Link>
                        </motion.div>
                </nav>
                <motion.button
                    className="lg:hidden text-[#0ba350] focus:outline-none p-2 rounded-full hover:bg-[#0ba350]/10 transition"
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
                </motion.button>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="lg:hidden fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-white to-[#f0fdf4] z-40 flex flex-col items-center pt-24 pb-10 px-4 shadow-2xl overflow-y-auto"
                    >
                        <div className="w-full max-w-md">
                            {navItems.map((item: any, index: number) => (
                                <motion.div
                                    key={index}
                                    className="w-full mb-2"
                                    variants={itemVariants}
                                >
                                    {item.href ? (
                                        <Link href={item.href} onClick={() => setIsOpen(false)}>
                                            <div
                                                className="w-full py-5 px-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm flex items-center gap-3 group"
                                            >
                                                {item.icon && <span className="text-[#0ba350] text-xl">{item.icon}</span>}
                                                <span className="text-gray-700 font-medium text-lg">{item.name}</span>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="w-full">
                                            <div className="w-full py-5 px-6 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm flex items-center justify-between">
                                                <span className="text-gray-700 font-medium text-lg">{item.name}</span>
                                                <FaChevronDown />
                                            </div>
                                            <div className="pl-6 mt-1">
                                                {item.subItems.map((subItem: any, subIndex: number) => (
                                                    <Link key={subIndex} href={subItem.href} onClick={() => setIsOpen(false)}>
                                                        <motion.div
                                                            className="py-3 px-4 rounded-lg flex items-center gap-3 group"
                                                            whileHover={{ x: 5 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <span className="h-2 w-2 bg-[#0ba350] rounded-full"></span>
                                                            <span className="text-gray-600">{subItem.name}</span>
                                                        </motion.div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            <motion.div
                                className="mt-6"
                                variants={itemVariants}
                            >
                                <Link
                                    href="/appointment"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-4 bg-gradient-to-r from-[#0ba350] to-[#0e7c3a] text-white rounded-xl shadow-lg text-center font-bold text-lg relative overflow-hidden group"
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-[#0e7c3a] to-[#0ba350] opacity-0 group-hover:opacity-100 transition-all duration-500"
                                        animate={{
                                            x: ["-100%", "100%"],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                    <span className="relative flex items-center justify-center gap-2">
                                        <FaPhone className="text-white" />
                                        <span>Book Appointment</span>
                                    </span>
                                </Link>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="ml-2"
                                >
                                    <Link
                                        href="/login"
                                        className="border border-[#0ba350] text-[#0ba350] px-6 py-3 rounded-full font-semibold transition-all hover:bg-[#0ba350] hover:text-white shadow-md"
                                    >
                                        Login
                                    </Link>
                                </motion.div>

                            </motion.div>
                        </div>

                        <motion.div
                            className="mt-auto pt-10 text-center text-gray-500 text-sm"
                            variants={itemVariants}
                        >
                            © {new Date().getFullYear()} ClinicSphere. All rights reserved.
                        </motion.div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;