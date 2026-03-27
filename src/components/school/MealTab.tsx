'use client';

import { useCallback, useEffect, useState } from 'react';

import { EmptyState, ErrorState, LoadingState, RetryButton } from '@/components/common/States';
import { useMeals } from '@/hooks/useMeals';
import { toYmd } from '@/lib/utils/date';
import type { SchoolDetail } from '@/types/school';

interface MealTabProps {
  detail: SchoolDetail;
}

/**
 * 오늘 날짜를 YYYYMMDD 문자열로 계산한다.
 */
function getTodayYmd(): string {
  return toYmd(new Date());
}

/**
 * 상세 탭2(급식) 콘텐츠를 렌더링한다.
 */
export function MealTab({ detail }: MealTabProps) {
  const todayYmd = getTodayYmd();
  const [fromYmd, setFromYmd] = useState<string>(() => getTodayYmd());
  const [toDateYmd, setToDateYmd] = useState<string>(() => getTodayYmd());
  const { status, items, errorMessage, fetchMeals } = useMeals();

  const handleFetch = useCallback(async () => {
    await fetchMeals({
      officeCode: detail.officeCode,
      schoolCode: detail.schoolCode,
      fromYmd,
      toYmd: toDateYmd,
    });
  }, [detail.officeCode, detail.schoolCode, fetchMeals, fromYmd, toDateYmd]);

  useEffect(() => {
    void handleFetch();
  }, [detail.schoolKey, handleFetch]);

  return (
    <div id="panel-meal" role="tabpanel" aria-labelledby="tab-meal" className="grid gap-3">
      <section className="card-surface grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div className="grid gap-1">
          <label htmlFor="meal-from" className="text-sm font-semibold text-[var(--text)]">
            시작일(YYYYMMDD)
          </label>
          <input
            id="meal-from"
            value={fromYmd}
            onChange={(event) => setFromYmd(event.target.value)}
            className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="meal-to" className="text-sm font-semibold text-[var(--text)]">
            종료일(YYYYMMDD)
          </label>
          <input
            id="meal-to"
            value={toDateYmd}
            onChange={(event) => setToDateYmd(event.target.value)}
            className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => void handleFetch()}
          disabled={status === 'loading'}
          className="min-h-11 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-contrast)]"
        >
          조회
        </button>
      </section>

      {status === 'loading' ? <LoadingState description="급식 정보를 조회하고 있습니다." /> : null}

      {status === 'empty' ? (
        <EmptyState message="해당 기간 급식 정보가 없습니다. 날짜 조건을 변경해 주세요." />
      ) : null}

      {status === 'error' ? (
        <ErrorState
          message={errorMessage ?? '급식 정보를 불러오지 못했습니다.'}
          retry={<RetryButton onRetry={() => void handleFetch()} />}
        />
      ) : null}

      {status === 'success' ? (
        <section className="grid gap-3">
          {items.map((item) => (
            <article key={`${item.mealDate}-${item.mealType}`} className="card-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[var(--text)]">{item.mealDate}</h3>
                  {item.mealDate.replaceAll('-', '') === todayYmd ? (
                    <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold text-[var(--primary-contrast)]">
                      TODAY
                    </span>
                  ) : null}
                </div>
                <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs text-[var(--text-muted)]">
                  {item.mealType}
                </span>
              </div>

              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
                {item.menuLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <div className="mt-3 grid gap-1 text-xs text-[var(--text-muted)]">
                {item.calorie ? <p>열량: {item.calorie}</p> : null}
                {item.origin ? <p>원산지: {item.origin}</p> : null}
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
