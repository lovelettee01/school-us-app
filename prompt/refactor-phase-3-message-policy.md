# Phase 3 상세계획서 - 메시지 정책 구현

## 목표
- 전역 메시지 타입/모드와 자동 선택 정책을 코드에 반영한다.

## 체크리스트
- [x] 메시지 타입 정의 (`error/warning/success/info`)
- [x] 표시 모드 정의 (`toast/popup/auto`)
- [x] 자동 선택 정책 구현 (`auto`에서 error 우선 popup)
- [x] 중복 억제 정책 구현 (3초 dedupe window)
- [x] 토스트 자동 닫힘 정책 구현
- [x] 팝업 액션/확인 버튼 정책 구현

## 완료 기준
- 동일 인터페이스(`pushMessage`)로 토스트/팝업을 제어할 수 있다.
