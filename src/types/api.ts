/**
 * NEIS API의 head 영역에 포함되는 공통 메타/결과 객체 타입이다.
 */
export interface NeisResultHead {
  list_total_count?: number;
  RESULT?: {
    CODE: string;
    MESSAGE: string;
  };
}

/**
 * NEIS API 리소스 배열 내부의 단일 블록 타입이다.
 */
export interface NeisRowResponse<T> {
  head?: NeisResultHead[];
  row?: T[];
}

/**
 * NEIS API 전체 응답 봉투(envelope) 타입이다.
 * 리소스 이름 키(ex: schoolInfo)가 동적으로 들어올 수 있어 index signature를 사용한다.
 */
export interface NeisApiEnvelope<T> {
  [resourceName: string]: NeisRowResponse<T>[];
}

/**
 * 공통 API 성공 응답 타입이다.
 */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta?: {
    totalCount?: number;
  };
}

/**
 * 공통 API 실패 응답 타입이다.
 */
export interface ApiFailure {
  ok: false;
  code: 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT' | 'UPSTREAM_ERROR' | 'EMPTY';
  message: string;
  status?: number;
}

/**
 * API 호출 결과의 표준 유니온 타입이다.
 */
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
