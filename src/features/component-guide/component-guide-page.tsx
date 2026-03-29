'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { AlertBanner } from '@/components/common/AlertBanner';
import { Badge } from '@/components/common/Badge';
import { AppButton } from '@/components/common/Button';
import { InfoIcon, SearchIcon } from '@/components/common/ButtonIcons';
import { AppCard } from '@/components/common/Card';
import { AppCheckbox } from '@/components/common/Checkbox';
import { AppInput } from '@/components/common/Input';
import { MessageModeToggle } from '@/components/common/MessageModeToggle';
import { AppModal } from '@/components/common/Modal';
import { AppRadioGroup } from '@/components/common/RadioGroup';
import { AppSelect } from '@/components/common/Select';
import { SkeletonBlock } from '@/components/common/Skeleton';
import { EmptyState, ErrorState, LoadingState, RetryButton } from '@/components/common/States';
import { Tabs, type TabKey } from '@/components/common/Tabs';
import { AppTextarea } from '@/components/common/Textarea';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Typography } from '@/components/common/Typography';
import { useMessageStore } from '@/store/message-store';

/**
 * 가이드 페이지에서 좌측 메뉴와 본문을 연결하기 위한 섹션 키 타입이다.
 */
type GuideSectionKey =
  | 'overview'
  | 'button'
  | 'typography'
  | 'badge'
  | 'modal'
  | 'message'
  | 'input'
  | 'selection'
  | 'feedback'
  | 'navigation'
  | 'theme';

/**
 * 좌측 메뉴 항목 정의 타입이다.
 */
interface GuideMenuItem {
  /**
   * 메뉴 항목 고유 키다.
   */
  key: GuideSectionKey;
  /**
   * 사용자에게 노출할 메뉴 라벨이다.
   */
  label: string;
  /**
   * 메뉴 보조 설명이다.
   */
  description: string;
}

const GUIDE_MENU_ITEMS: GuideMenuItem[] = [
  { key: 'overview', label: 'Overview', description: '컴포넌트 구성 개요' },
  { key: 'button', label: 'Button', description: '버튼/액션 컴포넌트' },
  { key: 'typography', label: 'Typography', description: '텍스트 스타일 체계' },
  { key: 'badge', label: 'Badge', description: '상태/메타 태그 표시' },
  { key: 'modal', label: 'Modal', description: '오버레이/확인 대화상자' },
  { key: 'message', label: 'Message', description: '토스트/팝업 메시지' },
  { key: 'input', label: 'Input', description: '텍스트 입력 계열' },
  { key: 'selection', label: 'Selection', description: '체크박스/라디오/셀렉트' },
  { key: 'feedback', label: 'Feedback', description: '배너/스켈레톤/상태 UI' },
  { key: 'navigation', label: 'Navigation', description: '탭 네비게이션' },
  { key: 'theme', label: 'Theme', description: '테마/메시지 모드 전환' },
];

interface GuideSectionLayoutProps {
  /**
   * 섹션 제목이다.
   */
  title: string;
  /**
   * 섹션 설명 문구다.
   */
  description: string;
  /**
   * 섹션 본문 콘텐츠다.
   */
  children: ReactNode;
}

/**
 * 모든 데모 섹션에서 공통으로 사용하는 레이아웃 래퍼다.
 */
function GuideSectionLayout({ title, description, children }: GuideSectionLayoutProps) {
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

/**
 * 공통 컴포넌트 가이드 메인 페이지다.
 * 좌측 메뉴에서 섹션을 전환하고, 우측에서 각 컴포넌트를 직접 테스트할 수 있다.
 */
export function ComponentGuidePage() {
  const pushMessage = useMessageStore((state) => state.pushMessage);

  const [activeSection, setActiveSection] = useState<GuideSectionKey>('overview');
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [textValue, setTextValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('auto');

  const [demoTab, setDemoTab] = useState<TabKey>('info');

  const sectionContent = useMemo(() => {
    if (activeSection === 'overview') {
      return (
        <GuideSectionLayout
          title="컴포넌트 가이드 개요"
          description="현재 프로젝트에서 사용 가능한 공통 컴포넌트를 한눈에 확인하고, 속성값을 바꿔 동작을 테스트할 수 있습니다."
        >
          <AppCard title="포함된 컴포넌트 그룹">
            <ul className="grid gap-2 text-sm text-[var(--text-muted)]">
              <li>Actions: `AppButton`</li>
              <li>Typography: `Typography`</li>
              <li>Data Display: `Badge`, `AppCard`</li>
              <li>Overlay: `AppModal`</li>
              <li>Messaging: `MessageToastViewport`, `MessagePopupHost`, `MessageModeToggle`</li>
              <li>Inputs: `AppInput`, `AppTextarea`, `AppSelect`, `AppCheckbox`, `AppRadioGroup`</li>
              <li>Feedback: `AlertBanner`, `LoadingState`, `ErrorState`, `EmptyState`, `SkeletonBlock`</li>
              <li>Navigation: `Tabs`</li>
              <li>Theme: `ThemeToggle`</li>
            </ul>
          </AppCard>
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'button') {
      return (
        <GuideSectionLayout
          title="Button"
          description="variant/size/loading 조합을 즉시 확인할 수 있습니다."
        >
          <AppCard title="실시간 데모" className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-3">
              <AppSelect
                label="Variant"
                value={buttonVariant}
                onChange={(event) => setButtonVariant(event.target.value as typeof buttonVariant)}
                options={[
                  { value: 'primary', label: 'primary' },
                  { value: 'secondary', label: 'secondary' },
                  { value: 'ghost', label: 'ghost' },
                  { value: 'danger', label: 'danger' },
                ]}
              />
              <AppSelect
                label="Size"
                value={buttonSize}
                onChange={(event) => setButtonSize(event.target.value as typeof buttonSize)}
                options={[
                  { value: 'sm', label: 'sm' },
                  { value: 'md', label: 'md' },
                  { value: 'lg', label: 'lg' },
                ]}
              />
              <AppCheckbox
                id="button-loading"
                label="Loading 상태"
                checked={isButtonLoading}
                onChange={(event) => setIsButtonLoading(event.target.checked)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <AppButton
                variant={buttonVariant}
                size={buttonSize}
                isLoading={isButtonLoading}
                leftIcon={<SearchIcon className="h-4 w-4" />}
              >
                샘플 버튼
              </AppButton>
              <AppButton variant="secondary" size="md" onClick={() => setIsButtonLoading((prev) => !prev)}>
                로딩 토글
              </AppButton>
            </div>
          </AppCard>

          <AlertBanner
            variant="info"
            title="주요 Props"
            description="`variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`, `fullWidth`, `loadingLabel`"
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'typography') {
      return (
        <GuideSectionLayout title="Typography" description="텍스트 레벨/색조/두께를 조합해 확인합니다.">
          <AppCard title="Variant 샘플" className="grid gap-2">
            <Typography variant="headline" weight="black">Headline 샘플 텍스트</Typography>
            <Typography variant="title" weight="bold">Title 샘플 텍스트</Typography>
            <Typography variant="body">Body 샘플 텍스트</Typography>
            <Typography variant="caption" tone="muted">Caption 샘플 텍스트</Typography>
            <Typography variant="overline" tone="primary">Overline 샘플 텍스트</Typography>
          </AppCard>
          <AlertBanner variant="info" title="주요 Props" description="`as`, `variant`, `weight`, `tone`, `className`" />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'badge') {
      return (
        <GuideSectionLayout title="Badge" description="상태/태그/카운트 표시용 배지 변형입니다.">
          <AppCard title="Variant" className="flex flex-wrap gap-2">
            <Badge variant="neutral">neutral</Badge>
            <Badge variant="primary">primary</Badge>
            <Badge variant="success">success</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="danger">danger</Badge>
          </AppCard>
          <AlertBanner variant="info" title="주요 Props" description="`variant`, `size`, `children`, `className`" />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'modal') {
      return (
        <GuideSectionLayout title="Modal" description="모달 열기/닫기, 액션 버튼 동작을 테스트합니다.">
          <AppCard title="모달 열기">
            <AppButton onClick={() => setIsModalOpen(true)} leftIcon={<InfoIcon className="h-4 w-4" />}>
              모달 열기
            </AppButton>
          </AppCard>

          <AppModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="가이드 모달 테스트"
            description="ESC, 배경 클릭, 버튼 동작을 확인할 수 있습니다."
            onPrimaryAction={() => {
              pushMessage({ type: 'success', title: '확인 액션이 실행되었습니다.' });
              setIsModalOpen(false);
            }}
            primaryActionLabel="확인"
          >
            <Typography tone="muted">모달 본문 콘텐츠 예시입니다.</Typography>
          </AppModal>

          <AlertBanner
            variant="info"
            title="주요 Props"
            description="`isOpen`, `onClose`, `title`, `description`, `onPrimaryAction`, `primaryActionLabel`, `closeOnBackdrop`"
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'message') {
      return (
        <GuideSectionLayout title="Message" description="토스트/팝업/자동 모드를 선택하고 메시지를 발생시켜 확인합니다.">
          <AppCard title="메시지 모드 설정" className="flex flex-wrap items-center gap-2">
            <MessageModeToggle />
            <ThemeToggle />
          </AppCard>

          <AppCard title="메시지 트리거" className="flex flex-wrap gap-2">
            <AppButton
              variant="secondary"
              onClick={() => pushMessage({ type: 'info', title: '정보 메시지', description: '정보성 안내입니다.' })}
            >
              Info
            </AppButton>
            <AppButton
              onClick={() => pushMessage({ type: 'success', title: '성공 메시지', description: '정상 처리되었습니다.' })}
            >
              Success
            </AppButton>
            <AppButton
              variant="danger"
              onClick={() => pushMessage({ type: 'error', title: '오류 메시지', description: '문제가 발생했습니다.' })}
            >
              Error
            </AppButton>
            <AppButton
              variant="secondary"
              onClick={() =>
                pushMessage({
                  type: 'warning',
                  title: '팝업 강제 노출',
                  description: '이 메시지는 팝업으로 표시됩니다.',
                  mode: 'popup',
                })
              }
            >
              Popup 강제
            </AppButton>
          </AppCard>

          <AlertBanner
            variant="info"
            title="주요 Props"
            description="`type`, `title`, `description`, `mode`, `durationMs`, `actionLabel`, `onAction`, `dedupeKey`"
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'input') {
      return (
        <GuideSectionLayout title="Input" description="텍스트 입력/텍스트영역의 상태를 테스트합니다.">
          <AppCard title="Text Input" className="grid gap-3">
            <AppInput
              id="guide-text-input"
              label="학교명"
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              placeholder="예: 서울고등학교"
              helperText={textValue.length < 2 ? '2글자 이상 입력해 주세요.' : '입력값이 유효합니다.'}
              helperTone={textValue.length < 2 ? 'danger' : 'muted'}
              variant={textValue.length < 2 ? 'error' : 'default'}
            />
          </AppCard>

          <AppCard title="Textarea" className="grid gap-3">
            <AppTextarea
              id="guide-textarea"
              label="설명"
              value={textareaValue}
              onChange={(event) => setTextareaValue(event.target.value)}
              helperText="최대 200자 권장"
              placeholder="설명 텍스트를 입력해 주세요"
            />
          </AppCard>
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'selection') {
      return (
        <GuideSectionLayout title="Selection" description="Select/Checkbox/Radio를 조합해 선택 컴포넌트를 테스트합니다.">
          <AppCard title="Select" className="grid gap-3">
            <AppSelect
              id="guide-select"
              label="교육청"
              value={selectValue}
              onChange={(event) => setSelectValue(event.target.value)}
              placeholder="선택해 주세요"
              options={[
                { value: 'B10', label: '서울특별시교육청' },
                { value: 'C10', label: '부산광역시교육청' },
                { value: 'D10', label: '대구광역시교육청' },
              ]}
              helperText={selectValue ? `선택값: ${selectValue}` : '아직 선택되지 않았습니다.'}
            />
          </AppCard>

          <AppCard title="Checkbox / Radio" className="grid gap-3">
            <AppCheckbox
              id="guide-checkbox"
              label="필수 약관 동의"
              description="체크 상태를 직접 전환해 보세요."
              checked={isChecked}
              onChange={(event) => setIsChecked(event.target.checked)}
            />

            <AppRadioGroup
              name="guide-radio"
              label="메시지 기본 모드"
              value={radioValue}
              onChange={setRadioValue}
              options={[
                { value: 'auto', label: '자동' },
                { value: 'toast', label: '토스트' },
                { value: 'popup', label: '팝업' },
              ]}
            />
          </AppCard>
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'feedback') {
      return (
        <GuideSectionLayout title="Feedback" description="배너/로딩/에러/빈 상태/스켈레톤을 확인합니다.">
          <div className="grid gap-3">
            <AlertBanner variant="info" title="정보 배너" description="일반 안내 메시지에 사용합니다." />
            <AlertBanner variant="success" title="성공 배너" description="작업 완료 결과를 안내합니다." />
            <AlertBanner variant="warning" title="경고 배너" description="주의가 필요한 상태를 안내합니다." />
            <AlertBanner variant="danger" title="오류 배너" description="문제 상황을 강조합니다." />
          </div>

          <AppCard title="상태 컴포넌트" className="grid gap-3">
            <LoadingState title="로딩 상태" description="데이터를 조회 중입니다." skeletonCount={2} />
            <ErrorState message="오류 상태 예시입니다." retry={<RetryButton onRetry={() => undefined} />} />
            <EmptyState title="빈 상태" message="조건을 변경해 다시 시도해 주세요." />
          </AppCard>

          <AppCard title="Skeleton" className="grid gap-2">
            <SkeletonBlock heightClassName="h-4" widthClassName="w-2/3" />
            <SkeletonBlock heightClassName="h-4" widthClassName="w-full" />
            <SkeletonBlock heightClassName="h-24" widthClassName="w-full" radiusClassName="rounded-xl" />
          </AppCard>
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'navigation') {
      return (
        <GuideSectionLayout title="Navigation" description="탭 전환 컴포넌트 동작을 확인합니다.">
          <AppCard title="Tabs 데모" className="grid gap-3">
            <Tabs activeTab={demoTab} onChange={setDemoTab} />
            <Typography tone="muted">현재 선택된 탭: {demoTab}</Typography>
          </AppCard>
        </GuideSectionLayout>
      );
    }

    return (
      <GuideSectionLayout title="Theme" description="테마와 메시지 노출 기본 모드를 즉시 변경합니다.">
        <AppCard title="전역 모드 토글" className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <MessageModeToggle />
        </AppCard>
      </GuideSectionLayout>
    );
  }, [
    activeSection,
    buttonSize,
    buttonVariant,
    demoTab,
    isButtonLoading,
    isChecked,
    isModalOpen,
    pushMessage,
    radioValue,
    selectValue,
    textValue,
    textareaValue,
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-6 md:px-6">
      <aside className="sticky top-4 hidden h-fit w-64 shrink-0 self-start md:block">
        <nav className="card-surface grid gap-1 p-2" aria-label="컴포넌트 가이드 메뉴">
          {GUIDE_MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveSection(item.key)}
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
            Component Guide
          </Typography>
          <Typography tone="muted">
            공통 컴포넌트의 시각/행동 규칙을 확인하고, Prop 조합을 직접 테스트할 수 있는 가이드 페이지입니다.
          </Typography>
          <div className="flex flex-wrap gap-2 md:hidden">
            {GUIDE_MENU_ITEMS.map((item) => (
              <AppButton
                key={item.key}
                variant={activeSection === item.key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </AppButton>
            ))}
          </div>
        </header>

        <div className="card-surface p-4 md:p-5">{sectionContent}</div>
      </main>
    </div>
  );
}
