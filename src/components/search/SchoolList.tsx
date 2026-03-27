import { SchoolCard } from '@/components/search/SchoolCard';
import type { SchoolSummary } from '@/types/school';

interface SchoolListProps {
  schools: SchoolSummary[];
  visibleCount: number;
  onMore: () => void;
  hasMore: boolean;
  isFavorite: (schoolKey: string) => boolean;
  onFavoriteToggle: (school: SchoolSummary) => void;
  onBeforeNavigate: (school: SchoolSummary) => void;
}

/**
 * 학교 검색 결과 리스트를 렌더링한다.
 */
export function SchoolList({
  schools,
  visibleCount,
  onMore,
  hasMore,
  isFavorite,
  onFavoriteToggle,
  onBeforeNavigate,
}: SchoolListProps) {
  return (
    <section className="grid gap-3" aria-live="polite">
      {schools.slice(0, visibleCount).map((school) => (
        <SchoolCard
          key={school.schoolKey}
          school={school}
          isFavorite={isFavorite(school.schoolKey)}
          onFavoriteToggle={onFavoriteToggle}
          onBeforeNavigate={onBeforeNavigate}
        />
      ))}

      {hasMore ? (
        <button
          type="button"
          onClick={onMore}
          className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)]"
        >
          더보기
        </button>
      ) : null}
    </section>
  );
}
