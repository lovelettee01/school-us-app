import type { SchoolKey } from '@/types/school';

/**
 * officeCode와 schoolCode를 조합해 라우팅용 schoolKey를 만든다.
 */
export function makeSchoolKey(officeCode: string, schoolCode: string): SchoolKey {
  return `${officeCode.trim()}-${schoolCode.trim()}`;
}

/**
 * schoolKey를 분해해 officeCode/schoolCode를 복원한다.
 * 형식이 잘못된 경우 null을 반환한다.
 */
export function parseSchoolKey(
  schoolKey: string,
): { officeCode: string; schoolCode: string } | null {
  const normalized = schoolKey.trim();
  const [officeCode, schoolCode, ...rest] = normalized.split('-');

  if (!officeCode || !schoolCode || rest.length > 0) {
    return null;
  }

  if (!/^[A-Z0-9]+$/i.test(officeCode) || !/^[0-9]+$/i.test(schoolCode)) {
    return null;
  }

  return {
    officeCode: officeCode.toUpperCase(),
    schoolCode,
  };
}
