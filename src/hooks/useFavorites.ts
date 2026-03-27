'use client';

import { useMemo, useState } from 'react';

import { readFavorites, writeFavorites } from '@/lib/storage/favorites';
import type { FavoriteSchool, SchoolSummary } from '@/types/school';

/**
 * 즐겨찾기 목록 조회/토글 로직을 관리하는 훅이다.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteSchool[]>(() => readFavorites());

  const favoriteSet = useMemo(() => new Set<string>(favorites.map((item) => item.schoolKey)), [favorites]);

  const isFavorite = (schoolKey: string) => favoriteSet.has(schoolKey);

  const toggleFavorite = (school: SchoolSummary) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.schoolKey === school.schoolKey);
      const next = exists
        ? prev.filter((item) => item.schoolKey !== school.schoolKey)
        : [
            {
              schoolKey: school.schoolKey,
              schoolName: school.schoolName,
              officeName: school.officeName,
              schoolType: school.schoolType,
              updatedAt: new Date().toISOString(),
            },
            ...prev,
          ];

      writeFavorites(next);
      return next;
    });
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
