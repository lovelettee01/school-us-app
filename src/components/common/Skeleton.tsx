interface SkeletonBlockProps {
  /**
   * 스켈레톤 높이 클래스다.
   * 예: `h-4`, `h-8`, `h-24`
   */
  heightClassName?: string;
  /**
   * 스켈레톤 폭 클래스다.
   * 예: `w-full`, `w-1/2`, `w-40`
   */
  widthClassName?: string;
  /**
   * 모서리 둥글기 클래스다.
   */
  radiusClassName?: string;
  /**
   * 추가 클래스명이다.
   */
  className?: string;
}

/**
 * 공통 스켈레톤 블록 컴포넌트다.
 * 데이터 로딩 중 레이아웃 점프를 줄이기 위해 사용한다.
 */
export function SkeletonBlock({
  heightClassName = 'h-4',
  widthClassName = 'w-full',
  radiusClassName = 'rounded-md',
  className,
}: SkeletonBlockProps) {
  return (
    <div
      aria-hidden
      className={[
        'animate-pulse bg-[var(--surface-muted)]',
        heightClassName,
        widthClassName,
        radiusClassName,
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
