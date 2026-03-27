import { NextRequest, NextResponse } from 'next/server';

import { getSchoolDetail } from '@/lib/api/school-api';

/**
 * 학교 상세 API Route 핸들러다.
 */
export async function GET(request: NextRequest) {
  const officeCode = request.nextUrl.searchParams.get('officeCode') ?? '';
  const schoolCode = request.nextUrl.searchParams.get('schoolCode') ?? '';

  const result = await getSchoolDetail(officeCode, schoolCode);
  if (!result.ok) {
    return NextResponse.json(result, { status: result.code === 'VALIDATION_ERROR' ? 400 : 200 });
  }

  return NextResponse.json(result, { status: 200 });
}
