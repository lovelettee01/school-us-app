'use client';

import { useMemo, useState } from 'react';

import { EmptyState, ErrorState, LoadingState, RetryButton } from '@/components/common/States';
import { useTimetable } from '@/hooks/useTimetable';
import { getWeekRangeYmd } from '@/lib/utils/date';
import { resolveSchoolLevel } from '@/lib/utils/school-level';
import type { SchoolDetail } from '@/types/school';
import type { TimetableItem } from '@/types/timetable';

interface TimetableTabProps {
  detail: SchoolDetail;
}

/**
 * 시간표 레코드를 날짜-교시 기반 2차원 표로 변환한다.
 */
function buildTimetableRows(items: TimetableItem[]) {
  const dateSet = new Set(items.map((item) => item.date));
  const dates = Array.from(dateSet).sort();
  const periodSet = new Set(items.map((item) => item.period));
  const periods = Array.from(periodSet).sort((a, b) => a - b);

  const matrix = periods.map((period) => {
    const values: Record<string, string> = {};
    dates.forEach((date) => {
      values[date] = items.find((item) => item.date === date && item.period === period)?.subject ?? '-';
    });
    return { period, values };
  });

  return { dates, matrix };
}

/**
 * YYYY-MM-DD 문자열을 요일 라벨과 함께 표시한다.
 */
function formatDateWithWeekday(date: string): string {
  const parsed = new Date(date);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[parsed.getDay()] ?? '';
  return `${date}(${weekday})`;
}

/**
 * 상세 탭3(시간표) 콘텐츠를 렌더링한다.
 */
export function TimetableTab({ detail }: TimetableTabProps) {
  const level = resolveSchoolLevel(detail);
  const [grade, setGrade] = useState('');
  const [classNo, setClassNo] = useState('');
  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const { status, items, errorMessage, fetchTimetable } = useTimetable();

  const weekRange = useMemo(() => {
    const parsed = new Date(baseDate);
    return getWeekRangeYmd(parsed);
  }, [baseDate]);

  const table = useMemo(() => buildTimetableRows(items), [items]);

  const handleFetch = async () => {
    if (!level) {
      return;
    }

    if (!grade || !classNo) {
      return;
    }

    await fetchTimetable({
      officeCode: detail.officeCode,
      schoolCode: detail.schoolCode,
      schoolLevel: level,
      grade: Number(grade),
      classNo: Number(classNo),
      fromYmd: weekRange.fromYmd,
      toYmd: weekRange.toYmd,
    });
  };

  if (!level) {
    return (
      <div id="panel-timetable" role="tabpanel" aria-labelledby="tab-timetable">
        <ErrorState message="학교급 정보를 판별할 수 없어 시간표 조회를 지원하지 않습니다." />
      </div>
    );
  }

  return (
    <div id="panel-timetable" role="tabpanel" aria-labelledby="tab-timetable" className="grid gap-3">
      <section className="card-surface grid gap-3 p-4 md:grid-cols-4 md:items-end">
        <div className="grid gap-1">
          <label htmlFor="time-grade" className="text-sm font-semibold text-[var(--text)]">
            학년
          </label>
          <select
            id="time-grade"
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
            className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          >
            <option value="">선택</option>
            {[1, 2, 3].map((value) => (
              <option key={value} value={value}>
                {value}학년
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor="time-class" className="text-sm font-semibold text-[var(--text)]">
            학급
          </label>
          <select
            id="time-class"
            value={classNo}
            onChange={(event) => setClassNo(event.target.value)}
            className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          >
            <option value="">선택</option>
            {Array.from({ length: 20 }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>
                {value}반
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor="time-date" className="text-sm font-semibold text-[var(--text)]">
            기준일
          </label>
          <input
            id="time-date"
            type="date"
            value={baseDate}
            onChange={(event) => setBaseDate(event.target.value)}
            className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleFetch}
          disabled={status === 'loading' || !grade || !classNo}
          className="min-h-11 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-contrast)]"
        >
          조회
        </button>
      </section>

      {!grade || !classNo ? (
        <EmptyState message="학년과 학급을 선택해 주세요." title="시간표 조건 선택" />
      ) : null}

      {status === 'loading' ? <LoadingState description="시간표를 조회하고 있습니다." /> : null}

      {status === 'empty' ? <EmptyState message="선택한 조건의 시간표가 없습니다." /> : null}

      {status === 'error' ? (
        <ErrorState
          message={errorMessage ?? '시간표를 불러오지 못했습니다.'}
          retry={<RetryButton onRetry={handleFetch} />}
        />
      ) : null}

      {status === 'success' ? (
        <section className="card-surface overflow-x-auto p-4" aria-live="polite">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="mb-2 text-left text-sm font-semibold text-[var(--text)]">
              {detail.schoolName} {grade}학년 {classNo}반 시간표
            </caption>
            <thead>
              <tr>
                <th className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2">교시</th>
                {table.dates.map((date) => (
                  <th key={date} className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2">
                    {formatDateWithWeekday(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.matrix.map((row) => (
                <tr key={row.period}>
                  <th className="border border-[var(--border)] px-2 py-2">{row.period}교시</th>
                  {table.dates.map((date) => (
                    <td key={`${row.period}-${date}`} className="border border-[var(--border)] px-2 py-2">
                      {row.values[date]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}
