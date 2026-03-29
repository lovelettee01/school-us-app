# 스토리지/환경변수/테마 가이드

## 1. 환경변수 사용

`src/lib/env.ts`에서 서버/클라이언트 환경변수를 분리한다.

### 1.1 서버 전용
- `NEIS_API_KEY`
- `NEIS_API_BASE_URL` (기본값: `https://open.neis.go.kr/hub`)
- `NEIS_API_ALLOW_INSECURE_TLS`

### 1.2 클라이언트 공개
- `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`
- `NEXT_PUBLIC_DEFAULT_THEME` (`light|dark|system`)
- `NEXT_PUBLIC_MESSAGE_DISPLAY_MODE` (`toast|popup|auto`)
- `NEXT_PUBLIC_RECENT_MAX_COUNT`

## 2. LocalStorage 키 설계

현재 사용 키:
- 테마: `schoolApp:theme:v1`
- 메시지 모드: `schoolApp:message-mode:v1`
- 즐겨찾기: `schoolApp:favorites:v1`
- 최근조회: `schoolApp:recents:v1`

버전 접미사(`:v1`)를 유지해 향후 마이그레이션 시 충돌을 줄인다.

## 3. 저장 모듈 사용 방식

- `src/lib/storage/theme.ts`
- `src/lib/storage/message-mode.ts`
- `src/lib/storage/favorites.ts`
- `src/lib/storage/recents.ts`

공통 정책:
- 브라우저 환경이 아니면 안전한 기본값 반환
- JSON parse 실패 시 fallback
- 저장 실패 시 앱 크래시 금지

## 4. 테마 적용 흐름

1. 초기 렌더 전 `layout.tsx`의 `themeInitScript` 실행
2. localStorage/시스템 설정 기반으로 `data-theme` 선적용
3. 클라이언트에서 `useTheme`가 모드 동기화
4. 토글 변경 시 store + localStorage + DOM 업데이트

## 5. 메시지 모드 적용 흐름

1. `useMessageMode`가 저장값 우선 조회
2. 저장값 없으면 공개 env 기본값 사용
3. 토글 변경 시 store + localStorage 반영
4. `pushMessage`가 최종 표시 모드 계산

## 6. 신규 저장값 추가 절차

1. 키 네이밍: `schoolApp:{domain}:v1`
2. read/write 함수 분리
3. SSR 안전 처리(`typeof window` 검사)
4. 훅 계층에서만 직접 사용
5. UI는 훅을 통해서만 접근

## 7. 체크리스트

- [ ] 서버 비밀값이 클라이언트 코드로 노출되지 않는가
- [ ] 저장 실패가 UI 크래시를 유발하지 않는가
- [ ] 테마 플리커가 최소화되도록 초기 스크립트를 유지했는가
- [ ] 저장 키 버전 관리 전략이 반영되었는가
