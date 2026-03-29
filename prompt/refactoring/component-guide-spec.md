# 공통 컴포넌트 가이드 명세서

## 문서 목적
- 공통 컴포넌트 API/상태/접근성 규칙을 정의해 화면별 편차를 줄인다.

## 진행 체크리스트
- [x] 1차 대상 컴포넌트 범위를 확정했다.
- [x] 컴포넌트별 공통 Props 규칙을 정의했다.
- [x] 상태/Variant/Size 네이밍 규칙을 정의했다.
- [x] 접근성 기준(키보드, ARIA, 포커스)을 정의했다.
- [ ] 모든 기존 화면을 신규 공통 컴포넌트로 치환했다.

## 1차 대상 컴포넌트
- Button
- Typography
- Badge
- Modal
- MessageToast
- MessagePopup

## 컴포넌트 공통 규칙
- Variant
  - `primary`, `secondary`, `ghost`, `danger`
- Size
  - `sm`, `md`, `lg`
- 상태
  - `isLoading`, `disabled`, `aria-busy`
- 접근성
  - 버튼: `aria-label` 필요 시 필수 지정
  - 모달: `role="dialog"`, `aria-modal="true"`, 포커스 트랩/복귀
  - 메시지: `aria-live` 우선순위 규칙 적용

## 컴포넌트별 API 초안
### Button
- 필수
  - `children`
- 선택
  - `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`, `fullWidth`

### Typography
- 필수
  - `children`
- 선택
  - `as`, `variant`, `tone`, `weight`

### Badge
- 필수
  - `children`
- 선택
  - `variant`, `size`

### Modal
- 필수
  - `isOpen`, `onClose`, `title`
- 선택
  - `description`, `primaryAction`, `secondaryAction`, `closeOnBackdrop`

### MessageToast
- 필수
  - `message.id`, `message.type`, `message.title`

### MessagePopup
- 필수
  - `isOpen`, `message`, `onClose`
- 선택
  - `onAction`, `actionLabel`
