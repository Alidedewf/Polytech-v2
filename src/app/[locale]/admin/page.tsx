'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchProjectsApi,
  createProjectApi,
  deleteProjectApi,
  getAuthToken,
  removeAuthToken,
} from '@/lib/api-client';

type Project = {
  id: string;
  slug?: string;
  titleRu: string;
  titleKk?: string;
  titleEn?: string;
  descRu: string;
  descKk?: string;
  descEn?: string;
  imageUrl?: string;
  isPublished?: boolean;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ru' | 'kk' | 'en'>('ru');

  // Form State
  const [titleRu, setTitleRu] = useState('');
  const [titleKk, setTitleKk] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descRu, setDescRu] = useState('');
  const [descKk, setDescKk] = useState('');
  const [descEn, setDescEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [creating, setCreating] = useState(false);

  const router = useRouter();

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjectsApi();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/ru/admin/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- загрузка данных на маунте
    loadProjects();
  }, [router, loadProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleRu || !descRu) {
      alert('Пожалуйста, заполните заголовок и описание хотя бы на русском языке');
      return;
    }

    try {
      setCreating(true);
      await createProjectApi({
        titleRu,
        titleKk,
        titleEn,
        descRu,
        descKk,
        descEn,
        imageUrl,
      });

      // Reset
      setTitleRu('');
      setTitleKk('');
      setTitleEn('');
      setDescRu('');
      setDescKk('');
      setDescEn('');
      setImageUrl('');
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при создании проекта');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Вы действительно хотите удалить проект "${title}"?`)) return;
    try {
      await deleteProjectApi(id);
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push('/ru/admin/login');
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.titleRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descRu.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm border border-gray-100">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#002A7A] border-t-transparent" />
          <span className="text-sm font-semibold text-gray-600">Загрузка панели управления...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Шапка Панели Управления */}
      <header className="border-b border-gray-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002A7A] text-white font-bold shadow-md">
              P
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Панель Менеджера PolyTech Park
              </h1>
              <p className="text-xs text-gray-500">Управление проектами и контентом сайта</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Статус: Онлайн
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
        </div>
      </header>

      {/* Основной Контейнер */}
      <main className="mx-auto max-w-[1440px] px-6 pt-8">
        {/* Карточки Статистики */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Всего проектов</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#002A7A]">{projects.length}</span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#002A7A]">База данных</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Опубликовано</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-600">{projects.length}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">На сайте</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Роль доступа</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-gray-800">Администратор</span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">Full Access</span>
            </div>
          </div>
        </div>

        {/* Панель Управления и Поиск */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или описанию..."
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-xs focus:border-[#002A7A] focus:outline-none focus:ring-1 focus:ring-[#002A7A]"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#002A7A] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-900 hover:shadow-lg active:scale-98"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Добавить проект
          </button>
        </div>

        {/* Список / Таблица Проектов */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50/50">
            <h2 className="text-base font-bold text-gray-900">
              Список всех проектов ({filteredProjects.length})
            </h2>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">Проектов не найдено</h3>
              <p className="mt-1 text-xs text-gray-500">Нажмите «Добавить проект», чтобы создать первый элемент.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 transition-colors hover:bg-gray-50/80 gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.titleRu}
                        className="h-20 w-28 rounded-xl object-cover border border-gray-200 shadow-xs flex-shrink-0"
                      />
                    ) : (
                      <div className="flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400 border border-gray-200">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {project.titleRu}
                        </h3>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          Активен
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {project.descRu}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <span>Дата: {new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
                        {project.slug && <span>Slug: {project.slug}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <a
                      href="/ru/projects"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Просмотр
                    </a>
                    <button
                      onClick={() => handleDelete(project.id, project.titleRu)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ПРОЕКТА */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-all">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#002A7A]">Добавить новый проект</h3>
                <p className="text-xs text-gray-500">Заполните информацию о проекте для публикации</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Языковые вкладки */}
            <div className="mt-4 flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('ru')}
                className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                  activeTab === 'ru'
                    ? 'border-[#002A7A] text-[#002A7A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Русский (RU) *
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kk')}
                className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                  activeTab === 'kk'
                    ? 'border-[#002A7A] text-[#002A7A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Казахский (KK)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                  activeTab === 'en'
                    ? 'border-[#002A7A] text-[#002A7A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Английский (EN)
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              {/* Русский язык */}
              {activeTab === 'ru' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Название проекта (RU) *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleRu}
                      onChange={(e) => setTitleRu(e.target.value)}
                      placeholder="Например: Инновационный кластер PolyTech"
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#002A7A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Описание проекта (RU) *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={descRu}
                      onChange={(e) => setDescRu(e.target.value)}
                      placeholder="Подробная информация и цели проекта..."
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#002A7A] focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Казахский язык */}
              {activeTab === 'kk' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Жоба атауы (KK)
                    </label>
                    <input
                      type="text"
                      value={titleKk}
                      onChange={(e) => setTitleKk(e.target.value)}
                      placeholder="Жоба атауын енгізіңіз..."
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#002A7A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Жоба сипаттамасы (KK)
                    </label>
                    <textarea
                      rows={4}
                      value={descKk}
                      onChange={(e) => setDescKk(e.target.value)}
                      placeholder="Жоба туралы толық ақпарат..."
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#002A7A] focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Английский язык */}
              {activeTab === 'en' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Project Title (EN)
                    </label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="Enter project title..."
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#002A7A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Project Description (EN)
                    </label>
                    <textarea
                      rows={4}
                      value={descEn}
                      onChange={(e) => setDescEn(e.target.value)}
                      placeholder="Full project details..."
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#002A7A] focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Обложка (Изображение) */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-bold uppercase text-gray-700">
                  Ссылка на обложку (URL картинки)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#002A7A] focus:outline-none"
                />

                {imageUrl && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 p-2 bg-gray-50">
                    <img src={imageUrl} alt="Предпросмотр" className="h-12 w-12 rounded-lg object-cover" />
                    <span className="text-xs text-gray-500">Предпросмотр обложки</span>
                  </div>
                )}
              </div>

              {/* Кнопки */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-[#002A7A] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-900 disabled:opacity-50"
                >
                  {creating ? 'Сохранение...' : 'Сохранить и опубликовать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
