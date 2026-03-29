'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * 가이드 영역 상단 대메뉴 탭 정의다.
 * 기능 가이드/컴포넌트 가이드 간 상호 이동을 제공한다.
 */
const GUIDE_TOP_TABS: Array<{ key: 'features' | 'components'; label: string; href: string; description: string }> = [
  {
    key: 'features',
    label: '기능 가이드',
    href: '/guide/features',
    description: '서비스/상태관리/API/지도 등 기술 스펙',
  },
  {
    key: 'components',
    label: '컴포넌트 가이드',
    href: '/guide/components',
    description: '공통 UI 컴포넌트 데모와 Props 문서',
  },
];

/**
 * `/guide/*` 페이지 공통 상단 탭 네비게이션 컴포넌트다.
 */
export function GuideTopTabs() {
  const pathname = usePathname();

  return (
    <nav className="card-surface mb-4 grid gap-2 p-2 md:grid-cols-2" aria-label="가이드 대메뉴">
      {GUIDE_TOP_TABS.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={[
              'rounded-xl border px-3 py-3 transition',
              isActive
                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-contrast)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]',
            ].join(' ')}
            aria-current={isActive ? 'page' : undefined}
          >
            <p className="text-sm font-black">{tab.label}</p>
            <p className={['mt-1 text-xs', isActive ? 'text-[var(--primary-contrast)]/90' : 'text-[var(--text-muted)]'].join(' ')}>
              {tab.description}
            </p>
          </Link>
        );
      })}
    </nav>
  );
}

