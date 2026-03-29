import type { SelectHTMLAttributes } from 'react';

/**
 * 공통 Select 옵션 타입이다.
 * 값/라벨/비활성 상태를 표준 구조로 정의한다.
 */
export interface AppSelectOption {
  /**
   * 제출 시 사용될 실제 값이다.
   */
  value: string;
  /**
   * 사용자에게 표시할 라벨 문자열이다.
   */
  label: string;
  /**
   * 해당 옵션의 선택 가능 여부다.
   */
  disabled?: boolean;
}

interface AppSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * 레이블 텍스트다.
   */
  label?: string;
  /**
   * 렌더링할 옵션 목록이다.
   */
  options: AppSelectOption[];
  /**
   * placeholder 성격의 첫 옵션 라벨이다.
   * 지정 시 빈 값 옵션을 최상단에 렌더링한다.
   */
  placeholder?: string;
  /**
   * 보조 설명 텍스트다.
   */
  helperText?: string;
  /**
   * 컨테이너 클래스명이다.
   */
  containerClassName?: string;
}

/**
 * 공통 Select 컴포넌트다.
 * 옵션 렌더링 규칙과 기본 스타일을 통일한다.
 */
export function AppSelect({
  id,
  label,
  options,
  placeholder,
  helperText,
  className,
  containerClassName,
  ...rest
}: AppSelectProps) {
  const helperId = helperText && id ? `${id}-helper` : undefined;

  return (
    <div className={["grid gap-1", containerClassName ?? ''].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={id} className="text-sm font-semibold text-[var(--text)]">
          {label}
        </label>
      ) : null}

      <select
        id={id}
        aria-describedby={helperId}
        className={[
          'min-h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      {helperText ? (
        <p id={helperId} className="text-xs text-[var(--text-muted)]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
