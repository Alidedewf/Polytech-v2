'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

/* ─── Типы ─── */
export type FontSize = 'normal' | 'large' | 'xlarge';
export type ColorScheme = 'normal' | 'bw' | 'dark' | 'blue';
export type LetterSpacing = 'normal' | 'medium' | 'large';

export interface AccessibilityState {
  fontSize: FontSize;
  colorScheme: ColorScheme;
  letterSpacing: LetterSpacing;
  hideImages: boolean;
}

interface AccessibilityContextValue extends AccessibilityState {
  setFontSize: (v: FontSize) => void;
  setColorScheme: (v: ColorScheme) => void;
  setLetterSpacing: (v: LetterSpacing) => void;
  setHideImages: (v: boolean) => void;
  resetAll: () => void;
  /** true, если хотя бы один параметр отличается от дефолтного */
  isActive: boolean;
}

const STORAGE_KEY = 'polytech-a11y';

const DEFAULTS: AccessibilityState = {
  fontSize: 'normal',
  colorScheme: 'normal',
  letterSpacing: 'normal',
  hideImages: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}

/* ─── Применение data-атрибутов на <html> ─── */
function applyToDOM(state: AccessibilityState) {
  const root = document.documentElement;
  root.setAttribute('data-font-size', state.fontSize);
  root.setAttribute('data-color-scheme', state.colorScheme);
  root.setAttribute('data-letter-spacing', state.letterSpacing);
  root.setAttribute('data-hide-images', String(state.hideImages));
}

/* ─── Провайдер ─── */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(DEFAULTS);

  // Инициализация из localStorage (клиент)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AccessibilityState>;
        const merged = { ...DEFAULTS, ...parsed };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- одноразовая гидрация из localStorage на маунте
        setState(merged);
        applyToDOM(merged);
      }
    } catch {
      // невалидный JSON — игнорируем
    }
  }, []);

  // Синхронизация DOM + localStorage при изменении
  useEffect(() => {
    applyToDOM(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setState((prev) => ({ ...prev, fontSize }));
  }, []);

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    setState((prev) => ({ ...prev, colorScheme }));
  }, []);

  const setLetterSpacing = useCallback((letterSpacing: LetterSpacing) => {
    setState((prev) => ({ ...prev, letterSpacing }));
  }, []);

  const setHideImages = useCallback((hideImages: boolean) => {
    setState((prev) => ({ ...prev, hideImages }));
  }, []);

  const resetAll = useCallback(() => {
    setState(DEFAULTS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isActive =
    state.fontSize !== 'normal' ||
    state.colorScheme !== 'normal' ||
    state.letterSpacing !== 'normal' ||
    state.hideImages;

  return (
    <AccessibilityContext.Provider
      value={{ ...state, setFontSize, setColorScheme, setLetterSpacing, setHideImages, resetAll, isActive }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
