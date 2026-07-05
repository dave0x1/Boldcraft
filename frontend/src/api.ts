const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  return data.token;
}

export async function fetchImages(page: number, limit = 20) {
  const res = await fetch(`${BASE_URL}/api/images?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch images');
  return res.json();
}

export async function uploadImage(file: File, token: string) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function deleteImage(id: string, token: string) {
  const res = await fetch(`${BASE_URL}/api/images/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}