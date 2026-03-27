/**
 * 급식 조회 요청 파라미터 타입이다.
 */
export interface MealQueryParams {
  officeCode: string;
  schoolCode: string;
  fromYmd: string;
  toYmd: string;
}

/**
 * 급식 탭에서 렌더링하는 내부 모델 타입이다.
 */
export interface MealItem {
  mealDate: string;
  mealType: string;
  menuLines: string[];
  calorie?: string;
  nutrition?: string;
  origin?: string;
}
