# Kakao Map 적용 가이드

## 1. 적용 범위

카카오맵은 학교 상세의 정보 탭(`SchoolInfoTab`)에서 사용한다.

- 지도 렌더링: `SchoolMapPanel`
- 길찾기/거리계산: `RouteDistancePanel`
- SDK 로딩: `src/lib/kakao/map-loader.ts`
- 거리 계산 유틸: `src/lib/kakao/distance.ts`
- 길찾기 링크 유틸: `src/lib/kakao/route-link.ts`

## 2. SDK 로딩 표준

`loadKakaoMapSdk()` 핵심 동작:
- 브라우저 환경인지 확인
- 이미 로딩된 경우 즉시 resolve
- `sdkPromise`로 단일 로딩 보장
- `NEXT_PUBLIC_KAKAO_MAP_APP_KEY` 미설정 시 실패
- script URL: `libraries=services` 포함(지오코더 사용)

### 2.1 실패 처리
- SDK 로드 실패 시 Promise reject
- 호출부(`SchoolMapPanel`)에서 상태를 `error`로 전환하고 전역 메시지 발행

## 3. 지도 표시 흐름

1. `SchoolMapPanel` 마운트
2. `loadKakaoMapSdk` 실행
3. 좌표 결정
- 우선순위 1: `detail.lat/lng`
- 우선순위 2: `detail.addressRoad`를 Geocoder로 변환
4. 좌표 확보 시 지도 생성 + 학교 마커 표시
5. 현재 위치가 있으면 현재 위치 마커 + 폴리라인 표시

## 4. 현재 위치/거리 계산

`RouteDistancePanel` + `useCurrentLocation` 조합으로 처리한다.

- 사용자 클릭 시 geolocation 권한 요청
- 성공 시 현재 좌표 획득
- `calculateDistanceMeters`(Haversine)로 직선거리 계산
- `formatDistance`로 텍스트 변환
- 도보/자전거/차량 예상시간 계산 후 카드 표시

기준 속도:
- 도보: 4.5km/h
- 자전거: 16km/h
- 차량: 35km/h

## 5. 길찾기 링크

`buildKakaoRouteUrl(payload)` 규칙:
- 좌표가 있으면 `https://map.kakao.com/link/to/...`
- 좌표가 없으면 주소 검색 링크(`?q=`) 생성

지원 UX:
- 길찾기 새 창 열기
- 길찾기 링크 복사
- 팝업 차단/복사 실패 시 전역 메시지 표시

## 6. 권한/오류 UX 정책

- 위치 권한 거부: 상태 `denied` + 사용자 메시지
- 브라우저 미지원: 상태 `error`
- 주소/좌표 없음: 상태 `empty` (지도 제한 안내)
- 모든 오류는 인라인 하단 텍스트보다 전역 메시지 시스템 중심

## 7. 신규 지도 기능 확장 방법

1. `src/lib/kakao/*`에 순수 유틸 추가
2. SDK 의존 로직은 컴포넌트/훅에서만 실행
3. 좌표 변환/거리 계산은 테스트 가능한 순수 함수로 유지
4. 사용자 액션 결과는 `useMessageStore.pushMessage`로 안내

## 8. 체크리스트

- [ ] SDK 중복 로딩 방지가 구현되었는가
- [ ] 앱 키 누락/로드 실패 케이스가 처리되었는가
- [ ] 좌표 없음/주소 없음 상태를 분리했는가
- [ ] 위치 권한 거부 시 재시도 UX가 있는가
- [ ] 지도 관련 에러가 전역 메시지 정책과 일치하는가
