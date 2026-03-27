import type { RecentSchool } from '@/types/school';

const RECENTS_KEY = 'schoolApp:recents:v1';

/**
 * 최근 조회 목록을 LocalStorage에서 읽어온다.
 */
export function readRecents(): RecentSchool[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as RecentSchool[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 최근 조회 목록을 LocalStorage에 저장한다.
 */
export function writeRecents(items: RecentSchool[]): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
