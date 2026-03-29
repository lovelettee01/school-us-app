import { redirect } from 'next/navigation';

/**
 * 기존 컴포넌트 가이드 URL(`/component-guide`) 호환을 위해
 * 신규 경로(`/guide/components`)로 즉시 리다이렉트한다.
 */
export default function LegacyComponentGuideRedirectPage() {
  redirect('/guide/components');
}

