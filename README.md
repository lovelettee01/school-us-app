# school-us-app

NEIS(Open API) 기반으로 학교 검색, 상세 정보, 급식, 시간표를 조회하는 Next.js 애플리케이션입니다.  
카카오 지도를 통해 학교 위치/길찾기/거리 계산을 제공하며, 공통 컴포넌트 및 기능 스펙 가이드를 웹에서 확인할 수 있습니다.

## 기술 스택
- Next.js 16 (App Router)
- React 19 + TypeScript (strict)
- TailwindCSS v4
- Zustand
- Vitest + Testing Library

## 주요 기능
- 학교 검색: 시도교육청 + 학교명 조건 검색
- 학교 상세: 기본 정보, 급식, 시간표 탭 제공
- 지도/경로: 카카오 지도 표시, 길찾기 링크, 현재 위치 기반 거리 계산
- 사용자 편의: 최근 조회, 즐겨찾기, 테마(라이트/다크/시스템), 메시지 모드(토스트/팝업/자동)
- 서버 API 라우트: NEIS 호출을 서버에서 프록시하여 클라이언트에 단순화된 응답 제공

## 최근 작업 내역(리팩토링/가이드)

### 1) 가이드 라우팅 통합
- 신규 가이드 허브: `/guide`
- 기능 가이드: `/guide/features`
- 컴포넌트 가이드: `/guide/components`
- 기존 `/component-guide`는 `/guide/components`로 리다이렉트

### 2) 공통 가이드 UI 레이아웃 적용
- 상단 대메뉴 탭(기능/컴포넌트 상호 이동)
- 좌측 메뉴 + 우측 상세 본문 구조
- 모바일 대응 메뉴 버튼 제공
- 좌측 메뉴 클릭 시 URL 쿼리(`?section=`) 기반으로 섹션 이동/유지
- 섹션 전환 시 본문 영역으로 부드러운 스크롤 이동

### 3) 기능 스펙 웹 문서화
- 기능 가이드 섹션: Overview, Architecture, Routing, Service/API, Zustand, Kakao Map, Hooks & Cache, UI & Message, Storage & Env, Testing, Phase Checklist
- 섹션별 연관 원문 문서 열기/경로 복사 기능 제공
- 원문 상세 라우트: `/guide/features/docs/[docSlug]`
  - 좌측 문서 목록 네비게이션
  - 모바일 문서 탭
  - 이전/다음 문서 이동

### 4) 프롬프트 문서 상세화
- `prompt/feature/feature-guide.md` 메인 문서 작성
- 세부 문서 작성:
  - `architecture-and-routing.md`
  - `feature-domain-breakdown.md`
  - `service-and-api-guide.md`
  - `zustand-guide.md`
  - `kakao-map-guide.md`
  - `hooks-and-cache-guide.md`
  - `ui-and-message-guide.md`
  - `storage-env-theme-guide.md`
  - `testing-and-operations-guide.md`

## 가이드 진입 경로
- 가이드 허브: `http://localhost:3000/guide`
- 기능 가이드: `http://localhost:3000/guide/features`
- 컴포넌트 가이드: `http://localhost:3000/guide/components`

## 프로젝트 구조
```text
src/
  app/
    api/neis/                         # 학교/상세/급식/시간표 API Route
    school/[schoolKey]/
    guide/                            # 가이드 허브/기능/컴포넌트 라우트
  features/
    search/                           # 홈 검색 페이지 컨테이너
    school/                           # 상세 페이지 컨테이너
    component-guide/                  # 컴포넌트 가이드 페이지
    feature-guide/                    # 기능 가이드 페이지
  components/
    common/                           # 공통 UI 컴포넌트
    guide/                            # 가이드 공통 UI(상단 탭)
    search/
    school/
  hooks/                              # 화면별 상태/데이터 로딩 훅
  lib/
    api/                              # NEIS API 서비스 계층
    guide/                            # 기능 문서 메타 정보
    kakao/                            # 지도/거리/링크 유틸
    mappers/
    validators/
    storage/
    utils/
  store/                              # Zustand store
  types/                              # 도메인 타입
prompt/
  feature/                            # 기능/기술 스펙 상세 문서
docs/
  deployment-checklist.md
  operations-guide.md
```

## 요구 사항
- Node.js 20+
- npm (`package-lock.json` 기준)

## 시작하기
```bash
npm install
npm run dev
```
- 기본 주소: `http://localhost:3000`

## 환경 변수
루트에 `.env.local` 파일을 생성하고 아래 값을 설정하세요.

```env
# 서버 전용
NEIS_API_KEY=your-neis-api-key
NEIS_API_BASE_URL=https://open.neis.go.kr/hub
NEIS_API_ALLOW_INSECURE_TLS=false

# 클라이언트 공개
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your-kakao-js-key
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_MESSAGE_DISPLAY_MODE=auto
NEXT_PUBLIC_RECENT_MAX_COUNT=10
```

### 환경 변수 설명
- `NEIS_API_KEY`: NEIS Open API 인증키
- `NEIS_API_BASE_URL`: NEIS API 베이스 URL (기본값 `https://open.neis.go.kr/hub`)
- `NEIS_API_ALLOW_INSECURE_TLS`: 개발/테스트 특수 환경에서만 제한적으로 사용
- `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`: 카카오 지도 JavaScript 키
- `NEXT_PUBLIC_DEFAULT_THEME`: `light` | `dark` | `system`
- `NEXT_PUBLIC_MESSAGE_DISPLAY_MODE`: `toast` | `popup` | `auto`
- `NEXT_PUBLIC_RECENT_MAX_COUNT`: 최근 조회 저장 개수

## API 라우트
모든 엔드포인트는 `GET`입니다.

- `/api/neis/schools?officeCode=&schoolName=&page=&pageSize=`
- `/api/neis/school?officeCode=&schoolCode=`
- `/api/neis/meals?officeCode=&schoolCode=&fromYmd=&toYmd=`
- `/api/neis/timetable?officeCode=&schoolCode=&schoolLevel=&grade=&classNo=&fromYmd=&toYmd=`

## 품질 검증 명령
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## 문서
- 기능/기술 스펙: `prompt/feature/*.md`
- 운영 가이드: `docs/operations-guide.md`
- 배포 체크리스트: `docs/deployment-checklist.md`
- 추가 정리 문서: `GIT_BUILD.md`, `REACT_GH_PAGES_ARCHITECTURE.md`

## 라이선스
별도 라이선스가 정의되지 않았습니다. 필요 시 `LICENSE` 파일을 추가하세요.
