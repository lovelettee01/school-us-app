'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { CopyIcon } from '@/components/common/ButtonIcons';
import { ErrorState, RetryButton } from '@/components/common/States';
import { loadKakaoMapSdk } from '@/lib/kakao/map-loader';
import { useErrorToast } from '@/hooks/useErrorToast';
import type { SchoolDetail } from '@/types/school';

interface SchoolMapPanelProps {
  detail: SchoolDetail;
  onResolvedPoint: (point: { lat: number; lng: number } | undefined) => void;
  children?: ReactNode;
}

/**
 * 카카오 지도 SDK를 로드하고 학교 위치를 지도에 렌더링하는 컴포넌트다.
 */
export function SchoolMapPanel({ detail, onResolvedPoint, children }: SchoolMapPanelProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'empty'>('loading');
  const [message, setMessage] = useState<string>('지도를 불러오는 중입니다.');

  useErrorToast(status === 'error', message);

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

  const renderMap = useCallback(async () => {
    setStatus('loading');
    setMessage('지도를 불러오는 중입니다.');

    try {
      await loadKakaoMapSdk();

      if (!mapRef.current) {
        return;
      }

      if (initialPoint) {
        const kakaoCenter = new window.kakao.maps.LatLng(initialPoint.lat, initialPoint.lng);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: kakaoCenter,
          level: 3,
        });
        map.addControl(new window.kakao.maps.MapTypeControl(), window.kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(new window.kakao.maps.ZoomControl(), window.kakao.maps.ControlPosition.RIGHT);

        const marker = new window.kakao.maps.Marker({ position: kakaoCenter });
        marker.setMap(map);

        onResolvedPoint(initialPoint);
        setStatus('ready');
        return;
      }

      if (!hasAddress) {
        setStatus('empty');
        setMessage('학교 위치 좌표가 없어 지도 표시가 제한됩니다.');
        onResolvedPoint(undefined);
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(detail.addressRoad, (results, geocodeStatus) => {
        if (geocodeStatus !== window.kakao.maps.services.Status.OK || results.length === 0) {
          setStatus('error');
          setMessage('주소 기반 위치를 찾지 못했습니다.');
          onResolvedPoint(undefined);
          return;
        }

        const first = results[0];
        const point = {
          lat: Number(first.y),
          lng: Number(first.x),
        };

        const kakaoCenter = new window.kakao.maps.LatLng(point.lat, point.lng);
        const map = new window.kakao.maps.Map(mapRef.current as HTMLElement, {
          center: kakaoCenter,
          level: 3,
        });
        map.addControl(new window.kakao.maps.MapTypeControl(), window.kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(new window.kakao.maps.ZoomControl(), window.kakao.maps.ControlPosition.RIGHT);

        const marker = new window.kakao.maps.Marker({ position: kakaoCenter });
        marker.setMap(map);

        onResolvedPoint(point);
        setStatus('ready');
      });
    } catch {
      setStatus('error');
      setMessage('지도를 불러오지 못했습니다. 다시 시도해 주세요.');
      onResolvedPoint(undefined);
    }
  }, [detail.addressRoad, hasAddress, initialPoint, onResolvedPoint]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void renderMap();
  }, [detail.schoolKey, renderMap]);

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
          message={message}
          retry={<RetryButton onRetry={() => void renderMap()} label="다시 시도" />}
        />
        {detail.addressRoad ? (
          <button
            type="button"
            onClick={() => void copyAddress()}
            className="inline-flex min-h-10 w-fit items-center gap-1 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)]"
          >
            <CopyIcon className="h-4 w-4" />
            주소 복사
          </button>
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
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(detail.addressRoad)}
              className="inline-flex min-h-10 w-fit items-center gap-1 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)]"
            >
              <CopyIcon className="h-4 w-4" />
              주소 복사
            </button>
          ) : null}
        </div>
      ) : null}
      {children ? <div className="mt-1 border-b border-[var(--border)] pb-2">{children}</div> : null}
      <div ref={mapRef} className="h-[260px] w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] md:h-[340px]" />
    </section>
  );
}


