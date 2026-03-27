import { NextRequest, NextResponse } from 'next/server';

import { getMeals } from '@/lib/api/meal-api';

/**
 * 급식 조회 API Route 핸들러다.
 */
export async function GET(request: NextRequest) {
  const officeCode = request.nextUrl.searchParams.get('officeCode') ?? '';
  const schoolCode = request.nextUrl.searchParams.get('schoolCode') ?? '';
  const fromYmd = request.nextUrl.searchParams.get('fromYmd') ?? '';
  const toYmd = request.nextUrl.searchParams.get('toYmd') ?? '';

  const result = await getMeals({ officeCode, schoolCode, fromYmd, toYmd });
  if (!result.ok) {
    return NextResponse.json(result, { status: result.code === 'VALIDATION_ERROR' ? 400 : 200 });
  }

  return NextResponse.json(result, { status: 200 });
}
