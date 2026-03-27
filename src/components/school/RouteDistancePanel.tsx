'use client';

import { useMemo, useState } from 'react';

import { BikeIcon, CarIcon, CopyIcon, DistanceIcon, RouteIcon, WalkIcon } from '@/components/common/ButtonIcons';
import { buildKakaoRouteUrl } from '@/lib/kakao/route-link';
import { calculateDistanceMeters, formatDistance } from '@/lib/kakao/distance';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useErrorToast } from '@/hooks/useErrorToast';
import type { SchoolDetail } from '@/types/school';

interface RouteDistancePanelProps {
  detail: SchoolDetail;
  targetPoint?: { lat: number; lng: number };
}

interface TravelTimeEstimate {
  walkMinutes: number;
  bikeMinutes: number;
  carMinutes: number;
}

interface TravelTimeCardItem {
  key: 'walk' | 'bike' | 'car';
  title: string;
  minutes: number;
}

/**
 * 거리(m)를 기반으로 이동수단별 예상 소요 시간(분)을 계산한다.
 * 도보 4.5km/h, 자전거 16km/h, 차량 35km/h를 기준 속도로 사용한다.
 */
function calculateTravelTimeEstimate(distanceMeters: number): TravelTimeEstimate {
  const walkMetersPerMinute = 4500 / 60;
  const bikeMetersPerMinute = 16000 / 60;
  const carMetersPerMinute = 35000 / 60;

  return {
    walkMinutes: Math.max(1, Math.round(distanceMeters / walkMetersPerMinute)),
    bikeMinutes: Math.max(1, Math.round(distanceMeters / bikeMetersPerMinute)),
    carMinutes: Math.max(1, Math.round(distanceMeters / carMetersPerMinute)),
  };
}

/**
 * 분 단위 시간을 "n시간 m분" 형식으로 변환한다.
 * 예: 135 -> "2시간 15분", 18 -> "0시간 18분"
 */
function formatDurationToHourMinute(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}시간 ${minutes}분`;
}

/**
 * 길찾기 링크와 현재 위치 기반 거리 계산 UI를 제공하는 패널이다.
 */
export function RouteDistancePanel({ detail, targetPoint }: RouteDistancePanelProps) {
  const [routeError, setRouteError] = useState<string | undefined>(undefined);
  const { status, location, errorMessage, requestLocation } = useCurrentLocation();

  useErrorToast(Boolean(errorMessage), errorMessage);
  useErrorToast(Boolean(routeError), routeError);

  const distanceInfo = useMemo(() => {
    if (!location || !targetPoint) {
      return null;
    }

    const meters = calculateDistanceMeters(location, targetPoint);
    return {
      distanceText: formatDistance(meters),
      travelTime: calculateTravelTimeEstimate(meters),
    };
  }, [location, targetPoint]);

  /**
   * 계산된 이동수단별 시간을 카드 렌더링에 필요한 배열 형태로 만든다.
   */
  const travelTimeCards = useMemo<TravelTimeCardItem[]>(() => {
    if (!distanceInfo) {
      return [];
    }

    return [
      { key: 'walk', title: '도보', minutes: distanceInfo.travelTime.walkMinutes },
      { key: 'bike', title: '자전거', minutes: distanceInfo.travelTime.bikeMinutes },
      { key: 'car', title: '차량', minutes: distanceInfo.travelTime.carMinutes },
    ];
  }, [distanceInfo]);

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

  const handleCopyRouteLink = async () => {
    const url = buildKakaoRouteUrl({
      schoolName: detail.schoolName,
      lat: targetPoint?.lat,
      lng: targetPoint?.lng,
      addressRoad: detail.addressRoad,
    });

    try {
      await navigator.clipboard.writeText(url);
      setRouteError('길찾기 링크를 복사했습니다.');
    } catch {
      setRouteError('링크 복사에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <section className="grid gap-1.5" aria-live="polite">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-label="길찾기 열기"
          title="길찾기 열기"
          onClick={handleOpenRoute}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]"
        >
          <RouteIcon className="h-3.5 w-3.5" /> 길찾기
        </button>

        <button
          type="button"
          aria-label="길찾기 링크 복사"
          title="길찾기 링크 복사"
          onClick={() => void handleCopyRouteLink()}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]"
        >
          <CopyIcon className="h-3.5 w-3.5" /> 링크복사
        </button>

        <button
          type="button"
          aria-label={status === 'loading' ? '위치 확인 중' : '거리 계산'}
          title={status === 'loading' ? '위치 확인 중' : '거리 계산'}
          onClick={requestLocation}
          disabled={!targetPoint || status === 'loading'}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]"
        >
          <DistanceIcon className="h-3.5 w-3.5" /> 거리계산
        </button>
      </div>

      {distanceInfo ? (
        <div className="grid gap-2">
          <p className="text-sm text-[var(--success)]">현재 위치 기준 약 {distanceInfo.distanceText}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {travelTimeCards.map((item) => {
              const Icon = item.key === 'walk' ? WalkIcon : item.key === 'bike' ? BikeIcon : CarIcon;

              return (
                <article
                  key={item.key}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3"
                >
                  <p className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text)]">
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {formatDurationToHourMinute(item.minutes)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
      {errorMessage ? <p className="text-sm text-[var(--warning)]">{errorMessage}</p> : null}
      {!targetPoint ? (
        <p className="text-sm text-[var(--warning)]">학교 좌표가 없어 거리 계산을 사용할 수 없습니다.</p>
      ) : null}
      {routeError ? <p className="text-sm text-[var(--danger)]">{routeError}</p> : null}
    </section>
  );
}

