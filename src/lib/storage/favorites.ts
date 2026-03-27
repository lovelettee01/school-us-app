import type { FavoriteSchool } from '@/types/school';

const FAVORITES_KEY = 'schoolApp:favorites:v1';

/**
 * 즐겨찾기 목록을 LocalStorage에서 읽어온다.
 */
export function readFavorites(): FavoriteSchool[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as FavoriteSchool[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 즐겨찾기 목록을 LocalStorage에 저장한다.
 */
export function writeFavorites(items: FavoriteSchool[]): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
