import { requestNeis } from '@/lib/api/neis-client';
import { mapTimetableItem, resolveTimetableResource, sortTimetableByPeriod } from '@/lib/mappers/timetable-mapper';
import { validateTimetableParams } from '@/lib/validators/timetable-validator';
import type { ApiResult } from '@/types/api';
import type { TimetableItem, TimetableQueryParams } from '@/types/timetable';

/**
 * 시간표 API를 호출하고 학교급 분기에 맞는 리소스를 선택해 조회한다.
 */
export async function getTimetable(params: TimetableQueryParams): Promise<ApiResult<TimetableItem[]>> {
  const validation = validateTimetableParams({
    schoolLevel: params.schoolLevel,
    grade: params.grade,
    classNo: params.classNo,
    fromYmd: params.fromYmd,
    toYmd: params.toYmd,
  });

  if (!validation.isValid) {
    return {
      ok: false,
      code: 'VALIDATION_ERROR',
      message: validation.errorMessage ?? '시간표 조회 조건이 올바르지 않습니다.',
    };
  }

  const resource = resolveTimetableResource(params.schoolLevel);
  const result = await requestNeis<Record<string, unknown>>({
    resource,
    params: {
      ATPT_OFCDC_SC_CODE: params.officeCode,
      SD_SCHUL_CODE: params.schoolCode,
      GRADE: params.grade,
      CLASS_NM: params.classNo,
      TI_FROM_YMD: params.fromYmd,
      TI_TO_YMD: params.toYmd,
      pIndex: 1,
      pSize: 200,
    },
  });

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: sortTimetableByPeriod(result.data.map(mapTimetableItem)),
    meta: result.meta,
  };
}
