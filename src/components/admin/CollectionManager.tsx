'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchCollectionApi,
  createItemApi,
  updateItemApi,
  deleteItemApi,
  type CollectionItem,
} from '@/lib/api-client';
import { LANG_TABS, type Field, type Section } from '@/lib/admin-sections';
import FileUpload from './FileUpload';

type FormState = Record<string, string>;

/** Универсальный менеджер раздела: список + модальная форма (создать/изменить/удалить). */
export default function CollectionManager({ section }: { section: Section }) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [lang, setLang] = useState<'Ru' | 'Kk' | 'En'>('Ru');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const hasI18n = section.fields.some(
    (f) => f.kind === 'i18nText' || f.kind === 'i18nTextarea',
  );

  const load = useCallback(async () => {
    try {
      const data = await fetchCollectionApi(section.collection);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [section.collection]);

  useEffect(() => {
    setLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- загрузка данных при смене раздела
    load();
  }, [load]);

  /** Пустая форма с дефолтами (select → первый вариант). */
  function emptyForm(): FormState {
    const f: FormState = {};
    for (const field of section.fields) {
      if (field.kind === 'select') f[field.key] = field.options?.[0]?.value ?? '';
    }
    return f;
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm());
    setLang('Ru');
    setError('');
    setModalOpen(true);
  }

  function openEdit(item: CollectionItem) {
    const f: FormState = {};
    for (const field of section.fields) {
      if (field.kind === 'i18nText' || field.kind === 'i18nTextarea') {
        for (const t of LANG_TABS) {
          f[`${field.key}${t.code}`] = String(item[`${field.key}${t.code}`] ?? '');
        }
      } else {
        f[field.key] = String(item[field.key] ?? '');
      }
    }
    setEditingId(item.id);
    setForm(f);
    setLang('Ru');
    setError('');
    setModalOpen(true);
  }

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    for (const field of section.fields) {
      if (!field.required) continue;
      const key = field.kind === 'i18nText' || field.kind === 'i18nTextarea' ? `${field.key}Ru` : field.key;
      if (!form[key]?.trim()) {
        return `Заполните поле «${field.label}»${hasI18n && (field.kind === 'i18nText' || field.kind === 'i18nTextarea') ? ' (русский)' : ''}`;
      }
    }
    return null;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await updateItemApi(section.collection, editingId, form);
      } else {
        await createItemApi(section.collection, form);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: CollectionItem) {
    const title = String(item[section.listTitleKey] ?? 'запись');
    if (!confirm(`Удалить «${title}»?`)) return;
    try {
      await deleteItemApi(section.collection, item.id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  }

  /** Текст подзаголовка строки (для select — человекочитаемая метка). */
  function subtitleFor(item: CollectionItem): string {
    if (!section.listSubtitleKey) return '';
    const raw = String(item[section.listSubtitleKey] ?? '');
    const sel = section.fields.find(
      (f) => f.kind === 'select' && f.key === section.listSubtitleKey,
    );
    if (sel) return sel.options?.find((o) => o.value === raw)?.label ?? raw;
    return raw;
  }

  const i18nFields = section.fields.filter(
    (f) => f.kind === 'i18nText' || f.kind === 'i18nTextarea',
  );
  const plainFields = section.fields.filter(
    (f) => f.kind !== 'i18nText' && f.kind !== 'i18nTextarea',
  );

  return (
    <div>
      {/* Заголовок раздела + кнопка добавления */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{section.subtitle}</p>
        </div>
        <button
          onClick={openNew}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#002A7A] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-900"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {section.addLabel}
        </button>
      </div>

      {/* Список */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
          <h3 className="text-base font-bold text-gray-900">
            Всего записей: {items.length}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm font-semibold text-gray-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#002A7A] border-t-transparent" />
            Загрузка…
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <h4 className="text-sm font-semibold text-gray-900">Пока пусто</h4>
            <p className="mt-1 text-xs text-gray-500">
              Нажмите «{section.addLabel}», чтобы добавить первую запись.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const img = section.listImageKey
                ? String(item[section.listImageKey] ?? '')
                : '';
              const subtitle = subtitleFor(item);
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-gray-50/80 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {section.listImageKey &&
                      (img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16v12H4z" />
                          </svg>
                        </div>
                      ))}
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-base font-bold text-gray-900">
                        {String(item[section.listTitleKey] ?? '—')}
                      </h4>
                      {subtitle && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => remove(item)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Модальная форма */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-[#002A7A]">
                {editingId ? 'Редактирование' : section.addLabel}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={save} className="mt-5 space-y-5">
              {/* Многоязычные поля под вкладками языков */}
              {hasI18n && (
                <div>
                  <div className="flex border-b border-gray-200">
                    {LANG_TABS.map((t) => (
                      <button
                        key={t.code}
                        type="button"
                        onClick={() => setLang(t.code)}
                        className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                          lang === t.code
                            ? 'border-[#002A7A] text-[#002A7A]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {t.label}
                        {t.code === 'Ru' ? ' *' : ''}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 space-y-4">
                    {i18nFields.map((field) => (
                      <FieldInput
                        key={`${field.key}${lang}`}
                        field={field}
                        name={`${field.key}${lang}`}
                        value={form[`${field.key}${lang}`] ?? ''}
                        onChange={set}
                        required={field.required && lang === 'Ru'}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Обычные поля (select / text / загрузка файлов) */}
              {plainFields.length > 0 && (
                <div className={`space-y-4 ${hasI18n ? 'border-t border-gray-100 pt-4' : ''}`}>
                  {plainFields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      name={field.key}
                      value={form[field.key] ?? ''}
                      onChange={set}
                      required={field.required}
                    />
                  ))}
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#002A7A] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-900 disabled:opacity-50"
                >
                  {saving ? 'Сохранение…' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/** Одно поле формы по его типу. */
function FieldInput({
  field,
  name,
  value,
  onChange,
  required,
}: {
  field: Field;
  name: string;
  value: string;
  onChange: (key: string, value: string) => void;
  required?: boolean;
}) {
  const labelEl = (
    <label className="block text-xs font-bold uppercase text-gray-700">
      {field.label}
      {required ? ' *' : ''}
    </label>
  );
  const inputCls =
    'mt-1 block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#002A7A] focus:outline-none';

  if (field.kind === 'image' || field.kind === 'file') {
    return (
      <FileUpload
        label={field.label}
        value={value}
        onChange={(url) => onChange(name, url)}
        accept={field.kind === 'file' ? field.accept ?? 'application/pdf' : 'image/*'}
        hint={field.hint}
      />
    );
  }

  if (field.kind === 'select') {
    return (
      <div>
        {labelEl}
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={inputCls}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.kind === 'i18nTextarea') {
    return (
      <div>
        {labelEl}
        <textarea
          rows={field.rows ?? 3}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={inputCls}
        />
      </div>
    );
  }

  // i18nText | text
  return (
    <div>
      {labelEl}
      <input
        type="text"
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={inputCls}
      />
      {field.hint && <p className="mt-1.5 text-xs text-gray-500">{field.hint}</p>}
    </div>
  );
}
