# 메시지 시스템 명세서

## 문서 목적
- 에러/상태 메시지 노출을 토스트/팝업으로 통합하고 선택 가능한 정책을 정의한다.

## 진행 체크리스트
- [x] 메시지 타입/모드 규격을 정의했다.
- [x] 전역 설정 + 이벤트별 override 정책을 정의했다.
- [x] 중복 억제/우선순위/자동 닫힘 정책을 정의했다.
- [x] 접근성 규칙을 정의했다.
- [ ] 기존 `useErrorToast` 호출을 신규 훅으로 모두 전환했다.

## 메시지 타입
- `error`
- `warning`
- `success`
- `info`

## 메시지 모드
- `toast`
- `popup`
- `auto`

## 선택 정책
- 기본 모드
  - 전역 설정(`messageDisplayMode`)으로 관리
- override
  - `pushMessage` 호출 시 `mode` 지정 가능
- auto 규칙
  - `error` + 사용자 액션 필요 -> `popup`
  - 그 외 -> `toast`

## 동작 정책
- 우선순위
  - `error > warning > success > info`
- 중복 억제
  - `dedupeKey`가 동일한 메시지는 3초 내 중복 삽입 차단
- 자동 닫힘
  - 토스트 기본 3.2초
  - 팝업은 수동 닫기 우선

## 접근성
- toast
  - `role="status"`, `aria-live="polite"`
  - 에러 토스트는 `role="alert"`, `aria-live="assertive"`
- popup
  - `role="dialog"`, `aria-modal="true"`
  - 포커스 트랩 + ESC 닫기 + 닫힐 때 포커스 복귀
