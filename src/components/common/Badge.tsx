import type { ReactNode } from 'react';

/**
 * 공통 배지 컴포넌트에서 사용하는 시각적 유형이다.
 * 상태/카운트/카테고리 정보를 짧게 강조 표시할 때 사용한다.
 */
export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

/**
 * 배지 크기 타입이다.
 */
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  /**
   * 배지의 의미에 맞는 색상 유형을 지정한다.
   */
  variant?: BadgeVariant;
  /**
   * 배지 크기를 지정한다.
   */
  size?: BadgeSize;
  /**
   * 배지에 표시할 텍스트/숫자/아이콘 콘텐츠다.
   */
  children: ReactNode;
  /**
   * 화면별 미세 조정을 위한 추가 클래스다.
   */
  className?: string;
}

/**
 * 배지 유형별 색상 클래스 매핑이다.
 */
const VARIANT_CLASS_MAP: Record<BadgeVariant, string> = {
  neutral: 'bg-[var(--surface-muted)] text-[var(--text-muted)]',
  primary: 'bg-[var(--primary)] text-[var(--primary-contrast)]',
  success: 'bg-[var(--success)]/15 text-[var(--success)]',
  warning: 'bg-[var(--warning)]/15 text-[var(--warning)]',
  danger: 'bg-[var(--danger)]/15 text-[var(--danger)]',
};

/**
 * 배지 크기별 클래스 매핑이다.
 */
const SIZE_CLASS_MAP: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-1 text-xs',
};

/**
 * 상태/메타 정보를 간결하게 표현하는 공통 배지 컴포넌트다.
 */
export function Badge({ variant = 'neutral', size = 'md', children, className }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-bold',
        VARIANT_CLASS_MAP[variant],
        SIZE_CLASS_MAP[size],
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
