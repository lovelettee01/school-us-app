import { OFFICES } from '@/constants/offices';

interface OfficeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * 시도교육청 선택 박스 컴포넌트다.
 */
export function OfficeSelect({ value, onChange }: OfficeSelectProps) {
  return (
    <div className="grid gap-1">
      <label htmlFor="office-select" className="text-sm font-semibold text-[var(--text)]">
        시도교육청
      </label>
      <select
        id="office-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
      >
        <option value="">선택해 주세요</option>
        {OFFICES.map((office) => (
          <option key={office.code} value={office.code}>
            {office.name}
          </option>
        ))}
      </select>
    </div>
  );
}
