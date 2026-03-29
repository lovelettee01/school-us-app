# 서비스/API 구현 가이드

## 1. API 계층 설계 원칙

이 프로젝트의 서버 데이터 경계는 다음 순서로 구성된다.

1. API Route (`src/app/api/neis/*/route.ts`)
2. 서비스 함수 (`src/lib/api/*.ts`)
3. 공통 NEIS 클라이언트 (`src/lib/api/neis-client.ts`)
4. Mapper/Validator (`src/lib/mappers`, `src/lib/validators`)

핵심 원칙:
- 클라이언트는 외부 API 직접 호출 금지
- 모든 응답은 `ApiResult<T>`로 정규화
- 검증 실패는 빠르게 반환(Fail Fast)

## 2. 공통 응답 타입

`src/types/api.ts`
- 성공: `ApiSuccess<T>` (`ok: true`)
- 실패: `ApiFailure` (`ok: false`, `code`, `message`)
- 유니온: `ApiResult<T>`

오류 코드:
- `VALIDATION_ERROR`
- `NETWORK_ERROR`
- `TIMEOUT`
- `UPSTREAM_ERROR`
- `EMPTY`

## 3. NEIS 공통 클라이언트 사용법

`requestNeis<T>({ resource, params, timeoutMs, retries })`

기본 동작:
- 환경변수에서 키/베이스URL 로딩
- 쿼리 정규화(빈값 제외)
- 기본 timeout 8초
- 기본 retry 1회
- NEIS envelope에서 `resource` 추출
- `INFO-000`, `INFO-200`만 성공 처리

### 3.1 주의사항
- `NEIS_API_KEY`가 비어있으면 즉시 실패
- 개발/테스트 환경에서만 TLS 우회 옵션 허용
- Route에서 validation error만 HTTP 400, 나머지는 200 + 실패 payload

## 4. 서비스별 구현 포인트

### 4.1 학교 검색/상세 (`src/lib/api/school-api.ts`)
- 검색 입력 검증(`validateSchoolSearchInput`)
- 리소스: `schoolInfo`
- Mapper: `mapSchoolSummary`, `mapSchoolDetail`
- 정렬: 학교명 오름차순

### 4.2 급식 (`src/lib/api/meal-api.ts`)
- 날짜 포맷/범위 검증
- 리소스: `mealServiceDietInfo`
- Mapper: `mapMealItem`
- 정렬: 급식일 오름차순

### 4.3 시간표 (`src/lib/api/timetable-api.ts`)
- 학교급/학년/반/날짜 검증
- 학교급에 따라 리소스 분기
  - `elementary` -> `elsTimetable`
  - `middle` -> `misTimetable`
  - `high` -> `hisTimetable`
- Mapper: `mapTimetableItem`
- 정렬: 날짜 + 교시 오름차순

## 5. API Route 작성 템플릿

```ts
export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get('value') ?? '';

  const result = await serviceFunction({ value });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.code === 'VALIDATION_ERROR' ? 400 : 200 });
  }

  return NextResponse.json(result, { status: 200 });
}
```

## 6. 신규 서비스 추가 실전 절차

1. `src/types/{domain}.ts` 타입 정의
2. `src/lib/validators/{domain}-validator.ts` 추가
3. `src/lib/mappers/{domain}-mapper.ts` 추가
4. `src/lib/api/{domain}-api.ts` 추가
5. `src/app/api/{domain}/route.ts` 추가
6. 클라이언트 훅/컴포넌트 연결
7. 테스트 작성

## 7. 서비스 품질 체크리스트

- [ ] 입력값 검증이 서비스 초기에 수행되는가
- [ ] 외부 응답을 mapper로 내부 타입으로 변환하는가
- [ ] 실패 코드/메시지가 사용자 UX에 맞게 정의되었는가
- [ ] API Route가 비즈니스 로직을 포함하지 않는가
- [ ] 실패/빈결과/성공 케이스 테스트가 있는가
