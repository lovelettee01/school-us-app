# school-us-app 재구축 전체 계획서 (Source-of-Truth)

## 0. 문서 목적
- 현재 저장소(`school-us-app`)의 구현 상태를 기준으로, 동일 기능/동일 품질을 처음부터 다시 구축하기 위한 실행 계획을 정의한다.
- 이 문서는 "구현 가이드"가 아니라 "구현 순서/완료 기준/검증 기준"을 명시하는 프로젝트 플랜 문서다.

## 1. 현재 기준 기능 범위(동결)
- 홈 검색 화면(`/`)
- 학교 상세 화면(`/school/[schoolKey]`)
- 상세 탭 3종: `학교정보`, `급식`, `시간표`
- 서버 API Route 4종
  - `/api/neis/schools`
  - `/api/neis/school`
  - `/api/neis/meals`
  - `/api/neis/timetable`
- 사용자 편의 기능
  - 즐겨찾기(LocalStorage)
  - 최근 조회(LocalStorage)
  - 테마(라이트/다크/시스템 + LocalStorage + 초기 스크립트)
  - 토스트 알림(Zustand)
- 지도/경로 기능
  - 카카오맵 SDK 로드
  - 학교 좌표/주소 기반 지도 표시
  - 길찾기 링크 열기/복사
  - 현재 위치 기반 직선거리 + 이동시간 추정

## 2. 재구축 원칙
- 기술 스택 고정: Next.js(App Router) + React + TypeScript(strict) + TailwindCSS + Zustand
- API 계약 유지: 현재 `ApiResult` 유니온 및 오류 코드 체계 유지
- 라우팅 키 규칙 유지: `schoolKey = {officeCode}-{schoolCode}`
- 화면 상태 체계 유지: `idle/loading/success/empty/error`
- 입력 검증 우선: 서버/클라이언트 이중 검증 유지
- 캐시 전략 유지: 검색/상세/급식/시간표 훅의 메모리 캐시 TTL 구조 유지

## 3. Phase별 구현 계획

## Phase 0. 착수 및 기준선 확정
### 목표
- 재구축 범위와 동작 동등성 기준을 확정한다.

### 작업
- 현재 기능 명세 동결(본 문서 기준)
- 환경 변수 계약 확정
  - `NEIS_API_KEY`
  - `NEIS_API_BASE_URL`
  - `NEIS_API_ALLOW_INSECURE_TLS`
  - `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`
  - `NEXT_PUBLIC_DEFAULT_THEME`
  - `NEXT_PUBLIC_RECENT_MAX_COUNT`
- 완료 정의(Definition of Done) 확정
  - 홈 검색, 상세 3탭, 지도/거리, 테마, 저장소 기능 동일 동작

### 산출물
- 본 문서
- 화면별 상세 플랜
  - `prompt/school_plan_home.md`
  - `prompt/school_plan_detail.md`

---

## Phase 1. 프로젝트 골격 및 개발 표준 구성
### 목표
- 빌드 가능한 기본 앱 골격과 개발 규칙을 준비한다.

### 작업
- Next.js App Router 기본 구조 생성
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/school/[schoolKey]/page.tsx` 라우트 구성
- 글로벌 스타일/테마 토큰(`globals.css`) 구성
- 절대 경로 alias 및 TypeScript strict 설정
- ESLint/Vitest 기본 설정 구성
- 공통 타입 디렉터리 초기화(`src/types`)

### 완료 기준
- `npm run typecheck`, `npm run lint`, `npm run test` 기본 통과

---

## Phase 2. 도메인 타입/유틸/검증 계층 구축
### 목표
- API/화면 전반에서 사용하는 도메인 계약을 먼저 고정한다.

### 작업
- 타입 정의
  - `ApiResult`, `ApiFailure`, `NeisApiEnvelope`
  - `SchoolSummary`, `SchoolDetail`, `MealItem`, `TimetableItem`
  - `ThemeMode`, `GeoPoint`
- 유틸 구현
  - 날짜 유틸(`toYmd`, `ymdToDashed`, `getWeekRangeYmd`)
  - 학교 키 유틸(`makeSchoolKey`, `parseSchoolKey`)
  - 학교급 분기 유틸(`resolveSchoolLevel`)
- 검증기 구현
  - 검색 입력 검증
  - 시간표 요청 검증

### 완료 기준
- 유틸/매퍼/검증기 단위 테스트 통과

---

## Phase 3. 서버 API 계층 구현(NEIS 프록시)
### 목표
- 클라이언트는 내부 API만 사용하도록 서버 경계를 완성한다.

### 작업
- 환경 변수 로더(`lib/env.ts`) 구현
- NEIS 공통 클라이언트 구현
  - query 빌더
  - timeout + retry
  - envelope 파싱
  - 오류 코드 매핑(`VALIDATION_ERROR/NETWORK_ERROR/TIMEOUT/UPSTREAM_ERROR/EMPTY`)
- 도메인 API 모듈 구현
  - 학교 검색/상세
  - 급식
  - 시간표(학교급별 resource 분기)
- API Route 4종 구현
  - 쿼리 파싱
  - 도메인 API 호출
  - validation 오류는 400, 그 외는 200 + 실패 payload 반환 정책 적용

### 완료 기준
- 각 API Route가 계약된 `ApiResult` 형태로 응답
- 잘못된 파라미터/빈 결과/외부 장애 케이스 처리 확인

---

## Phase 4. 전역 UI 인프라 구축
### 목표
- 모든 화면에서 재사용되는 상태 UI/토스트/테마를 먼저 안정화한다.

### 작업
- 공통 상태 컴포넌트
  - `LoadingState`, `ErrorState`, `EmptyState`, `InlineFieldError`, `RetryButton`
- Zustand 스토어
  - `theme-store`
  - `toast-store`
- 훅
  - `useTheme`(저장값 + 시스템 모드 + DOM 반영)
  - `useErrorToast`(중복 메시지 방지)
- 레이아웃
  - 초기 테마 적용 인라인 스크립트
  - `ToastViewport` 전역 배치

### 완료 기준
- SSR/CSR 전환 시 테마 깜빡임 최소화
- 에러 발생 시 토스트 정상 누적/자동 제거

---

## Phase 5. 홈 검색 화면 구현
### 목표
- 학교 검색 플로우와 저장형 편의 기능을 완성한다.

### 작업
- 검색 페이지 컨테이너(`SearchPage`) 구현
- 컴포넌트 구현
  - `OfficeSelect`
  - `SchoolSearchForm`(엔터 제출/초기화)
  - `SchoolList`, `SchoolCard`(더보기 + 상세 이동)
  - `RecentSchools`, `FavoriteSchools`
- 훅 구현
  - `useSchoolSearch`(검증, 로딩 상태, 캐시 TTL 5분, abort)
  - `useRecents`(최대 10개, 중복 제거 최신화)
  - `useFavorites`(최대 10개, 토글, 초과 토스트)
- LocalStorage 모듈 구현
  - favorites / recents / theme

### 완료 기준
- 검색 성공/빈결과/오류/재시도 UX 동작
- 최근 조회/즐겨찾기 저장 및 삭제 동작
- 상세 이동 전 recent 반영

---

## Phase 6. 상세 페이지 기본 구조 및 탭 전환 구현
### 목표
- 상세 페이지의 데이터 로딩/탭 라우팅/헤더 동작을 완성한다.

### 작업
- `SchoolDetailPage` 컨테이너 구현
  - `schoolKey` 파싱
  - 상세 데이터 조회 훅 연결(`useSchoolDetail`, TTL 10분)
  - URL query `tab` 동기화(`info|meal|timetable`)
- `SchoolHeader` 구현
  - 대표 정보
  - 즐겨찾기 토글
  - 홈 이동
- `Tabs` 구현
  - 접근성(role/tablist/tab/tabpanel)
  - 좌우 방향키 전환

### 완료 기준
- 상세 초기 로딩/빈값/오류/재시도 동작
- 탭 URL 직접 접근 및 새로고침 시 탭 복원

---

## Phase 7. 탭1(학교정보/지도/거리) 구현
### 목표
- 지도 렌더링과 위치 기반 부가기능을 완성한다.

### 작업
- `SchoolInfoTab` 구현
  - 기본정보 아코디언
  - 지도 + 거리패널 조합
- `SchoolMapPanel` 구현
  - SDK 1회 로드
  - 좌표 우선 표시, 없으면 주소 지오코딩
  - 실패/빈좌표 상태 처리 및 주소 복사
  - 현재 위치 마커 + 학교-현재 위치 라인 오버레이
- `RouteDistancePanel` 구현
  - 현재 위치 권한 요청(`useCurrentLocation`)
  - haversine 거리 계산
  - 도보/자전거/차량 시간 추정
  - 길찾기 링크 열기/복사

### 완료 기준
- 좌표 있음/없음/지오코딩 실패/SDK 실패 시나리오 각각 정상 처리
- 거리 계산 결과 닫기 시 오버레이 제거

---

## Phase 8. 탭2(급식) 구현
### 목표
- 기간 조회형 급식 UI와 상세 데이터 표현을 완성한다.

### 작업
- `useMeals` 구현(TTL 5분)
- `MealTab` 구현
  - 시작일/종료일(date input)
  - 조회 버튼/재시도
  - 정렬/아코디언(기본 첫 항목 open)
  - TODAY 배지
  - 메뉴 라인 파싱 + 알레르기 코드 뱃지
  - 알레르기 가이드 툴팁
  - 영양/원산지/열량 카드
- 급식 매퍼 구현
  - HTML `<br>` 정리
  - 엔티티 치환

### 완료 기준
- 날짜 범위 검증 오류 처리
- 빈급식/오류/성공 상태별 UI 정상

---

## Phase 9. 탭3(시간표) 구현
### 목표
- 학년/학급/조회기준일 기반 시간표 조회를 완성한다.

### 작업
- `useTimetable` 구현(TTL 5분)
- `TimetableTab` 구현
  - 학교급 판별 실패 예외 처리
  - 주간/일자 토글
  - 기준일 date input
  - 학년/학급 select
  - 조회 버튼(조건 충족 시 활성)
  - 날짜 x 교시 매트릭스 테이블 렌더링
- 시간표 매퍼 구현
  - 리소스 분기(`els/mis/hisTimetable`)
  - 교시/날짜 정렬

### 완료 기준
- 학년/학급 미선택 경고 상태
- 빈 시간표/오류/성공 상태 및 재시도 동작

---

## Phase 10. 접근성/품질/회귀 검증
### 목표
- 구현 완료 후 기능 동등성과 안정성을 증명한다.

### 작업
- 정적 검증(필수)
  - `npm run typecheck`
  - `npm run lint`
- 테스트 실행
  - `npm run test`
  - 핵심 유틸/매퍼/스토리지 회귀 테스트 확인
- 빌드 검증
  - `npm run build`
- 수동 시나리오 검증
  - 홈 검색 → 상세 이동 → 3탭 확인
  - 테마 전환/새로고침 유지
  - 즐겨찾기/최근 조회 저장/삭제
  - 지도/거리/길찾기 링크

### 완료 기준
- 필수 명령 모두 통과
- 핵심 사용자 시나리오 수동 검증 완료

---

## Phase 11. 배포 및 운영 준비
### 목표
- 실제 운영 가능한 상태로 배포 절차와 운영 대응을 정리한다.

### 작업
- 환경 변수 분리(dev/staging/prod)
- 배포 체크리스트 정리
- 운영 문서 정리
  - 장애 대응(NEIS 장애, Kakao SDK 실패, 위치 권한 거부)
  - 로그 확인 포인트
  - 키/보안 관리

### 완료 기준
- 문서만으로 신규 인원이 배포/장애 대응 가능

## 4. 화면별 상세 플랜 문서
- 홈 화면 플랜: `prompt/school_plan_home.md`
- 상세 화면 플랜: `prompt/school_plan_detail.md`

## 5. 최종 수용 기준(Release Gate)
- 기능 동등성: 현재 저장소 기능과 UX 흐름이 동일해야 한다.
- 계약 동등성: API 응답 타입과 오류 코드가 동일해야 한다.
- 데이터 동등성: 매퍼/검증/저장소 동작이 동일해야 한다.
- 품질 기준: `typecheck + lint + test + build` 모두 성공해야 한다.
