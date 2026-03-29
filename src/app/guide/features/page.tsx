import type { Metadata } from 'next';

import { FeatureGuidePage } from '@/features/feature-guide/feature-guide-page';

/**
 * 기능 가이드 라우트 메타데이터다.
 */
export const metadata: Metadata = {
  title: '기능 가이드',
  description: '서비스 아키텍처, 상태관리, API, 지도 연동 등 전체 기술 스펙을 확인하는 가이드',
};

/**
 * `/guide/features` 라우트 엔트리 페이지다.
 */
export default function GuideFeaturesRoutePage() {
  return <FeatureGuidePage />;
}

