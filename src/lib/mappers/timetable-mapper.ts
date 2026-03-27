import { ymdToDashed } from '@/lib/utils/date';
import type { SchoolLevel, TimetableItem } from '@/types/timetable';

/**
 * 학교급에 따라 NEIS 시간표 리소스명을 반환한다.
 */
export function resolveTimetableResource(level: SchoolLevel): 'elsTimetable' | 'misTimetable' | 'hisTimetable' {
  if (level === 'elementary') {
    return 'elsTimetable';
  }
  if (level === 'middle') {
    return 'misTimetable';
  }
  return 'hisTimetable';
}

/**
 * NEIS 시간표 원본 레코드를 내부 TimetableItem으로 변환한다.
 */
export function mapTimetableItem(raw: Record<string, unknown>): TimetableItem {
  return {
    date: ymdToDashed(String(raw.ALL_TI_YMD ?? '')),
    grade: Number(raw.GRADE ?? 0),
    classNo: Number(raw.CLASS_NM ?? 0),
    period: Number(raw.PERIO ?? 0),
    subject: String(raw.ITRT_CNTNT ?? '').trim() || '-',
  };
}

/**
 * 시간표 목록을 교시 기준 오름차순으로 정렬한다.
 */
export function sortTimetableByPeriod(items: TimetableItem[]): TimetableItem[] {
  return [...items].sort((a, b) => {
    if (a.date === b.date) {
      return a.period - b.period;
    }
    return a.date.localeCompare(b.date);
  });
}
