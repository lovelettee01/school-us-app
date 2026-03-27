'use client';

import Link from 'next/link';

import { TrashIcon } from '@/components/common/ButtonIcons';
import type { FavoriteSchool } from '@/types/school';

interface FavoriteSchoolsProps {
  items: FavoriteSchool[];
  onRemove: (schoolKey: string) => void;
}

/**
 * 즐겨찾기 학교 목록을 단순 리스트 형태로 표시한다.
 * 각 항목 오른쪽에서 즉시 삭제할 수 있다.
 */
export function FavoriteSchools({ items, onRemove }: FavoriteSchoolsProps) {
  return (
    <section className="card-surface p-4">
      <h2 className="section-title">즐겨찾기</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">즐겨찾기한 학교가 없습니다.</p>
      ) : (
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {items.map((item) => (
            <li
              key={item.schoolKey}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2"
            >
              <Link href={`/school/${item.schoolKey}`} className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--text)]">{item.schoolName}</p>
                <p className="truncate text-xs text-[var(--text-muted)]">{item.officeName}</p>
              </Link>
              <button
                type="button"
                onClick={() => onRemove(item.schoolKey)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                aria-label={`${item.schoolName} 즐겨찾기 삭제`}
                title="삭제"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
