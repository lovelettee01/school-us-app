import { isValidYmd } from '@/lib/utils/date';
import type { SchoolLevel } from '@/types/timetable';

/**
 * 학교급 값이 허용된 문자열인지 검증한다.
 */
export function isValidSchoolLevel(level: string): level is SchoolLevel {
  return level === 'elementary' || level === 'middle' || level === 'high';
}

/**
 * 시간표 요청 파라미터를 검증하고 정규화한다.
 */
export function validateTimetableParams(input: {
  schoolLevel: string;
  grade: number;
  classNo: number;
  fromYmd: string;
  toYmd: string;
}): { isValid: boolean; errorMessage?: string } {
  if (!isValidSchoolLevel(input.schoolLevel)) {
    return { isValid: false, errorMessage: '학교급 정보가 올바르지 않습니다.' };
  }

  if (!Number.isInteger(input.grade) || input.grade < 1) {
    return { isValid: false, errorMessage: '학년 값이 올바르지 않습니다.' };
  }

  if (!Number.isInteger(input.classNo) || input.classNo < 1) {
    return { isValid: false, errorMessage: '학급 값이 올바르지 않습니다.' };
  }

  if (!isValidYmd(input.fromYmd) || !isValidYmd(input.toYmd)) {
    return { isValid: false, errorMessage: '조회 날짜 형식이 올바르지 않습니다.' };
  }

  if (input.fromYmd > input.toYmd) {
    return { isValid: false, errorMessage: '조회 시작일이 종료일보다 늦을 수 없습니다.' };
  }

  return { isValid: true };
}
