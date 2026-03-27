import { MoreIcon } from '@/components/common/ButtonIcons';
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
          className="inline-flex min-h-9 items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--text)]"
        >
          <MoreIcon className="h-4 w-4" />
          더보기
        </button>
      ) : null}
    </section>
  );
}
