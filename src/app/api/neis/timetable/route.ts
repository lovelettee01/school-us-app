import { NextRequest, NextResponse } from 'next/server';

import { getTimetable } from '@/lib/api/timetable-api';

/**
 * 시간표 조회 API Route 핸들러다.
 */
export async function GET(request: NextRequest) {
  const officeCode = request.nextUrl.searchParams.get('officeCode') ?? '';
  const schoolCode = request.nextUrl.searchParams.get('schoolCode') ?? '';
  const schoolLevel = request.nextUrl.searchParams.get('schoolLevel') ?? '';
  const grade = Number(request.nextUrl.searchParams.get('grade') ?? 0);
  const classNo = Number(request.nextUrl.searchParams.get('classNo') ?? 0);
  const fromYmd = request.nextUrl.searchParams.get('fromYmd') ?? '';
  const toYmd = request.nextUrl.searchParams.get('toYmd') ?? '';

  const result = await getTimetable({
    officeCode,
    schoolCode,
    schoolLevel: schoolLevel as 'elementary' | 'middle' | 'high',
    grade,
    classNo,
    fromYmd,
    toYmd,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.code === 'VALIDATION_ERROR' ? 400 : 200 });
  }

  return NextResponse.json(result, { status: 200 });
}
