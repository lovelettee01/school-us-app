'use client';

import Link from 'next/link';

import { AppButton } from '@/components/common/Button';
import { TrashIcon } from '@/components/common/ButtonIcons';
import type { RecentSchool } from '@/types/school';

interface RecentSchoolsProps {
  /**
   * 렌더링할 최근 조회 학교 목록이다.
   */
  items: RecentSchool[];
  /**
   * 최근 조회 항목 제거 콜백이다.
   */
  onRemove: (schoolKey: string) => void;
}

/**
 * 최근 조회 학교 목록을 단순 리스트 형태로 표시한다.
 * 각 항목 오른쪽에서 즉시 삭제할 수 있다.
 */
export function RecentSchools({ items, onRemove }: RecentSchoolsProps) {
  return (
    <section className="card-surface p-4">
      <h2 className="section-title">최근 조회</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">아직 조회한 학교가 없습니다.</p>
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
              <AppButton
                variant="secondary"
                size="sm"
                onClick={() => onRemove(item.schoolKey)}
                className="min-h-7 min-w-7 rounded-md px-1.5"
                leftIcon={<TrashIcon className="h-3.5 w-3.5" />}
                aria-label={`${item.schoolName} 최근 조회 삭제`}
                title="삭제"
              >
                <span className="sr-only">삭제</span>
              </AppButton>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
