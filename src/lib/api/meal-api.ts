import { requestNeis } from '@/lib/api/neis-client';
import { mapMealItem } from '@/lib/mappers/meal-mapper';
import { isValidYmd } from '@/lib/utils/date';
import type { ApiResult } from '@/types/api';
import type { MealItem, MealQueryParams } from '@/types/meal';

/**
 * 급식 API를 호출하고 내부 MealItem 목록으로 변환한다.
 */
export async function getMeals(params: MealQueryParams): Promise<ApiResult<MealItem[]>> {
  if (!params.officeCode.trim() || !params.schoolCode.trim()) {
    return { ok: false, code: 'VALIDATION_ERROR', message: '학교 정보가 올바르지 않습니다.' };
  }

  if (!isValidYmd(params.fromYmd) || !isValidYmd(params.toYmd) || params.fromYmd > params.toYmd) {
    return { ok: false, code: 'VALIDATION_ERROR', message: '날짜 범위가 올바르지 않습니다.' };
  }

  const result = await requestNeis<Record<string, unknown>>({
    resource: 'mealServiceDietInfo',
    params: {
      ATPT_OFCDC_SC_CODE: params.officeCode,
      SD_SCHUL_CODE: params.schoolCode,
      MLSV_FROM_YMD: params.fromYmd,
      MLSV_TO_YMD: params.toYmd,
      pIndex: 1,
      pSize: 100,
    },
  });

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: result.data.map(mapMealItem).sort((a, b) => a.mealDate.localeCompare(b.mealDate)),
    meta: result.meta,
  };
}
