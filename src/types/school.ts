/**
 * schoolKey는 officeCode-schoolCode 포맷을 사용하는 문자열 타입이다.
 */
export type SchoolKey = `${string}-${string}`;

/**
 * 검색 결과 카드에서 사용하는 학교 요약 정보 모델이다.
 */
export interface SchoolSummary {
  schoolKey: SchoolKey;
  officeCode: string;
  officeName: string;
  schoolCode: string;
  schoolName: string;
  schoolType: string;
  addressRoad: string;
  tel?: string;
}

/**
 * 상세 페이지 헤더/탭에서 사용하는 확장 학교 정보 모델이다.
 */
export interface SchoolDetail extends SchoolSummary {
  orgType?: string;
  regionName?: string;
  homepage?: string;
  addressJibun?: string;
  coeduType?: string;
  lat?: number;
  lng?: number;
}

/**
 * 학교 검색 폼/요청 파라미터 타입이다.
 */
export interface SchoolSearchParams {
  officeCode: string;
  schoolName: string;
  page?: number;
  pageSize?: number;
}

/**
 * 즐겨찾기 저장 구조 타입이다.
 */
export interface FavoriteSchool {
  schoolKey: SchoolKey;
  schoolName: string;
  officeName: string;
  schoolType?: string;
  updatedAt: string;
}

/**
 * 최근 조회 저장 구조 타입이다.
 */
export interface RecentSchool {
  schoolKey: SchoolKey;
  schoolName: string;
  officeName: string;
  viewedAt: string;
}

/**
 * 지도/거리 계산에서 사용하는 지점 타입이다.
 */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * 길찾기/거리 패널에서 표현하는 계산 결과 타입이다.
 */
export interface RouteDistanceInfo {
  from?: GeoPoint;
  to: GeoPoint;
  distanceMeters?: number;
  distanceText?: string;
  canNavigate: boolean;
}

/**
 * 외부 길찾기 URL 생성 시 사용하는 입력 payload 타입이다.
 */
export interface RouteLinkPayload {
  schoolName: string;
  lat?: number;
  lng?: number;
  addressRoad?: string;
}
