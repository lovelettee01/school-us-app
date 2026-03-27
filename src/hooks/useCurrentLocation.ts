'use client';

import { useState } from 'react';

import type { GeoPoint } from '@/types/school';

/**
 * 브라우저 위치 권한 요청과 현재 좌표 취득을 담당하는 훅이다.
 */
export function useCurrentLocation() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'denied' | 'error'>('idle');
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('현재 브라우저는 위치 기능을 지원하지 않습니다.');
      return;
    }

    setStatus('loading');
    setErrorMessage(undefined);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus('success');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setStatus('denied');
          setErrorMessage('거리 계산을 위해 위치 권한이 필요합니다.');
          return;
        }

        setStatus('error');
        setErrorMessage('현재 위치를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      },
    );
  };

  return {
    status,
    location,
    errorMessage,
    requestLocation,
  };
}
