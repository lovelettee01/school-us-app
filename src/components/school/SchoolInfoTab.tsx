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
  /**
   * 학교 기본정보 아코디언은 최초 진입 시 펼쳐진 상태로 시작한다.
   */
  const [isInfoAccordionOpen, setIsInfoAccordionOpen] = useState(true);
  const [resolvedPoint, setResolvedPoint] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [currentLocationPoint, setCurrentLocationPoint] = useState<{ lat: number; lng: number } | undefined>(undefined);

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
        <button
          type="button"
          aria-expanded={isInfoAccordionOpen}
          aria-controls="school-basic-info-panel"
          onClick={() => setIsInfoAccordionOpen((prev) => !prev)}
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="text-sm font-bold text-[var(--text)]">학교 기본 정보</h3>
          <span className="text-xs font-semibold text-[var(--text-muted)]">
            {isInfoAccordionOpen ? '접기' : '펼치기'}
          </span>
        </button>
        <div
          id="school-basic-info-panel"
          aria-hidden={!isInfoAccordionOpen}
          className={[
            'overflow-hidden transition-all duration-300 ease-in-out',
            isInfoAccordionOpen ? 'mt-3 max-h-[1200px] opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
        >
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {infoCards.map((item) => (
              <article key={item.key} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <p className="text-xs font-semibold text-[var(--text)]">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SchoolMapPanel
        detail={detail}
        onResolvedPoint={setResolvedPoint}
        currentLocationPoint={currentLocationPoint}
      >
        <RouteDistancePanel detail={detail} targetPoint={resolvedPoint} onLocationResolved={setCurrentLocationPoint} />
      </SchoolMapPanel>
    </div>
  );
}
