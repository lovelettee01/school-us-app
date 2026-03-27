import { describe, expect, it } from 'vitest';

import { makeSchoolKey, parseSchoolKey } from '@/lib/utils/school-key';

/**
 * schoolKey 생성/파싱 유틸의 왕복 일관성을 검증한다.
 */
describe('school-key', () => {
  it('officeCode와 schoolCode를 조합해 schoolKey를 만든다', () => {
    expect(makeSchoolKey('B10', '7010569')).toBe('B10-7010569');
  });

  it('정상 schoolKey를 분해한다', () => {
    expect(parseSchoolKey('B10-7010569')).toEqual({ officeCode: 'B10', schoolCode: '7010569' });
  });

  it('형식 오류 schoolKey는 null을 반환한다', () => {
    expect(parseSchoolKey('INVALID')).toBeNull();
  });
});
