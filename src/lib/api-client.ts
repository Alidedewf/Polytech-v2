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

/* ===================== Универсальные коллекции ===================== */
// Разделы: 'vacancies' | 'documents' | 'board' | 'management' | 'partners'
// (проекты остаются на своих отдельных функциях выше).

function authHeaders(json = true): Record<string, string> {
  const token = getAuthToken();
  const h: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

/** Запись коллекции: id + createdAt + произвольные поля раздела. */
export type CollectionItem = { id: string; createdAt?: string } & Record<
  string,
  unknown
>;

export async function fetchCollectionApi(
  name: string,
): Promise<CollectionItem[]> {
  const res = await fetch(`${API_URL}/c/${name}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Не удалось загрузить данные раздела');
  return await res.json();
}

export async function createItemApi(
  name: string,
  data: Record<string, unknown>,
): Promise<CollectionItem> {
  const res = await fetch(`${API_URL}/c/${name}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error || 'Ошибка сохранения');
  return out;
}

export async function updateItemApi(
  name: string,
  id: string,
  data: Record<string, unknown>,
): Promise<CollectionItem> {
  const res = await fetch(`${API_URL}/c/${name}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error || 'Ошибка сохранения');
  return out;
}

export async function deleteItemApi(name: string, id: string) {
  const res = await fetch(`${API_URL}/c/${name}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(false),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error || 'Ошибка удаления');
  return out;
}

/** Читает файл как data-URL (base64). */
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });
}

/** Загружает файл (картинку/PDF) на бэкенд, возвращает публичный URL. */
export async function uploadFileApi(file: File): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ filename: file.name, dataUrl }),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(out.error || 'Ошибка загрузки файла');
  return out.url as string;
}
