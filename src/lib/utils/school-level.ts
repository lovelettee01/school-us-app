import type { SchoolDetail } from '@/types/school';

const LEVEL_MAP: Record<string, 'elementary' | 'middle' | 'high'> = {
  초등학교: 'elementary',
  중학교: 'middle',
  고등학교: 'high',
};

/**
 * 학교 유형 문자열을 시간표 분기용 schoolLevel로 매핑한다.
 */
export function resolveSchoolLevel(detail: SchoolDetail): 'elementary' | 'middle' | 'high' | null {
  return LEVEL_MAP[detail.schoolType] ?? null;
}
