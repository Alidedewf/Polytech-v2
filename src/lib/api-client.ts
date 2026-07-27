const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('polytech_token');
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('polytech_token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('polytech_token');
  }
}

export async function loginApi(email: string, pass: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Ошибка входа');
  }

  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function fetchProjectsApi() {
  const res = await fetch(`${API_URL}/projects`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Не удалось загрузить проекты');
  return await res.json();
}

export type ProjectInput = {
  titleRu: string;
  titleKk?: string;
  titleEn?: string;
  descRu: string;
  descKk?: string;
  descEn?: string;
  imageUrl?: string;
};

export async function createProjectApi(project: ProjectInput) {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка создания проекта');
  return data;
}

export async function deleteProjectApi(id: string) {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка удаления проекта');
  return data;
}
