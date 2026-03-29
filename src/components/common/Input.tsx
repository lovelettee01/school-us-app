import type { InputHTMLAttributes } from 'react';

/**
 * 공통 입력 필드의 시각적 변형 타입이다.
 * 화면 맥락(기본/에러)에 따라 테두리/도움말 색상을 일관되게 제어한다.
 */
export type AppInputVariant = 'default' | 'error';

interface AppInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 레이블 텍스트다.
   * 지정하면 입력 필드 상단에 제목으로 렌더링한다.
   */
  label?: string;
  /**
   * 시각적 변형을 지정한다.
   * `error`일 때 위험 색상 테두리를 사용한다.
   */
  variant?: AppInputVariant;
  /**
   * 입력 필드 하단 보조 설명 텍스트다.
   * 사용 가이드, 단위, 제한 조건 안내에 사용한다.
   */
  helperText?: string;
  /**
   * 설명 텍스트 영역에 적용할 tone이다.
   * `danger`는 오류, `muted`는 일반 설명 문구에 사용한다.
   */
  helperTone?: 'muted' | 'danger';
  /**
   * 컨테이너 영역에 추가할 클래스명이다.
   */
  containerClassName?: string;
}

/**
 * 공통 텍스트 입력 컴포넌트다.
 * 레이블/보조설명/에러 스타일을 통합해 입력 UI의 일관성을 유지한다.
 */
export function AppInput({
  id,
  label,
  variant = 'default',
  helperText,
  helperTone = 'muted',
  className,
  containerClassName,
  ...rest
}: AppInputProps) {
  const helperId = helperText && id ? `${id}-helper` : undefined;

  return (
    <div className={["grid gap-1", containerClassName ?? ''].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={id} className="text-sm font-semibold text-[var(--text)]">
          {label}
        </label>
      ) : null}

      <input
        id={id}
        aria-describedby={helperId}
        className={[
          'min-h-10 rounded-xl border bg-[var(--surface)] px-3 text-sm text-[var(--text)]',
          variant === 'error' ? 'border-[var(--danger)]' : 'border-[var(--border)]',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />

      {helperText ? (
        <p
          id={helperId}
          className={[
            'text-xs',
            helperTone === 'danger' ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]',
          ].join(' ')}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
