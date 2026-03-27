/**
 * 카카오 지도 SDK 전역 타입의 최소 선언이다.
 * 상세한 타입보다 실제 사용 API 중심으로 최소 범위를 정의한다.
 */
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: Record<string, unknown>) => unknown;
        Marker: new (options: Record<string, unknown>) => {
          setMap: (map: unknown) => void;
        };
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: Array<{ y: string; x: string }>, status: string) => void,
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
      };
    };
  }
}

export {};
