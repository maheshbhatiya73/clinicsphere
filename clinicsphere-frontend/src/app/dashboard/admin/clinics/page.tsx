'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaPlus} from 'react-icons/fa';
import CreateModel from './CreateModel';
import UpdateModel from './UpdateModel';
import DeleteModel from './DeleteModel';
import { getAllAdminClinics, createAdminClinic, updateAdminClinic, deleteAdminClinic } from '@/app/lib/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


interface Clinic {
  _id: string;
  name: string;
  contact: { phone: string; email: string };
  address: { line1: string; city: string; state: string; postal_code: string; country: string; location: { lat: number; lng: number } };
  working_hours: { monday: { open: string; close: string } };
  settings: { time_zone: string; currency: string; language: string; telemedicine_enabled: boolean };
}

const ClinicPage: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [token, setToken] = useState<string>('');


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const fetchClinics = async () => {
    if (!token) return
    try {
      const data = await getAllAdminClinics(token);
      setClinics(data);
    } catch (error) {
      console.error('Fetch clinics error:', error);
    }
  };

  useEffect(() => {

    fetchClinics();
  }, [token]);

  const handleCreate = async (data: Clinic) => {
    try {
      const newClinic = await createAdminClinic(data, token);
      if (newClinic) {
        fetchClinics()

      }
    } catch (error) {
      console.error('Create clinic error:', error);
    }
  };

  const handleUpdate = async (data: Clinic) => {
    if (!selectedClinic) return;
    try {
      const updatedClinic = await updateAdminClinic(selectedClinic._id, data, token);
      setClinics(clinics.map((clinic) => (clinic._id === selectedClinic._id ? updatedClinic : clinic)));
    } catch (error) {
      console.error('Update clinic error:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedClinic) return;
    try {
      await deleteAdminClinic(selectedClinic._id, token);
      setClinics(clinics.filter((clinic) => clinic._id !== selectedClinic._id));
    } catch (error) {
      console.error('Delete clinic error:', error);
    }
  };

  const filteredClinics = clinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'all' || clinic.address.city.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto space-y-6"
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-semibold text-sky-800">Clinic Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage all your registered clinics easily.</p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
          >
            <FaPlus className="mr-2 h-4 w-4" /> Add Clinic
          </Button>
        </div>
        {/* Search and Filter */}
        <div className=" p-4 rounded-xl flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus-visible:ring-sky-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] focus:ring-sky-500">
              <SelectValue placeholder="Filter by City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-sky-200 overflow-hidden">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-sky-100">
              <TableRow className="even:bg-sky-50">
                <TableHead className="text-sky-700">Name</TableHead>
                <TableHead className="text-sky-700">Address</TableHead>
                <TableHead className="text-sky-700">Contact</TableHead>
                <TableHead className="text-sky-700">Hours</TableHead>
                <TableHead className="text-sky-700">Status</TableHead>
                <TableHead className="text-sky-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClinics.map((clinic) => (
                <TableRow
                  key={clinic._id}
                  className="hover:bg-sky-50 transition-colors"
                >
                  <TableCell className="font-medium text-sky-600">
                    {clinic.name}
                  </TableCell>
                  <TableCell>
                    {clinic.address.line1}, {clinic.address.city}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>{clinic.contact.phone}</p>
                      <p className="text-sm text-gray-500">
                        {clinic.contact.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {clinic.working_hours.monday.open} -{' '}
                    {clinic.working_hours.monday.close}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        clinic.settings.telemedicine_enabled
                          ? 'border-green-600 text-green-600'
                          : 'border-yellow-500 text-yellow-500'
                      }
                    >
                      {clinic.settings.telemedicine_enabled ? 'Telemedicine' : 'In-Person'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <DotsHorizontalIcon className="h-4 w-4 text-sky-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedClinic(clinic);
                            setIsUpdateOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedClinic(clinic);
                            setIsDeleteOpen(true);
                          }}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modals */}
        <CreateModel
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
        />
        <UpdateModel
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          onUpdate={handleUpdate}
          clinicId={selectedClinic?._id || ''}
          token={token}
        />
        <DeleteModel
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onDelete={handleDelete}
          clinicName={selectedClinic?.name || ''}
        />
      </motion.div>
    </div>
  );
};

export default ClinicPage;