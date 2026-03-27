'use client';

import { useState } from 'react';

import { RouteDistancePanel } from '@/components/school/RouteDistancePanel';
import { SchoolMapPanel } from '@/components/school/SchoolMapPanel';
import type { SchoolDetail } from '@/types/school';

interface SchoolInfoTabProps {
  detail: SchoolDetail;
}

/**
 * 상세 탭1(학교정보/지도) 콘텐츠를 렌더링한다.
 */
export function SchoolInfoTab({ detail }: SchoolInfoTabProps) {
  const [resolvedPoint, setResolvedPoint] = useState<{ lat: number; lng: number } | undefined>(undefined);

  return (
    <div id="panel-info" role="tabpanel" aria-labelledby="tab-info" className="grid gap-3">
      <section className="card-surface p-4">
        <h3 className="text-sm font-bold text-[var(--text)]">학교 기본 정보</h3>
        <dl className="mt-2 grid gap-2 text-sm text-[var(--text-muted)] md:grid-cols-2">
          <div>
            <dt className="font-semibold text-[var(--text)]">학교명</dt>
            <dd>{detail.schoolName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--text)]">교육청</dt>
            <dd>{detail.officeName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--text)]">학교급</dt>
            <dd>{detail.schoolType}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--text)]">설립구분</dt>
            <dd>{detail.orgType ?? '정보 없음'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--text)]">남녀공학</dt>
            <dd>{detail.coeduType ?? '정보 없음'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--text)]">대표 연락처</dt>
            <dd>{detail.tel ?? '정보 없음'}</dd>
          </div>
        </dl>
      </section>

      <SchoolMapPanel detail={detail} onResolvedPoint={setResolvedPoint} />
      <RouteDistancePanel detail={detail} targetPoint={resolvedPoint} />
    </div>
  );
}
