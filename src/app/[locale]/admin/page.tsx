'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, removeAuthToken } from '@/lib/api-client';
import { SECTIONS } from '@/lib/admin-sections';
import CollectionManager from '@/components/admin/CollectionManager';

export default function AdminDashboardPage() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(SECTIONS[0].collection);
  const router = useRouter();

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/ru/admin/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- разблокировка после проверки токена
    setReady(true);
  }, [router]);

  function handleLogout() {
    removeAuthToken();
    router.push('/ru/admin/login');
  }

  if (!ready) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#002A7A] border-t-transparent" />
          <span className="text-sm font-semibold text-gray-600">Загрузка…</span>
        </div>
      </div>
    );
  }

  const activeSection = SECTIONS.find((s) => s.collection === active) ?? SECTIONS[0];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Шапка */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002A7A] font-bold text-white shadow-md">
              P
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                Панель управления PolyTech Park
              </h1>
              <p className="text-xs text-gray-500">Контент сайта</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/80 px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выход
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-8 lg:flex-row">
        {/* Навигация по разделам */}
        <aside className="lg:w-64 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.collection}
                onClick={() => setActive(s.collection)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                  active === s.collection
                    ? 'bg-[#002A7A] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {s.navLabel}
              </button>
            ))}
          </nav>

          {activeSection.viewPath && (
            <a
              href={activeSection.viewPath}
              target="_blank"
              rel="noreferrer"
              className="mt-4 hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 lg:flex"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Открыть раздел на сайте
            </a>
          )}
        </aside>

        {/* Активный раздел */}
        <main className="min-w-0 flex-1">
          <CollectionManager key={activeSection.collection} section={activeSection} />
        </main>
      </div>
    </div>
  );
}
