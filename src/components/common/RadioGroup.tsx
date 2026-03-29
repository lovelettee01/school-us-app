import type { InputHTMLAttributes } from 'react';

/**
 * 라디오 옵션의 표준 구조다.
 */
export interface AppRadioOption {
  /**
   * 옵션 값이다.
   */
  value: string;
  /**
   * 사용자 노출 라벨이다.
   */
  label: string;
  /**
   * 옵션 비활성화 여부다.
   */
  disabled?: boolean;
}

interface AppRadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  /**
   * 그룹 레이블이다.
   */
  label?: string;
  /**
   * 라디오 그룹 name이다.
   */
  name: string;
  /**
   * 옵션 목록이다.
   */
  options: AppRadioOption[];
  /**
   * 현재 선택 값이다.
   */
  value: string;
  /**
   * 선택 변경 콜백이다.
   */
  onChange: (value: string) => void;
}

/**
 * 공통 라디오 그룹 컴포넌트다.
 * 단일 선택 입력의 옵션 렌더링과 상태 관리를 통일한다.
 */
export function AppRadioGroup({ label, name, options, value, onChange, disabled }: AppRadioGroupProps) {
  return (
    <fieldset className="grid gap-2" disabled={disabled}>
      {label ? <legend className="text-sm font-semibold text-[var(--text)]">{label}</legend> : null}

      <div className="grid gap-1">
        {options.map((option) => (
          <label key={option.value} className="inline-flex cursor-pointer items-center gap-2 rounded-lg p-1 text-sm text-[var(--text)]">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={disabled || option.disabled}
              onChange={(event) => onChange(event.target.value)}
              className="h-4 w-4 border-[var(--border)]"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
