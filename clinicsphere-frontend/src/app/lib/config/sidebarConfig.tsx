'use client';
import { FaTachometerAlt, FaUsers, FaSignOutAlt, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { JSX } from 'react';
import { FiBarChart2, FiClipboard } from "react-icons/fi";
import { CiHospital1 } from "react-icons/ci";
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlineMedicalServices, MdOutlineFolderSpecial } from "react-icons/md";
import { TbCategory2 } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";


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
    icon: <FiBarChart2 className="w-5 h-5" style={{ color: iconColors.dashboard }} />,
  },
  {
    name: "Clinics",
    href: "/dashboard/admin/clinics",
    icon: <CiHospital1 className="w-5 h-5" style={{ color: iconColors.dashboard }} />,

  },
  {
    name: "Assign Doctors",
     href: "/dashboard/admin/assign-doctor",
    icon: <FaUserDoctor className="w-5 h-5" style={{ color: iconColors.dashboard }} />,

  },
 {
    name: 'Services',
    icon: <MdOutlineMedicalServices className="w-5 h-5" style={{ color: iconColors.users }} />,
    submenu: [
      { name: 'Services', href: '/dashboard/admin/services', icon: <MdOutlineMedicalServices className="w-5 h-5" /> },
      { name: 'Service Categorie', href: '/dashboard/admin/services-categorie', icon: <TbCategory2 className="w-5 h-5" /> },
    ],
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
  {
    name: "appointments",
    icon: <FiClipboard className="w-5 h-5" style={{ color: iconColors.plans }} />,
    href: '/dashboard/admin/appointment',
  },
  {
    name: "Specialties",
    icon: <MdOutlineFolderSpecial className="w-5 h-5" style={{ color: iconColors.company }} />,
    href: '/dashboard/admin/specialties',
  },
   {
    name: "Settings",
    icon: <IoSettingsOutline className="w-5 h-5" style={{ color: iconColors.company }} />,
    href: '/dashboard/admin/settings',
  }
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
  },
  {
    name: "appointments",
    href: '/dashboard/doctor/appointment',
    icon: <FaMapMarkerAlt className="w-5 h-5" style={{ color: iconColors.plans }} />,
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