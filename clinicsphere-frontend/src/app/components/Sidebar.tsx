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
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const submenuVariants = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 pt-6 pb-4 bg-[var(--bg-secondary)] backdrop-blur-lg">
        <div className="flex items-center space-x-3 px-4">
          <h2 className="text-xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text">
            HEALTHCARE
          </h2>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-4 overflow-y-auto" aria-label="Main navigation">
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
                className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 group
                  ${isMainActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300'
                    : 'hover:bg-[var(--hover-bg)] hover:shadow-md hover:scale-105'}
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
                  <span className="p-2 rounded-xl shadow-inner bg-[var(--bg-secondary)] border border-[var(--border-color)] transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
                    {item.name}
                  </span>
                </div>
                {item.submenu && (
                  <motion.div
                    animate={{ rotate: isMenuOpen(item.name) ? 180 : 0, scale: isMenuOpen(item.name) ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-[var(--text-secondary)] group-hover:text-indigo-400"
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
                      className="ml-8 mt-2 space-y-2"
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
                                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-teal-500 dark:hover:text-teal-300'}
                            `}
                            onClick={() => isMobile && closeSidebar()}
                            aria-label={subItem.name}
                          >
                            <span className="flex items-center mr-2 transform group-hover:scale-110 transition-transform">
                              {subItem.icon}
                            </span>
                            {subItem.name}
                            {pathname === subItem.href && (
                              <span className="w-2 h-2 ml-auto bg-teal-400 rounded-full animate-pulse" />
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

      <div className="sticky bottom-0 pt-4 mt-auto border-t border-[var(--border-color)] bg-[var(--bg-secondary)] backdrop-blur-lg">
        <Link
          href={logoutItem.href}
          className="flex items-center p-3 space-x-3 rounded-2xl transition-all duration-300 group hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-105"
          onClick={() => isMobile && closeSidebar()}
          aria-label={logoutItem.name}
        >
          <span className="p-2 rounded-xl shadow-inner border bg-[var(--bg-secondary)] border-[var(--border-color)] text-red-500 group-hover:scale-110 transition-transform">
            {logoutItem.icon}
          </span>
          <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-red-500 dark:group-hover:text-red-300">
            {logoutItem.name}
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        className="hidden lg:block w-72 text-[var(--text-primary)] p-4 fixed h-screen shadow-2xl z-50 border-r bg-[var(--bg-secondary)] backdrop-blur-xl border-[var(--border-color)] overflow-hidden"
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
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              onClick={closeSidebar}
              aria-hidden="true"
            />
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed lg:hidden w-72 text-[var(--text-primary)] p-4 h-screen shadow-2xl z-50 bg-[var(--bg-secondary)] backdrop-blur-xl border-r border-[var(--border-color)] overflow-y-auto"
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