import { describe, expect, it } from 'vitest';

import { calculateDistanceMeters, formatDistance } from '@/lib/kakao/distance';

/**
 * 거리 계산 유틸의 결과 범위를 검증한다.
 */
describe('distance util', () => {
  it('동일 좌표 거리는 0에 가깝다', () => {
    const distance = calculateDistanceMeters({ lat: 37.5665, lng: 126.978 }, { lat: 37.5665, lng: 126.978 });
    expect(distance).toBeLessThan(1);
  });

  it('서울시청-남산타워 거리는 약 1km~3km 범위다', () => {
    const distance = calculateDistanceMeters({ lat: 37.5662952, lng: 126.9779451 }, { lat: 37.5511694, lng: 126.9882266 });
    expect(distance).toBeGreaterThan(1000);
    expect(distance).toBeLessThan(3000);
  });

  it('거리 포맷을 m/km 규칙으로 출력한다', () => {
    expect(formatDistance(550)).toBe('550m');
    expect(formatDistance(1450)).toBe('1.4km');
  });
});
