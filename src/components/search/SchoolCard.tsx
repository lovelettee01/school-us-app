'use client';

import Link from 'next/link';

import { DetailIcon, StarIcon } from '@/components/common/ButtonIcons';
import type { SchoolSummary } from '@/types/school';

interface SchoolCardProps {
  school: SchoolSummary;
  isFavorite: boolean;
  onFavoriteToggle: (school: SchoolSummary) => void;
  onBeforeNavigate: (school: SchoolSummary) => void;
}

/**
 * 검색 결과의 단일 학교 카드 컴포넌트다.
 */
export function SchoolCard({ school, isFavorite, onFavoriteToggle, onBeforeNavigate }: SchoolCardProps) {
  return (
    <article className="card-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-[var(--text)]">{school.schoolName}</h3>
        <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--text-muted)]">
          {school.schoolType}
        </span>
      </div>

      <p className="mt-2 text-sm text-[var(--text-muted)]">{school.officeName}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{school.addressRoad || '주소 정보 없음'}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{school.tel || '연락처 정보 없음'}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/school/${school.schoolKey}`}
          onClick={() => onBeforeNavigate(school)}
          className="inline-flex min-h-9 items-center gap-1 rounded-xl bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-contrast)]"
        >
          <DetailIcon className="h-4 w-4" />
          상세 보기
        </Link>
        <button
          type="button"
          onClick={() => onFavoriteToggle(school)}
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          className={[
            'inline-flex min-h-9 min-w-9 items-center justify-center rounded-xl border px-2 text-xs font-semibold',
            isFavorite
              ? 'border-amber-300 bg-amber-50 text-amber-600'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]',
          ].join(' ')}
        >
          <StarIcon className="h-4 w-4" filled={isFavorite} />
        </button>
      </div>
    </article>
  );
}
