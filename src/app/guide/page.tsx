import type { Metadata } from 'next';
import Link from 'next/link';

import { GuideTopTabs } from '@/components/guide/GuideTopTabs';
import { FEATURE_DOCS } from '@/lib/guide/feature-docs';

/**
 * `/guide` 인덱스 라우트 메타데이터다.
 */
export const metadata: Metadata = {
  title: '가이드 허브',
  description: '기능 가이드와 컴포넌트 가이드 진입 허브 페이지',
};

/**
 * 전체 가이드 진입 허브 페이지다.
 */
export default function GuideIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-6">
      <GuideTopTabs />

      <main className="grid gap-4">
        <section className="card-surface grid gap-2 p-4 md:p-5">
          <h1 className="text-xl font-black text-[var(--text)]">Guide Hub</h1>
          <p className="text-sm text-[var(--text-muted)]">
            기능/기술 스펙 문서와 공통 컴포넌트 가이드를 한 곳에서 이동할 수 있는 허브입니다.
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            <Link
              href="/guide/features"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 transition hover:bg-[var(--surface-muted)]"
            >
              <p className="text-sm font-black text-[var(--text)]">기능 가이드</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">아키텍처, 서비스/API, Zustand, Kakao Map, 테스트 가이드</p>
            </Link>
            <Link
              href="/guide/components"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 transition hover:bg-[var(--surface-muted)]"
            >
              <p className="text-sm font-black text-[var(--text)]">컴포넌트 가이드</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">버튼/입력/모달/메시지 등 공통 컴포넌트 데모 및 Props 문서</p>
            </Link>
          </div>
        </section>

        <section className="card-surface grid gap-2 p-4 md:p-5">
          <h2 className="text-base font-black text-[var(--text)]">기능 문서 원문 바로가기</h2>
          <p className="text-xs text-[var(--text-muted)]">`prompt/feature` 문서를 웹에서 바로 열어 확인할 수 있습니다.</p>
          <div className="grid gap-2 md:grid-cols-2">
            {FEATURE_DOCS.map((doc) => (
              <Link
                key={doc.slug}
                href={`/guide/features/docs/${doc.slug}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 transition hover:bg-[var(--surface-muted)]"
              >
                <p className="text-sm font-semibold text-[var(--text)]">{doc.title}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{doc.fileName}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

