// api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
};

// New type for updating users (password is optional)
export type UpdateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

// Type for user data returned by API
export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  activityLog?: { action: string; timestamp: string; _id: string }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// Type for paginated response from get all users
export type UsersResponse = {
  users: User[];
  total: number;
  page: number;
  limit: number;
};

export type DoctorPayload = {
  name: string;
  email: string;
  password?: string; // Optional for create, not needed for update
  specialty: string;
  licenseNumber: string;
};

export type UpdateDoctorPayload = {
  name?: string;
  email?: string;
  password?: string;
  specialty?: string;
  licenseNumber?: string;
};

export type PatientPayload = {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medicalHistory?: string;
};

export type UpdatePatientPayload = Partial<PatientPayload>;

export type Patient = {
  _id: string;
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type PatientsResponse = {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
};

export type Doctor = {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type DoctorsResponse = {
  doctors: Doctor[];
  total: number;
  page: number;
  limit: number;
};

export interface Appointment {
  patientId: any;
  _id: string;
  doctorId: { _id: string; name: string; email: string };
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentResponse {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
}

export async function login(payload: LoginPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Login failed');
    }
    const data = await res.json();
    return data // Returns { access_token, user: { id, name, email, role } }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during login');
  }
}

export async function register(payload: RegisterPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    return res.json(); // Returns { access_token, user: { id, name, email, role } }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during registration');
  }
}

export async function fetchUserProfile(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }
    const data = await res.json();
    return data // Returns { id, name, email, role }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during profile fetch');
  }
}

export async function createAdminUser(payload: RegisterPayload, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create user');
    }
    return res.json(); // Returns { user: User }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during user creation');
  }
}

// Update a user by ID
export async function updateAdminUser(
  userId: string,
  payload: UpdateUserPayload,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update user');
    }
    return res.json(); // Returns { user: User }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during user update');
  }
}

// Delete a user by ID
export async function deleteAdminUser(userId: string, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }
    return res.json(); // Returns success message or empty response
  } catch (error: any) {
    throw new Error(error.message || 'Network error during user deletion');
  }
}

// Get all users (with pagination)
export async function getAllAdminUsers(
  token: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/users?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }
    return res.json() as Promise<UsersResponse>; // Returns UsersResponse
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching users');
  }
}

// Get a user by ID
export async function getAdminUserById(userId: string, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch user');
    }
    return res.json(); // Returns { user: User }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching user');
  }
}

export async function createAdminDoctor(payload: DoctorPayload, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create doctor');
    }
    return res.json(); // Returns { doctor: Doctor }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during doctor creation');
  }
}

// Update a doctor by ID
export async function updateAdminDoctor(
  doctorId: string,
  payload: UpdateDoctorPayload,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update doctor');
    }
    return res.json(); // Returns { doctor: Doctor }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during doctor update');
  }
}

// Delete a doctor by ID
export async function deleteAdminDoctor(doctorId: string, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete doctor');
    }
    return res.json(); // Returns success message or empty response
  } catch (error: any) {
    throw new Error(error.message || 'Network error during doctor deletion');
  }
}

// Get all doctors (with pagination)
export async function getAllAdminDoctors(
  token: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/doctors?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch doctors');
    }
    return res.json() as Promise<DoctorsResponse>; // Returns DoctorsResponse
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching doctors');
  }
}

// Get a doctor by ID
export async function getAdminDoctorById(doctorId: string, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch doctor');
    }
    return res.json(); // Returns { doctor: Doctor }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching doctor');
  }
}

export async function createDoctorPatient(
  payload: PatientPayload,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/doctor/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create patient');
    }
    return res.json(); // Returns { patient: Patient }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during patient creation');
  }
}

export async function getAllDoctorPatients(
  token: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/doctor/patients?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch patients');
    }
    return res.json() as Promise<PatientsResponse>;
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching patients');
  }
}

export async function getDoctorPatientById(
  doctorId: string,
  patientId: string,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}/patients/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch patient');
    }
    return res.json(); // Returns { patient: Patient }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching patient');
  }
}


export async function updateDoctorPatient(
  patientId: string,
  payload: PatientPayload,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/doctor/patients/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update patient');
    }
    return res.json(); // Returns { patient: Patient }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during patient update');
  }
}

export async function deleteDoctorPatient(
  patientId: string,
  token: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/doctor/patients/${patientId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete patient');
    }
    return res.json(); // Returns success message or empty response
  } catch (error: any) {
    throw new Error(error.message || 'Network error during patient deletion');
  }


}

export async function getAllDoctors() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/doctor/list`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch doctors');
    }
    const data = await res.json();
    return data // Returns array of Doctor
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching doctors');
  }
}

export async function getAllAppointments(page: number = 1, limit: number = 10, role?: string, token?: string) {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(role && { role }),
    }).toString();
    const res = await fetch(`${API_BASE_URL}/api/admin/appointments?${query}`, {
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch appointments');
    }
    const data = await res.json();
    return data as AppointmentResponse;
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching appointments');
  }
}

export async function getAppointmentById(id: string, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/appointments/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch appointment');
    }
    const data = await res.json();
    return data; // Appointment object
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching appointment');
  }
}

export async function createAppointment(appointmentData: {
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status?: string;
  notes?: string;
  reason?: string;
}, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/appointments`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create appointment');
    }
    const data = await res.json();
    return data; // Created appointment
  } catch (error: any) {
    throw new Error(error.message || 'Network error during creating appointment');
  }
}

export async function updateAppointment(id: string, appointmentData: {
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  notes?: string;
  reason?: string;
}, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/appointments/${id}`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update appointment');
    }
    const data = await res.json();
    return data; // Updated appointment
  } catch (error: any) {
    throw new Error(error.message || 'Network error during updating appointment');
  }
}

export async function deleteAppointment(id: string, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/appointments/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete appointment');
    }
    const data = await res.json();
    return data; // { message: 'Appointment deleted successfully' }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during deleting appointment');
  }
}

export async function getDoctorAppointments(page: number = 1, limit: number = 10, token?: string) {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    }).toString();
    const res = await fetch(`${API_BASE_URL}/api/doctor/appointments?${query}`, {
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch doctor appointments');
    }
    const data = await res.json();
    return data; // { appointments, total, page, limit }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching doctor appointments');
  }
}

export async function getDoctorAppointmentById(id: string, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/doctor/appointments/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch doctor appointment');
    }
    const data = await res.json();
    return data; // Appointment object
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching doctor appointment');
  }
}

export async function createDoctorAppointment(appointmentData: {
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status?: string;
  notes?: string;
  reason?: string;
}, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/doctor/appointments`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create doctor appointment');
    }
    const data = await res.json();
    return data; // Created appointment
  } catch (error: any) {
    throw new Error(error.message || 'Network error during creating doctor appointment');
  }
}

export async function updatePatientAppointment(id: string, appointmentData: {
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  notes?: string;
  reason?: string;
}, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/patient/appointments/${id}`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update patient appointment');
    }
    const data = await res.json();
    return data; // Updated appointment
  } catch (error: any) {
    throw new Error(error.message || 'Network error during updating patient appointment');
  }
}

export async function deletePatientAppointment(id: string, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/patient/appointments/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete patient appointment');
    }
    const data = await res.json();
    return data; // { message: 'Appointment deleted successfully' }
  } catch (error: any) {
    throw new Error(error.message || 'Network error during deleting patient appointment');
  }
}


export async function getPatientAppointments(page: number = 1, limit: number = 10, token?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/patient/appointments?page=${page}&limit=${limit}`, {
      headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to fetch patient appointments');
    }
    const data = await res.json();
    return data as AppointmentResponse;
  } catch (error: any) {
    throw new Error(error.message || 'Network error during fetching patient appointments');
  }
}

export async function createPatientAppointment(
  appointmentData: {
    doctorId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status?: string;
    notes?: string;
    reason?: string;
  },
  token?: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/patient/appointments`, {
      method: 'POST',
      headers: token
        ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create patient appointment');
    }
    const data = await res.json();
    return data as Appointment;
  } catch (error: any) {
    throw new Error(error.message || 'Network error during creating patient appointment');
  }
}
