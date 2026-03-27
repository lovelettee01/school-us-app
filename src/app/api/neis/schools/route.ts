import { NextRequest, NextResponse } from 'next/server';

import { searchSchools } from '@/lib/api/school-api';

/**
 * 학교 검색 API Route 핸들러다.
 * 클라이언트에서 시도교육청/학교명 조건으로 검색할 때 사용한다.
 */
export async function GET(request: NextRequest) {
  const officeCode = request.nextUrl.searchParams.get('officeCode') ?? '';
  const schoolName = request.nextUrl.searchParams.get('schoolName') ?? '';
  const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
  const pageSize = Number(request.nextUrl.searchParams.get('pageSize') ?? 20);

  const result = await searchSchools({ officeCode, schoolName, page, pageSize });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.code === 'VALIDATION_ERROR' ? 400 : 200 });
  }

  return NextResponse.json(result, { status: 200 });
}
