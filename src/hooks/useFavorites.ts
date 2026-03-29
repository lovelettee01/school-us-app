'use client';

import { useMemo, useState } from 'react';

import { readFavorites, writeFavorites } from '@/lib/storage/favorites';
import { useMessageStore } from '@/store/message-store';
import type { FavoriteSchool, SchoolSummary } from '@/types/school';

/**
 * 즐겨찾기 최대 허용 개수 상수다.
 * 요구사항에 따라 10개를 초과해 추가할 수 없다.
 */
const FAVORITE_MAX_COUNT = 10;

/**
 * 즐겨찾기 목록 조회/토글 로직을 관리하는 훅이다.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteSchool[]>(() => readFavorites());
  const pushMessage = useMessageStore((state) => state.pushMessage);

  const favoriteSet = useMemo(() => new Set<string>(favorites.map((item) => item.schoolKey)), [favorites]);

  const isFavorite = (schoolKey: string) => favoriteSet.has(schoolKey);

  /**
   * 즐겨찾기 단건을 명시적으로 제거한다.
   * 홈 화면 리스트의 즉시 삭제 버튼에서 사용한다.
   */
  const removeFavorite = (schoolKey: string) => {
    setFavorites((prev) => {
      const next = prev.filter((item) => item.schoolKey !== schoolKey);
      writeFavorites(next);
      return next;
    });
  };

  /**
   * 즐겨찾기 추가/해제를 토글한다.
   * 이미 등록된 학교는 해제하고, 신규 등록은 최대 개수 제한을 검증한다.
   */
  const toggleFavorite = (school: SchoolSummary) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.schoolKey === school.schoolKey);

      if (exists) {
        const next = prev.filter((item) => item.schoolKey !== school.schoolKey);
        writeFavorites(next);
        return next;
      }

      if (prev.length >= FAVORITE_MAX_COUNT) {
        pushMessage({
          type: 'warning',
          title: '즐겨찾기 등록 한도를 초과했습니다.',
          description: `즐겨찾기는 최대 ${FAVORITE_MAX_COUNT}개까지 등록할 수 있습니다.`,
          mode: 'toast',
          dedupeKey: 'favorites:max-count',
        });
        return prev;
      }

      const next = [
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
    removeFavorite,
    toggleFavorite,
  };
}
