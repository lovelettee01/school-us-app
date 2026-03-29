'use client';

import Link from 'next/link';

import { AppButton } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { HomeIcon, StarIcon } from '@/components/common/ButtonIcons';
import type { SchoolDetail } from '@/types/school';

interface SchoolHeaderProps {
  detail: SchoolDetail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * 학교 상세 상단 대표 정보 헤더 컴포넌트다.
 */
export function SchoolHeader({ detail, isFavorite, onToggleFavorite }: SchoolHeaderProps) {
  return (
    <header className="card-surface grid gap-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[var(--text)]">{detail.schoolName}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-sm text-[var(--text-muted)]">{detail.officeName}</p>
            <Badge variant="neutral" size="sm">
              {detail.schoolType}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <AppButton
            variant={isFavorite ? 'danger' : 'secondary'}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            leftIcon={<StarIcon className="h-4 w-4" filled={isFavorite} />}
          >
            {isFavorite ? '해제' : '즐겨찾기'}
          </AppButton>
          <Link
            href="/"
            className="inline-flex min-h-9 items-center gap-1 rounded-xl bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-contrast)] hover:brightness-95"
          >
            <HomeIcon className="h-4 w-4" />
            홈으로
          </Link>
        </div>
      </div>

      <dl className="grid gap-2 text-sm text-[var(--text-muted)] md:grid-cols-2">
        <div>
          <dt className="font-semibold text-[var(--text)]">도로명 주소</dt>
          <dd>
            {detail.addressJibun ? `(${detail.addressJibun}) ` : ''}
            {detail.addressRoad || '정보 없음'}
          </dd>
        </div>
        {detail.tel ? (
          <div>
            <dt className="font-semibold text-[var(--text)]">전화번호</dt>
            <dd>{detail.tel}</dd>
          </div>
        ) : null}
        {detail.homepage ? (
          <div>
            <dt className="font-semibold text-[var(--text)]">홈페이지</dt>
            <dd>
              <a href={detail.homepage} target="_blank" rel="noreferrer" className="text-[var(--primary)] underline">
                {detail.homepage}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
    </header>
  );
}
