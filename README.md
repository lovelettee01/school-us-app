# school-us-app

NEIS(Open API) 기반으로 학교 검색, 상세 정보, 급식, 시간표를 조회하는 Next.js 애플리케이션입니다.  
학교 위치를 카카오 지도에서 확인하고, 현재 위치 기준 거리/예상 이동 시간을 볼 수 있습니다.

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
- 사용자 편의: 최근 조회 학교, 즐겨찾기, 테마(라이트/다크/시스템) 저장
- 서버 API 라우트: NEIS 호출을 서버에서 프록시하여 클라이언트에 단순화된 응답 제공

## 프로젝트 구조
```text
src/
  app/
    api/neis/         # 학교/상세/급식/시간표 API Route
    school/[schoolKey]/
  features/
    search/           # 홈 검색 페이지 컨테이너
    school/           # 상세 페이지 컨테이너
  components/         # 공통/검색/상세 UI 컴포넌트
  hooks/              # 화면별 상태/데이터 로딩 훅
  lib/                # API 클라이언트, mapper, validator, storage, util
  store/              # Zustand store
  types/              # 도메인 타입
docs/
  deployment-checklist.md
  operations-guide.md
  screenshots/        # README용 스크린샷(권장)
```

## 요구 사항
- Node.js 20+
- npm (이 저장소는 `package-lock.json` 기준으로 npm 사용)

## 시작하기
```bash
npm install
npm run dev
```
- 기본 주소: `http://localhost:3000`

## 화면 스크린샷
현재 저장소에는 스크린샷 이미지가 아직 없습니다. 아래 경로/파일명으로 추가하면 README에서 바로 노출됩니다.

- `docs/screenshots/home-search.png`
- `docs/screenshots/school-detail-info.png`
- `docs/screenshots/school-detail-map.png`
- `docs/screenshots/school-detail-meal-timetable.png`

예시:

```md
![홈 검색 화면](docs/screenshots/home-search.png)
![학교 상세 - 기본 정보](docs/screenshots/school-detail-info.png)
![학교 상세 - 지도/거리](docs/screenshots/school-detail-map.png)
![학교 상세 - 급식/시간표](docs/screenshots/school-detail-meal-timetable.png)
```

## 환경 변수
루트에 `.env.local` 파일을 만들고 아래 값을 설정하세요.

```env
# 서버 전용
NEIS_API_KEY=your-neis-api-key
NEIS_API_BASE_URL=https://open.neis.go.kr/hub
NEIS_API_ALLOW_INSECURE_TLS=false

# 클라이언트 공개
NEXT_PUBLIC_KAKAO_MAP_APP_KEY=your-kakao-js-key
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_RECENT_MAX_COUNT=10
```

### 환경 변수 설명
- `NEIS_API_KEY`: NEIS Open API 인증키
- `NEIS_API_BASE_URL`: NEIS API 베이스 URL (기본값 `https://open.neis.go.kr/hub`)
- `NEIS_API_ALLOW_INSECURE_TLS`: 내부망/특수 환경에서만 `true` 고려
- `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`: 카카오 지도 JavaScript 키
- `NEXT_PUBLIC_DEFAULT_THEME`: `light` | `dark` | `system`
- `NEXT_PUBLIC_RECENT_MAX_COUNT`: 최근 조회 저장 개수

## API 라우트
모든 엔드포인트는 `GET`입니다.

- `/api/neis/schools?officeCode=&schoolName=&page=&pageSize=`
- `/api/neis/school?officeCode=&schoolCode=`
- `/api/neis/meals?officeCode=&schoolCode=&fromYmd=&toYmd=`
- `/api/neis/timetable?officeCode=&schoolCode=&schoolLevel=&grade=&classNo=&fromYmd=&toYmd=`

참고: 현재 저장소 기준으로 `/api/health` 라우트는 구현되어 있지 않습니다.

## 품질 검증 명령
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## 자체 서버 배포 절차 (Ubuntu + Node + PM2 + Nginx)

### 1) 서버 준비
```bash
sudo apt update
sudo apt install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2) 애플리케이션 배치
```bash
git clone <your-repo-url>
cd school-us-app
npm ci
cp .env.local.example .env.local # 예시 파일이 없으면 직접 생성
```

`.env.local`에 운영 값을 채웁니다.

### 3) 빌드 및 로컬 기동 확인
```bash
npm run typecheck
npm run lint
npm run test
npm run build
PORT=3000 npm run start
```

### 4) PM2 등록 (백그라운드 실행)
```bash
cd /path/to/school-us-app
pm2 start npm --name school-us-app -- run start
pm2 save
pm2 startup
```

필요 시 포트 지정:
```bash
pm2 start npm --name school-us-app -- run start -- -p 3000
```

### 5) Nginx 리버스 프록시 설정
`/etc/nginx/sites-available/school-us-app` 파일 생성:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

활성화:
```bash
sudo ln -s /etc/nginx/sites-available/school-us-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6) HTTPS 적용 (권장)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 7) 배포 후 점검
- 홈 검색 동작 확인
- 상세 탭(지도/급식/시간표) 확인
- 다크모드 토글/저장 확인
- PM2 상태 확인: `pm2 status`
- Nginx 로그 확인: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`

## 문서
- 운영 가이드: `docs/operations-guide.md`
- 배포 체크리스트: `docs/deployment-checklist.md`

## 라이선스
별도 라이선스가 정의되지 않았습니다. 필요 시 `LICENSE` 파일을 추가하세요.

