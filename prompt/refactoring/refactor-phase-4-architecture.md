# Phase 4 상세계획서 - 상태관리/아키텍처

## 목표
- Zustand 기반 메시지 스토어와 렌더러 계층을 분리한다.

## 체크리스트
- [x] `message-store` 상태 구조 설계/구현
- [x] 액션(`pushMessage`, `dismissToast`, `dismissPopup`, `clearMessages`) 구현
- [x] 토스트 렌더러(`MessageToastViewport`) 구현
- [x] 팝업 렌더러(`MessagePopupHost`) 구현
- [x] 메시지 모드 저장소(`message-mode`) 구현
- [x] 메시지 모드 훅/토글 UI(`useMessageMode`, `MessageModeToggle`) 구현

## 완료 기준
- 레이아웃에서 토스트/팝업 호스트가 동시에 동작하고 사용자 모드 전환이 가능하다.
