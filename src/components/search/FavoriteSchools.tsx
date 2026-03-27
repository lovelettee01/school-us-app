'use client';

import Link from 'next/link';

import type { FavoriteSchool } from '@/types/school';

interface FavoriteSchoolsProps {
  items: FavoriteSchool[];
}

/**
 * 즐겨찾기 학교 목록을 가로 카드 형태로 표시한다.
 */
export function FavoriteSchools({ items }: FavoriteSchoolsProps) {
  return (
    <section className="card-surface p-4">
      <h2 className="section-title">즐겨찾기</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">즐겨찾기한 학교가 없습니다.</p>
      ) : (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.map((item) => (
            <Link
              key={item.schoolKey}
              href={`/school/${item.schoolKey}`}
              className="min-w-44 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2"
            >
              <p className="text-sm font-semibold text-[var(--text)]">{item.schoolName}</p>
              <p className="text-xs text-[var(--text-muted)]">{item.officeName}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
