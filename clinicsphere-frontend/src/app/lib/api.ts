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

export async function login(payload: LoginPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }
  return res.json();
}

export async function register(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }
  return res.json();
}

export async function fetchUserProfile(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return res.json();
}
