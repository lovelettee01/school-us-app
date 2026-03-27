'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { EmptyState, ErrorState, LoadingState, RetryButton } from '@/components/common/States';
import { Tabs, type TabKey } from '@/components/common/Tabs';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { MealTab } from '@/components/school/MealTab';
import { SchoolHeader } from '@/components/school/SchoolHeader';
import { SchoolInfoTab } from '@/components/school/SchoolInfoTab';
import { TimetableTab } from '@/components/school/TimetableTab';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecents } from '@/hooks/useRecents';
import { useSchoolDetail } from '@/hooks/useSchoolDetail';

interface SchoolDetailPageProps {
  schoolKey: string;
}

function normalizeTab(value: string | null): TabKey {
  if (value === 'meal' || value === 'timetable' || value === 'info') {
    return value;
  }
  return 'info';
}

/**
 * 상세 페이지 탭 전환/데이터 로딩 전체를 제어하는 클라이언트 컨테이너다.
 */
export function SchoolDetailPage({ schoolKey }: SchoolDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = normalizeTab(searchParams.get('tab'));

  const { status, detail, errorMessage, retry } = useSchoolDetail(schoolKey);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { pushRecent } = useRecents();

  const activePanel = useMemo(() => {
    if (!detail) {
      return null;
    }

    if (activeTab === 'meal') {
      return <MealTab detail={detail} />;
    }

    if (activeTab === 'timetable') {
      return <TimetableTab detail={detail} />;
    }

    return <SchoolInfoTab detail={detail} />;
  }, [activeTab, detail]);

  useEffect(() => {
    if (detail) {
      pushRecent(detail);
    }
  }, [detail, pushRecent]);

  const handleChangeTab = (tab: TabKey) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('tab', tab);
    router.replace(`/school/${schoolKey}?${next.toString()}`);
  };

  if (status === 'loading') {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <LoadingState description="학교 대표 정보를 조회하고 있습니다." skeletonCount={4} />
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <EmptyState message="학교 정보를 찾을 수 없습니다." />
      </div>
    );
  }

  if (status === 'error' || !detail) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <ErrorState message={errorMessage ?? '학교 정보를 불러오지 못했습니다.'} retry={<RetryButton onRetry={retry} />} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 md:px-6">
      <header className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-muted)]">학교 상세 정보</p>
          <h1 className="text-lg font-black text-[var(--text)]">{detail.schoolName}</h1>
        </div>
        <ThemeToggle />
      </header>

      <SchoolHeader
        detail={detail}
        isFavorite={isFavorite(detail.schoolKey)}
        onToggleFavorite={() => {
          toggleFavorite(detail);
          pushRecent(detail);
        }}
      />

      <Tabs activeTab={activeTab} onChange={handleChangeTab} />
      {activePanel}
    </div>
  );
}
