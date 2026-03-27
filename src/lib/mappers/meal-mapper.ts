import { ymdToDashed } from '@/lib/utils/date';
import type { MealItem } from '@/types/meal';

/**
 * 급식 응답 문자열에서 HTML 줄바꿈/엔티티를 텍스트로 정규화한다.
 * `<br/>` 류 태그는 줄바꿈으로 치환해 UI에서 실제 줄바꿈 렌더링이 가능하도록 만든다.
 */
export function normalizeMealText(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\r/g, '')
    .trim();
}

/**
 * 급식 메뉴 문자열의 HTML 줄바꿈/공백을 정리해 배열로 변환한다.
 */
export function parseMealMenuLines(value: string): string[] {
  const normalized = normalizeMealText(value);

  return normalized
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * NEIS 급식 원본 레코드를 내부 MealItem 모델로 매핑한다.
 */
export function mapMealItem(raw: Record<string, unknown>): MealItem {
  const mealType = String(raw.MMEAL_SC_NM ?? '').trim() || '급식';
  const menuRaw = String(raw.DDISH_NM ?? '');
  const calorie = normalizeMealText(String(raw.CAL_INFO ?? ''));
  const nutrition = normalizeMealText(String(raw.NTR_INFO ?? ''));
  const origin = normalizeMealText(String(raw.ORPLC_INFO ?? ''));

  return {
    mealDate: ymdToDashed(String(raw.MLSV_YMD ?? '')),
    mealType,
    menuLines: parseMealMenuLines(menuRaw),
    calorie: calorie || undefined,
    nutrition: nutrition || undefined,
    origin: origin || undefined,
  };
}
