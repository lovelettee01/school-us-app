# Phase 0~1 상세 계획 및 인벤토리

## 목표
- 리팩토링 착수 기준선을 고정하고, 실제 구현 대상/영향 범위를 코드 기준으로 명확히 식별한다.

## 체크리스트
- [x] 리팩토링 목표와 비범위를 `prompt/refactor_plan.md`에 확정했다.
- [x] 컴포넌트 현황 파일 목록을 수집했다.
- [x] 에러 노출 지점(`InlineFieldError`, `useErrorToast`, `ErrorState`)을 수집했다.
- [x] 전환 우선 대상 화면(검색/상세/급식/시간표/지도)을 분류했다.
- [x] 후속 Phase 상세 문서 파일 구조를 정의했다.

## 현재 공통 컴포넌트 인벤토리
- `src/components/common/ButtonIcons.tsx`
- `src/components/common/States.tsx`
- `src/components/common/Tabs.tsx`
- `src/components/common/ThemeToggle.tsx`
- `src/components/common/ToastViewport.tsx`

## 에러 노출 관련 식별 결과
- 인라인 에러
  - `src/components/search/SchoolSearchForm.tsx` (`InlineFieldError`)
- 토스트 훅 사용 지점
  - `src/components/school/MealTab.tsx`
  - `src/components/school/RouteDistancePanel.tsx`
  - `src/components/school/SchoolMapPanel.tsx`
  - `src/components/school/TimetableTab.tsx`
  - `src/features/school/school-detail-page.tsx`
  - `src/features/search/search-page.tsx`
- 상태 패널형 에러 렌더링
  - `src/components/common/States.tsx` (`ErrorState`)

## Phase 2~7 상세 문서
- [x] `prompt/refactoring/component-guide-spec.md`
- [x] `prompt/refactoring/message-system-spec.md`
- [x] `prompt/refactoring/error-mapping-matrix.md`

## 리스크 메모
- 에러 메시지를 팝업/토스트 중심으로 전환할 때, 기존 화면의 재시도 동작 문맥이 약해질 수 있다.
- 대응으로 "메시지 + 최소 상태 패널(행동 버튼)" 병행 정책을 적용한다.
