import { getServerEnv } from '@/lib/env';
import type { ApiFailure, ApiResult, ApiSuccess, NeisApiEnvelope } from '@/types/api';

interface RequestOptions {
  resource: string;
  params: Record<string, string | number | undefined>;
  timeoutMs?: number;
  retries?: number;
}

/**
 * NEIS 쿼리 파라미터를 URLSearchParams로 변환한다.
 * undefined/null/빈문자열은 제외해 불필요한 파라미터 전송을 막는다.
 */
export function buildNeisQuery(params: Record<string, string | number | undefined>): URLSearchParams {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const normalized = typeof value === 'string' ? value.trim() : String(value);
    if (normalized.length === 0) {
      return;
    }

    query.set(key, normalized);
  });

  return query;
}

function createFailure(
  code: ApiFailure['code'],
  message: string,
  status?: number,
): ApiFailure {
  return { ok: false, code, message, status };
}

/**
 * NEIS 응답 envelope에서 요청한 리소스 영역을 안전하게 추출한다.
 */
function extractResourceRows<T>(envelope: NeisApiEnvelope<T>, resource: string) {
  const sections = envelope[resource];
  if (!Array.isArray(sections) || sections.length === 0) {
    return { resultCode: 'INFO-200', resultMessage: '정상 처리되었습니다.', rows: [] as T[], totalCount: 0 };
  }

  const headBlock = sections.find((section) => Array.isArray(section.head));
  const rowBlock = sections.find((section) => Array.isArray(section.row));

  const resultCode = headBlock?.head?.[1]?.RESULT?.CODE ?? headBlock?.head?.[0]?.RESULT?.CODE ?? 'INFO-200';
  const resultMessage =
    headBlock?.head?.[1]?.RESULT?.MESSAGE ??
    headBlock?.head?.[0]?.RESULT?.MESSAGE ??
    '정상 처리되었습니다.';
  const totalCount = headBlock?.head?.[0]?.list_total_count ?? 0;
  const rows = rowBlock?.row ?? [];

  return { resultCode, resultMessage, rows, totalCount };
}

/**
 * NEIS API를 호출하고 공통 ApiResult 형태로 반환한다.
 */
export async function requestNeis<T>(options: RequestOptions): Promise<ApiResult<T[]>> {
  const { neisApiKey, neisBaseUrl } = getServerEnv();

  if (!neisApiKey) {
    return createFailure('UPSTREAM_ERROR', 'NEIS API 키가 설정되지 않았습니다.');
  }

  const timeoutMs = options.timeoutMs ?? 8000;
  const retries = options.retries ?? 1;

  const query = buildNeisQuery({
    KEY: neisApiKey,
    Type: 'json',
    pIndex: 1,
    pSize: 100,
    ...options.params,
  });

  const url = `${neisBaseUrl}/${options.resource}?${query.toString()}`;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return createFailure('NETWORK_ERROR', '외부 API 요청에 실패했습니다.', response.status);
      }

      const json = (await response.json()) as NeisApiEnvelope<T>;
      const extracted = extractResourceRows(json, options.resource);

      if (extracted.resultCode !== 'INFO-000' && extracted.resultCode !== 'INFO-200') {
        return createFailure('UPSTREAM_ERROR', extracted.resultMessage || '외부 서비스 오류가 발생했습니다.');
      }

      if (extracted.rows.length === 0) {
        return createFailure('EMPTY', '조회 결과가 없습니다.');
      }

      const success: ApiSuccess<T[]> = {
        ok: true,
        data: extracted.rows,
        meta: { totalCount: extracted.totalCount },
      };

      return success;
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof Error && error.name === 'AbortError') {
        if (attempt < retries) {
          continue;
        }
        return createFailure('TIMEOUT', '요청 시간이 초과되었습니다.');
      }

      if (attempt < retries) {
        continue;
      }

      return createFailure('NETWORK_ERROR', '네트워크 오류가 발생했습니다.');
    }
  }

  return createFailure('NETWORK_ERROR', '요청 처리에 실패했습니다.');
}
