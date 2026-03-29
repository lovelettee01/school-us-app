'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { AppButton } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { InfoIcon, MealIcon, SearchIcon } from '@/components/common/ButtonIcons';
import { EmptyState, ErrorState, LoadingState, RetryButton } from '@/components/common/States';
import { MEAL_ALLERGY_REFERENCE } from '@/constants/meal-allergy';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { useMeals } from '@/hooks/useMeals';
import { toYmd } from '@/lib/utils/date';
import type { SchoolDetail } from '@/types/school';

interface MealTabProps {
  /**
   * 급식 조회에 사용할 학교 상세 데이터다.
   */
  detail: SchoolDetail;
}

interface ParsedMealLine {
  /**
   * 알레르기 표기를 제거한 메뉴 본문 텍스트다.
   */
  baseText: string;
  /**
   * 메뉴 라인에서 추출한 알레르기 코드 목록이다.
   */
  allergyCodes: string[];
}

/**
 * 급식 아코디언 아이템의 안정적인 key를 생성한다.
 * 날짜/식사구분/인덱스를 조합해 렌더링 순서가 바뀌어도 충돌을 줄인다.
 */
function makeMealItemKey(mealDate: string, mealType: string, index: number): string {
  return `${mealDate}-${mealType}-${index}`;
}

/**
 * 날짜 입력 컨트롤(`type=date`)에 사용할 오늘 날짜 문자열(YYYY-MM-DD)을 생성한다.
 * 로컬 타임존 기준으로 계산해 날짜 오차를 방지한다.
 */
function getTodayDateInputValue(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 날짜 입력 값(YYYY-MM-DD)을 NEIS 조회 포맷(YYYYMMDD)으로 변환한다.
 */
function toYmdFromDateInput(dateInput: string): string {
  return dateInput.replaceAll('-', '');
}

/**
 * 메뉴 한 줄에서 알레르기 번호 표기(예: (1.2.5.6))를 추출해 분리한다.
 */
function parseMealLine(line: string): ParsedMealLine {
  const match = line.match(/\(([\d.\s,]+)\)\s*$/);
  if (!match) {
    return {
      baseText: line,
      allergyCodes: [],
    };
  }

  const allergyCodes = match[1]
    .split(/[.,\s]+/)
    .map((code) => code.trim())
    .filter((code) => code.length > 0);

  return {
    baseText: line.slice(0, match.index).trim(),
    allergyCodes,
  };
}

/**
 * 상세 탭2(급식) 콘텐츠를 렌더링한다.
 * 날짜 선택, 알레르기 안내, 결과 아코디언, 상세 카드(원산지/영양)를 포함한다.
 */
export function MealTab({ detail }: MealTabProps) {
  const todayDateInput = getTodayDateInputValue();
  const todayYmd = toYmd(new Date());

  const [fromDate, setFromDate] = useState<string>(todayDateInput);
  const [toDate, setToDate] = useState<string>(todayDateInput);
  const [isAllergyTooltipOpen, setIsAllergyTooltipOpen] = useState<boolean>(false);
  const [openMealItems, setOpenMealItems] = useState<Record<string, boolean>>({});
  const { status, items, errorMessage, fetchMeals } = useMeals();

  useErrorMessage(status === 'error', errorMessage ?? '급식 정보를 불러오지 못했습니다.', {
    dedupeKey: `meal-tab:${detail.schoolKey}`,
  });

  const handleFetch = useCallback(async () => {
    await fetchMeals({
      officeCode: detail.officeCode,
      schoolCode: detail.schoolCode,
      fromYmd: toYmdFromDateInput(fromDate),
      toYmd: toYmdFromDateInput(toDate),
    });
  }, [detail.officeCode, detail.schoolCode, fetchMeals, fromDate, toDate]);

  useEffect(() => {
    void handleFetch();
  }, [detail.schoolKey, handleFetch]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.mealDate.localeCompare(b.mealDate));
  }, [items]);

  /**
   * 급식 결과 아코디언 항목의 열림/닫힘 상태를 토글한다.
   * 기본 열림 항목(첫 번째)도 사용자가 클릭하면 정상적으로 닫을 수 있도록
   * 현재 상태가 없을 때의 기본값을 함께 받아 반전한다.
   */
  const toggleMealItem = (itemKey: string, defaultOpen: boolean = false) => {
    setOpenMealItems((prev) => ({
      ...prev,
      [itemKey]: !(prev[itemKey] ?? defaultOpen),
    }));
  };

  /**
   * span 기반 상호작용 요소에서 Enter/Space 입력을 클릭과 동일하게 처리한다.
   */
  const handleAllergyGuideKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    setIsAllergyTooltipOpen((prev) => !prev);
  };

  return (
    <div id="panel-meal" role="tabpanel" aria-labelledby="tab-meal" className="grid gap-3">
      <section className="card-surface grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div className="grid gap-1">
          <label htmlFor="meal-from" className="text-sm font-semibold text-[var(--text)]">
            시작일
          </label>
          <input
            id="meal-from"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="min-h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="meal-to" className="text-sm font-semibold text-[var(--text)]">
            종료일
          </label>
          <input
            id="meal-to"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="min-h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          />
        </div>
        <AppButton
          onClick={() => void handleFetch()}
          isLoading={status === 'loading'}
          loadingLabel="조회 중"
          leftIcon={<SearchIcon className="h-4 w-4" />}
        >
          조회
        </AppButton>
      </section>

      {status === 'loading' ? <LoadingState description="급식 정보를 조회하고 있습니다." /> : null}

      {status === 'empty' ? (
        <EmptyState message="해당 기간 급식 정보가 없습니다. 날짜 조건을 변경해 주세요." />
      ) : null}

      {status === 'error' ? (
        <ErrorState
          message="메시지 팝업을 확인한 뒤 다시 시도해 주세요."
          retry={<RetryButton onRetry={() => void handleFetch()} />}
        />
      ) : null}

      {status === 'success' ? (
        <section className="grid gap-3">
          <div className="relative flex justify-end">
            <span
              role="button"
              tabIndex={0}
              aria-expanded={isAllergyTooltipOpen}
              aria-controls="meal-allergy-tooltip"
              onClick={() => setIsAllergyTooltipOpen((prev) => !prev)}
              onKeyDown={handleAllergyGuideKeyDown}
              onBlur={() => setTimeout(() => setIsAllergyTooltipOpen(false), 150)}
              className={[
                'inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs transition',
                isAllergyTooltipOpen
                  ? 'bg-[var(--primary)] text-[var(--primary-contrast)]'
                  : 'bg-[var(--surface-muted)] text-[var(--text-muted)]',
              ].join(' ')}
            >
              <InfoIcon className="h-3.5 w-3.5 text-[var(--danger)]" />
              알레르기 가이드
            </span>

            <div
              id="meal-allergy-tooltip"
              role="tooltip"
              aria-hidden={!isAllergyTooltipOpen}
              className={[
                'absolute right-0 top-10 z-20 w-[320px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg transition-all duration-200',
                isAllergyTooltipOpen ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-1 opacity-0',
              ].join(' ')}
            >
              <p className="text-xs font-semibold text-[var(--text)]">알레르기 번호 안내</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[var(--text-muted)]">
                {MEAL_ALLERGY_REFERENCE.map((item) => (
                  <li key={item.code}>
                    {item.code}번: {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {sortedItems.map((item, index) => {
            const itemKey = makeMealItemKey(item.mealDate, item.mealType, index);
            const isOpen = openMealItems[itemKey] ?? index === 0;

            return (
              <article key={itemKey} className="card-surface p-4">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`meal-item-panel-${itemKey}`}
                  onClick={() => toggleMealItem(itemKey, index === 0)}
                  className="w-full cursor-pointer text-left"
                >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--text)]">{item.mealDate}</h3>
                    {item.mealDate.replaceAll('-', '') === todayYmd ? (
                      <Badge variant="primary" size="sm">
                        TODAY
                      </Badge>
                    ) : null}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs text-[var(--text-muted)]">
                    <MealIcon className="h-3.5 w-3.5" />
                    {item.mealType}
                  </span>
                </div>
                </button>

                <div
                  id={`meal-item-panel-${itemKey}`}
                  aria-hidden={!isOpen}
                  className={[
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isOpen ? 'mt-3 max-h-[1200px] opacity-100' : 'max-h-0 opacity-0',
                  ].join(' ')}
                >
                  <div className="grid gap-3 border-t border-[var(--border)] pt-3">
                    <section>
                      <h4 className="text-xs font-semibold text-[var(--text)]">메뉴</h4>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[var(--text-muted)]">
                        {item.menuLines.map((line) => (
                          <li key={line}>
                            {(() => {
                              const parsed = parseMealLine(line);

                              return (
                                <div className="grid gap-1">
                                  <span>{parsed.baseText || line}</span>
                                  {parsed.allergyCodes.length > 0 ? (
                                    <div className="flex flex-wrap items-center gap-1">
                                      <span className="text-[10px] font-semibold text-[var(--warning)]">알레르기</span>
                                      {parsed.allergyCodes.map((code) => (
                                        <span
                                          key={`${line}-${code}`}
                                          className="rounded-full bg-[var(--warning)]/15 px-1.5 py-0.5 text-[10px] font-bold text-[var(--warning)]"
                                        >
                                          {code}
                                        </span>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })()}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <div className="grid gap-2 md:grid-cols-2">
                      <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                        <p className="text-xs font-semibold text-[var(--text)]">영양정보</p>
                        <p className="mt-1 whitespace-pre-line text-xs text-[var(--text-muted)]">
                          {item.nutrition ?? '정보 없음'}
                        </p>
                      </article>

                      <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                        <p className="text-xs font-semibold text-[var(--text)]">원산지정보</p>
                        <p className="mt-1 whitespace-pre-line text-xs text-[var(--text-muted)]">
                          {item.origin ?? '정보 없음'}
                        </p>
                      </article>
                    </div>

                    {item.calorie ? (
                      <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                        <p className="text-xs font-semibold text-[var(--text)]">열량정보</p>
                        <p className="mt-1 whitespace-pre-line text-xs text-[var(--text-muted)]">{item.calorie}</p>
                      </article>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}


