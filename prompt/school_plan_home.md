# 홈 화면(`/`) 상세 재구축 플랜

## 1. 화면 목표
- 시도교육청 + 학교명으로 학교를 검색하고, 결과에서 상세 페이지로 진입한다.
- 최근 조회/즐겨찾기를 즉시 확인하고 관리한다.

## 2. UI 구성
- 상단 헤더
  - 타이틀: 학교 정보 조회
  - 설명 문구
  - 테마 토글
- 검색 카드
  - 시도교육청 Select
  - 학교명 Input
  - 조회 버튼
  - 초기화 버튼
  - 인라인 오류 메시지
- 보조 리스트 2열
  - 최근 조회
  - 즐겨찾기
- 검색 결과 영역
  - 결과 요약(총 n건)
  - 로딩/빈값/오류 상태
  - 학교 카드 목록 + 더보기

## 3. 상태 모델
- 검색 상태: `idle | loading | success | empty | error`
- 검색 입력: `officeCode`, `schoolName`
- 목록 표시: `visibleCount`, `hasMore`
- 저장 데이터
  - recents: 최대 10개
  - favorites: 최대 10개

## 4. 핵심 인터랙션 규칙
- 조회 실행
  - Enter 또는 조회 버튼으로 실행
  - 실행 시 `visibleCount`를 PAGE_SIZE로 리셋
- 입력 검증
  - 교육청 미선택 오류
  - 학교명 미입력 오류
  - 학교명 2글자 미만 오류
- 초기화
  - 기본 교육청(B10) 복원
  - 학교명/검색상태 리셋
- 더보기
  - PAGE_SIZE(10) 단위 증가
- 상세 이동 전
  - `onBeforeNavigate`로 최근 조회 기록
- 즐겨찾기
  - 토글 방식
  - 최대 개수 초과 시 info 토스트

## 5. API 연동
- 엔드포인트: `/api/neis/schools`
- 파라미터: `officeCode`, `schoolName`
- 캐시 정책
  - key: `{officeCode}:{schoolName}`
  - TTL: 5분
- 요청 중복 제어
  - 이전 요청 Abort 후 신규 요청

## 6. 예외/오류 처리
- 네트워크 실패: 에러 상태 + 에러 토스트 + 재시도 버튼
- 빈 결과: EmptyState 노출
- 검증 오류: 인라인 오류 우선

## 7. 접근성 체크
- label-input 연결
- 인라인 오류 `aria-describedby`
- 결과 영역 `aria-live=polite`
- 아이콘 버튼 `aria-label/title` 지정

## 8. 테스트 포인트
- 검증기 단위 테스트
- `useSchoolSearch` 캐시/abort/상태 전이 테스트
- favorites/recents 저장소 테스트
- 홈 화면 통합 시나리오
  - 조회 성공
  - 조회 실패
  - 즐겨찾기 추가/삭제
  - 최근 조회 삭제
