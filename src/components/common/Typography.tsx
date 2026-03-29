import type { ElementType, ReactNode } from 'react';

/**
 * 공통 타이포그래피 컴포넌트에서 사용하는 시맨틱 스타일 변형이다.
 * 제목/본문/설명 텍스트를 일관된 크기와 굵기로 표현하기 위해 사용한다.
 */
export type TypographyVariant = 'headline' | 'title' | 'body' | 'caption' | 'overline';

/**
 * 텍스트 강조 강도를 나타내는 가중치 타입이다.
 */
export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'black';

/**
 * 텍스트 색조를 일관되게 매핑하기 위한 타입이다.
 */
export type TypographyTone = 'default' | 'muted' | 'danger' | 'success' | 'warning' | 'primary';

interface TypographyProps {
  /**
   * 렌더링할 실제 HTML 태그를 지정한다.
   * 지정하지 않으면 기본 `p` 태그로 렌더링한다.
   */
  as?: ElementType;
  /**
   * 타이포그래피 스타일 프리셋을 지정한다.
   */
  variant?: TypographyVariant;
  /**
   * 텍스트 굵기를 지정한다.
   */
  weight?: TypographyWeight;
  /**
   * 텍스트 색상을 지정한다.
   */
  tone?: TypographyTone;
  /**
   * 텍스트 콘텐츠다.
   */
  children: ReactNode;
  /**
   * 화면별 미세 조정을 위한 추가 클래스다.
   */
  className?: string;
}

/**
 * 변형별 기본 크기/행간 클래스 매핑이다.
 */
const VARIANT_CLASS_MAP: Record<TypographyVariant, string> = {
  headline: 'text-2xl leading-tight',
  title: 'text-lg leading-snug',
  body: 'text-sm leading-relaxed',
  caption: 'text-xs leading-relaxed',
  overline: 'text-[11px] uppercase tracking-[0.08em] leading-normal',
};

/**
 * 굵기별 클래스 매핑이다.
 */
const WEIGHT_CLASS_MAP: Record<TypographyWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
};

/**
 * 색조별 클래스 매핑이다.
 */
const TONE_CLASS_MAP: Record<TypographyTone, string> = {
  default: 'text-[var(--text)]',
  muted: 'text-[var(--text-muted)]',
  danger: 'text-[var(--danger)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  primary: 'text-[var(--primary)]',
};

/**
 * 앱 전반에서 텍스트 표현을 통일하기 위한 공통 타이포그래피 컴포넌트다.
 */
export function Typography({
  as,
  variant = 'body',
  weight = 'regular',
  tone = 'default',
  className,
  children,
}: TypographyProps) {
  const Component = as ?? 'p';

  return (
    <Component
      className={[
        VARIANT_CLASS_MAP[variant],
        WEIGHT_CLASS_MAP[weight],
        TONE_CLASS_MAP[tone],
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Component>
  );
}
