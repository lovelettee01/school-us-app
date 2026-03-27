'use client';

import { useRef, useState } from 'react';

import { validateSchoolSearchInput } from '@/lib/validators/search-validator';
import type { ApiResult } from '@/types/api';
import type { SchoolSummary } from '@/types/school';

interface SearchState {
  status: 'idle' | 'loading' | 'success' | 'empty' | 'error';
  errorMessage?: string;
  totalCount: number;
  results: SchoolSummary[];
}

const cache = new Map<string, { createdAt: number; payload: ApiResult<SchoolSummary[]> }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * 검색 화면에서 학교 조회 API와 상태를 제어하는 훅이다.
 */
export function useSchoolSearch() {
  const [state, setState] = useState<SearchState>({
    status: 'idle',
    totalCount: 0,
    results: [],
  });

  const abortRef = useRef<AbortController | null>(null);

  const search = async (officeCode: string, schoolName: string) => {
    const validation = validateSchoolSearchInput({ officeCode, schoolName });
    if (!validation.isValid || !validation.officeCode || !validation.schoolName) {
      setState({
        status: 'error',
        totalCount: 0,
        results: [],
        errorMessage: validation.errorMessage,
      });
      return;
    }

    const key = `${validation.officeCode}:${validation.schoolName}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      if (cached.payload.ok) {
        setState({
          status: cached.payload.data.length > 0 ? 'success' : 'empty',
          totalCount: cached.payload.meta?.totalCount ?? cached.payload.data.length,
          results: cached.payload.data,
        });
      } else {
        setState({ status: 'error', totalCount: 0, results: [], errorMessage: cached.payload.message });
      }
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, status: 'loading', errorMessage: undefined }));

    try {
      const query = new URLSearchParams({
        officeCode: validation.officeCode,
        schoolName: validation.schoolName,
      });

      const response = await fetch(`/api/neis/schools?${query.toString()}`, {
        method: 'GET',
        signal: controller.signal,
      });

      const payload = (await response.json()) as ApiResult<SchoolSummary[]>;
      cache.set(key, { createdAt: Date.now(), payload });

      if (!payload.ok) {
        if (payload.code === 'EMPTY') {
          setState({ status: 'empty', totalCount: 0, results: [] });
          return;
        }

        setState({
          status: 'error',
          totalCount: 0,
          results: [],
          errorMessage: payload.message,
        });
        return;
      }

      setState({
        status: payload.data.length > 0 ? 'success' : 'empty',
        totalCount: payload.meta?.totalCount ?? payload.data.length,
        results: payload.data,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      setState({
        status: 'error',
        totalCount: 0,
        results: [],
        errorMessage: '검색 중 네트워크 오류가 발생했습니다.',
      });
    }
  };

  const reset = () => {
    setState({ status: 'idle', totalCount: 0, results: [] });
  };

  return {
    ...state,
    search,
    reset,
  };
}
