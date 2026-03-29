import type { Metadata } from 'next';

import { ComponentGuidePage } from '@/features/component-guide/component-guide-page';

/**
 * 컴포넌트 가이드 라우트 메타데이터다.
 */
export const metadata: Metadata = {
  title: '컴포넌트 가이드',
  description: '공통 컴포넌트의 시각/행동/Props를 확인하고 테스트하는 가이드',
};

/**
 * `/guide/components` 라우트 엔트리 페이지다.
 */
export default function GuideComponentsRoutePage() {
  return <ComponentGuidePage />;
}

