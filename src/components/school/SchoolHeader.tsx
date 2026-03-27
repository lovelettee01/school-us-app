'use client';

import Link from 'next/link';

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
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {detail.officeName} · {detail.schoolType}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleFavorite}
            className="min-h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)]"
          >
            {isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          </button>
          <Link
            href="/"
            className="min-h-11 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-contrast)]"
          >
            홈으로
          </Link>
        </div>
      </div>

      <dl className="grid gap-2 text-sm text-[var(--text-muted)] md:grid-cols-2">
        <div>
          <dt className="font-semibold text-[var(--text)]">도로명 주소</dt>
          <dd>{detail.addressRoad || '정보 없음'}</dd>
        </div>
        {detail.addressJibun ? (
          <div>
            <dt className="font-semibold text-[var(--text)]">지번 주소</dt>
            <dd>{detail.addressJibun}</dd>
          </div>
        ) : null}
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
