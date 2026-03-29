'use client';

import { useMemo, useState } from 'react';

import { EmptyState, ErrorState, LoadingState, RetryButton } from '@/components/common/States';
import { MessageModeToggle } from '@/components/common/MessageModeToggle';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { FavoriteSchools } from '@/components/search/FavoriteSchools';
import { OfficeSelect } from '@/components/search/OfficeSelect';
import { RecentSchools } from '@/components/search/RecentSchools';
import { SchoolList } from '@/components/search/SchoolList';
import { SchoolSearchForm } from '@/components/search/SchoolSearchForm';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecents } from '@/hooks/useRecents';
import { useSchoolSearch } from '@/hooks/useSchoolSearch';

const PAGE_SIZE = 10;
const DEFAULT_OFFICE_CODE = 'B10';

/**
 * 홈 검색 페이지 전체 상호작용을 오케스트레이션하는 클라이언트 컴포넌트다.
 */
export function SearchPage() {
  const [officeCode, setOfficeCode] = useState(DEFAULT_OFFICE_CODE);
  const [schoolName, setSchoolName] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { favorites, isFavorite, removeFavorite, toggleFavorite } = useFavorites();
  const { recents, pushRecent, removeRecent } = useRecents();
  const { status, results, totalCount, errorMessage, search, reset } = useSchoolSearch();

  useErrorMessage(status === 'error', errorMessage ?? '학교 검색 중 오류가 발생했습니다.', {
    dedupeKey: 'search-page:error',
  });

  const hasMore = results.length > visibleCount;

  const resultSummary = useMemo(() => {
    if (status !== 'success') {
      return null;
    }

    return `총 ${totalCount.toLocaleString()}건`;
  }, [status, totalCount]);

  const handleSubmit = async () => {
    setVisibleCount(PAGE_SIZE);
    await search(officeCode, schoolName);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 md:px-6">
      <header className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h1 className="text-xl font-black text-[var(--text)]">학교 정보 조회</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">시도교육청과 학교명을 선택해 학교를 검색하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <MessageModeToggle />
          <ThemeToggle />
        </div>
      </header>

      <SchoolSearchForm
        officeCode={officeCode}
        defaultOfficeCode={DEFAULT_OFFICE_CODE}
        schoolName={schoolName}
        onOfficeChange={setOfficeCode}
        onSchoolNameChange={setSchoolName}
        onSubmit={handleSubmit}
        onReset={() => {
          setVisibleCount(PAGE_SIZE);
          reset();
        }}
        isLoading={status === 'loading'}
        officeSelect={<OfficeSelect value={officeCode} onChange={setOfficeCode} />}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <RecentSchools items={recents} onRemove={removeRecent} />
        <FavoriteSchools items={favorites} onRemove={removeFavorite} />
      </section>

      <section className="grid gap-3">
        <h2 className="section-title">검색 결과</h2>
        <p aria-live="polite" className="section-subtitle">
          {resultSummary ?? '검색 조건을 입력한 뒤 조회를 실행해 주세요.'}
        </p>

        {status === 'loading' ? <LoadingState description="학교 목록을 조회하고 있습니다." skeletonCount={5} /> : null}

        {status === 'empty' ? (
          <EmptyState
            message="조건에 맞는 학교가 없습니다. 교육청 또는 학교명을 바꿔 다시 시도해 주세요."
          />
        ) : null}

        {status === 'error' ? (
          <ErrorState
            message="메시지 팝업을 확인한 뒤 다시 시도해 주세요."
            retry={<RetryButton onRetry={handleSubmit} />}
          />
        ) : null}

        {status === 'success' ? (
          <SchoolList
            schools={results}
            visibleCount={visibleCount}
            onMore={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            hasMore={hasMore}
            isFavorite={isFavorite}
            onFavoriteToggle={toggleFavorite}
            onBeforeNavigate={pushRecent}
          />
        ) : null}
      </section>
    </div>
  );
}
