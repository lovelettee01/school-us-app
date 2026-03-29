'use client';

import { create } from 'zustand';

import type { ThemeMode } from '@/types/theme';

interface ThemeStore {
  /**
   * 현재 선택된 테마 모드다.
   */
  mode: ThemeMode;
  /**
   * 테마 모드를 변경하는 액션이다.
   */
  setMode: (mode: ThemeMode) => void;
}

/**
 * 테마 모드 전환 상태를 전역으로 관리하는 Zustand 스토어다.
 */
export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
}));
