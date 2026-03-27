'use client';

import { useState } from 'react';

import { getPublicEnv } from '@/lib/env';
import { readRecents, writeRecents } from '@/lib/storage/recents';
import type { RecentSchool, SchoolSummary } from '@/types/school';

/**
 * 최근 조회 목록을 조회하고 갱신하는 훅이다.
 */
export function useRecents() {
  const [recents, setRecents] = useState<RecentSchool[]>(() => readRecents());
  const { recentMaxCount } = getPublicEnv();

  const pushRecent = (school: SchoolSummary) => {
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
      ].slice(0, Math.max(1, recentMaxCount));

      writeRecents(next);
      return next;
    });
  };

  return {
    recents,
    pushRecent,
  };
}
