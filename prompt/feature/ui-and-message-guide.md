# UI 컴포넌트/메시지 시스템 가이드

## 1. 공통 컴포넌트 구조

`src/components/common`은 다음 범주로 구성된다.

- 입력/폼: `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`
- 액션: `Button`, `Tabs`, `Modal`
- 정보표현: `Typography`, `Badge`, `Card`, `AlertBanner`
- 피드백: `States(Loading/Empty/Error)`, `Skeleton`
- 전역 UX: `ThemeToggle`, `MessageModeToggle`, `MessageToastViewport`, `MessagePopupHost`

도메인 컴포넌트:
- 검색: `src/components/search/*`
- 상세: `src/components/school/*`

## 2. 상태 기반 렌더링 표준

화면/탭 컴포넌트는 아래 상태를 기본 제공한다.

- `loading`: `LoadingState`
- `empty`: `EmptyState`
- `error`: `ErrorState` + `RetryButton`
- `success`: 실제 콘텐츠

## 3. 전역 메시지 시스템

### 3.1 목적
- 컴포넌트 하단 인라인 오류 메시지 의존도를 줄이고
- 화면 어디서든 일관된 오류/안내 UX를 제공한다.

### 3.2 구성
- 저장소: `message-store`
- 토스트 렌더러: `MessageToastViewport`
- 팝업 렌더러: `MessagePopupHost`
- 모드 토글: `MessageModeToggle`

### 3.3 모드
- `toast`: 우상단 토스트
- `popup`: 모달형 팝업
- `auto`: 에러/액션 필요 메시지 팝업, 일반 안내 토스트

### 3.4 발행 패턴

```ts
pushMessage({
  type: 'error',
  title: '오류가 발생했습니다.',
  description: '다시 시도해 주세요.',
  dedupeKey: 'feature:case',
});
```

## 4. 화면별 메시지 사용 예시

- 검색 실패: `search-page:error`
- 상세 실패: `school-detail:{schoolKey}`
- 급식 실패: `meal-tab:{schoolKey}`
- 시간표 실패: `timetable-tab:{schoolKey}`
- 지도/거리 실패: `school-map:{schoolKey}`, `route-distance:*`

## 5. 접근성 포인트

- 토스트는 상황에 따라 `role="status"` 또는 `role="alert"`
- 팝업은 `role="dialog"`, `aria-modal="true"`
- ESC 닫기 지원
- 닫기 후 포커스 복귀 지원

## 6. 컴포넌트 가이드 페이지 활용

`/component-guide`에서 다음을 확인한다.
- 컴포넌트 변형(variant/size/state)
- 인터랙션 동작
- Props 설명 및 예제

신규 공통 컴포넌트 추가 시:
1. `src/components/common`에 컴포넌트 구현
2. 타입/주석 작성
3. `/component-guide`에 데모 섹션 추가
4. 접근성(키보드/라벨/포커스) 검증

## 7. 체크리스트

- [ ] loading/empty/error/success 4상태가 명확한가
- [ ] 오류 노출이 전역 메시지 정책과 충돌하지 않는가
- [ ] dedupeKey가 안정적으로 설계되었는가
- [ ] 컴포넌트 가이드 페이지에 예제가 반영되었는가
