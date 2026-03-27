'use client';

import Link from 'next/link';

import type { RecentSchool } from '@/types/school';

interface RecentSchoolsProps {
  items: RecentSchool[];
}

/**
 * 최근 조회 학교 목록을 가로 카드 형태로 표시한다.
 */
export function RecentSchools({ items }: RecentSchoolsProps) {
  return (
    <section className="card-surface p-4">
      <h2 className="section-title">최근 조회</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">아직 조회한 학교가 없습니다.</p>
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
