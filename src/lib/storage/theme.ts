import { THEME_STORAGE_KEY } from '@/constants/theme';
import type { ThemeMode } from '@/types/theme';

/**
 * 브라우저 LocalStorage에서 테마 모드를 읽는다.
 */
export function readStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 선택한 테마 모드를 LocalStorage에 저장한다.
 */
export function writeStoredTheme(mode: ThemeMode): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // 저장 실패는 사용자 경험을 깨지 않도록 무시한다.
  }
}
