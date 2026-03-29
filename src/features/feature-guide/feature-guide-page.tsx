'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AppButton } from '@/components/common/Button';
import { CopyIcon } from '@/components/common/ButtonIcons';
import { AppCard } from '@/components/common/Card';
import { Typography } from '@/components/common/Typography';
import { GuideTopTabs } from '@/components/guide/GuideTopTabs';
import { FEATURE_DOCS } from '@/lib/guide/feature-docs';

/**
 * 기능 가이드 섹션 키 타입이다.
 */
type FeatureGuideSectionKey =
  | 'overview'
  | 'architecture'
  | 'routing'
  | 'services'
  | 'zustand'
  | 'kakao'
  | 'hooks'
  | 'ui'
  | 'storage'
  | 'testing'
  | 'checklist';

interface FeatureGuideMenuItem {
  /**
   * 섹션 식별 키다.
   */
  key: FeatureGuideSectionKey;
  /**
   * 메뉴 라벨이다.
   */
  label: string;
  /**
   * 메뉴 보조 설명이다.
   */
  description: string;
}

const FEATURE_GUIDE_MENU_ITEMS: FeatureGuideMenuItem[] = [
  { key: 'overview', label: 'Overview', description: '기술 스택과 핵심 흐름' },
  { key: 'architecture', label: 'Architecture', description: '레이어 구조와 책임 분리' },
  { key: 'routing', label: 'Routing', description: '페이지/API 라우팅 규칙' },
  { key: 'services', label: 'Service/API', description: 'NEIS 서비스 계층 설계' },
  { key: 'zustand', label: 'Zustand', description: '전역 상태와 메시지 정책' },
  { key: 'kakao', label: 'Kakao Map', description: '지도/거리/길찾기 연동' },
  { key: 'hooks', label: 'Hooks & Cache', description: '훅 상태 전이와 캐시' },
  { key: 'ui', label: 'UI & Message', description: '상태 UI와 전역 메시지' },
  { key: 'storage', label: 'Storage & Env', description: '로컬 저장소/환경변수' },
  { key: 'testing', label: 'Testing', description: '검증 절차와 운영 점검' },
  { key: 'checklist', label: 'Phase Checklist', description: '단계별 실행 체크' },
];

/**
 * query string section 값이 유효한지 검증한다.
 */
function isFeatureGuideSectionKey(value: string | null): value is FeatureGuideSectionKey {
  return FEATURE_GUIDE_MENU_ITEMS.some((item) => item.key === value);
}

interface SectionLayoutProps {
  /**
   * 제목이다.
   */
  title: string;
  /**
   * 설명이다.
   */
  description: string;
  /**
   * 본문이다.
   */
  children: React.ReactNode;
}

/**
 * 섹션 공통 레이아웃이다.
 */
function SectionLayout({ title, description, children }: SectionLayoutProps) {
  return (
    <section className="grid gap-3">
      <header className="grid gap-1">
        <Typography as="h2" variant="title" weight="black">
          {title}
        </Typography>
        <Typography tone="muted">{description}</Typography>
      </header>
      {children}
    </section>
  );
}

interface BulletListCardProps {
  /**
   * 카드 제목이다.
   */
  title: string;
  /**
   * 목록 데이터다.
   */
  items: string[];
}

/**
 * 목록형 카드 컴포넌트다.
 */
function BulletListCard({ title, items }: BulletListCardProps) {
  return (
    <AppCard title={title}>
      <ul className="grid gap-2 text-sm text-[var(--text-muted)]">
        {items.map((item) => (
          <li key={`${title}-${item}`} className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </AppCard>
  );
}

/**
 * 전체 소스 기술 스펙을 섹션별로 제공하는 기능 가이드 페이지다.
 */
export function FeatureGuidePage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCopiedDocPath, setIsCopiedDocPath] = useState(false);

  const activeSection = useMemo<FeatureGuideSectionKey>(() => {
    const section = searchParams.get('section');
    return isFeatureGuideSectionKey(section) ? section : 'overview';
  }, [searchParams]);
  const contentTopRef = useRef<HTMLDivElement | null>(null);

  const handleSectionChange = (nextSection: FeatureGuideSectionKey) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('section', nextSection);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    contentTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeSection]);

  const currentDoc = useMemo(() => {
    const matchedDoc = FEATURE_DOCS.find((item) => item.sectionKeys.includes(activeSection));
    return matchedDoc ?? FEATURE_DOCS[0];
  }, [activeSection]);

  const content = useMemo(() => {
    if (activeSection === 'overview') {
      return (
        <SectionLayout title="기능 가이드 개요" description="프로젝트의 전체 구조와 기술 스택, 데이터 흐름을 요약합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard
              title="기술 스택"
              items={[
                'Next.js 16 App Router',
                'React 19 + TypeScript(strict)',
                'TailwindCSS v4',
                'Zustand',
                'Vitest + Testing Library',
                'Kakao Maps JavaScript SDK',
              ]}
            />
            <BulletListCard
              title="핵심 기능"
              items={[
                '학교 검색, 상세, 급식, 시간표 조회',
                '카카오 지도 기반 위치 표시',
                '현재 위치 거리/예상 소요시간 계산',
                '전역 메시지 토스트/팝업 모드',
                '테마 모드 및 사용자 선호 저장',
                '컴포넌트 가이드/기능 가이드 제공',
              ]}
            />
          </div>
          <AppCard title="표준 데이터 흐름">
            <ol className="grid gap-2 text-sm text-[var(--text-muted)]">
              <li>1. 화면 컨테이너가 훅 호출</li>
              <li>2. 훅이 내부 API Route(`/api/neis/*`) 요청</li>
              <li>3. API Route가 서비스 계층 호출</li>
              <li>4. 서비스가 NEIS 응답 수집</li>
              <li>5. Validator/Mapper로 내부 타입 정규화</li>
              <li>6. 상태 UI + 전역 메시지로 결과 표시</li>
            </ol>
          </AppCard>
        </SectionLayout>
      );
    }

    if (activeSection === 'architecture') {
      return (
        <SectionLayout title="아키텍처" description="레이어별 책임 분리를 통해 유지보수성을 확보합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard
              title="프레젠테이션 계층"
              items={[
                '`src/app`: 라우트/레이아웃/API 엔트리',
                '`src/features`: 화면 단위 오케스트레이션',
                '`src/components`: 공통/도메인 UI',
              ]}
            />
            <BulletListCard
              title="비즈니스 계층"
              items={[
                '`src/hooks`: 상태/비동기 제어',
                '`src/lib/api`: 서비스 함수',
                '`src/lib/mappers`: 응답 매핑',
                '`src/lib/validators`: 입력 검증',
                '`src/store`: 전역 Zustand store',
              ]}
            />
          </div>
        </SectionLayout>
      );
    }

    if (activeSection === 'routing') {
      return (
        <SectionLayout title="라우팅" description="페이지 라우트와 API 라우트를 분리 운영합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard
              title="페이지 라우트"
              items={['`/`', '`/school/[schoolKey]`', '`/guide`', '`/guide/features`', '`/guide/components`']}
            />
            <BulletListCard
              title="API 라우트"
              items={['`/api/neis/schools`', '`/api/neis/school`', '`/api/neis/meals`', '`/api/neis/timetable`']}
            />
          </div>
        </SectionLayout>
      );
    }

    if (activeSection === 'services') {
      return (
        <SectionLayout title="서비스/API" description="NEIS 연동은 공통 클라이언트와 도메인 서비스로 구현합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard
              title="서비스 계층 구성"
              items={[
                '`requestNeis`: timeout/retry/공통 실패 처리',
                '`school-api`: 학교 검색/상세',
                '`meal-api`: 급식 조회',
                '`timetable-api`: 시간표 조회',
              ]}
            />
            <BulletListCard
              title="구현 순서"
              items={[
                '타입 정의 -> 검증기 구현',
                '매퍼 구현 -> 서비스 함수 구현',
                'API Route 연결 -> 훅/화면 연결',
                '테스트/검증 실행',
              ]}
            />
          </div>
        </SectionLayout>
      );
    }

    if (activeSection === 'zustand') {
      return (
        <SectionLayout title="Zustand" description="전역 상태는 테마와 메시지에 집중하고 화면 상태는 훅에 둡니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard title="theme-store" items={['mode', 'setMode', 'useTheme 훅으로 DOM/localStorage 동기화']} />
            <BulletListCard
              title="message-store"
              items={[
                'defaultMode, toastMessages, activePopup, popupQueue',
                'pushMessage, dismissToast, dismissPopup',
                '3초 dedupe, 토스트 3200ms 기본 지속시간',
              ]}
            />
          </div>
        </SectionLayout>
      );
    }

    if (activeSection === 'kakao') {
      return (
        <SectionLayout title="Kakao Map" description="지도 SDK 로딩, 주소 지오코딩, 거리 계산을 분리 구성합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard
              title="핵심 파일"
              items={[
                '`src/lib/kakao/map-loader.ts`',
                '`src/lib/kakao/distance.ts`',
                '`src/lib/kakao/route-link.ts`',
                '`SchoolMapPanel`',
                '`RouteDistancePanel`',
              ]}
            />
            <BulletListCard
              title="처리 규칙"
              items={[
                'SDK는 1회만 로드',
                '학교 좌표 우선, 없으면 주소 지오코딩',
                '현재 위치 획득 시 마커/경로선 오버레이',
                '실패 상황은 전역 메시지로 안내',
              ]}
            />
          </div>
        </SectionLayout>
      );
    }

    if (activeSection === 'hooks') {
      return (
        <SectionLayout title="Hooks & Cache" description="조회 훅은 상태 머신과 캐시 TTL을 함께 관리합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard
              title="조회 훅"
              items={[
                '`useSchoolSearch`: TTL 5분',
                '`useSchoolDetail`: TTL 10분',
                '`useMeals`: TTL 5분',
                '`useTimetable`: TTL 5분',
              ]}
            />
            <BulletListCard
              title="보조 훅"
              items={[
                '`useErrorMessage`',
                '`useCurrentLocation`',
                '`useTheme` / `useMessageMode`',
                '`useFavorites` / `useRecents`',
              ]}
            />
          </div>
        </SectionLayout>
      );
    }

    if (activeSection === 'ui') {
      return (
        <SectionLayout title="UI & Message" description="상태 UI 컴포넌트와 전역 메시지 시스템을 조합합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard
              title="상태 UI"
              items={['LoadingState', 'EmptyState', 'ErrorState + RetryButton', 'AlertBanner/Skeleton']}
            />
            <BulletListCard
              title="메시지 UX"
              items={['MessageToastViewport', 'MessagePopupHost', 'MessageModeToggle', 'useErrorMessage']}
            />
          </div>
        </SectionLayout>
      );
    }

    if (activeSection === 'storage') {
      return (
        <SectionLayout title="Storage & Env" description="환경변수와 localStorage를 안전하게 사용합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard
              title="Public Env"
              items={[
                '`NEXT_PUBLIC_KAKAO_MAP_APP_KEY`',
                '`NEXT_PUBLIC_DEFAULT_THEME`',
                '`NEXT_PUBLIC_MESSAGE_DISPLAY_MODE`',
                '`NEXT_PUBLIC_RECENT_MAX_COUNT`',
              ]}
            />
            <BulletListCard
              title="Storage Key"
              items={['schoolApp:theme:v1', 'schoolApp:message-mode:v1', 'schoolApp:favorites:v1', 'schoolApp:recents:v1']}
            />
          </div>
        </SectionLayout>
      );
    }

    if (activeSection === 'testing') {
      return (
        <SectionLayout title="Testing" description="변경 후 정적 검증과 테스트를 기본으로 수행합니다.">
          <div className="grid gap-3 md:grid-cols-2">
            <BulletListCard title="필수 검증" items={['`npm run typecheck`', '`npm run lint`', '`npm run test`', '`npm run build`(필요 시)']} />
            <BulletListCard
              title="대표 테스트"
              items={[
                'neis-client.test.ts',
                'distance.test.ts',
                'meal-mapper.test.ts',
                'timetable-mapper.test.ts',
                'theme.test.ts',
                'school-key.test.ts',
              ]}
            />
          </div>
        </SectionLayout>
      );
    }

    return (
      <SectionLayout title="Phase Checklist" description="리팩터링/확장 시 단계별 실행 여부를 점검합니다.">
        <AppCard title="Phase A">
          <ul className="grid gap-2 text-sm text-[var(--text-muted)]">
            <li>[ ] 구조와 호출 경계 파악</li>
            <li>[ ] 타입/검증/매핑 기준 정리</li>
            <li>[ ] 영향 범위 확정</li>
          </ul>
        </AppCard>
        <AppCard title="Phase B">
          <ul className="grid gap-2 text-sm text-[var(--text-muted)]">
            <li>[ ] 서비스/API 구현</li>
            <li>[ ] 훅/화면 연결</li>
            <li>[ ] 메시지 정책 적용</li>
          </ul>
        </AppCard>
        <AppCard title="Phase C">
          <ul className="grid gap-2 text-sm text-[var(--text-muted)]">
            <li>[ ] 상태 UI 적용</li>
            <li>[ ] 캐시/중복 제어 확인</li>
            <li>[ ] 저장소 동작 확인</li>
          </ul>
        </AppCard>
        <AppCard title="Phase D">
          <ul className="grid gap-2 text-sm text-[var(--text-muted)]">
            <li>[ ] typecheck</li>
            <li>[ ] lint</li>
            <li>[ ] test</li>
            <li>[ ] build (필요 시)</li>
          </ul>
        </AppCard>
      </SectionLayout>
    );
  }, [activeSection]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-6">
      <GuideTopTabs />

      <div className="flex min-w-0 flex-1 gap-4">
        <aside className="sticky top-4 hidden h-fit w-64 shrink-0 self-start md:block">
          <nav className="card-surface grid gap-1 p-2" aria-label="기능 가이드 메뉴">
            {FEATURE_GUIDE_MENU_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSectionChange(item.key)}
                className={[
                  'grid rounded-lg px-3 py-2 text-left transition',
                  activeSection === item.key
                    ? 'bg-[var(--primary)] text-[var(--primary-contrast)]'
                    : 'text-[var(--text)] hover:bg-[var(--surface-muted)]',
                ].join(' ')}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-[11px] opacity-85">{item.description}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-4 grid gap-2">
            <Typography as="h1" variant="headline" weight="black">
              Feature Guide
            </Typography>
            <Typography tone="muted">
              전체 서비스, 상태관리, API, 지도 연동, 저장소, 테스트 운영 방법을 섹션 기반 가이드로 제공합니다.
            </Typography>

            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
              <p className="text-xs text-[var(--text-muted)]">연관 원문: {currentDoc.fileName}</p>
              <Link
                href={`/guide/features/docs/${currentDoc.slug}`}
                className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
              >
                문서 열기
              </Link>
              <AppButton
                size="sm"
                variant="secondary"
                leftIcon={<CopyIcon className="h-3.5 w-3.5" />}
                onClick={() => {
                  void navigator.clipboard.writeText(`prompt/feature/${currentDoc.fileName}`);
                  setIsCopiedDocPath(true);
                  window.setTimeout(() => setIsCopiedDocPath(false), 1200);
                }}
              >
                {isCopiedDocPath ? '경로 복사됨' : '경로 복사'}
              </AppButton>
            </div>

            <div className="flex flex-wrap gap-2 md:hidden">
              {FEATURE_GUIDE_MENU_ITEMS.map((item) => (
                <AppButton
                  key={item.key}
                  size="sm"
                  variant={activeSection === item.key ? 'primary' : 'secondary'}
                  onClick={() => handleSectionChange(item.key)}
                >
                  {item.label}
                </AppButton>
              ))}
            </div>
          </header>

          <div ref={contentTopRef} className="card-surface p-4 md:p-5">{content}</div>
        </main>
      </div>
    </div>
  );
}
