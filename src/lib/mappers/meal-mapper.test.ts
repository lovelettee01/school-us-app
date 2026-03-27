import { describe, expect, it } from 'vitest';

import { mapMealItem, parseMealMenuLines } from '@/lib/mappers/meal-mapper';

/**
 * 급식 문자열 파싱/매핑 규칙을 검증한다.
 */
describe('meal-mapper', () => {
  it('<br> 변형을 줄 배열로 변환한다', () => {
    const lines = parseMealMenuLines('쌀밥<br/>미역국(5.6)<BR>불고기(10.13)');
    expect(lines).toEqual(['쌀밥', '미역국(5.6)', '불고기(10.13)']);
  });

  it('빈 줄/공백을 제거하고 날짜를 YYYY-MM-DD로 변환한다', () => {
    const item = mapMealItem({
      MLSV_YMD: '20260327',
      MMEAL_SC_NM: '중식',
      DDISH_NM: ' 쌀밥 <br/>  <br/> 된장국 ',
    });

    expect(item.mealDate).toBe('2026-03-27');
    expect(item.menuLines).toEqual(['쌀밥', '된장국']);
  });
});
