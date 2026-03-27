'use client';

import { useEffect, useMemo } from 'react';

import { getPublicEnv } from '@/lib/env';
import { readStoredTheme, writeStoredTheme } from '@/lib/storage/theme';
import { useThemeStore } from '@/store/theme-store';
import type { ThemeMode } from '@/types/theme';

/**
 * 실제 DOM에 반영할 테마값(light/dark)을 계산한다.
 */
function resolveAppliedTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') {
    return mode;
  }

  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * 앱 전역 테마 초기화/전환을 담당하는 훅이다.
 */
export function useTheme() {
  const { defaultTheme } = getPublicEnv();
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  useEffect(() => {
    const stored = readStoredTheme();
    if (stored) {
      setMode(stored);
      return;
    }

    if (defaultTheme === 'light' || defaultTheme === 'dark' || defaultTheme === 'system') {
      setMode(defaultTheme);
    }
  }, [defaultTheme, setMode]);

  useEffect(() => {
    const apply = () => {
      const applied = resolveAppliedTheme(mode);
      document.documentElement.setAttribute('data-theme', applied);
    };

    apply();

    if (mode !== 'system') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [mode]);

  const appliedTheme = useMemo(() => resolveAppliedTheme(mode), [mode]);

  const updateMode = (nextMode: ThemeMode) => {
    setMode(nextMode);
    writeStoredTheme(nextMode);
  };

  return {
    mode,
    appliedTheme,
    setMode: updateMode,
  };
}
