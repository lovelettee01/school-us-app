/**
 * 앱 전반에서 공통으로 사용하는 UI 비동기 상태 집합 타입이다.
 * 서버/클라이언트 패칭 결과를 동일한 패턴으로 표현하기 위해 사용한다.
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

/**
 * 비동기 상태의 표준 형태를 정의한다.
 * status와 함께 data/errorMessage를 선택적으로 포함한다.
 */
export interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  errorMessage?: string;
}
