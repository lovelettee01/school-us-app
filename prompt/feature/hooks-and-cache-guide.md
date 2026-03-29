# 훅/클라이언트 캐시 가이드

## 1. 훅 계층 역할

`src/hooks`는 화면 컨테이너와 API/스토어 사이 어댑터 역할을 담당한다.

- API 호출/상태 머신 관리
- 캐시/중복요청 제어
- 전역 메시지 연동
- 로컬 저장소 연동

## 2. 데이터 조회 훅

### 2.1 `useSchoolSearch`
- 상태: `idle | loading | success | empty | error`
- 캐시 TTL: 5분
- 키: `officeCode:schoolName`
- 이전 요청 취소: `AbortController`

### 2.2 `useSchoolDetail`
- 상태: `loading | success | empty | error`
- 캐시 TTL: 10분
- 키: `schoolKey`
- `parseSchoolKey`로 URL 파라미터 검증

### 2.3 `useMeals`
- 상태: `idle | loading | success | empty | error`
- 캐시 TTL: 5분
- 키: `meal:{office}:{school}:{from}:{to}`

### 2.4 `useTimetable`
- 상태: `idle | loading | success | empty | error`
- 캐시 TTL: 5분
- 키: `time:{office}:{school}:{level}:{grade}:{class}:{from}:{to}`

## 3. UX 보조 훅

- `useCurrentLocation`: 위치 권한 요청/좌표 수집
- `useErrorMessage`: 동일 에러 메시지 1회 전역 발행
- `useTheme`: 테마 상태 + DOM 반영 + 저장
- `useMessageMode`: 메시지 모드 상태 + 저장
- `useFavorites`: 즐겨찾기 토글(최대 10개)
- `useRecents`: 최근 조회(최대 10개)

## 4. 신규 데이터 훅 작성 표준

1. 상태 타입 정의
2. 캐시 필요 여부 판단(TTL 명시)
3. API 호출 함수 구현
4. 오류/빈결과/성공 분기
5. 필요 시 `useErrorMessage` 연동

### 4.1 템플릿

```ts
'use client';

import { useState } from 'react';

export function useDomainData() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'empty' | 'error'>('idle');
  const [items, setItems] = useState<unknown[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    setStatus('loading');
    setErrorMessage(undefined);
    try {
      // fetch + parse
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('데이터를 불러오지 못했습니다.');
    }
  };

  return { status, items, errorMessage, fetchData };
}
```

## 5. 캐시 운영 가이드

- 캐시는 화면 응답성 개선을 위해 훅 내부 `Map`으로 유지한다.
- 캐시 key는 요청 조건 전체를 반영해야 한다.
- TTL이 지나면 재요청한다.
- 에러 응답도 캐시에 들어가므로 dedupe 효과가 생긴다.

## 6. 체크리스트

- [ ] 훅 상태 전이가 명확한가
- [ ] 캐시 key 충돌 가능성이 없는가
- [ ] 에러 메시지가 사용자 문구로 정리되어 있는가
- [ ] 요청 중복/취소 처리가 필요한 훅에 반영되었는가
