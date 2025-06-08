'use client';
import { useState, useContext, createContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSearch, FiBell, FiSun, FiMoon, FiSettings } from 'react-icons/fi';
import { BiChevronDown, BiLogOut, BiUser } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';
import Sidebar from '@/app/components/Sidebar';
import { useAuth } from './AuthContext';

interface LayoutContextProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

interface ProfileTypes {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_pic?: string; // Optional profile picture field
}

const LayoutContext = createContext<LayoutContextProps | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const contextValue = {
    isSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
    closeSidebar: () => setIsSidebarOpen(false),
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useLayout();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileTypes | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'patient',
        profile_pic: user.profile_pic || '/default-profile.png', // Fallback profile picture
      });
    }
    
  }, [user]);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <header className="lg:hidden fixed w-full top-0 z-50 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-[var(--button-bg)] hover:bg-gray-200 dark:hover:bg-gray-600 text-[var(--icon-color)]"
          >
            {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--button-bg)] hover:bg-gray-200 dark:hover:bg-gray-600 text-[var(--icon-color)]"
            >
              {theme === 'light' ? <FiMoon className="w-6 h-6" /> : <FiSun className="w-6 h-6" />}
            </button>
            <button className="p-2 rounded-full bg-[var(--button-bg)] hover:bg-gray-200 dark:hover:bg-gray-600 text-[var(--icon-color)]">
              <FiBell className="w-6 h-6" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500" />
          </div>
        </div>
      </header>

      <header className="hidden lg:block fixed left-72 right-0 top-0 z-40 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between h-16 px-8">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 w-5 h-5 text-[var(--icon-color)]" />
              <input
                type="text"
                placeholder="Search patients, doctors..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--button-bg)] hover:bg-gray-200 dark:hover:bg-gray-600 text-[var(--icon-color)]"
            >
              {theme === 'light' ? <FiMoon className="w-6 h-6" /> : <FiSun className="w-6 h-6" />}
            </button>
            <button className="p-2 rounded-full bg-[var(--button-bg)] hover:bg-gray-200 dark:hover:bg-gray-600 text-[var(--icon-color)] relative">
              <FiBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-[var(--bg-secondary)]" />
            </button>
            <div className="relative inline-block text-left" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex cursor-pointer items-center space-x-3 focus:outline-none hover:scale-105 transition-transform"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 shadow-md overflow-hidden flex items-center justify-center">
                  <Image
                    src={profileData?.profile_pic || '/default-profile.png'}
                    height={40}
                    width={40}
                    alt="profile"
                    className="rounded-full object-cover h-full w-full"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="font-medium text-[var(--text-primary)]">
                    {profileData?.name || 'User'}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] capitalize">
                    {profileData?.role || 'User'}
                  </p>
                </div>
                <BiChevronDown className="w-5 h-5 text-gray-500" />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20"
                  >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      <li>
                        <button
                          onClick={() => {
                            const role = profileData?.role;
                            if (!role) return;
                            const roleRoutes: { [key: string]: string } = {
                              admin: '/admin/profile',
                              doctor: '/doctor/profile',
                              patient: '/patient/profile',
                            };
                            const route = roleRoutes[role];
                            if (route) {
                              router.push(route);
                              setOpen(false);
                            }
                          }}
                          className="flex cursor-pointer items-center w-full px-4 py-2 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <BiUser className="w-5 h-5" />
                          <span>Profile</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className="flex cursor-pointer items-center w-full px-4 py-2 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FiSettings className="w-5 h-5" />
                          <span>Settings</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push('/auth/logout');
                          }}
                          className="flex cursor-pointer items-center w-full px-4 py-2 gap-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <BiLogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="fixed top-0 left-0 z-50">
        <Sidebar role={profileData?.role || 'patient'} />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <main className="pt-16 lg:pt-0 lg:pl-72 transition-all duration-300">
        <div className="p-6 lg:p-8 min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}