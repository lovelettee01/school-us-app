import type { Metadata } from 'next';
import fs from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { GuideTopTabs } from '@/components/guide/GuideTopTabs';
import { FEATURE_DOCS } from '@/lib/guide/feature-docs';

interface FeatureDocDetailPageProps {
  /**
   * 동적 라우트 파라미터다.
   */
  params: Promise<{
    /**
     * 조회할 문서 슬러그다.
     */
    docSlug: string;
  }>;
}

/**
 * 기능 문서 상세 페이지 메타데이터를 생성한다.
 */
export async function generateMetadata({ params }: FeatureDocDetailPageProps): Promise<Metadata> {
  const resolved = await params;
  const doc = FEATURE_DOCS.find((item) => item.slug === resolved.docSlug);

  if (!doc) {
    return {
      title: '문서 없음',
      description: '요청한 기능 문서를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${doc.title} 원문`,
    description: doc.description,
  };
}

/**
 * `prompt/feature/*.md` 원문 문서를 웹에서 확인하는 상세 페이지다.
 * 좌측 메뉴에서 다른 문서로 바로 이동할 수 있다.
 */
export default async function FeatureDocDetailPage({ params }: FeatureDocDetailPageProps) {
  const resolved = await params;
  const doc = FEATURE_DOCS.find((item) => item.slug === resolved.docSlug);

  if (!doc) {
    notFound();
  }

  const absolutePath = path.join(process.cwd(), 'prompt', 'feature', doc.fileName);

  let markdown = '';
  try {
    markdown = await fs.readFile(absolutePath, 'utf8');
  } catch {
    notFound();
  }

  const currentIndex = FEATURE_DOCS.findIndex((item) => item.slug === doc.slug);
  const previousDoc = currentIndex > 0 ? FEATURE_DOCS[currentIndex - 1] : null;
  const nextDoc = currentIndex < FEATURE_DOCS.length - 1 ? FEATURE_DOCS[currentIndex + 1] : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-6">
      <GuideTopTabs />

      <div className="flex min-w-0 flex-1 gap-4">
        <aside className="sticky top-4 hidden h-fit w-72 shrink-0 self-start md:block">
          <nav className="card-surface grid gap-1 p-2" aria-label="기능 문서 목록">
            {FEATURE_DOCS.map((item) => {
              const isActive = item.slug === doc.slug;

              return (
                <Link
                  key={item.slug}
                  href={`/guide/features/docs/${item.slug}`}
                  className={[
                    'grid rounded-lg px-3 py-2 text-left transition',
                    isActive
                      ? 'bg-[var(--primary)] text-[var(--primary-contrast)]'
                      : 'text-[var(--text)] hover:bg-[var(--surface-muted)]',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="text-sm font-semibold">{item.title}</span>
                  <span className="text-[11px] opacity-85">{item.fileName}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="card-surface mb-4 grid gap-2 p-4">
            <p className="text-xs font-semibold text-[var(--text-muted)]">Feature Doc Source</p>
            <h1 className="text-xl font-black text-[var(--text)]">{doc.title}</h1>
            <p className="text-sm text-[var(--text-muted)]">{doc.description}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/guide/features"
                className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
              >
                기능 가이드로 돌아가기
              </Link>
              <Link
                href="/guide/components"
                className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
              >
                컴포넌트 가이드 이동
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 md:hidden">
              {FEATURE_DOCS.map((item) => (
                <Link
                  key={item.slug}
                  href={`/guide/features/docs/${item.slug}`}
                  className={[
                    'inline-flex min-h-9 items-center rounded-lg border px-3 text-xs font-semibold transition',
                    item.slug === doc.slug
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-contrast)]'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]',
                  ].join(' ')}
                  aria-current={item.slug === doc.slug ? 'page' : undefined}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </header>

          <section className="card-surface overflow-x-auto p-4 md:p-5">
            <p className="mb-3 text-xs text-[var(--text-muted)]">원문 경로: prompt/feature/{doc.fileName}</p>
            <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--text)]">{markdown}</pre>
          </section>

          <nav className="card-surface mt-4 grid gap-2 p-3 md:grid-cols-2" aria-label="이전 다음 문서 이동">
            {previousDoc ? (
              <Link
                href={`/guide/features/docs/${previousDoc.slug}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 transition hover:bg-[var(--surface-muted)]"
              >
                <p className="text-xs text-[var(--text-muted)]">이전 문서</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">{previousDoc.title}</p>
              </Link>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-3">
                <p className="text-xs text-[var(--text-muted)]">이전 문서</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">첫 번째 문서입니다.</p>
              </div>
            )}

            {nextDoc ? (
              <Link
                href={`/guide/features/docs/${nextDoc.slug}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-right transition hover:bg-[var(--surface-muted)]"
              >
                <p className="text-xs text-[var(--text-muted)]">다음 문서</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">{nextDoc.title}</p>
              </Link>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-3 text-right">
                <p className="text-xs text-[var(--text-muted)]">다음 문서</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">마지막 문서입니다.</p>
              </div>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}
