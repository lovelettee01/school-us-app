/**
 * 시간표 분기 기준 학교급 타입이다.
 */
export type SchoolLevel = 'elementary' | 'middle' | 'high';

/**
 * 시간표 조회 요청 파라미터 타입이다.
 */
export interface TimetableQueryParams {
  officeCode: string;
  schoolCode: string;
  schoolLevel: SchoolLevel;
  grade: number;
  classNo: number;
  fromYmd: string;
  toYmd: string;
}

/**
 * 시간표 탭에서 사용하는 내부 렌더 모델 타입이다.
 */
export interface TimetableItem {
  date: string;
  grade: number;
  classNo: number;
  period: number;
  subject: string;
}
