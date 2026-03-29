'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * 공통 버튼 컴포넌트에서 사용할 시각적 변형 타입이다.
 * 화면 목적에 따라 강조도(주요/보조/경고/투명)를 일관되게 적용하기 위해 사용한다.
 */
export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * 공통 버튼 컴포넌트에서 사용할 크기 타입이다.
 * 동일한 컴포넌트가 화면별로 다른 밀도를 요구할 때 높이/패딩/폰트 크기를 통일하기 위해 사용한다.
 */
export type AppButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 역할(주요/보조/투명/위험)을 지정한다.
   * 지정하지 않으면 주요 액션인 `primary`가 기본 적용된다.
   */
  variant?: AppButtonVariant;
  /**
   * 버튼의 높이와 타이포그래피 크기를 제어한다.
   * 지정하지 않으면 일반 입력 영역과 균형이 맞는 `md`를 사용한다.
   */
  size?: AppButtonSize;
  /**
   * 로딩 상태 여부를 지정한다.
   * `true`일 때 버튼을 비활성화하고 보조 로딩 라벨을 노출한다.
   */
  isLoading?: boolean;
  /**
   * 버튼 왼쪽 아이콘 슬롯이다.
   * 액션 성격을 빠르게 인지할 수 있도록 시각 단서를 제공한다.
   */
  leftIcon?: ReactNode;
  /**
   * 버튼 오른쪽 아이콘 슬롯이다.
   * 외부 이동/확장 등 보조 의미를 전달할 때 사용한다.
   */
  rightIcon?: ReactNode;
  /**
   * 버튼을 가로 폭 100%로 확장할지 여부를 지정한다.
   */
  fullWidth?: boolean;
  /**
   * 로딩 중 보조 텍스트를 지정한다.
   * 미지정 시 기본값 `처리 중`을 사용한다.
   */
  loadingLabel?: string;
}

/**
 * Variant별 클래스 매핑 테이블이다.
 * Tailwind 클래스 문자열을 한곳에서 관리해 스타일 편차를 줄인다.
 */
const VARIANT_CLASS_MAP: Record<AppButtonVariant, string> = {
  primary:
    'border border-transparent bg-[var(--primary)] text-[var(--primary-contrast)] hover:brightness-95',
  secondary:
    'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]',
  ghost:
    'border border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]',
  danger:
    'border border-transparent bg-[var(--danger)] text-white hover:brightness-95',
};

/**
 * Size별 클래스 매핑 테이블이다.
 * 높이/패딩/폰트 크기를 단계적으로 관리한다.
 */
const SIZE_CLASS_MAP: Record<AppButtonSize, string> = {
  sm: 'min-h-8 rounded-lg px-2.5 text-xs',
  md: 'min-h-9 rounded-xl px-3 text-xs',
  lg: 'min-h-11 rounded-xl px-4 text-sm',
};

/**
 * 앱 전역에서 재사용하는 공통 버튼 컴포넌트다.
 * 로딩/비활성/아이콘 조합을 공통 API로 제공해 화면별 버튼 구현 중복을 제거한다.
 */
export function AppButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  loadingLabel = '처리 중',
  disabled,
  className,
  children,
  ...rest
}: AppButtonProps) {
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <button
      type="button"
      {...rest}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={[
        'inline-flex items-center justify-center gap-1.5 font-semibold transition',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
        VARIANT_CLASS_MAP[variant],
        SIZE_CLASS_MAP[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'cursor-not-allowed opacity-60' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingLabel}</span>
        </span>
      ) : (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      )}
    </button>
  );
}
