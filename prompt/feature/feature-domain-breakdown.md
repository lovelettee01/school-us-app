# 기능 도메인 세분화 가이드

## 1. 도메인 맵

### 1.1 검색 도메인
- 엔트리: `src/features/search/search-page.tsx`
- 하위 컴포넌트: `src/components/search/*`
- 훅: `useSchoolSearch`, `useFavorites`, `useRecents`
- API: `/api/neis/schools`
- 서비스: `searchSchools`

핵심 기능:
- 교육청 + 학교명 검색
- 페이징형 더보기(클라이언트 visibleCount)
- 최근조회/즐겨찾기 관리

### 1.2 학교 상세 도메인
- 엔트리: `src/features/school/school-detail-page.tsx`
- 탭: `SchoolInfoTab`, `MealTab`, `TimetableTab`
- 훅: `useSchoolDetail`, `useMeals`, `useTimetable`
- API: `/api/neis/school`, `/api/neis/meals`, `/api/neis/timetable`

핵심 기능:
- 학교 기본정보
- 탭 전환 URL 동기화
- 탭별 조회 조건 기반 데이터 로딩

### 1.3 지도/거리 도메인
- 컴포넌트: `SchoolMapPanel`, `RouteDistancePanel`
- 훅: `useCurrentLocation`
- 라이브러리: `src/lib/kakao/*`

핵심 기능:
- 지도 SDK 로딩
- 학교 위치 렌더링
- 현재 위치 기반 거리/예상시간
- 외부 길찾기 링크

### 1.4 메시지/테마 도메인
- 스토어: `message-store`, `theme-store`
- 훅: `useMessageMode`, `useTheme`, `useErrorMessage`
- UI: `MessageModeToggle`, `ThemeToggle`, `MessageToastViewport`, `MessagePopupHost`

핵심 기능:
- 전역 에러/알림 전달
- 토스트/팝업/자동 모드
- 라이트/다크/시스템 테마

### 1.5 컴포넌트 가이드 도메인
- 엔트리: `/component-guide`
- 기능: 공통 컴포넌트 시연/테스트
- 목적: 디자인 시스템 확장 시 회귀 검증과 사용법 문서화

## 2. 도메인별 확장 포인트

### 2.1 검색 확장
- 검색 조건 추가(예: 학교급, 지역)
- 검색 결과 정렬 옵션
- 서버 페이징/무한스크롤

### 2.2 상세 확장
- 추가 탭(학사일정, 공지)
- 데이터 소스 확장(타 외부 API)

### 2.3 지도 확장
- 다중 마커
- 대중교통 예상시간
- 위치 히스토리

### 2.4 메시지 확장
- 메시지 우선순위
- 동일 소스 rate limit
- 글로벌 무음 모드

## 3. 도메인 신규 추가 절차

1. 도메인 타입 정의
2. API 경계(서비스+route) 작성
3. 화면 컨테이너/컴포넌트 작성
4. 훅으로 상태/요청 분리
5. 전역 메시지/테마 정책 연결
6. 테스트/문서 갱신

## 4. 체크리스트

- [ ] 도메인 경계가 기존 도메인과 충돌하지 않는가
- [ ] API/훅/UI 분리가 유지되는가
- [ ] 전역 UX(메시지/테마/상태표현)가 일관적인가
- [ ] 관련 문서(본 가이드 + 세부 가이드)가 함께 갱신되었는가
