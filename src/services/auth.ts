export interface RegisterPayload {
  email?: string;
  password?: string;
  firstName: string;
  lastName: string;
  walletAddress?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface LoginPayload {
  email?: string;
  password?: string;
  walletAddress?: string;
}

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}
