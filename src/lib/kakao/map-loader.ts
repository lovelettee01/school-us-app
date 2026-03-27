import { getPublicEnv } from '@/lib/env';

let sdkPromise: Promise<void> | null = null;

/**
 * 카카오 지도 SDK를 1회만 로드하기 위한 로더 함수다.
 */
export function loadKakaoMapSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('브라우저 환경에서만 사용할 수 있습니다.'));
  }

  if (window.kakao?.maps) {
    return Promise.resolve();
  }

  if (sdkPromise) {
    return sdkPromise;
  }

  const { kakaoMapAppKey } = getPublicEnv();
  if (!kakaoMapAppKey) {
    return Promise.reject(new Error('카카오 지도 앱 키가 설정되지 않았습니다.'));
  }

  sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${kakaoMapAppKey}&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => resolve());
    };
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'));
    };

    document.head.appendChild(script);
  });

  return sdkPromise;
}
