import { ymdToDashed } from '@/lib/utils/date';
import type { MealItem } from '@/types/meal';

/**
 * 급식 메뉴 문자열의 HTML 줄바꿈/공백을 정리해 배열로 변환한다.
 */
export function parseMealMenuLines(value: string): string[] {
  const normalized = value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\r/g, '');

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

  return {
    mealDate: ymdToDashed(String(raw.MLSV_YMD ?? '')),
    mealType,
    menuLines: parseMealMenuLines(menuRaw),
    calorie: String(raw.CAL_INFO ?? '').trim() || undefined,
    nutrition: String(raw.NTR_INFO ?? '').trim() || undefined,
    origin: String(raw.ORPLC_INFO ?? '').trim() || undefined,
  };
}
