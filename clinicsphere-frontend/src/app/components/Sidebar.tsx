'use client';
import { useState, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayout } from '../lib/context/DefaultLayout';
import { adminNavItems, doctorNavItems, patientNavItems, logoutItem } from '@/app/lib/config/sidebarConfig';

interface NavItem {
  name: string;
  href?: string;
  icon: JSX.Element;
  submenu?: NavItem[];
}

interface SidebarProps {
  role: 'admin' | 'doctor' | 'patient';
}

export default function Sidebar({ role }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { isSidebarOpen, closeSidebar } = useLayout();
  const pathname = usePathname();

  const toggleMenu = (menuName: string) => {
    setOpenMenu(prev => (prev === menuName ? null : menuName));
  };
  const isMenuOpen = (menuName: string) => openMenu === menuName;

  const navItems: NavItem[] = role === 'admin' ? adminNavItems :
    role === 'doctor' ? doctorNavItems :
    role === 'patient' ? patientNavItems : [];

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 20 },
    },
  };

  const submenuVariants = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full font-inter">
      <div className="sticky top-0 z-10 pt-6 pb-4 ">
        <div className="flex items-center space-x-3 px-5">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-sky-500 to-teal-400 bg-clip-text">
            MediCare
          </h2>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-5 mt-2 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const isMainActive = item.href && pathname === item.href;
          return (
            <motion.div
              key={item.name}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={item.href || '#'}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 group
                  ${isMainActive
                    ? 'bg-sky-100/60 text-sky-600 shadow-md'
                    : 'hover:bg-sky-50/50 hover:shadow-lg hover:scale-105 hover:border-sky-300/50 '}
                `}
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault();
                    toggleMenu(item.name);
                  } else if (isMobile) {
                    closeSidebar();
                  }
                }}
                aria-label={item.name}
                aria-expanded={item.submenu ? isMenuOpen(item.name) : undefined}
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-lg bg-white/70 border border-sky-200/50 shadow-sm transform group-hover:scale-110 group-hover:bg-sky-100/60 transition-all">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-sky-500">
                    {item.name}
                  </span>
                </div>
                {item.submenu && (
                  <motion.div
                    animate={{ rotate: isMenuOpen(item.name) ? 180 : 0, scale: isMenuOpen(item.name) ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-500 group-hover:text-sky-400"
                  >
                    <FaChevronDown className="w-4 h-4" aria-hidden="true" />
                  </motion.div>
                )}
              </Link>
              {item.submenu && (
                <AnimatePresence initial={false}>
                  {isMenuOpen(item.name) && (
                    <motion.ul
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="ml-9 mt-2 space-y-1"
                      role="menu"
                    >
                      {item.submenu.map((subItem) => (
                        <motion.li
                          key={subItem.name}
                          variants={itemVariants}
                          role="menuitem"
                        >
                          <Link
                            href={subItem.href}
                            className={`flex items-center p-2 rounded-lg text-sm transition-all duration-200
                              ${pathname === subItem.href
                                ? 'bg-sky-100/50 text-sky-600 shadow-sm'
                                : 'text-gray-600 hover:bg-sky-50/40 hover:text-sky-500 hover:shadow-sm'}
                            `}
                            onClick={() => isMobile && closeSidebar()}
                            aria-label={subItem.name}
                          >
                            <span className="flex items-center mr-2 transform group-hover:scale-110 transition-transform">
                              {subItem.icon}
                            </span>
                            {subItem.name}
                            {pathname === subItem.href && (
                              <span className="w-2 h-2 ml-auto bg-sky-400 rounded-full animate-pulse" />
                            )}
                          </Link>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </nav>

      <div className="sticky bottom-0 pt-4 mt-auto border-t border-sky-200/50 bg-gradient-to-t from-white/80 to-sky-50/80 backdrop-blur-md">
        <Link
          href={logoutItem.href}
          className="flex items-center p-3 space-x-3 rounded-xl transition-all duration-300 group hover:bg-red-50/50 hover:shadow-lg hover:scale-105 hover:border-red-300/50 hover:border"
          onClick={() => isMobile && closeSidebar()}
          aria-label={logoutItem.name}
        >
          <span className="p-2 rounded-lg bg-white/70 border border-red-200/50 shadow-sm text-red-500 group-hover:scale-110 group-hover:bg-red-100/60 transition-all">
            {logoutItem.icon}
          </span>
          <span className="text-sm font-medium text-gray-800 group-hover:text-red-500">
            {logoutItem.name}
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        className="hidden lg:block w-72 text-gray-800 p-4 fixed h-screen shadow-xl z-50 border-r bg-gradient-to-b from-white/90 to-sky-50/90 backdrop-blur-2xl border-sky-200/50 overflow-hidden"
        initial={false}
        animate="visible"
        role="navigation"
        aria-label="Desktop sidebar"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              onClick={closeSidebar}
              aria-hidden="true"
            />
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed lg:hidden w-72 text-gray-800 p-4 h-screen shadow-2xl z-50 bg-gradient-to-b from-white/90 to-sky-50/90 backdrop-blur-2xl border-r border-sky-200/50 overflow-y-auto"
              role="navigation"
              aria-label="Mobile sidebar"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}