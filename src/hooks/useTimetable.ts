'use client';

import { useState } from 'react';

import type { ApiResult } from '@/types/api';
import type { TimetableItem } from '@/types/timetable';

const cache = new Map<string, { createdAt: number; payload: ApiResult<TimetableItem[]> }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * 시간표 탭 조회 상태와 API 호출을 관리하는 훅이다.
 */
export function useTimetable() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'empty' | 'error'>('idle');
  const [items, setItems] = useState<TimetableItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const fetchTimetable = async (params: {
    officeCode: string;
    schoolCode: string;
    schoolLevel: 'elementary' | 'middle' | 'high';
    grade: number;
    classNo: number;
    fromYmd: string;
    toYmd: string;
  }) => {
    const key = `time:${params.officeCode}:${params.schoolCode}:${params.schoolLevel}:${params.grade}:${params.classNo}:${params.fromYmd}:${params.toYmd}`;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      if (cached.payload.ok) {
        setItems(cached.payload.data);
        setStatus(cached.payload.data.length === 0 ? 'empty' : 'success');
      } else {
        setStatus(cached.payload.code === 'EMPTY' ? 'empty' : 'error');
        setErrorMessage(cached.payload.message);
      }
      return;
    }

    setStatus('loading');
    setErrorMessage(undefined);

    const query = new URLSearchParams({
      officeCode: params.officeCode,
      schoolCode: params.schoolCode,
      schoolLevel: params.schoolLevel,
      grade: String(params.grade),
      classNo: String(params.classNo),
      fromYmd: params.fromYmd,
      toYmd: params.toYmd,
    });

    try {
      const response = await fetch(`/api/neis/timetable?${query.toString()}`);
      const payload = (await response.json()) as ApiResult<TimetableItem[]>;
      cache.set(key, { createdAt: Date.now(), payload });

      if (!payload.ok) {
        setStatus(payload.code === 'EMPTY' ? 'empty' : 'error');
        setItems([]);
        setErrorMessage(payload.message);
        return;
      }

      setItems(payload.data);
      setStatus(payload.data.length === 0 ? 'empty' : 'success');
    } catch {
      setStatus('error');
      setErrorMessage('시간표 정보를 불러오지 못했습니다.');
    }
  };

  return {
    status,
    items,
    errorMessage,
    fetchTimetable,
  };
}
