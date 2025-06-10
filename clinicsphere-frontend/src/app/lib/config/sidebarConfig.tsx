'use client';
import { FaTachometerAlt, FaUsers, FaSignOutAlt, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { JSX } from 'react';

export interface SubmenuItem {
  name: string;
  href: string;
  icon: JSX.Element;
}

export interface NavItem {
  name: string;
  href?: string;
  icon: JSX.Element;
  submenu?: SubmenuItem[];
}

export const iconColors = {
  dashboard: '#6366f1',
  users: '#10b981',
  company: '#8b5cf6',
  plans: '#f59e0b',
  logout: '#ef4444',
};

export const adminNavItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/admin',
    icon: <FaTachometerAlt className="w-5 h-5" style={{ color: iconColors.dashboard }} />,
  },
  {
    name: 'Profile',
    href: '/dashboard/admin/profile',
    icon: <CgProfile className="w-5 h-5" style={{ color: iconColors.dashboard }} />,
  },
  {
    name: 'Users',
    icon: <FaUsers className="w-5 h-5" style={{ color: iconColors.users }} />,
    submenu: [
      { name: 'Doctors', href: '/dashboard/admin/users/doctors', icon: <CgProfile className="w-5 h-5" /> },
      { name: 'Patients', href: '/dashboard/admin/users/patients', icon: <CgProfile className="w-5 h-5" /> },
    ],
  },
 
];

export const doctorNavItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/doctor',
    icon: <FaTachometerAlt className="w-5 h-5" style={{ color: iconColors.dashboard }} />,
  },
   {
    name: 'Profile',
    href: '/dashboard/doctor/profile',
    icon: <CgProfile className="w-5 h-5" style={{ color: iconColors.dashboard }} />,
  },
  {
    name: "patients",
    href: '/dashboard/doctor/patients',
    icon: <FaUsers className="w-5 h-5" style={{ color: iconColors.users }} />,
  }
];

export const patientNavItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/patient',
    icon: <FaTachometerAlt className="w-5 h-5" style={{ color: iconColors.dashboard }} />,
  },
    {
    name: 'Profile',
    href: '/dashboard/patient/profile',
    icon: <CgProfile className="w-5 h-5" style={{ color: iconColors.dashboard }} />,
  },
  {
    name: 'Appointments',
    href: '/dashboard/patient/appointments',
    icon: <FaMapMarkerAlt className="w-5 h-5" style={{ color: iconColors.plans }} />,
  },
  {
    name: 'Doctors',
    href: '/dashboard/patient/doctors',
    icon: <FaUsers className="w-5 h-5" style={{ color: iconColors.users }} />,
  }
];

export const logoutItem: NavItem = {
  name: 'Logout',
  href: '/auth/logout',
  icon: <FaSignOutAlt className="w-5 h-5" style={{ color: iconColors.logout }} />,
};