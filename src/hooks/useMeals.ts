'use client';

import { useState } from 'react';

import type { ApiResult } from '@/types/api';
import type { MealItem } from '@/types/meal';

const cache = new Map<string, { createdAt: number; payload: ApiResult<MealItem[]> }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * 급식 탭 조회 상태와 API 호출을 관리하는 훅이다.
 */
export function useMeals() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'empty' | 'error'>('idle');
  const [items, setItems] = useState<MealItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const fetchMeals = async (params: {
    officeCode: string;
    schoolCode: string;
    fromYmd: string;
    toYmd: string;
  }) => {
    const key = `meal:${params.officeCode}:${params.schoolCode}:${params.fromYmd}:${params.toYmd}`;
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

    const query = new URLSearchParams(params);
    try {
      const response = await fetch(`/api/neis/meals?${query.toString()}`);
      const payload = (await response.json()) as ApiResult<MealItem[]>;
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
      setErrorMessage('급식 정보를 불러오지 못했습니다.');
    }
  };

  return {
    status,
    items,
    errorMessage,
    fetchMeals,
  };
}
