import type { RouteLinkPayload } from '@/types/school';

/**
 * 학교 좌표/주소 기반 카카오맵 길찾기 링크를 생성한다.
 */
export function buildKakaoRouteUrl(payload: RouteLinkPayload): string {
  const name = encodeURIComponent(payload.schoolName);

  if (typeof payload.lat === 'number' && typeof payload.lng === 'number') {
    return `https://map.kakao.com/link/to/${name},${payload.lat},${payload.lng}`;
  }

  const address = encodeURIComponent(payload.addressRoad ?? payload.schoolName);
  return `https://map.kakao.com/?q=${address}`;
}
