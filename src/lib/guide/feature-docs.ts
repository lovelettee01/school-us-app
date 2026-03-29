/**
 * 기능 가이드 원문 문서 슬러그 타입이다.
 */
export type FeatureDocSlug =
  | 'feature-guide'
  | 'architecture-and-routing'
  | 'feature-domain-breakdown'
  | 'service-and-api-guide'
  | 'zustand-guide'
  | 'kakao-map-guide'
  | 'hooks-and-cache-guide'
  | 'ui-and-message-guide'
  | 'storage-env-theme-guide'
  | 'testing-and-operations-guide';

/**
 * 기능 가이드 원문 문서 메타데이터 타입이다.
 */
export interface FeatureDocMeta {
  /**
   * URL에 사용할 문서 슬러그다.
   */
  slug: FeatureDocSlug;
  /**
   * 문서 파일명이다.
   */
  fileName: string;
  /**
   * 화면에 표시할 문서 제목이다.
   */
  title: string;
  /**
   * 문서 요약 설명이다.
   */
  description: string;
  /**
   * 연관된 기능 가이드 섹션 키 목록이다.
   */
  sectionKeys: string[];
}

/**
 * `prompt/feature` 원문 문서 메타 목록이다.
 */
export const FEATURE_DOCS: FeatureDocMeta[] = [
  {
    slug: 'feature-guide',
    fileName: 'feature-guide.md',
    title: '통합 기능 가이드',
    description: '프로젝트 전체 구조와 단계별 체크리스트',
    sectionKeys: ['overview', 'checklist'],
  },
  {
    slug: 'architecture-and-routing',
    fileName: 'architecture-and-routing.md',
    title: '아키텍처/라우팅 가이드',
    description: '레이어 구조와 라우팅 설계',
    sectionKeys: ['architecture', 'routing'],
  },
  {
    slug: 'feature-domain-breakdown',
    fileName: 'feature-domain-breakdown.md',
    title: '기능 도메인 세분화 가이드',
    description: '서비스 단위 기능 경계와 확장 포인트',
    sectionKeys: ['overview'],
  },
  {
    slug: 'service-and-api-guide',
    fileName: 'service-and-api-guide.md',
    title: '서비스/API 구현 가이드',
    description: 'NEIS 연동, 검증, 매핑 표준',
    sectionKeys: ['services'],
  },
  {
    slug: 'zustand-guide',
    fileName: 'zustand-guide.md',
    title: 'Zustand 상태관리 가이드',
    description: '전역 상태와 메시지 큐 정책',
    sectionKeys: ['zustand'],
  },
  {
    slug: 'kakao-map-guide',
    fileName: 'kakao-map-guide.md',
    title: 'Kakao Map 적용 가이드',
    description: '지도/거리/길찾기 연동 상세',
    sectionKeys: ['kakao'],
  },
  {
    slug: 'hooks-and-cache-guide',
    fileName: 'hooks-and-cache-guide.md',
    title: '훅/클라이언트 캐시 가이드',
    description: '조회 훅 상태 전이와 캐시 전략',
    sectionKeys: ['hooks'],
  },
  {
    slug: 'ui-and-message-guide',
    fileName: 'ui-and-message-guide.md',
    title: 'UI/메시지 시스템 가이드',
    description: '컴포넌트/전역 메시지 UX 패턴',
    sectionKeys: ['ui'],
  },
  {
    slug: 'storage-env-theme-guide',
    fileName: 'storage-env-theme-guide.md',
    title: '스토리지/환경변수/테마 가이드',
    description: '설정값/선호값 저장 및 운영',
    sectionKeys: ['storage'],
  },
  {
    slug: 'testing-and-operations-guide',
    fileName: 'testing-and-operations-guide.md',
    title: '테스트/검증/운영 가이드',
    description: '검증 절차와 운영 체크리스트',
    sectionKeys: ['testing'],
  },
];

