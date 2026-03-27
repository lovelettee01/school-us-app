import { mapSchoolDetail, mapSchoolSummary } from '@/lib/mappers/school-mapper';
import { requestNeis } from '@/lib/api/neis-client';
import { validateSchoolSearchInput } from '@/lib/validators/search-validator';
import type { ApiResult } from '@/types/api';
import type { SchoolDetail, SchoolSearchParams, SchoolSummary } from '@/types/school';

/**
 * 학교 검색 API를 호출해 SchoolSummary 목록을 반환한다.
 */
export async function searchSchools(params: SchoolSearchParams): Promise<ApiResult<SchoolSummary[]>> {
  const validation = validateSchoolSearchInput({
    officeCode: params.officeCode,
    schoolName: params.schoolName,
  });

  if (!validation.isValid || !validation.officeCode || !validation.schoolName) {
    return {
      ok: false,
      code: 'VALIDATION_ERROR',
      message: validation.errorMessage ?? '검색 조건이 올바르지 않습니다.',
    };
  }

  const result = await requestNeis<Record<string, unknown>>({
    resource: 'schoolInfo',
    params: {
      ATPT_OFCDC_SC_CODE: validation.officeCode,
      SCHUL_NM: validation.schoolName,
      pIndex: params.page ?? 1,
      pSize: params.pageSize ?? 20,
    },
  });

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: result.data.map(mapSchoolSummary).sort((a, b) => a.schoolName.localeCompare(b.schoolName)),
    meta: result.meta,
  };
}

/**
 * 학교 상세 API를 호출해 단일 SchoolDetail을 반환한다.
 */
export async function getSchoolDetail(
  officeCode: string,
  schoolCode: string,
): Promise<ApiResult<SchoolDetail>> {
  if (!officeCode.trim() || !schoolCode.trim()) {
    return { ok: false, code: 'VALIDATION_ERROR', message: '학교 식별자가 올바르지 않습니다.' };
  }

  const result = await requestNeis<Record<string, unknown>>({
    resource: 'schoolInfo',
    params: {
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
      pIndex: 1,
      pSize: 1,
    },
  });

  if (!result.ok) {
    return result;
  }

  const first = result.data[0];
  if (!first) {
    return { ok: false, code: 'EMPTY', message: '학교 정보를 찾을 수 없습니다.' };
  }

  return {
    ok: true,
    data: mapSchoolDetail(first),
  };
}
