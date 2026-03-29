# 테스트/검증/운영 가이드

## 1. 기본 검증 순서

이 저장소는 npm 기준으로 아래 순서를 권장한다.

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. 필요 시 `npm run build`

## 2. 현재 테스트 자산

- `src/lib/api/neis-client.test.ts`
- `src/lib/kakao/distance.test.ts`
- `src/lib/mappers/meal-mapper.test.ts`
- `src/lib/mappers/timetable-mapper.test.ts`
- `src/lib/storage/theme.test.ts`
- `src/lib/utils/school-key.test.ts`

특징:
- 순수 함수/유틸 중심 테스트가 구축되어 있다.
- 새 비즈니스 로직은 같은 레이어 근처에 테스트를 추가한다.

## 3. 변경 유형별 필수 검증

### 3.1 타입/인터페이스 변경
- `typecheck`
- 관련 mapper/validator 테스트

### 3.2 UI/상태 로직 변경
- `typecheck`
- `lint`
- 관련 훅/컴포넌트 테스트
- 주요 수동 시나리오

### 3.3 API/런타임 영향 변경
- 위 항목 + `build`
- API Route 수동 호출 검증

## 4. 수동 점검 시나리오

### 4.1 검색 페이지
- 교육청/학교명 입력 후 검색
- 결과 없음 시 empty 상태 확인
- 오류 시 전역 메시지 확인

### 4.2 상세 페이지
- `tab=info|meal|timetable` 전환
- 즐겨찾기 토글, 최근조회 반영
- 급식/시간표 조회 조건 변경

### 4.3 지도/거리
- 지도 로딩 성공/실패
- 길찾기 링크 열기/복사
- 위치 권한 허용/거부

### 4.4 메시지/테마
- 메시지 모드(auto/toast/popup) 전환
- 에러 상황에서 모드별 노출 확인
- 테마 전환 + 새로고침 후 유지 확인

## 5. 장애 대응 기준

- Validation 오류: 입력/UI 가이드 보강
- Upstream 오류: 사용자 메시지 + 재시도 동선
- Network/Timeout: 재시도 버튼 및 dedupe 메시지 유지

## 6. 완료 보고 템플릿

1. 변경 요약
2. 수정 파일 목록
3. 실행한 검증 명령/결과
4. 미실행 항목과 사유
5. 리스크/가정

## 7. 체크리스트

- [ ] 테스트 추가 없이 로직 변경하지 않았는가
- [ ] 실패 시나리오(오류/빈값/권한거부)를 점검했는가
- [ ] 수동 점검 절차를 작업 기록에 남겼는가
- [ ] 빌드 영향 변경에서 `npm run build`를 검토했는가
