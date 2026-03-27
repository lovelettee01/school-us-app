import { describe, expect, it } from 'vitest';

import { buildNeisQuery } from '@/lib/api/neis-client';

/**
 * NEIS 쿼리 빌더의 정규화/인코딩 동작을 검증한다.
 */
describe('buildNeisQuery', () => {
  it('빈 값은 제거하고 공백을 trim해서 직렬화한다', () => {
    const query = buildNeisQuery({
      A: '  value  ',
      B: '',
      C: undefined,
      D: 1,
    });

    expect(query.get('A')).toBe('value');
    expect(query.get('B')).toBeNull();
    expect(query.get('C')).toBeNull();
    expect(query.get('D')).toBe('1');
  });

  it('한글/특수문자 입력도 URLSearchParams로 안전하게 처리한다', () => {
    const query = buildNeisQuery({
      SCHUL_NM: '서울 고등학교',
    });

    expect(query.toString()).toContain('SCHUL_NM=');
    expect(query.get('SCHUL_NM')).toBe('서울 고등학교');
  });
});
