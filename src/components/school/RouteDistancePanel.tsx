'use client';

import { useMemo, useState } from 'react';

import { buildKakaoRouteUrl } from '@/lib/kakao/route-link';
import { calculateDistanceMeters, formatDistance } from '@/lib/kakao/distance';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import type { SchoolDetail } from '@/types/school';

interface RouteDistancePanelProps {
  detail: SchoolDetail;
  targetPoint?: { lat: number; lng: number };
}

/**
 * 길찾기 링크와 현재 위치 기반 거리 계산 UI를 제공하는 패널이다.
 */
export function RouteDistancePanel({ detail, targetPoint }: RouteDistancePanelProps) {
  const [routeError, setRouteError] = useState<string | undefined>(undefined);
  const { status, location, errorMessage, requestLocation } = useCurrentLocation();

  const distanceText = useMemo(() => {
    if (!location || !targetPoint) {
      return null;
    }

    const meters = calculateDistanceMeters(location, targetPoint);
    return formatDistance(meters);
  }, [location, targetPoint]);

  const handleOpenRoute = () => {
    setRouteError(undefined);
    const url = buildKakaoRouteUrl({
      schoolName: detail.schoolName,
      lat: targetPoint?.lat,
      lng: targetPoint?.lng,
      addressRoad: detail.addressRoad,
    });

    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      setRouteError('길찾기 페이지를 열지 못했습니다. 팝업 차단을 확인해 주세요.');
    }
  };

  return (
    <section className="card-surface grid gap-2 p-4" aria-live="polite">
      <h3 className="text-sm font-bold text-[var(--text)]">길찾기/거리</h3>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleOpenRoute}
          className="min-h-11 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-contrast)]"
        >
          길찾기 열기
        </button>

        <button
          type="button"
          onClick={requestLocation}
          disabled={!targetPoint || status === 'loading'}
          className="min-h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)]"
        >
          {status === 'loading' ? '위치 확인 중...' : '거리 계산'}
        </button>
      </div>

      {distanceText ? <p className="text-sm text-[var(--success)]">현재 위치 기준 약 {distanceText}</p> : null}
      {errorMessage ? <p className="text-sm text-[var(--warning)]">{errorMessage}</p> : null}
      {!targetPoint ? (
        <p className="text-sm text-[var(--warning)]">학교 좌표가 없어 거리 계산을 사용할 수 없습니다.</p>
      ) : null}
      {routeError ? <p className="text-sm text-[var(--danger)]">{routeError}</p> : null}
    </section>
  );
}
