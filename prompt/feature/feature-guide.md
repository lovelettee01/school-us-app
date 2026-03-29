# school-us-app 기능/기술 스택 통합 가이드

## 1. 문서 목적
이 문서는 `school-us-app` 전체 소스의 기능 구조와 기술 스택 사용 방법을 실무 기준으로 정리한 가이드다.

- 기능별 구조를 빠르게 파악한다.
- 신규 기능(서비스)을 기존 패턴에 맞춰 안정적으로 추가한다.
- Zustand, Kakao Map, 메시지 시스템, API 라우트, 훅 계층을 일관되게 사용한다.

## 2. 빠른 네비게이션

- [아키텍처/라우팅 가이드](./architecture-and-routing.md)
- [기능 도메인 세분화 가이드](./feature-domain-breakdown.md)
- [서비스/API 구현 가이드](./service-and-api-guide.md)
- [Zustand 상태관리 가이드](./zustand-guide.md)
- [Kakao Map 적용 가이드](./kakao-map-guide.md)
- [훅/클라이언트 캐시 가이드](./hooks-and-cache-guide.md)
- [UI 컴포넌트/메시지 시스템 가이드](./ui-and-message-guide.md)
- [스토리지/환경변수/테마 가이드](./storage-env-theme-guide.md)
- [테스트/검증/운영 가이드](./testing-and-operations-guide.md)

## 3. 프로젝트 핵심 요약

### 3.1 기술 스택
- 프레임워크: Next.js 16 App Router
- UI: React 19 + TailwindCSS v4
- 언어: TypeScript strict
- 상태관리: Zustand
- 테스트: Vitest + Testing Library
- 지도: Kakao Maps JavaScript SDK

### 3.2 기능 도메인
- 학교 검색 (`/`)
- 학교 상세 (`/school/[schoolKey]`)
  - 기본정보/지도
  - 급식
  - 시간표
- 컴포넌트 가이드 (`/component-guide`)
- 전역 UX
  - 메시지 토스트/팝업
  - 테마 전환
  - 즐겨찾기/최근조회

### 3.3 데이터 흐름(요약)
1. 화면(Container)에서 훅 호출
2. 훅이 내부 API Route(`/api/neis/*`) 요청
3. API Route가 서비스(`src/lib/api/*.ts`) 호출
4. 서비스가 `requestNeis`로 외부 NEIS 호출
5. Mapper/Validator로 정규화 후 `ApiResult` 반환
6. 훅이 상태 갱신 + 전역 메시지 발행

## 4. 서비스 구현 표준(요약)

### 4.1 새 서비스 추가 기본 규칙
1. 타입 먼저 정의 (`src/types/*`)
2. 검증기 추가 (`src/lib/validators/*`)
3. API 서비스 함수 추가 (`src/lib/api/*`)
4. Mapper 추가 (`src/lib/mappers/*`)
5. API Route 추가 (`src/app/api/*/route.ts`)
6. 클라이언트 훅 추가 (`src/hooks/*`)
7. UI 연결 (`src/features/*`, `src/components/*`)
8. 테스트 작성 (`*.test.ts`)

### 4.2 실패 처리 표준
- 비즈니스/입력오류: `VALIDATION_ERROR`
- 외부 서비스/네트워크: `NETWORK_ERROR`, `TIMEOUT`, `UPSTREAM_ERROR`
- 정상이지만 결과없음: `EMPTY`
- 사용자 노출: 인라인 오류 대신 전역 메시지(토스트/팝업)

## 5. Phase 기반 실행 체크리스트

### Phase A. 구조 이해
- [ ] 라우트와 기능 경계 파악 (`src/app`, `src/features`)
- [ ] API/Mapper/Validator 호출 흐름 파악 (`src/lib`)
- [ ] 공통 상태 스토어 구조 파악 (`src/store`)

### Phase B. 기능(서비스) 확장
- [ ] 신규 타입/검증/서비스/API Route 구현
- [ ] 화면 훅과 UI 연결
- [ ] 메시지 정책(토스트/팝업/auto) 적용

### Phase C. UX/상태 일관성
- [ ] 로딩/빈상태/오류상태 컴포넌트 적용
- [ ] 캐시 TTL/중복요청 제어 적용
- [ ] 로컬 저장소(테마/최근/즐겨찾기) 동작 확인

### Phase D. 품질 검증
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] 변경 영향이 크면 `npm run build`

## 6. 권장 작업 순서
1. [아키텍처/라우팅 가이드](./architecture-and-routing.md) 확인
2. [서비스/API 구현 가이드](./service-and-api-guide.md)로 서버 경계 설계
3. [훅/클라이언트 캐시 가이드](./hooks-and-cache-guide.md)로 화면 연결
4. [Zustand 상태관리 가이드](./zustand-guide.md), [UI 컴포넌트/메시지 가이드](./ui-and-message-guide.md)로 UX 일관성 확보
5. [테스트/검증/운영 가이드](./testing-and-operations-guide.md)로 마무리
