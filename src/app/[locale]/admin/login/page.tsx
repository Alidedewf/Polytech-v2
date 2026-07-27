'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/lib/api-client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginApi(email, password);
      router.push('/ru/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#002A7A]">
            Вход в Панель Управления
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Введите учётные данные менеджера PolyTech Park
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@polytech.kz"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-[#002A7A] focus:outline-none focus:ring-1 focus:ring-[#002A7A]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Пароль
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-[#002A7A] focus:outline-none focus:ring-1 focus:ring-[#002A7A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-[#002A7A] py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти в панель'}
          </button>
        </form>
      </div>
    </div>
  );
}
