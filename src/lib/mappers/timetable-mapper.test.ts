import { describe, expect, it } from 'vitest';

import { mapTimetableItem, resolveTimetableResource, sortTimetableByPeriod } from '@/lib/mappers/timetable-mapper';

/**
 * 시간표 분기/정렬 규칙을 검증한다.
 */
describe('timetable-mapper', () => {
  it('학교급에 맞는 리소스명을 반환한다', () => {
    expect(resolveTimetableResource('elementary')).toBe('elsTimetable');
    expect(resolveTimetableResource('middle')).toBe('misTimetable');
    expect(resolveTimetableResource('high')).toBe('hisTimetable');
  });

  it('교시 기준 오름차순 정렬을 보장한다', () => {
    const sorted = sortTimetableByPeriod([
      { date: '2026-03-27', grade: 1, classNo: 1, period: 3, subject: '영어' },
      { date: '2026-03-27', grade: 1, classNo: 1, period: 1, subject: '국어' },
    ]);

    expect(sorted.map((item) => item.period)).toEqual([1, 3]);
  });

  it('원본 레코드를 내부 타입으로 변환한다', () => {
    const mapped = mapTimetableItem({
      ALL_TI_YMD: '20260327',
      GRADE: '1',
      CLASS_NM: '2',
      PERIO: '1',
      ITRT_CNTNT: '수학',
    });

    expect(mapped).toEqual({
      date: '2026-03-27',
      grade: 1,
      classNo: 2,
      period: 1,
      subject: '수학',
    });
  });
});
