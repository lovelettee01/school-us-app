# Zustand 상태관리 가이드

## 1. 현재 전역 스토어 구성

`src/store`에는 2개 스토어가 존재한다.

1. `theme-store.ts`
- 상태: `mode`
- 액션: `setMode`
- 목적: 앱 전역 테마 모드 관리

2. `message-store.ts`
- 상태: `defaultMode`, `toastMessages`, `activePopup`, `popupQueue`
- 액션: `setDefaultMode`, `pushMessage`, `dismissToast`, `dismissPopup`, `clearMessages`
- 목적: 전역 메시지 표시 정책/큐 관리

## 2. 메시지 스토어 핵심 로직

### 2.1 모드 결정
- 명시 모드(`input.mode`) 우선
- 없으면 전역 기본 모드 사용
- 기본이 `auto`면 아래 규칙 적용
  - 에러거나 액션 버튼이 필요하면 `popup`
  - 그 외는 `toast`

### 2.2 중복 억제
- `DEDUPE_WINDOW_MS = 3000`
- dedupe key가 같은 메시지는 3초 내 중복 삽입 방지

### 2.3 토스트 수명주기
- 기본 노출 시간 `DEFAULT_TOAST_DURATION_MS = 3200`
- 자동 제거 타이머로 토스트 정리

### 2.4 팝업 큐
- `activePopup`이 비어 있으면 즉시 표시
- 이미 표시 중이면 `popupQueue`에 적재
- 닫기 시 큐의 다음 항목 활성화

## 3. 훅 계층에서 Zustand 사용하는 방식

### 3.1 테마
- `useTheme` 훅이 `theme-store` + `localStorage`를 묶어 제공
- `mode` 변경 시 DOM `data-theme` 갱신
- `system`일 때 OS 테마 변경 리스닝

### 3.2 메시지 모드
- `useMessageMode` 훅이 `message-store` + `localStorage`를 묶어 제공
- 기본값: 환경변수(`NEXT_PUBLIC_MESSAGE_DISPLAY_MODE`) 또는 저장값

### 3.3 에러 전파
- `useErrorMessage(enabled, message, options)`로 중복 1회 발행
- 각 화면/탭 훅에서 인라인 에러 대신 전역 메시지 사용

## 4. 새 전역 스토어 추가 가이드

1. 파일 생성: `src/store/{domain}-store.ts`
2. 구조 정의: `state + actions`
3. 클라이언트 컴포넌트 전용이면 `'use client'` 명시
4. 훅으로 감싸서 저장소/환경값과 결합
5. 직접 `useStore()` 전체 구독보다 selector 구독 우선

### 4.1 권장 템플릿

```ts
'use client';

import { create } from 'zustand';

interface DomainStore {
  value: string;
  setValue: (value: string) => void;
}

export const useDomainStore = create<DomainStore>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

## 5. 사용 시 주의사항

- 전역 상태는 최소화한다.
- 서버 데이터 캐시는 훅/쿼리 계층에서 관리하고, 전역 store에 과도하게 넣지 않는다.
- `localStorage` 실패는 앱 크래시로 연결하지 않는다.

## 6. 점검 체크리스트

- [ ] store 인터페이스가 상태와 액션을 명확히 분리했는가
- [ ] UI 컴포넌트에서 필요한 필드만 selector로 구독하는가
- [ ] 중복 메시지 억제 규칙(`dedupeKey`)을 고려했는가
- [ ] 전역 상태와 로컬 상태의 책임이 충돌하지 않는가
