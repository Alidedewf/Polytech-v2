'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  useAccessibility,
  type FontSize,
  type ColorScheme,
  type LetterSpacing,
} from './AccessibilityContext';

/* ─── Иконка глаза (SVG) ─── */
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ─── Кнопка-переключатель с несколькими вариантами ─── */
function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="a11y-group">
      <span className="a11y-group__label">{label}</span>
      <div className="a11y-group__options">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`a11y-option${value === opt.value ? ' a11y-option--active' : ''}`}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Панель доступности ─── */
export default function AccessibilityPanel() {
  const t = useTranslations('accessibility');
  const {
    fontSize,
    colorScheme,
    letterSpacing,
    hideImages,
    setFontSize,
    setColorScheme,
    setLetterSpacing,
    setHideImages,
    resetAll,
    isActive,
  } = useAccessibility();

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне панели
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Закрытие по Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div ref={panelRef} className="a11y-wrapper">
      {/* Кнопка-триггер */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`a11y-trigger${isActive ? ' a11y-trigger--active' : ''}`}
        aria-label={t('toggle')}
        aria-expanded={open}
        title={t('toggle')}
      >
        <EyeIcon />
      </button>

      {/* Выпадающая панель */}
      {open && (
        <div className="a11y-panel" role="dialog" aria-label={t('panelTitle')}>
          <h3 className="a11y-panel__title">{t('panelTitle')}</h3>

          <OptionGroup<FontSize>
            label={t('fontSize')}
            value={fontSize}
            onChange={setFontSize}
            options={[
              { value: 'normal', label: t('fontNormal') },
              { value: 'large', label: t('fontLarge') },
              { value: 'xlarge', label: t('fontXlarge') },
            ]}
          />

          <OptionGroup<ColorScheme>
            label={t('colorScheme')}
            value={colorScheme}
            onChange={setColorScheme}
            options={[
              { value: 'normal', label: t('colorNormal') },
              { value: 'bw', label: t('colorBw') },
              { value: 'dark', label: t('colorDark') },
              { value: 'blue', label: t('colorBlue') },
            ]}
          />

          <OptionGroup<LetterSpacing>
            label={t('letterSpacing')}
            value={letterSpacing}
            onChange={setLetterSpacing}
            options={[
              { value: 'normal', label: t('spacingNormal') },
              { value: 'medium', label: t('spacingMedium') },
              { value: 'large', label: t('spacingLarge') },
            ]}
          />

          {/* Чекбокс скрытия изображений */}
          <div className="a11y-group">
            <label className="a11y-checkbox">
              <input
                type="checkbox"
                checked={hideImages}
                onChange={(e) => setHideImages(e.target.checked)}
              />
              <span>{t('hideImages')}</span>
            </label>
          </div>

          {/* Сброс */}
          {isActive && (
            <button
              type="button"
              className="a11y-reset"
              onClick={() => {
                resetAll();
                setOpen(false);
              }}
            >
              {t('reset')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
