'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { AppButton } from '@/components/common/Button';
import { CopyIcon } from '@/components/common/ButtonIcons';
import { ErrorState, RetryButton } from '@/components/common/States';
import { loadKakaoMapSdk } from '@/lib/kakao/map-loader';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import type { SchoolDetail } from '@/types/school';

interface SchoolMapPanelProps {
  /**
   * 지도 렌더링 기준이 되는 학교 상세 데이터다.
   */
  detail: SchoolDetail;
  /**
   * 학교 좌표 해석 완료 시 상위 컴포넌트로 전달하는 콜백이다.
   */
  onResolvedPoint: (point: { lat: number; lng: number } | undefined) => void;
  /**
   * 상위에서 전달받는 현재 위치 좌표다.
   * 학교 위치와 함께 지도 오버레이를 그리는 데 사용한다.
   */
  currentLocationPoint?: { lat: number; lng: number };
  /**
   * 지도 하단 보조 패널 슬롯이다.
   * 예: 거리 계산 패널.
   */
  children?: ReactNode;
}

/**
 * 카카오 지도 SDK를 로드하고 학교 위치를 지도에 렌더링하는 컴포넌트다.
 */
export function SchoolMapPanel({ detail, onResolvedPoint, currentLocationPoint, children }: SchoolMapPanelProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<{ addControl: (control: unknown, position: unknown) => void; setBounds: (bounds: unknown) => void } | null>(null);
  const schoolMarkerRef = useRef<{ setMap: (map: unknown) => void } | null>(null);
  const currentMarkerRef = useRef<{ setMap: (map: unknown) => void } | null>(null);
  const routeLineRef = useRef<{ setMap: (map: unknown) => void } | null>(null);
  const schoolPointRef = useRef<{ lat: number; lng: number } | undefined>(undefined);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'empty'>('loading');
  const [message, setMessage] = useState<string>('지도를 불러오는 중입니다.');

  useErrorMessage(status === 'error', message, {
    dedupeKey: `school-map:${detail.schoolKey}`,
  });

  const initialPoint = useMemo(
    () =>
      detail.lat && detail.lng
        ? {
            lat: detail.lat,
            lng: detail.lng,
          }
        : undefined,
    [detail.lat, detail.lng],
  );

  const hasAddress = useMemo(() => detail.addressRoad.trim().length > 0, [detail.addressRoad]);

  /**
   * 지도 위에 현재 위치 마커와 학교-현재 위치 연결선을 그린다.
   * 기존 오버레이가 있으면 먼저 제거해 중복 렌더링을 방지한다.
   */
  const renderCurrentLocationOverlay = useCallback(
    (locationPoint: { lat: number; lng: number } | undefined) => {
      const map = mapInstanceRef.current;
      const schoolPoint = schoolPointRef.current;
      if (!map || !schoolPoint) {
        return;
      }

      currentMarkerRef.current?.setMap(null);
      routeLineRef.current?.setMap(null);
      currentMarkerRef.current = null;
      routeLineRef.current = null;

      if (!locationPoint) {
        return;
      }

      const schoolLatLng = new window.kakao.maps.LatLng(schoolPoint.lat, schoolPoint.lng);
      const currentLatLng = new window.kakao.maps.LatLng(locationPoint.lat, locationPoint.lng);

      const currentMarker = new window.kakao.maps.Marker({
        position: currentLatLng,
      });
      currentMarker.setMap(map);

      const routeLine = new window.kakao.maps.Polyline({
        path: [schoolLatLng, currentLatLng],
        strokeWeight: 4,
        strokeColor: '#2563EB',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      });
      routeLine.setMap(map);

      const bounds = new window.kakao.maps.LatLngBounds();
      bounds.extend(schoolLatLng);
      bounds.extend(currentLatLng);
      map.setBounds(bounds);

      currentMarkerRef.current = currentMarker;
      routeLineRef.current = routeLine;
    },
    [],
  );

  /**
   * 학교 좌표가 확정되면 공통 지도 초기화 로직을 수행한다.
   * 이 함수는 학교 마커를 고정으로 두고, 이후 현재 위치 오버레이를 다시 그릴 수 있게 상태를 보관한다.
   */
  const initializeMapWithSchoolPoint = useCallback(
    (point: { lat: number; lng: number }) => {
      if (!mapRef.current) {
        return;
      }

      currentMarkerRef.current?.setMap(null);
      routeLineRef.current?.setMap(null);
      schoolMarkerRef.current?.setMap(null);

      const kakaoCenter = new window.kakao.maps.LatLng(point.lat, point.lng);
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: kakaoCenter,
        level: 3,
      });
      map.addControl(new window.kakao.maps.MapTypeControl(), window.kakao.maps.ControlPosition.TOPRIGHT);
      map.addControl(new window.kakao.maps.ZoomControl(), window.kakao.maps.ControlPosition.RIGHT);

      const schoolMarker = new window.kakao.maps.Marker({ position: kakaoCenter });
      schoolMarker.setMap(map);

      mapInstanceRef.current = map;
      schoolMarkerRef.current = schoolMarker;
      schoolPointRef.current = point;

      onResolvedPoint(point);
      setStatus('ready');

      renderCurrentLocationOverlay(currentLocationPoint);
    },
    [currentLocationPoint, onResolvedPoint, renderCurrentLocationOverlay],
  );

  const renderMap = useCallback(async () => {
    setStatus('loading');
    setMessage('지도를 불러오는 중입니다.');

    try {
      await loadKakaoMapSdk();

      if (!mapRef.current) {
        return;
      }

      if (initialPoint) {
        initializeMapWithSchoolPoint(initialPoint);
        return;
      }

      if (!hasAddress) {
        setStatus('empty');
        setMessage('학교 위치 좌표가 없어 지도 표시가 제한됩니다.');
        schoolPointRef.current = undefined;
        onResolvedPoint(undefined);
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(detail.addressRoad, (results, geocodeStatus) => {
        if (geocodeStatus !== window.kakao.maps.services.Status.OK || results.length === 0) {
          setStatus('error');
          setMessage('주소 기반 위치를 찾지 못했습니다.');
          schoolPointRef.current = undefined;
          onResolvedPoint(undefined);
          return;
        }

        const first = results[0];
        const point = {
          lat: Number(first.y),
          lng: Number(first.x),
        };

        initializeMapWithSchoolPoint(point);
      });
    } catch {
      setStatus('error');
      setMessage('지도를 불러오지 못했습니다. 다시 시도해 주세요.');
      schoolPointRef.current = undefined;
      onResolvedPoint(undefined);
    }
  }, [detail.addressRoad, hasAddress, initialPoint, initializeMapWithSchoolPoint, onResolvedPoint]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void renderMap();
  }, [detail.schoolKey, renderMap]);

  /**
   * 거리 계산 버튼으로 현재 위치가 갱신될 때 지도 오버레이를 즉시 동기화한다.
   */
  useEffect(() => {
    if (status !== 'ready') {
      return;
    }

    renderCurrentLocationOverlay(currentLocationPoint);
  }, [currentLocationPoint, renderCurrentLocationOverlay, status]);

  if (status === 'error') {
    const copyAddress = async () => {
      try {
        await navigator.clipboard.writeText(detail.addressRoad);
      } catch {
        // 복사 실패는 치명적 오류가 아니므로 무시한다.
      }
    };

    return (
      <section className="card-surface grid gap-2 p-4" aria-live="polite">
        <h3 className="text-sm font-bold text-[var(--text)]">학교 위치</h3>
        <p className="text-sm text-[var(--text-muted)]">{detail.addressRoad || '주소 정보 없음'}</p>
        <ErrorState
          message="메시지 팝업을 확인한 뒤 다시 시도해 주세요."
          retry={<RetryButton onRetry={() => void renderMap()} label="다시 시도" />}
        />
        {detail.addressRoad ? (
          <AppButton
            variant="secondary"
            onClick={() => void copyAddress()}
            leftIcon={<CopyIcon className="h-4 w-4" />}
          >
            주소 복사
          </AppButton>
        ) : null}
        {children ? <div className="mt-2 border-t border-[var(--border)] pt-3">{children}</div> : null}
      </section>
    );
  }

  return (
    <section className="card-surface grid gap-2 p-4" aria-live="polite">
      <h3 className="text-sm font-bold text-[var(--text)]">학교 위치</h3>
      <p className="text-sm text-[var(--text-muted)]">{detail.addressRoad || '주소 정보 없음'}</p>
      {status === 'empty' ? (
        <div className="grid gap-2">
          <p className="text-sm text-[var(--warning)]">{message}</p>
          {detail.addressRoad ? (
            <AppButton
              variant="secondary"
              onClick={() => void navigator.clipboard.writeText(detail.addressRoad)}
              leftIcon={<CopyIcon className="h-4 w-4" />}
            >
              주소 복사
            </AppButton>
          ) : null}
        </div>
      ) : null}
      {children ? <div className="mt-1 border-b border-[var(--border)] pb-2">{children}</div> : null}
      <div ref={mapRef} className="h-[260px] w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] md:h-[340px]" />
    </section>
  );
}



