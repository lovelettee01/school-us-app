'use client';

import { useState } from 'react';

import { RouteDistancePanel } from '@/components/school/RouteDistancePanel';
import { SchoolMapPanel } from '@/components/school/SchoolMapPanel';
import type { SchoolDetail } from '@/types/school';

interface SchoolInfoTabProps {
  detail: SchoolDetail;
}

interface InfoCardItem {
  key: string;
  title: string;
  value: string;
}

/**
 * 상세 탭1(학교정보/지도) 콘텐츠를 렌더링한다.
 */
export function SchoolInfoTab({ detail }: SchoolInfoTabProps) {
  const [resolvedPoint, setResolvedPoint] = useState<{ lat: number; lng: number } | undefined>(undefined);

  const infoCards: InfoCardItem[] = [
    { key: 'schoolName', title: '학교명', value: detail.schoolName },
    { key: 'officeName', title: '교육청', value: detail.officeName },
    { key: 'schoolType', title: '학교급', value: detail.schoolType },
    { key: 'orgType', title: '설립구분', value: detail.orgType ?? '정보 없음' },
    { key: 'coeduType', title: '남녀공학', value: detail.coeduType ?? '정보 없음' },
    { key: 'tel', title: '대표 연락처', value: detail.tel ?? '정보 없음' },
  ];

  return (
    <div id="panel-info" role="tabpanel" aria-labelledby="tab-info" className="grid gap-3">
      <section className="card-surface p-4">
        <h3 className="text-sm font-bold text-[var(--text)]">학교 기본 정보</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {infoCards.map((item) => (
            <article key={item.key} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
              <p className="text-xs font-semibold text-[var(--text)]">{item.title}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <SchoolMapPanel detail={detail} onResolvedPoint={setResolvedPoint}>
        <RouteDistancePanel detail={detail} targetPoint={resolvedPoint} />
      </SchoolMapPanel>
    </div>
  );
}
