'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { AlertBanner } from '@/components/common/AlertBanner';
import { Badge } from '@/components/common/Badge';
import { AppButton } from '@/components/common/Button';
import { InfoIcon, SearchIcon, StarIcon } from '@/components/common/ButtonIcons';
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

interface PropDocItem {
  /**
   * Props 이름이다.
   */
  name: string;
  /**
   * Props 타입 문자열이다.
   */
  type: string;
  /**
   * 필수 여부 표기값이다.
   */
  required: 'Y' | 'N';
  /**
   * 기본값 또는 기본 동작 설명이다.
   */
  defaultValue: string;
  /**
   * Props 사용 목적과 동작 설명이다.
   */
  description: string;
}

interface PropDocTableProps {
  /**
   * Props 표 제목이다.
   */
  title: string;
  /**
   * 표에 노출할 Props 문서 행 목록이다.
   */
  items: PropDocItem[];
}

/**
 * 컴포넌트 Props 문서를 표 형식으로 보여주는 공통 블록이다.
 */
function PropDocTable({ title, items }: PropDocTableProps) {
  return (
    <AppCard title={title} className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-xs">
        <thead>
          <tr>
            <th className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 text-left">Prop</th>
            <th className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 text-left">Type</th>
            <th className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 text-left">필수</th>
            <th className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 text-left">기본값</th>
            <th className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 text-left">설명</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${title}-${item.name}`}>
              <td className="border border-[var(--border)] px-2 py-2 font-semibold text-[var(--text)]">{item.name}</td>
              <td className="border border-[var(--border)] px-2 py-2 text-[var(--text-muted)]">{item.type}</td>
              <td className="border border-[var(--border)] px-2 py-2 text-[var(--text-muted)]">{item.required}</td>
              <td className="border border-[var(--border)] px-2 py-2 text-[var(--text-muted)]">{item.defaultValue}</td>
              <td className="border border-[var(--border)] px-2 py-2 text-[var(--text-muted)]">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppCard>
  );
}

interface ExampleBlockProps {
  /**
   * 예제 블록 제목이다.
   */
  title: string;
  /**
   * 예제의 핵심 기능 설명이다.
   */
  feature: string;
  /**
   * 예제의 권장 사용 방법 설명이다.
   */
  usage: string;
  /**
   * 실제 렌더링할 데모 UI다.
   */
  children: ReactNode;
  /**
   * 복사 버튼에서 사용할 코드 스니펫이다.
   * 미지정 시 기본 템플릿을 자동 생성한다.
   */
  codeSnippet?: string;
}

/**
 * 기능/사용 방법/실행 데모를 고정 레이아웃으로 노출하는 예제 블록이다.
 */
function ExampleBlock({ title, feature, usage, children, codeSnippet }: ExampleBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const resolvedSnippet = codeSnippet ?? `// ${title}\n// 기능: ${feature}\n// 사용 방법: ${usage}`;

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(resolvedSnippet);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1200);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <AppCard title={title} className="grid gap-3">
      <div className="grid gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <Typography variant="caption" weight="bold">
          기능
        </Typography>
        <Typography variant="caption" tone="muted">
          {feature}
        </Typography>
        <Typography variant="caption" weight="bold" className="mt-1">
          사용 방법
        </Typography>
        <Typography variant="caption" tone="muted">
          {usage}
        </Typography>
      </div>
      <div className="rounded-lg border border-[var(--border)] p-3">{children}</div>
      <div className="grid gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3">
        <div className="flex items-center justify-between gap-2">
          <Typography variant="caption" weight="bold">
            예제 코드
          </Typography>
          <AppButton variant="secondary" size="sm" onClick={() => void handleCopySnippet()}>
            {isCopied ? '복사됨' : '코드 복사'}
          </AppButton>
        </div>
        <pre className="overflow-x-auto rounded-md bg-black/80 p-3 text-[11px] text-gray-100">
          <code>{resolvedSnippet}</code>
        </pre>
      </div>
    </AppCard>
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
  const [isStrictModalOpen, setIsStrictModalOpen] = useState(false);

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
          description="각 컴포넌트는 속성별 예제를 개별 블록으로 분리해 기능과 사용 방법을 함께 확인할 수 있습니다."
        >
          <ExampleBlock
            title="가이드 사용 순서"
            feature="좌측 메뉴에서 컴포넌트 섹션을 선택하고, 우측 예제 블록에서 상태를 변경해 테스트합니다."
            usage="예제 확인 후 하단 Props 문서 표를 참고해 실제 화면 적용 코드를 작성합니다."
          >
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
          </ExampleBlock>
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'button') {
      return (
        <GuideSectionLayout title="Button" description="버튼 속성(variant/size/loading/icon/fullWidth)을 예제별로 분리 제공합니다.">
          <ExampleBlock
            title="Variant 예제"
            feature="primary/secondary/ghost/danger를 상황별로 구분해 사용합니다."
            usage="핵심 CTA는 primary, 위험 동작은 danger를 사용합니다."
          >
            <div className="flex flex-wrap gap-2">
              <AppButton variant="primary">primary</AppButton>
              <AppButton variant="secondary">secondary</AppButton>
              <AppButton variant="ghost">ghost</AppButton>
              <AppButton variant="danger">danger</AppButton>
            </div>
          </ExampleBlock>

          <ExampleBlock
            title="Size 예제"
            feature="화면 밀도에 맞게 버튼 크기를 조절합니다."
            usage="보조 액션은 sm, 기본 폼 액션은 md, 강조 버튼은 lg를 권장합니다."
          >
            <div className="flex flex-wrap gap-2">
              <AppButton size="sm">small</AppButton>
              <AppButton size="md">medium</AppButton>
              <AppButton size="lg">large</AppButton>
            </div>
          </ExampleBlock>

          <ExampleBlock
            title="Loading / Disabled 예제"
            feature="비동기 처리 중 중복 클릭을 막고 상태를 전달합니다."
            usage="요청 시작 시 isLoading=true를 설정하고 완료 시 false로 복구합니다."
          >
            <div className="flex flex-wrap gap-2">
              <AppButton isLoading>로딩</AppButton>
              <AppButton variant="secondary" disabled>
                비활성
              </AppButton>
              <AppButton variant="secondary" onClick={() => setIsButtonLoading((prev) => !prev)}>
                로딩 토글
              </AppButton>
              <AppButton isLoading={isButtonLoading} loadingLabel="처리 중">
                상태 연동
              </AppButton>
            </div>
          </ExampleBlock>

          <ExampleBlock
            title="Icon / FullWidth 예제"
            feature="아이콘 슬롯과 전체 폭 버튼을 통해 의미 전달과 반응형 대응을 강화합니다."
            usage="아이콘은 left/right 슬롯을 사용하고 모바일 주요 CTA는 fullWidth를 사용합니다."
          >
            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                <AppButton leftIcon={<SearchIcon className="h-4 w-4" />}>검색</AppButton>
                <AppButton variant="secondary" rightIcon={<StarIcon className="h-4 w-4" />}>
                  즐겨찾기
                </AppButton>
              </div>
              <AppButton variant="secondary" fullWidth>
                전체 폭 버튼
              </AppButton>
            </div>
          </ExampleBlock>

          <ExampleBlock
            title="실시간 Props 조합 테스트"
            feature="variant/size/loading 조합을 실시간으로 바꿔 결과를 확인합니다."
            usage="실제 화면 적용 전에 조합을 확정하는 샌드박스로 사용합니다."
          >
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
                label="Loading"
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
          </ExampleBlock>

          <PropDocTable
            title="AppButton Props 문서"
            items={[
              { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", required: 'N', defaultValue: 'primary', description: '버튼 시각적 성격을 지정한다.' },
              { name: 'size', type: "'sm' | 'md' | 'lg'", required: 'N', defaultValue: 'md', description: '버튼 크기를 지정한다.' },
              { name: 'isLoading', type: 'boolean', required: 'N', defaultValue: 'false', description: '로딩 스피너를 표시하고 버튼을 비활성화한다.' },
              { name: 'leftIcon/rightIcon', type: 'ReactNode', required: 'N', defaultValue: '-', description: '버튼 아이콘 슬롯을 렌더링한다.' },
              { name: 'fullWidth', type: 'boolean', required: 'N', defaultValue: 'false', description: '버튼 폭을 100%로 확장한다.' },
              { name: 'loadingLabel', type: 'string', required: 'N', defaultValue: '처리 중', description: '로딩 상태 대체 텍스트를 지정한다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'typography') {
      return (
        <GuideSectionLayout title="Typography" description="variant/tone/weight/as 태그를 개별 예제로 제공합니다.">
          <ExampleBlock
            title="Variant 예제"
            feature="텍스트 계층 구조를 크기/행간 단위로 통일합니다."
            usage="문서 구조에 맞게 headline/title/body/caption/overline을 선택합니다."
          >
            <div className="grid gap-2">
              <Typography variant="headline" weight="black">Headline 샘플 텍스트</Typography>
              <Typography variant="title" weight="bold">Title 샘플 텍스트</Typography>
              <Typography variant="body">Body 샘플 텍스트</Typography>
              <Typography variant="caption" tone="muted">Caption 샘플 텍스트</Typography>
              <Typography variant="overline" tone="primary">Overline 샘플 텍스트</Typography>
            </div>
          </ExampleBlock>

          <ExampleBlock
            title="Tone / Weight / as 예제"
            feature="색조, 굵기, 태그를 독립적으로 제어해 의미 전달을 강화합니다."
            usage="상태 텍스트는 tone으로, 강조는 weight로, 시맨틱은 as로 지정합니다."
          >
            <div className="grid gap-1">
              <Typography as="h3" variant="title" weight="black">as=&quot;h3&quot; + black</Typography>
              <Typography tone="success" weight="bold">success + bold</Typography>
              <Typography tone="warning" weight="semibold">warning + semibold</Typography>
              <Typography tone="danger" weight="medium">danger + medium</Typography>
            </div>
          </ExampleBlock>

          <PropDocTable
            title="Typography Props 문서"
            items={[
              { name: 'as', type: 'ElementType', required: 'N', defaultValue: 'p', description: '렌더링할 HTML 태그를 지정한다.' },
              { name: 'variant', type: "'headline' | 'title' | 'body' | 'caption' | 'overline'", required: 'N', defaultValue: 'body', description: '텍스트 스타일 프리셋을 지정한다.' },
              { name: 'weight', type: "'regular' | 'medium' | 'semibold' | 'bold' | 'black'", required: 'N', defaultValue: 'regular', description: '폰트 굵기를 지정한다.' },
              { name: 'tone', type: "'default' | 'muted' | 'danger' | 'success' | 'warning' | 'primary'", required: 'N', defaultValue: 'default', description: '텍스트 색조를 지정한다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'badge') {
      return (
        <GuideSectionLayout title="Badge" description="배지의 variant/size/조합 패턴을 분리해 확인합니다.">
          <ExampleBlock
            title="Variant 예제"
            feature="상태/분류/메타 정보를 색상으로 구분합니다."
            usage="상태 의미에 맞는 variant를 선택해 일관된 시각 피드백을 제공합니다."
          >
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">neutral</Badge>
              <Badge variant="primary">primary</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="danger">danger</Badge>
            </div>
          </ExampleBlock>

          <ExampleBlock
            title="Size / 조합 예제"
            feature="배지 크기를 상황에 맞춰 조정하고 여러 메타 태그를 조합합니다."
            usage="보조 태그는 sm, 기본 태그는 md를 사용합니다."
          >
            <div className="grid gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="sm" variant="primary">SM</Badge>
                <Badge size="md" variant="primary">MD</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral">공지</Badge>
                <Badge variant="warning">승인대기</Badge>
                <Badge variant="success">완료</Badge>
              </div>
            </div>
          </ExampleBlock>

          <PropDocTable
            title="Badge Props 문서"
            items={[
              { name: 'variant', type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger'", required: 'N', defaultValue: 'neutral', description: '배지 색상 유형을 지정한다.' },
              { name: 'size', type: "'sm' | 'md'", required: 'N', defaultValue: 'md', description: '배지 크기를 지정한다.' },
              { name: 'children', type: 'ReactNode', required: 'Y', defaultValue: '-', description: '배지에 표시할 내용이다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'modal') {
      return (
        <GuideSectionLayout title="Modal" description="기본/확인형/배경닫기제어 모달을 분리해 테스트합니다.">
          <ExampleBlock
            title="기본 모달 예제"
            feature="안내형 모달을 열고 닫는 기본 흐름을 제공합니다."
            usage="isOpen과 onClose를 상태에 연결해 모달 노출을 제어합니다."
          >
            <AppButton onClick={() => setIsModalOpen(true)} leftIcon={<InfoIcon className="h-4 w-4" />}>
              모달 열기
            </AppButton>
          </ExampleBlock>

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

          <ExampleBlock
            title="배경 클릭 닫기 비활성 예제"
            feature="중요 확인 플로우에서 배경 클릭 닫힘을 막습니다."
            usage="closeOnBackdrop={false}로 의도치 않은 닫힘을 방지합니다."
          >
            <AppButton variant="danger" onClick={() => setIsStrictModalOpen(true)}>
              엄격 모달 열기
            </AppButton>
            <AppModal
              isOpen={isStrictModalOpen}
              onClose={() => setIsStrictModalOpen(false)}
              closeOnBackdrop={false}
              title="배경 클릭으로 닫히지 않는 모달"
              description="닫기 버튼 또는 ESC로 종료합니다."
              primaryActionLabel="동의"
              onPrimaryAction={() => {
                pushMessage({ type: 'success', title: '동의 처리 완료' });
                setIsStrictModalOpen(false);
              }}
            >
              <Typography tone="muted">필수 약관 동의 같은 흐름에 사용합니다.</Typography>
            </AppModal>
          </ExampleBlock>

          <PropDocTable
            title="AppModal Props 문서"
            items={[
              { name: 'isOpen', type: 'boolean', required: 'Y', defaultValue: '-', description: '모달 표시 여부를 제어한다.' },
              { name: 'onClose', type: '() => void', required: 'Y', defaultValue: '-', description: '모달 닫기 이벤트를 처리한다.' },
              { name: 'title', type: 'string', required: 'Y', defaultValue: '-', description: '모달 제목을 지정한다.' },
              { name: 'description', type: 'string', required: 'N', defaultValue: '-', description: '모달 보조 설명을 지정한다.' },
              { name: 'onPrimaryAction', type: '() => void', required: 'N', defaultValue: '-', description: '확인 버튼 동작을 지정한다.' },
              { name: 'closeOnBackdrop', type: 'boolean', required: 'N', defaultValue: 'true', description: '배경 클릭 닫기 허용 여부를 제어한다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'message') {
      return (
        <GuideSectionLayout title="Message" description="메시지 타입/모드/중복억제/액션 버튼 예제를 분리 제공합니다.">
          <ExampleBlock
            title="메시지 모드 선택 예제"
            feature="토스트/팝업/자동 모드를 즉시 전환합니다."
            usage="메시지 표시 기본 전략을 사용자 선택으로 제어합니다."
          >
            <MessageModeToggle />
            <ThemeToggle />
          </ExampleBlock>

          <ExampleBlock
            title="타입별 메시지 예제"
            feature="info/success/warning/error 타입별 메시지를 노출합니다."
            usage="pushMessage에 type/title/description을 전달해 호출합니다."
          >
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
          </ExampleBlock>

          <ExampleBlock
            title="중복 억제 / 액션 버튼 예제"
            feature="동일 메시지 반복 호출을 억제하고 팝업 액션 버튼을 제공합니다."
            usage="dedupeKey와 actionLabel/onAction을 함께 사용합니다."
          >
            <div className="flex flex-wrap gap-2">
              <AppButton
                variant="secondary"
                onClick={() =>
                  pushMessage({
                    type: 'info',
                    title: '중복 억제 테스트',
                    description: '3초 이내 반복 호출은 차단됩니다.',
                    dedupeKey: 'guide:message:dedupe',
                  })
                }
              >
                Dedupe 테스트
              </AppButton>
              <AppButton
                onClick={() =>
                  pushMessage({
                    type: 'error',
                    title: '요청 실패',
                    description: '재시도를 눌러 다시 실행할 수 있습니다.',
                    actionLabel: '재시도',
                    onAction: () => pushMessage({ type: 'success', title: '재시도 성공' }),
                    mode: 'popup',
                  })
                }
              >
                Action 팝업
              </AppButton>
            </div>
          </ExampleBlock>

          <PropDocTable
            title="pushMessage Payload 문서"
            items={[
              { name: 'type', type: "'error' | 'warning' | 'success' | 'info'", required: 'Y', defaultValue: '-', description: '메시지 의미 타입을 지정한다.' },
              { name: 'title', type: 'string', required: 'Y', defaultValue: '-', description: '메시지 제목을 지정한다.' },
              { name: 'description', type: 'string', required: 'N', defaultValue: '-', description: '상세 설명 문구를 지정한다.' },
              { name: 'mode', type: "'toast' | 'popup'", required: 'N', defaultValue: 'auto', description: '표시 모드를 강제한다.' },
              { name: 'dedupeKey', type: 'string', required: 'N', defaultValue: '-', description: '중복 억제 키를 지정한다.' },
              { name: 'actionLabel/onAction', type: 'string / () => void', required: 'N', defaultValue: '-', description: '팝업 액션 버튼을 구성한다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'input') {
      const isInvalid = textValue.length > 0 && textValue.length < 2;

      return (
        <GuideSectionLayout title="Input" description="기본/검증/비활성/장문 입력 예제를 개별 블록으로 제공합니다.">
          <ExampleBlock
            title="기본 입력 예제"
            feature="레이블, placeholder, helperText를 기본 조합으로 노출합니다."
            usage="폼 기본 입력 필드에 그대로 적용할 수 있습니다."
          >
            <AppInput
              id="guide-text-input"
              label="학교명"
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              placeholder="예: 서울고등학교"
              helperText="2글자 이상 입력해 주세요."
            />
          </ExampleBlock>

          <ExampleBlock
            title="검증 연동 예제"
            feature="입력값 기준으로 error 스타일과 helper tone을 동적으로 전환합니다."
            usage="검증 결과를 variant/helperTone과 연결합니다."
          >
            <AppInput
              id="guide-text-input-validation"
              label="학교명 검증"
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              helperText={isInvalid ? '2글자 이상 입력해 주세요.' : '입력값이 유효합니다.'}
              helperTone={isInvalid ? 'danger' : 'muted'}
              variant={isInvalid ? 'error' : 'default'}
            />
          </ExampleBlock>

          <ExampleBlock
            title="읽기전용/비활성 예제"
            feature="입력 가능 여부를 상태별로 분리해 표현합니다."
            usage="수정 불가 값은 readOnly, 접근 제한은 disabled를 사용합니다."
          >
            <div className="grid gap-2 md:grid-cols-2">
              <AppInput id="guide-input-readonly" label="읽기전용" value="고정값" readOnly helperText="readOnly 상태" />
              <AppInput id="guide-input-disabled" label="비활성" value="입력 불가" disabled helperText="disabled 상태" />
            </div>
          </ExampleBlock>

          <ExampleBlock
            title="Textarea 예제"
            feature="장문 입력과 길이 기반 오류 강조를 지원합니다."
            usage="hasError에 검증 결과를 전달해 상태를 표현합니다."
          >
            <AppTextarea
              id="guide-textarea"
              label="설명"
              value={textareaValue}
              onChange={(event) => setTextareaValue(event.target.value)}
              helperText="최대 200자 권장"
              hasError={textareaValue.length > 180}
              placeholder="설명 텍스트를 입력해 주세요"
            />
          </ExampleBlock>

          <PropDocTable
            title="AppInput / AppTextarea Props 문서"
            items={[
              { name: 'label', type: 'string', required: 'N', defaultValue: '-', description: '입력 상단 라벨을 지정한다.' },
              { name: 'variant', type: "'default' | 'error'", required: 'N', defaultValue: 'default', description: '입력 시각 상태를 지정한다.' },
              { name: 'helperText', type: 'string', required: 'N', defaultValue: '-', description: '입력 하단 안내 문구를 노출한다.' },
              { name: 'helperTone', type: "'muted' | 'danger'", required: 'N', defaultValue: 'muted', description: '보조 문구 색상을 지정한다.' },
              { name: 'hasError(Textarea)', type: 'boolean', required: 'N', defaultValue: 'false', description: 'textarea 오류 강조 여부를 지정한다.' },
              { name: 'disabled/readOnly', type: 'boolean', required: 'N', defaultValue: 'false', description: '입력 가능 여부를 제어한다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'selection') {
      return (
        <GuideSectionLayout title="Selection" description="선택형 입력 컴포넌트별로 기본/옵션/상태 예제를 제공합니다.">
          <ExampleBlock
            title="Select 기본 예제"
            feature="옵션 목록 선택과 선택값 반영을 확인합니다."
            usage="value와 onChange를 상태와 연결해 사용합니다."
          >
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
          </ExampleBlock>

          <ExampleBlock
            title="Select 옵션 비활성 예제"
            feature="특정 옵션의 선택 불가 상태를 제어합니다."
            usage="옵션 데이터에 disabled=true를 지정합니다."
          >
            <AppSelect
              id="guide-select-disabled-option"
              label="학년"
              defaultValue=""
              placeholder="학년 선택"
              options={[
                { value: '1', label: '1학년' },
                { value: '2', label: '2학년' },
                { value: '3', label: '3학년', disabled: true },
              ]}
              helperText="3학년은 선택 불가 상태"
            />
          </ExampleBlock>

          <ExampleBlock
            title="Checkbox / Radio 예제"
            feature="불리언 체크와 단일 선택 그룹을 함께 테스트합니다."
            usage="checked/onChange 및 value/onChange 패턴을 각각 사용합니다."
          >
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
          </ExampleBlock>

          <PropDocTable
            title="Selection 컴포넌트 Props 문서"
            items={[
              { name: 'options(Select/Radio)', type: 'Array<{ value; label; disabled? }>', required: 'Y', defaultValue: '-', description: '선택 가능한 옵션 목록을 전달한다.' },
              { name: 'placeholder(Select)', type: 'string', required: 'N', defaultValue: '-', description: '초기 안내 옵션 라벨을 지정한다.' },
              { name: 'checked(Checkbox)', type: 'boolean', required: 'N', defaultValue: 'false', description: '체크 상태를 제어한다.' },
              { name: 'value/onChange', type: 'string / (value) => void', required: 'Y', defaultValue: '-', description: '선택값과 변경 핸들러를 연결한다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'feedback') {
      return (
        <GuideSectionLayout title="Feedback" description="피드백 컴포넌트를 기능별 예제 블록으로 제공합니다.">
          <ExampleBlock
            title="AlertBanner 예제"
            feature="정보/성공/경고/오류 맥락을 배너로 전달합니다."
            usage="페이지 문맥 메시지에 AlertBanner를 사용합니다."
          >
            <AlertBanner variant="info" title="정보 배너" description="일반 안내 메시지에 사용합니다." />
            <AlertBanner variant="success" title="성공 배너" description="작업 완료 결과를 안내합니다." />
            <AlertBanner variant="warning" title="경고 배너" description="주의가 필요한 상태를 안내합니다." />
            <AlertBanner variant="danger" title="오류 배너" description="문제 상황을 강조합니다." />
          </ExampleBlock>

          <ExampleBlock
            title="Loading / Error / Empty 예제"
            feature="비동기 상태 전환에 맞춘 표준 UI를 제공합니다."
            usage="데이터 상태값에 따라 조건 렌더링합니다."
          >
            <LoadingState title="로딩 상태" description="데이터를 조회 중입니다." skeletonCount={2} />
            <ErrorState message="오류 상태 예시입니다." retry={<RetryButton onRetry={() => undefined} />} />
            <EmptyState title="빈 상태" message="조건을 변경해 다시 시도해 주세요." />
          </ExampleBlock>

          <ExampleBlock
            title="Skeleton 예제"
            feature="로딩 중 레이아웃 점프를 줄이기 위한 플레이스홀더를 제공합니다."
            usage="실제 콘텐츠 구조와 유사한 형태로 배치합니다."
          >
            <SkeletonBlock heightClassName="h-4" widthClassName="w-2/3" />
            <SkeletonBlock heightClassName="h-4" widthClassName="w-full" />
            <SkeletonBlock heightClassName="h-24" widthClassName="w-full" radiusClassName="rounded-xl" />
          </ExampleBlock>

          <PropDocTable
            title="Feedback 컴포넌트 Props 문서"
            items={[
              { name: 'variant(AlertBanner)', type: "'info' | 'success' | 'warning' | 'danger'", required: 'N', defaultValue: 'info', description: '배너 시각 유형을 지정한다.' },
              { name: 'title/message', type: 'string', required: 'Y', defaultValue: '-', description: '상태 메시지 핵심 문구를 전달한다.' },
              { name: 'retry/action', type: 'ReactNode', required: 'N', defaultValue: '-', description: '후속 액션 영역을 지정한다.' },
              { name: 'skeletonCount', type: 'number', required: 'N', defaultValue: '3', description: 'LoadingState 스켈레톤 개수를 지정한다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    if (activeSection === 'navigation') {
      return (
        <GuideSectionLayout title="Navigation" description="탭 전환과 키보드 접근성 동작을 예제로 제공합니다.">
          <ExampleBlock
            title="Tabs 동작 예제"
            feature="클릭 또는 키보드로 탭 선택을 전환합니다."
            usage="activeTab/onChange를 상태와 연결해 라우팅/패널 전환에 사용합니다."
          >
            <Tabs activeTab={demoTab} onChange={setDemoTab} />
            <Typography tone="muted">현재 선택된 탭: {demoTab}</Typography>
          </ExampleBlock>

          <PropDocTable
            title="Tabs Props 문서"
            items={[
              { name: 'activeTab', type: "'info' | 'meal' | 'timetable'", required: 'Y', defaultValue: '-', description: '현재 활성 탭 키를 지정한다.' },
              { name: 'onChange', type: '(tab) => void', required: 'Y', defaultValue: '-', description: '탭 변경 이벤트를 처리한다.' },
            ]}
          />
        </GuideSectionLayout>
      );
    }

    return (
      <GuideSectionLayout title="Theme" description="전역 토글 컴포넌트의 기능과 사용 방법을 확인합니다.">
        <ExampleBlock
          title="Theme / MessageMode 토글 예제"
          feature="앱 전역 테마 및 메시지 표시 전략을 즉시 변경합니다."
          usage="헤더/설정 화면에 배치해 사용자 선호 설정을 제공합니다."
        >
          <ThemeToggle />
          <MessageModeToggle />
        </ExampleBlock>

        <PropDocTable
          title="Theme/Mode 토글 Props 문서"
          items={[
            { name: 'ThemeToggle', type: '무인자 컴포넌트', required: 'Y', defaultValue: '-', description: '내부 훅으로 테마 상태를 읽고 변경한다.' },
            { name: 'MessageModeToggle', type: '무인자 컴포넌트', required: 'Y', defaultValue: '-', description: '메시지 표시 모드를 변경한다.' },
          ]}
        />
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
    isStrictModalOpen,
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

