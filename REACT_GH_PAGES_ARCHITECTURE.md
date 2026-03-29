# React SPA + GitHub Pages + 외부 API 서버 구조 정리

이 문서는 현재 Next.js 기반 프로젝트를 **구현 변경 없이** 개념적으로 이전/운영하기 위한 구조 가이드입니다.

## 1. 결론 요약

- GitHub Pages는 정적 파일 호스팅이므로 **순수 React SPA 배포는 가능**합니다.
- 하지만 NEIS API 키 보호가 필요하므로, 브라우저에서 NEIS를 직접 호출하면 안 됩니다.
- 따라서 권장 구조는 아래와 같습니다.

1. 프론트엔드: React SPA (GitHub Pages)
2. 백엔드(API 프록시): 별도 서버/서버리스
3. NEIS API 호출/키 관리는 백엔드에서만 수행

---

## 2. 왜 백엔드가 필요한가

브라우저에서 직접 NEIS API를 호출하면:
- `NEIS_API_KEY` 노출 위험
- CORS 정책으로 호출 실패 가능
- 키 도용/쿼터 소진/과금 리스크

그래서 프론트는 항상 “내 API 서버”를 호출하고, 실제 NEIS 연동은 서버가 담당해야 합니다.

---

## 3. 권장 아키텍처

```text
[User Browser]
   -> https://<github-id>.github.io/<repo>/  (React SPA)
   -> https://api.your-domain.com/neis/*     (Your API Server)

[Your API Server]
   -> https://open.neis.go.kr/hub             (NEIS Open API)
```

역할 분리:
- React SPA: 화면/상태/사용자 상호작용
- API 서버: 키 보관, 검증, 에러 변환, 응답 캐싱, CORS 제어

---

## 4. 환경변수 전략

### 프론트엔드 (공개 가능 변수만)
- `REACT_APP_API_BASE_URL` 또는 `VITE_API_BASE_URL`
- `Kakao JS Key`처럼 공개 가능한 키만 `PUBLIC` 범주로 관리

### 백엔드 (비공개)
- `NEIS_API_KEY`
- `NEIS_API_BASE_URL=https://open.neis.go.kr/hub`
- 내부 운영용 설정(타임아웃, 재시도, 로깅 레벨 등)

원칙:
- 브라우저 번들에 비밀키 포함 금지
- 비밀키는 서버 환경에서만 로드

---

## 5. API 계약(권장)

프론트와 백엔드 사이의 API는 현재 프로젝트와 유사한 형태를 유지하면 이전 비용이 낮습니다.

권장 엔드포인트:
- `GET /neis/schools?officeCode=&schoolName=&page=&pageSize=`
- `GET /neis/school?officeCode=&schoolCode=`
- `GET /neis/meals?officeCode=&schoolCode=&fromYmd=&toYmd=`
- `GET /neis/timetable?officeCode=&schoolCode=&schoolLevel=&grade=&classNo=&fromYmd=&toYmd=`

응답 포맷 권장:
- `ok`, `code`, `message`, `data`, `meta` 구조 통일
- Validation/Network/Upstream 오류를 코드로 구분

---

## 6. GitHub Pages 배포 방식

1. React 앱을 정적 빌드 (`dist` 또는 `build`)
2. GitHub Actions로 Pages에 배포
3. SPA 라우팅 이슈 대응 (`404.html` 리다이렉트 전략 또는 HashRouter)
4. 리포지토리 페이지면 base path(`/repo-name`) 반영

주의:
- BrowserRouter 사용 시 새로고침 404를 반드시 처리
- 자산 경로(base/publicPath) 누락 시 CSS/JS 404 발생

---

## 7. 백엔드 배포 옵션

선택지:
1. 기존 자체 서버(Node + PM2 + Nginx)
2. 서버리스(Vercel Functions, Cloudflare Workers, AWS Lambda)

선정 기준:
- 운영 편의성
- 로그/모니터링
- 비용
- CORS/보안 정책 구성 난이도

---

## 8. 보안 체크리스트

- `NEIS_API_KEY`를 프론트 저장소/Actions 공개 변수에 넣지 않기
- API 서버에서 허용 Origin 제한
- 요청 파라미터 검증(officeCode, schoolCode, ymd 등)
- 과도한 호출 방지(레이트리밋/캐시)
- 에러 메시지에 내부 정보 노출 금지

---

## 9. 운영 체크리스트

배포 후 최소 점검:
1. 홈 검색 정상 동작
2. 상세(정보/급식/시간표/지도) 정상 동작
3. 브라우저 콘솔 4xx/5xx/CORS 오류 여부
4. API 서버 로그에서 NEIS 오류 비율 확인
5. 키/쿼터 사용량 모니터링

---

## 10. 마이그레이션(개념) 순서

1. 프론트에서 `/api/*` 상대경로 호출을 `API_BASE_URL` 기반 호출로 전환
2. 백엔드 프록시 API 구현 및 배포
3. CORS/보안/캐시 정책 적용
4. React SPA 정적 빌드 + GitHub Pages 배포
5. 통합 검증 및 장애 대응 문서화

---

## 11. 한 줄 정리

**React로 바꾸면 GitHub Pages 배포는 쉬워지지만, NEIS를 안전하게 쓰려면 백엔드 분리는 여전히 필수입니다.**
