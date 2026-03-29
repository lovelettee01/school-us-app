'use client';

import { useEffect, useMemo, useState } from 'react';

import { AppButton } from '@/components/common/Button';
import { BikeIcon, CarIcon, CloseIcon, CopyIcon, DistanceIcon, RouteIcon, WalkIcon } from '@/components/common/ButtonIcons';
import { buildKakaoRouteUrl } from '@/lib/kakao/route-link';
import { calculateDistanceMeters, formatDistance } from '@/lib/kakao/distance';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { useMessageStore } from '@/store/message-store';
import type { SchoolDetail } from '@/types/school';

interface RouteDistancePanelProps {
  detail: SchoolDetail;
  targetPoint?: { lat: number; lng: number };
  onLocationResolved?: (point: { lat: number; lng: number } | undefined) => void;
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
 * 에러/성공 안내는 패널 하단 텍스트 대신 전역 메시지 시스템으로 노출한다.
 */
export function RouteDistancePanel({ detail, targetPoint, onLocationResolved }: RouteDistancePanelProps) {
  const [isDistanceResultClosed, setIsDistanceResultClosed] = useState(false);
  const { status, location, errorMessage, requestLocation } = useCurrentLocation();
  const pushMessage = useMessageStore((state) => state.pushMessage);

  useErrorMessage(Boolean(errorMessage), errorMessage, {
    dedupeKey: `route-distance:location:${detail.schoolKey}`,
  });

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

  const isDistanceResultVisible = Boolean(distanceInfo) && !isDistanceResultClosed;

  /**
   * 거리 계산용 현재 위치가 갱신될 때 부모 패널로 전달해
   * 지도 컴포넌트에서 현재 위치 마커/경로선을 그릴 수 있게 한다.
   */
  useEffect(() => {
    if (!onLocationResolved) {
      return;
    }

    if (!location) {
      onLocationResolved(undefined);
      return;
    }

    onLocationResolved(location);
  }, [location, onLocationResolved]);

  const handleOpenRoute = () => {
    const url = buildKakaoRouteUrl({
      schoolName: detail.schoolName,
      lat: targetPoint?.lat,
      lng: targetPoint?.lng,
      addressRoad: detail.addressRoad,
    });

    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      pushMessage({
        type: 'error',
        title: '길찾기 페이지를 열지 못했습니다.',
        description: '브라우저 팝업 차단 설정을 확인해 주세요.',
        dedupeKey: `route-distance:open-fail:${detail.schoolKey}`,
      });
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
      pushMessage({
        type: 'success',
        title: '길찾기 링크를 복사했습니다.',
        dedupeKey: `route-distance:copy-success:${detail.schoolKey}`,
      });
    } catch {
      pushMessage({
        type: 'error',
        title: '링크 복사에 실패했습니다.',
        description: '잠시 후 다시 시도해 주세요.',
        dedupeKey: `route-distance:copy-fail:${detail.schoolKey}`,
      });
    }
  };

  /**
   * 거리 계산 요청을 처리한다.
   * 결과 카드가 열려 있는 동안에는 재조회하지 않고,
   * 닫힌 상태에서만 기존 지도 오버레이를 초기화한 뒤 새 위치를 요청한다.
   */
  const handleRequestDistance = () => {
    if (!targetPoint || status === 'loading') {
      if (!targetPoint) {
        pushMessage({
          type: 'warning',
          title: '학교 좌표가 없어 거리 계산을 사용할 수 없습니다.',
          dedupeKey: `route-distance:no-target:${detail.schoolKey}`,
        });
      }
      return;
    }

    if (isDistanceResultVisible) {
      return;
    }

    onLocationResolved?.(undefined);
    setIsDistanceResultClosed(false);
    requestLocation();
  };

  /**
   * 거리 계산 결과 카드를 닫고, 지도의 현재 위치 오버레이도 함께 숨긴다.
   */
  const handleCloseDistanceResult = () => {
    setIsDistanceResultClosed(true);
    onLocationResolved?.(undefined);
  };

  return (
    <section className="grid gap-1.5" aria-live="polite">
      <div className="flex flex-wrap gap-2">
        <AppButton
          variant="secondary"
          size="sm"
          onClick={handleOpenRoute}
          leftIcon={<RouteIcon className="h-3.5 w-3.5" />}
        >
          길찾기
        </AppButton>

        <AppButton
          variant="secondary"
          size="sm"
          onClick={() => void handleCopyRouteLink()}
          leftIcon={<CopyIcon className="h-3.5 w-3.5" />}
        >
          링크복사
        </AppButton>

        <AppButton
          variant={isDistanceResultVisible ? 'primary' : 'secondary'}
          size="sm"
          disabled={!targetPoint || status === 'loading'}
          isLoading={status === 'loading'}
          loadingLabel="확인 중"
          onClick={handleRequestDistance}
          leftIcon={<DistanceIcon className="h-3.5 w-3.5" />}
        >
          거리계산
        </AppButton>
      </div>

      {isDistanceResultVisible ? (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-xs text-[var(--success)]">현재 위치 기준 (직진 거리) 약 {distanceInfo?.distanceText}</p>
            <button
              type="button"
              aria-label="거리 계산 결과 닫기"
              onClick={handleCloseDistanceResult}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-bold text-[var(--text-muted)]"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {travelTimeCards.map((item) => {
              const Icon = item.key === 'walk' ? WalkIcon : item.key === 'bike' ? BikeIcon : CarIcon;
              const iconColorClass =
                item.key === 'walk'
                  ? 'text-red-500'
                  : item.key === 'bike'
                    ? 'text-yellow-500'
                    : 'text-blue-500';

              return (
                <article
                  key={item.key}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2"
                >
                  <p className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text)]">
                    <Icon className={`h-3.5 w-3.5 ${iconColorClass}`} />
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {formatDurationToHourMinute(item.minutes)}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <p className="text-xs text-[var(--text-muted)]">거리 계산을 실행하면 현재 위치 기준 예상 이동시간을 확인할 수 있습니다.</p>
      )}
    </section>
  );
}
