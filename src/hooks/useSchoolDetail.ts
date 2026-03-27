'use client';

import { useCallback, useEffect, useState } from 'react';

import { parseSchoolKey } from '@/lib/utils/school-key';
import type { ApiResult } from '@/types/api';
import type { SchoolDetail } from '@/types/school';

const cache = new Map<string, { createdAt: number; payload: ApiResult<SchoolDetail> }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * 상세 페이지 공통 데이터(학교 대표 정보)를 조회하는 훅이다.
 */
export function useSchoolDetail(schoolKey: string) {
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading');
  const [detail, setDetail] = useState<SchoolDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    const parsed = parseSchoolKey(schoolKey);
    if (!parsed) {
      setStatus('error');
      setErrorMessage('잘못된 학교 주소입니다.');
      return;
    }

    const cached = cache.get(schoolKey);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      if (cached.payload.ok) {
        setDetail(cached.payload.data);
        setStatus('success');
      } else {
        setStatus(cached.payload.code === 'EMPTY' ? 'empty' : 'error');
        setErrorMessage(cached.payload.message);
      }
      return;
    }

    setStatus('loading');
    setErrorMessage(undefined);

    const query = new URLSearchParams({
      officeCode: parsed.officeCode,
      schoolCode: parsed.schoolCode,
    });

    try {
      const response = await fetch(`/api/neis/school?${query.toString()}`);
      const payload = (await response.json()) as ApiResult<SchoolDetail>;
      cache.set(schoolKey, { createdAt: Date.now(), payload });

      if (!payload.ok) {
        setStatus(payload.code === 'EMPTY' ? 'empty' : 'error');
        setErrorMessage(payload.message);
        return;
      }

      setDetail(payload.data);
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('학교 정보를 불러오지 못했습니다.');
    }
  }, [schoolKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return {
    status,
    detail,
    errorMessage,
    retry: load,
  };
}
