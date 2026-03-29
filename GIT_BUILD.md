# GitHub Pages 빌드/배포 가이드 (`GIT_BUILD.md`)

이 문서는 **현재 `school-us-app` 코드베이스 기준**으로 GitHub Pages에 배포하는 방법을 설명합니다.

## 0. 먼저 알아야 할 핵심 제약

이 프로젝트는 현재 구조상 다음을 사용합니다.
- Next.js App Router
- `src/app/api/neis/*` 서버 API Route
- 서버 전용 환경변수 (`NEIS_API_KEY`)

GitHub Pages는 **정적 파일 호스팅만 지원**하므로:
- Next.js API Route 실행 불가
- 서버 런타임 없음
- 서버 비밀키(`NEIS_API_KEY`) 보관/사용 불가

즉, **현 상태 그대로는 기능이 완전한 배포가 불가능**합니다.

가능하게 하려면 아래 2가지 중 하나를 선택해야 합니다.
1. `API Route`를 외부 백엔드(별도 서버/서버리스)로 분리
2. 기능 축소(NEIS 연동 제거 또는 목업 데이터)

이 문서는 **1번(외부 백엔드 분리)** 기준으로 설명합니다.

---

## 1. 배포 아키텍처

- Frontend: GitHub Pages (정적 export)
- Backend(API): 외부 서버 (예: 기존 자체 서버, Cloudflare Workers, Vercel Functions 등)
- Frontend는 `https://<your-api-domain>`으로 호출

권장 형태:
- 프론트: `https://<github-id>.github.io/<repo-name>/`
- API: `https://api.your-domain.com/neis/...`

---

## 2. 코드 준비 체크리스트

아래 항목을 먼저 반영해야 GitHub Pages에서 정상 동작합니다.

### 2-1. `next.config.ts` 정적 export 설정

필수 설정 예시:

```ts
import type { NextConfig } from 'next';

const isGhPages = process.env.GITHUB_ACTIONS === 'true';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const basePath = isGhPages && repo ? `/${repo}` : '';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
```

설명:
- `output: 'export'`: 정적 파일(`out`) 생성
- `trailingSlash: true`: GitHub Pages 경로 호환성 개선
- `images.unoptimized`: Next Image 최적화 서버 기능 비활성
- `basePath/assetPrefix`: 저장소 페이지(`/<repo-name>`) 대응

### 2-2. API 호출 경로 분리

현재 훅/컴포넌트는 `/api/neis/...` 상대경로를 호출합니다.
GitHub Pages에서는 `/api/*`가 존재하지 않으므로, 아래처럼 바꿔야 합니다.

- `NEXT_PUBLIC_API_BASE_URL` 환경변수 도입
- 클라이언트 호출을 `${NEXT_PUBLIC_API_BASE_URL}/neis/...`로 변경

예:
- 기존: `fetch('/api/neis/schools?...')`
- 변경: `fetch(`${apiBaseUrl}/neis/schools?...`)`

### 2-3. 외부 API 서버 준비

외부 API 서버가 다음 엔드포인트를 제공해야 합니다.
- `GET /neis/schools`
- `GET /neis/school`
- `GET /neis/meals`
- `GET /neis/timetable`

그리고 서버에서:
- `NEIS_API_KEY`를 안전하게 보관
- CORS 허용(프론트 도메인: `https://<github-id>.github.io`)

### 2-4. 정적 export 제약 확인

다음 항목은 정적 export에서 주의가 필요합니다.
- Server Action/Route Handler 의존 기능 사용 금지
- 런타임 서버 렌더링 의존 로직 제거
- 클라이언트 사이드 데이터 페칭 중심으로 구성

---

## 3. 로컬에서 Pages 빌드 검증

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

`next.config.ts`에 `output: 'export'`가 있으면 `out/` 디렉터리가 생성되어야 합니다.

로컬 정적 미리보기 예:

```bash
npx serve out
```

확인 포인트:
- 홈/상세 라우팅 정상
- 정적 자산(스크립트/CSS) 404 없음
- 외부 API 호출 성공(CORS 포함)

---

## 4. GitHub Pages 설정

1. GitHub 저장소 진입
2. `Settings > Pages`
3. `Build and deployment`를 **GitHub Actions**로 선택

---

## 5. GitHub Actions 워크플로우 작성

경로: `.github/workflows/deploy-pages.yml`

```yml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Typecheck
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test

      - name: Build (Static Export)
        env:
          GITHUB_ACTIONS: true
          GITHUB_REPOSITORY: ${{ github.repository }}
          NEXT_PUBLIC_API_BASE_URL: ${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
          NEXT_PUBLIC_KAKAO_MAP_APP_KEY: ${{ secrets.NEXT_PUBLIC_KAKAO_MAP_APP_KEY }}
          NEXT_PUBLIC_DEFAULT_THEME: system
          NEXT_PUBLIC_RECENT_MAX_COUNT: 10
        run: npm run build

      - name: Add .nojekyll
        run: touch out/.nojekyll

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 6. GitHub Secrets 설정

`Settings > Secrets and variables > Actions`에서 추가:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`

주의:
- `NEXT_PUBLIC_*` 값은 브라우저에서 노출됩니다.
- `NEIS_API_KEY`는 절대 프론트/Pages 시크릿으로 넣지 말고 **외부 API 서버에만** 보관하세요.

---

## 7. 사용자/프로젝트 페이지 차이

- 사용자 페이지: `https://<user>.github.io` (repo 이름이 `<user>.github.io`)
  - 보통 `basePath` 불필요
- 프로젝트 페이지: `https://<user>.github.io/<repo>`
  - `basePath`/`assetPrefix` 필요

이 문서의 설정은 프로젝트 페이지에도 동작하도록 작성했습니다.

---

## 8. 배포 후 점검 체크리스트

1. 페이지 진입 시 JS/CSS 404가 없는지 확인
2. 홈 검색 동작 확인
3. 상세 탭(정보/급식/시간표/지도) 확인
4. API 호출 실패 시 CORS/도메인 허용 확인
5. 지도 미표시 시 `NEXT_PUBLIC_KAKAO_MAP_APP_KEY` 및 도메인 등록 확인

---

## 9. 자주 발생하는 문제

### 9-1. 새로고침 시 404
- 원인: 정적 경로/라우팅 설정 불일치
- 조치: `trailingSlash: true`, `basePath` 설정 재확인

### 9-2. 정적 파일 로드 실패
- 원인: `basePath`, `assetPrefix` 누락
- 조치: `next.config.ts` 설정 및 Actions 환경값 확인

### 9-3. API 호출 실패
- 원인: GitHub Pages에는 `/api`가 없음
- 조치: 외부 API 도메인 호출로 변경, CORS 허용

### 9-4. 빌드는 성공했지만 기능 일부 미동작
- 원인: 서버 런타임 의존 코드 존재
- 조치: 정적 export 제약에 맞게 기능 분리/대체

---

## 10. 운영 권장사항

- GitHub Pages는 정적 프론트 배포 전용으로 사용
- API/시크릿은 별도 서버에서 관리
- 프론트 변경과 API 변경을 동시에 배포하는 경우, API 하위호환성 먼저 확보
- 배포 브랜치 보호와 Actions required check 설정 권장

---

## 11. 참고: 현재 프로젝트에 바로 적용 시 우선 작업 순서

1. `next.config.ts`에 정적 export 설정 추가
2. 클라이언트 API 호출 경로를 `NEXT_PUBLIC_API_BASE_URL` 기반으로 치환
3. 외부 API 서버 준비(CORS + NEIS 키 보관)
4. `.github/workflows/deploy-pages.yml` 추가
5. GitHub Pages + Secrets 설정
6. push 후 Actions 성공 및 실제 페이지 동작 확인

필요하면 다음 단계로, 위 체크리스트를 기준으로 실제 코드/워크플로우 파일까지 바로 적용해 줄 수 있습니다.
