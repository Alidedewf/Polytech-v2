'use client';

import { useRef, useState } from 'react';
import { uploadFileApi } from '@/lib/api-client';

/** Поле загрузки файла (картинка/PDF). Грузит на бэкенд и возвращает URL. */
export default function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  label,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isPdf = accept.includes('pdf');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const url = await uploadFileApi(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="block text-xs font-bold uppercase text-gray-700">
        {label}
      </label>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {busy ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#002A7A] border-t-transparent" />
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
            </svg>
          )}
          {busy ? 'Загрузка…' : value ? 'Заменить файл' : 'Выбрать файл'}
        </button>

        {value && !busy && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            Убрать
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}

      {/* Превью */}
      {value && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
          {isPdf ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#002A7A] hover:underline"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
              </svg>
              Открыть загруженный PDF
            </a>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Предпросмотр" className="h-14 w-14 rounded-lg object-cover" />
              <span className="text-xs text-gray-500 break-all">{value}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
