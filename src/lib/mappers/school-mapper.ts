import { ymdToDashed } from '@/lib/utils/date';
import { makeSchoolKey } from '@/lib/utils/school-key';
import type { SchoolDetail, SchoolSummary } from '@/types/school';

/**
 * NEIS 학교 원본 필드를 내부 SchoolSummary 모델로 변환한다.
 */
export function mapSchoolSummary(raw: Record<string, unknown>): SchoolSummary {
  const officeCode = String(raw.ATPT_OFCDC_SC_CODE ?? '').trim();
  const schoolCode = String(raw.SD_SCHUL_CODE ?? '').trim();

  return {
    schoolKey: makeSchoolKey(officeCode, schoolCode),
    officeCode,
    officeName: String(raw.ATPT_OFCDC_SC_NM ?? '').trim(),
    schoolCode,
    schoolName: String(raw.SCHUL_NM ?? '이름없음').trim(),
    schoolType: String(raw.SCHUL_KND_SC_NM ?? '기타').trim(),
    addressRoad: String(raw.ORG_RDNMA ?? '').trim(),
    tel: String(raw.ORG_TELNO ?? '').trim() || undefined,
  };
}

/**
 * NEIS 학교 원본 필드를 상세 화면용 SchoolDetail 모델로 변환한다.
 */
export function mapSchoolDetail(raw: Record<string, unknown>): SchoolDetail {
  const summary = mapSchoolSummary(raw);

  return {
    ...summary,
    orgType: String(raw.FOND_SC_NM ?? '').trim() || undefined,
    regionName: String(raw.LCTN_SC_NM ?? '').trim() || undefined,
    homepage: String(raw.HMPG_ADRES ?? '').trim() || undefined,
    addressJibun: String(raw.ORG_RDNZC ?? '').trim() || undefined,
    coeduType: String(raw.COEDU_SC_NM ?? '').trim() || undefined,
    lat: Number(raw.REFINE_WGS84_LAT ?? raw.LA ?? undefined) || undefined,
    lng: Number(raw.REFINE_WGS84_LOGT ?? raw.LO ?? undefined) || undefined,
  };
}

/**
 * 시간표/급식에서 공통 사용하는 날짜 변환 유틸을 내보내 재사용성을 높인다.
 */
export const mapYmdToDashed = ymdToDashed;
