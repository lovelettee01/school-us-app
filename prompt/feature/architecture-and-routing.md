# 아키텍처/라우팅 가이드

## 1. 레이어 구조

- `src/app`
  - App Router 엔트리, API Route, 레이아웃
- `src/features`
  - 라우트 단위 화면 컨테이너
- `src/components`
  - 재사용 UI(공통 + 도메인)
- `src/hooks`
  - 화면 중심 상태/비동기 로직
- `src/lib`
  - API 서비스, mapper, validator, util, storage, kakao
- `src/store`
  - 전역 Zustand store
- `src/types`
  - 도메인/공통 타입

## 2. 라우트 구성

### 2.1 페이지 라우트
- `/` -> `src/app/page.tsx` -> `SearchPage`
- `/school/[schoolKey]` -> `src/app/school/[schoolKey]/page.tsx` -> `SchoolDetailPage`
- `/component-guide` -> `src/app/component-guide/page.tsx` -> `ComponentGuidePage`

### 2.2 API 라우트
- `/api/neis/schools`
- `/api/neis/school`
- `/api/neis/meals`
- `/api/neis/timetable`

모든 라우트는 `GET`이며 클라이언트는 외부 NEIS가 아니라 내부 API만 호출한다.

## 3. 컨테이너 컴포넌트 역할

### 3.1 `src/features/search/search-page.tsx`
- 검색 조건 상태 관리
- `useSchoolSearch`, `useFavorites`, `useRecents` 조합
- 상태별 렌더링(`LoadingState`, `EmptyState`, `ErrorState`)
- 에러는 `useErrorMessage`로 전역 메시지 발행

### 3.2 `src/features/school/school-detail-page.tsx`
- 학교 상세 공통데이터 로딩(`useSchoolDetail`)
- 탭(`info`, `meal`, `timetable`) URL 동기화
- 탭별 하위 컴포넌트 렌더링

### 3.3 `src/features/component-guide/component-guide-page.tsx`
- 공통 컴포넌트 시연/실습
- Props별 예제/상태 비교

## 4. 레이아웃 전역 구성

`src/app/layout.tsx`에서 아래 전역 요소를 제공한다.

- 테마 초기화 스크립트
- `MessageToastViewport`
- `MessagePopupHost`

이 구조 덕분에 어떤 라우트에서도 동일한 메시지 UX를 사용할 수 있다.

## 5. 신규 기능 라우팅 추가 절차

1. `src/app/{route}/page.tsx` 생성
2. `src/features/{feature}/{feature}-page.tsx` 생성
3. 필요한 도메인 컴포넌트 분리(`src/components/{feature}`)
4. API 필요 시 `src/app/api/{domain}` 및 `src/lib/api` 확장
5. 전역 메시지/테마 UX 일관성 유지

## 6. 구조 점검 체크리스트

- [ ] 라우트 파일은 엔트리 역할만 하고 비즈니스는 features/hook으로 이동했는가
- [ ] API Route는 파라미터 추출 + 서비스 위임만 수행하는가
- [ ] 도메인 타입이 `src/types`에 정리되어 있는가
- [ ] 상태별(loading/empty/error/success) UI가 분리되어 있는가
