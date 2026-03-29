import type { InputHTMLAttributes } from 'react';

interface AppCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * 체크박스 라벨이다.
   */
  label: string;
  /**
   * 라벨 아래 보조 설명 텍스트다.
   */
  description?: string;
}

/**
 * 공통 체크박스 컴포넌트다.
 * 레이블 클릭 영역과 보조설명을 포함한 일관된 선택 UI를 제공한다.
 */
export function AppCheckbox({ id, label, description, className, ...rest }: AppCheckboxProps) {
  return (
    <label htmlFor={id} className={["flex cursor-pointer items-start gap-2 rounded-lg p-1", className ?? ''].filter(Boolean).join(' ')}>
      <input id={id} type="checkbox" className="mt-0.5 h-4 w-4 rounded border-[var(--border)]" {...rest} />
      <span>
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-[var(--text-muted)]">{description}</span> : null}
      </span>
    </label>
  );
}
