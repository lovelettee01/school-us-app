import type { TextareaHTMLAttributes } from 'react';

interface AppTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /**
   * 레이블 텍스트다.
   */
  label?: string;
  /**
   * 보조 설명 텍스트다.
   */
  helperText?: string;
  /**
   * 에러 상태 여부다.
   * `true`일 때 테두리를 위험 색상으로 강조한다.
   */
  hasError?: boolean;
  /**
   * 컨테이너 클래스명이다.
   */
  containerClassName?: string;
}

/**
 * 공통 텍스트영역 컴포넌트다.
 * 장문 입력 UI를 일관된 스타일/접근성 규칙으로 제공한다.
 */
export function AppTextarea({
  id,
  label,
  helperText,
  hasError = false,
  className,
  containerClassName,
  ...rest
}: AppTextareaProps) {
  const helperId = helperText && id ? `${id}-helper` : undefined;

  return (
    <div className={["grid gap-1", containerClassName ?? ''].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={id} className="text-sm font-semibold text-[var(--text)]">
          {label}
        </label>
      ) : null}

      <textarea
        id={id}
        aria-describedby={helperId}
        className={[
          'min-h-28 rounded-xl border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]',
          hasError ? 'border-[var(--danger)]' : 'border-[var(--border)]',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />

      {helperText ? (
        <p id={helperId} className={["text-xs", hasError ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]'].join(' ')}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
