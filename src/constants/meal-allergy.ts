/**
 * 급식 메뉴에 표기되는 알레르기 번호 표준 매핑 상수다.
 * NEIS 식단 문자열 내 괄호 숫자(예: 1.2.5.6) 해석을 돕기 위해 고정 목록으로 제공한다.
 */
export const MEAL_ALLERGY_REFERENCE: Array<{ code: number; label: string }> = [
  { code: 1, label: '난류' },
  { code: 2, label: '우유' },
  { code: 3, label: '메밀' },
  { code: 4, label: '땅콩' },
  { code: 5, label: '대두' },
  { code: 6, label: '밀' },
  { code: 7, label: '고등어' },
  { code: 8, label: '게' },
  { code: 9, label: '새우' },
  { code: 10, label: '돼지고기' },
  { code: 11, label: '복숭아' },
  { code: 12, label: '토마토' },
  { code: 13, label: '아황산류' },
  { code: 14, label: '호두' },
  { code: 15, label: '닭고기' },
  { code: 16, label: '쇠고기' },
  { code: 17, label: '오징어' },
  { code: 18, label: '조개류(굴/전복/홍합 포함)' },
  { code: 19, label: '잣' },
];
