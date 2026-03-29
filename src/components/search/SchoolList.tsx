import { AppButton } from '@/components/common/Button';
import { MoreIcon } from '@/components/common/ButtonIcons';
import { SchoolCard } from '@/components/search/SchoolCard';
import type { SchoolSummary } from '@/types/school';

interface SchoolListProps {
  /**
   * 전체 검색 결과 목록이다.
   */
  schools: SchoolSummary[];
  /**
   * 현재 화면에 노출할 최대 항목 수다.
   */
  visibleCount: number;
  /**
   * 더보기 클릭 시 호출되는 콜백이다.
   */
  onMore: () => void;
  /**
   * 추가 노출 가능한 항목 존재 여부다.
   */
  hasMore: boolean;
  /**
   * 특정 학교의 즐겨찾기 상태 판별 함수다.
   */
  isFavorite: (schoolKey: string) => boolean;
  /**
   * 학교 즐겨찾기 토글 콜백이다.
   */
  onFavoriteToggle: (school: SchoolSummary) => void;
  /**
   * 상세 이동 전 사전 처리(최근 조회 저장 등) 콜백이다.
   */
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
        <AppButton variant="secondary" onClick={onMore} leftIcon={<MoreIcon className="h-4 w-4" />}>
          더보기
        </AppButton>
      ) : null}
    </section>
  );
}
