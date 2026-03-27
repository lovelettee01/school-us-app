'use client';

import { create } from 'zustand';

import type { ThemeMode } from '@/types/theme';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

/**
 * 테마 모드 전환 상태를 전역으로 관리하는 Zustand 스토어다.
 */
export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
}));
