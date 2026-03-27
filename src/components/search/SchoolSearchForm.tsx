import type { ReactNode } from 'react';

import { InlineFieldError } from '@/components/common/States';

interface SchoolSearchFormProps {
  officeCode: string;
  schoolName: string;
  onOfficeChange: (value: string) => void;
  onSchoolNameChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  errorMessage?: string;
  officeSelect: ReactNode;
}

/**
 * 검색 폼의 입력/조회/초기화 UI를 담당한다.
 */
export function SchoolSearchForm({
  officeCode,
  schoolName,
  onOfficeChange,
  onSchoolNameChange,
  onSubmit,
  onReset,
  isLoading,
  errorMessage,
  officeSelect,
}: SchoolSearchFormProps) {
  const errorId = 'search-form-error';

  return (
    <section className="card-surface p-4">
      <div className="grid gap-3 md:grid-cols-[240px_1fr_auto_auto] md:items-end">
        {officeSelect}
        <div className="grid gap-1">
          <label htmlFor="school-name" className="text-sm font-semibold text-[var(--text)]">
            학교명
          </label>
          <input
            id="school-name"
            value={schoolName}
            onChange={(event) => onSchoolNameChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onSubmit();
              }
            }}
            aria-describedby={errorMessage ? errorId : undefined}
            placeholder="학교명을 2글자 이상 입력해 주세요"
            className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="min-h-11 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-contrast)]"
        >
          조회
        </button>

        <button
          type="button"
          onClick={() => {
            onOfficeChange('');
            onSchoolNameChange('');
            onReset();
          }}
          disabled={isLoading || (!officeCode && !schoolName)}
          className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)]"
        >
          초기화
        </button>
      </div>
      <InlineFieldError id={errorId} message={errorMessage} />
    </section>
  );
}
