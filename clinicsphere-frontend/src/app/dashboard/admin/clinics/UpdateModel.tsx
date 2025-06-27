'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getAdminClinicById } from '@/app/lib/api/api';

interface ClinicFormData {
  name: string;
  contact: { phone: string; email: string };
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    location: { lat: number; lng: number };
  };
  working_hours: Record<string, { open: string; close: string }>;
  settings: {
    time_zone: string;
    currency: string;
    language: string;
    telemedicine_enabled: boolean;
  };
}

interface CreateModelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: any
  clinicId: string;
  token: string
}

const CreateModel: React.FC<CreateModelProps> = ({ isOpen, onClose, onUpdate, clinicId, token }) => {
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    contact: { phone: '', email: '' },
    address: { line1: '', city: '', state: '', postal_code: '', country: '', location: { lat: 0, lng: 0 } },
    working_hours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' },
    },
    settings: { time_zone: 'Asia/Kolkata', currency: 'INR', language: 'en', telemedicine_enabled: false },
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [openPopover, setOpenPopover] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateTime = (open: string, close: string, key: string) => {
    if (open && close && open >= close) {
      setErrors((prev) => ({ ...prev, [key]: 'Open time must be before close time' }));
      return false;
    }
    setErrors((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    return true;
  };

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const clinic = await getAdminClinicById(clinicId, token);
        setFormData({
          name: clinic.name,
          contact: clinic.contact,
          address: clinic.address,
          working_hours: clinic.working_hours,
          settings: clinic.settings,
        });

        await fetchClinic();
      } catch (error) {
        console.error('Fetch clinic error:', error);
      }
    };
    if (isOpen && clinicId) fetchClinic();
  }, [isOpen, clinicId, token]); 

  const handleTimeChange = (day: string, field: 'open' | 'close', value: string) => {
    setFormData((prev) => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          [field]: value,
        },
      },
    }));
    if (formData.working_hours[day]) {
      validateTime(
        field === 'open' ? value : formData.working_hours[day].open,
        field === 'close' ? value : formData.working_hours[day].close,
        day
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name || !formData.contact.phone || !formData.contact.email) {
        alert('Please fill in all required fields (Clinic Name, Phone, Email).');
        return;
      }

      // Validate address fields
      if (
        !formData.address.line1 ||
        !formData.address.city ||
        !formData.address.state ||
        !formData.address.postal_code ||
        !formData.address.country
      ) {
        alert('Please fill in all required address fields.');
        return;
      }

      // Validate latitude and longitude
      if (
        formData.address.location.lat < -90 ||
        formData.address.location.lat > 90 ||
        formData.address.location.lng < -180 ||
        formData.address.location.lng > 180
      ) {
        alert('Please provide valid latitude (-90 to 90) and longitude (-180 to 180).');
        return;
      }

      // Validate working hours
      const cleanWorkingHours = Object.fromEntries(
        Object.entries(formData.working_hours).filter(([_, hours]) => hours.open && hours.close)
      );
      const hasValidHours = Object.entries(cleanWorkingHours).some(([key, hours]) => {
        return hours.open && hours.close && hours.open < hours.close;
      });
      if (!hasValidHours) {
        alert('Please provide valid working hours for at least one day or date.');
        return;
      }

      // Check for time validation errors
      if (Object.keys(errors).length > 0) {
        alert('Please fix the time validation errors before submitting.');
        return;
      }

      await onUpdate({ ...formData, working_hours: cleanWorkingHours });
      onClose();
      setFormData({
        name: '',
        contact: { phone: '', email: '' },
        address: { line1: '', city: '', state: '', postal_code: '', country: '', location: { lat: 0, lng: 0 } },
        working_hours: {
          monday: { open: '', close: '' },
          tuesday: { open: '', close: '' },
          wednesday: { open: '', close: '' },
          thursday: { open: '', close: '' },
          friday: { open: '', close: '' },
          saturday: { open: '', close: '' },
          sunday: { open: '', close: '' },
        },
        settings: { time_zone: 'Asia/Kolkata', currency: 'INR', language: 'en', telemedicine_enabled: false },
      });
      setSelectedDate(undefined);
      setErrors({});
    } catch (error) {
      console.error('Create error:', error);
      alert('An error occurred while creating the clinic. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-0 shadow-2xl" style={{ scrollbarWidth: 'none' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
          <DialogHeader className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-3xl font-bold text-indigo-800 tracking-tight">
                Create New Clinic
              </DialogTitle>
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
              >
                Close
              </Button>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
            <Card className="border-none bg-white/50 backdrop-blur-sm shadow-lg rounded-xl">
              <CardContent className="pt-6">
                <div className="space-y-8">
                  {/* Clinic Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-indigo-700">Clinic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Clinic Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter clinic name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-indigo-700">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={formData.contact.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contact: { ...formData.contact, phone: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.contact.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contact: { ...formData.contact, email: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-indigo-700">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="line1" className="text-sm font-medium text-gray-700">Address Line 1</Label>
                        <Input
                          id="line1"
                          placeholder="Enter address"
                          value={formData.address.line1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, line1: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                        <Input
                          id="city"
                          placeholder="Enter city"
                          value={formData.address.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, city: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                        <Input
                          id="state"
                          placeholder="Enter state"
                          value={formData.address.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, state: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">Postal Code</Label>
                        <Input
                          id="postal_code"
                          placeholder="Enter postal code"
                          value={formData.address.postal_code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, postal_code: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                        <Input
                          id="country"
                          placeholder="Enter country"
                          value={formData.address.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, country: e.target.value },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          placeholder="Enter latitude"
                          value={formData.address.location.lat}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                location: {
                                  ...formData.address.location,
                                  lat: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          placeholder="Enter longitude"
                          value={formData.address.location.lng}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                location: {
                                  ...formData.address.location,
                                  lng: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-indigo-700">Working Hours</h3>

                    {/* Weekly Schedule */}
                    <div className="rounded-xl border p-4 shadow-sm bg-muted/40">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-800">Weekly Schedule</h4>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const mondayHours = formData.working_hours.monday;
                            if (mondayHours && mondayHours.open && mondayHours.close) {
                              setFormData({
                                ...formData,
                                working_hours: {
                                  ...formData.working_hours,
                                  tuesday: { ...mondayHours },
                                  wednesday: { ...mondayHours },
                                  thursday: { ...mondayHours },
                                  friday: { ...mondayHours },
                                },
                              });
                            }
                          }}
                          className="text-sm"
                        >
                          Copy Monday to Weekdays
                        </Button>
                      </div>
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <div key={day} className="mb-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-700 capitalize">{day}</Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.working_hours[day]?.open === '00:00' && formData.working_hours[day]?.close === '23:59'}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    working_hours: {
                                      ...formData.working_hours,
                                      [day]: checked
                                        ? { open: '00:00', close: '23:59' }
                                        : { open: '', close: '' },
                                    },
                                  })
                                }
                                className="data-[state=checked]:bg-indigo-600"
                              />
                              <span className="text-sm text-gray-600">24 Hours</span>
                              <Switch
                                checked={!!formData.working_hours[day]?.open || !!formData.working_hours[day]?.close}
                                onCheckedChange={(checked) => {
                                  if (!checked) {
                                    const { [day]: _, ...rest } = formData.working_hours;
                                    setFormData({ ...formData, working_hours: rest });
                                    setErrors((prev) => {
                                      const { [day]: _, ...restErrors } = prev;
                                      return restErrors;
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      working_hours: {
                                        ...formData.working_hours,
                                        [day]: { open: '', close: '' },
                                      },
                                    });
                                  }
                                }}
                                className="data-[state=checked]:bg-indigo-600"
                              />
                              <span className="text-sm text-gray-600">Open</span>
                            </div>
                          </div>
                          {(formData.working_hours[day]?.open || formData.working_hours[day]?.close || formData.working_hours[day]) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`${day}-open`}>Open Time</Label>
                                <Input
                                  type="time"
                                  id={`${day}-open`}
                                  step="60"
                                  value={formData.working_hours[day]?.open || ''}
                                  onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                                  disabled={formData.working_hours[day]?.open === '00:00' && formData.working_hours[day]?.close === '23:59'}
                                  className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden ${errors[day] ? 'border-red-500' : ''}`}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label htmlFor={`${day}-close`}>Close Time</Label>
                                <Input
                                  type="time"
                                  id={`${day}-close`}
                                  step="60"
                                  value={formData.working_hours[day]?.close || ''}
                                  onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                                  disabled={formData.working_hours[day]?.open === '00:00' && formData.working_hours[day]?.close === '23:59'}
                                  className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden ${errors[day] ? 'border-red-500' : ''}`}
                                />
                              </div>
                              {errors[day] && <p className="text-red-500 text-sm col-span-2">{errors[day]}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Special Hours */}
                    <div className="rounded-xl border p-4 shadow-sm bg-muted/40">
                      <h4 className="text-lg font-medium text-gray-800 mb-4">Special Hours</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="special-date">Select Date</Label>
                            <Popover open={openPopover} onOpenChange={setOpenPopover}>
                              <PopoverTrigger asChild>
                                <Button variant="outline" id="special-date" className="w-full justify-between font-normal">
                                  {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                                  <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={(date) => {
                                    setSelectedDate(date);
                                    setOpenPopover(false);
                                  }}
                                  disabled={(date) => date < new Date()} // Prevent past dates
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="special-open">Open Time</Label>
                            <Input
                              type="time"
                              id="special-open"
                              step="60"
                              value={selectedDate ? formData.working_hours[format(selectedDate, 'yyyy-MM-dd')]?.open || '' : ''}
                              onChange={(e) => {
                                if (selectedDate) {
                                  const dateKey = format(selectedDate, 'yyyy-MM-dd');
                                  handleTimeChange(dateKey, 'open', e.target.value);
                                }
                              }}
                              disabled={!selectedDate}
                              className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden ${selectedDate && errors[format(selectedDate, 'yyyy-MM-dd')] ? 'border-red-500' : ''}`}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="special-close">Close Time</Label>
                            <Input
                              type="time"
                              id="special-close"
                              step="60"
                              value={selectedDate ? formData.working_hours[format(selectedDate, 'yyyy-MM-dd')]?.close || '' : ''}
                              onChange={(e) => {
                                if (selectedDate) {
                                  const dateKey = format(selectedDate, 'yyyy-MM-dd');
                                  handleTimeChange(dateKey, 'close', e.target.value);
                                }
                              }}
                              disabled={!selectedDate}
                              className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden ${selectedDate && errors[format(selectedDate, 'yyyy-MM-dd')] ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {selectedDate && errors[format(selectedDate, 'yyyy-MM-dd')] && (
                            <p className="text-red-500 text-sm col-span-3">{errors[format(selectedDate, 'yyyy-MM-dd')]}</p>
                          )}
                        </div>
                        {/* Display Existing Special Hours */}
                        {Object.keys(formData.working_hours)
                          .filter((key) => !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key))
                          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                          .map((dateKey) => (
                            <div key={dateKey} className="flex items-center gap-4">
                              <span className="text-sm font-medium text-gray-700 w-32">{format(new Date(dateKey), 'PPP')}</span>
                              <Input
                                type="time"
                                value={formData.working_hours[dateKey].open}
                                onChange={(e) => handleTimeChange(dateKey, 'open', e.target.value)}
                                className={`w-32 ${errors[dateKey] ? 'border-red-500' : ''}`}
                              />
                              <Input
                                type="time"
                                value={formData.working_hours[dateKey].close}
                                onChange={(e) => handleTimeChange(dateKey, 'close', e.target.value)}
                                className={`w-32 ${errors[dateKey] ? 'border-red-500' : ''}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const { [dateKey]: _, ...rest } = formData.working_hours;
                                  setFormData({ ...formData, working_hours: rest });
                                  setErrors((prev) => {
                                    const { [dateKey]: _, ...restErrors } = prev;
                                    return restErrors;
                                  });
                                }}
                              >
                                <TrashIcon className="h-4 w-4 text-red-600" />
                              </Button>
                              {errors[dateKey] && <p className="text-red-500 text-sm">{errors[dateKey]}</p>}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-indigo-700">Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="time_zone" className="text-sm font-medium text-gray-700">Time Zone</Label>
                        <Select
                          value={formData.settings.time_zone}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              settings: { ...formData.settings, time_zone: value },
                            })
                          }
                        >
                          <SelectTrigger
                            id="time_zone"
                            className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          >
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">America/New_York</SelectItem>
                            <SelectItem value="Europe/London">Europe/London</SelectItem>
                            <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
                        <Select
                          value={formData.settings.currency}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              settings: { ...formData.settings, currency: value },
                            })
                          }
                        >
                          <SelectTrigger
                            id="currency"
                            className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          >
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-medium text-gray-700">Language</Label>
                        <Select
                          value={formData.settings.language}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              settings: { ...formData.settings, language: value },
                            })
                          }
                        >
                          <SelectTrigger
                            id="language"
                            className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg transition-all duration-200"
                          >
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telemedicine" className="text-sm font-medium text-gray-700">Telemedicine</Label>
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="telemedicine"
                            checked={formData.settings.telemedicine_enabled}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                settings: { ...formData.settings, telemedicine_enabled: checked },
                              })
                            }
                            className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-200"
                          />
                          <span className="text-sm font-medium text-gray-600">
                            {formData.settings.telemedicine_enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-4 border-t border-gray-200 pt-6 sticky bottom-0 bg-white/80 backdrop-blur-sm z-10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all duration-200 px-6"
              >
                Create Clinic
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModel;