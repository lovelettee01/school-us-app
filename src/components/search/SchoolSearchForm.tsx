import type { ReactNode } from 'react';

import { ResetIcon, SearchIcon } from '@/components/common/ButtonIcons';
import { AppButton } from '@/components/common/Button';

interface SchoolSearchFormProps {
  /**
   * 현재 선택된 시도교육청 코드다.
   */
  officeCode: string;
  /**
   * 초기화 시 되돌아갈 기본 교육청 코드다.
   */
  defaultOfficeCode: string;
  /**
   * 사용자 입력 학교명 문자열이다.
   */
  schoolName: string;
  /**
   * 교육청 선택 변경 콜백이다.
   */
  onOfficeChange: (value: string) => void;
  /**
   * 학교명 입력 변경 콜백이다.
   */
  onSchoolNameChange: (value: string) => void;
  /**
   * 조회 실행 콜백이다.
   */
  onSubmit: () => void;
  /**
   * 폼 초기화 콜백이다.
   */
  onReset: () => void;
  /**
   * 조회 진행 중 여부다.
   */
  isLoading: boolean;
  /**
   * 외부에서 주입하는 교육청 선택 UI 노드다.
   */
  officeSelect: ReactNode;
}

/**
 * 검색 폼의 입력/조회/초기화 UI를 담당한다.
 * 에러 메시지는 인라인 하단 대신 전역 메시지 시스템에서 표시한다.
 */
export function SchoolSearchForm({
  officeCode,
  defaultOfficeCode,
  schoolName,
  onOfficeChange,
  onSchoolNameChange,
  onSubmit,
  onReset,
  isLoading,
  officeSelect,
}: SchoolSearchFormProps) {
  return (
    <section className="card-surface p-4">
      <div className="grid gap-3 md:grid-cols-[240px_1fr_auto] md:items-end">
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
            placeholder="학교명을 2글자 이상 입력해 주세요"
            className="min-h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
          <AppButton
            onClick={onSubmit}
            disabled={isLoading}
            leftIcon={<SearchIcon className="h-4 w-4" />}
            isLoading={isLoading}
            loadingLabel="조회 중"
          >
            조회
          </AppButton>

          <AppButton
            variant="secondary"
            onClick={() => {
              onOfficeChange(defaultOfficeCode);
              onSchoolNameChange('');
              onReset();
            }}
            disabled={isLoading || (officeCode === defaultOfficeCode && !schoolName)}
            leftIcon={<ResetIcon className="h-4 w-4" />}
          >
            초기화
          </AppButton>
        </div>
      </div>
    </section>
  );
}
