'use client';

import { useCallback, useState } from 'react';

import { readRecents, writeRecents } from '@/lib/storage/recents';
import type { RecentSchool, SchoolSummary } from '@/types/school';

/**
 * 최근 조회 최대 보관 개수다.
 * 10개를 초과하면 오래된 항목부터 제거해 항상 10개를 유지한다.
 */
const RECENT_MAX_COUNT = 10;

/**
 * 최근 조회 목록을 조회하고 갱신하는 훅이다.
 */
export function useRecents() {
  const [recents, setRecents] = useState<RecentSchool[]>(() => readRecents());

  /**
   * 학교 상세 진입 전 최근 조회를 갱신한다.
   * 중복 키는 최신 순으로 재정렬하고, 상한 개수를 넘으면 뒤에서 잘라낸다.
   */
  const pushRecent = useCallback((school: SchoolSummary) => {
    setRecents((prev) => {
      const deduped = prev.filter((item) => item.schoolKey !== school.schoolKey);
      const next = [
        {
          schoolKey: school.schoolKey,
          schoolName: school.schoolName,
          officeName: school.officeName,
          viewedAt: new Date().toISOString(),
        },
        ...deduped,
      ].slice(0, RECENT_MAX_COUNT);

      writeRecents(next);
      return next;
    });
  }, []);

  /**
   * 최근 조회 단건을 명시적으로 삭제한다.
   * 홈 화면 리스트에서 사용자가 즉시 제거할 때 호출한다.
   */
  const removeRecent = useCallback((schoolKey: string) => {
    setRecents((prev) => {
      const next = prev.filter((item) => item.schoolKey !== schoolKey);
      writeRecents(next);
      return next;
    });
  }, []);

  return {
    recents,
    pushRecent,
    removeRecent,
  };
}
