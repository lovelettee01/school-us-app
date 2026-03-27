import { ReactNode } from 'react';

import { RetryIcon } from '@/components/common/ButtonIcons';

interface LoadingStateProps {
  title?: string;
  description?: string;
  skeletonCount?: number;
}

/**
 * 공통 로딩 상태 UI를 렌더링한다.
 */
export function LoadingState({
  title = '데이터를 불러오는 중입니다.',
  description,
  skeletonCount = 3,
}: LoadingStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      {description ? <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p> : null}
      <div className="mt-4 grid gap-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="h-18 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
        ))}
      </div>
    </section>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: ReactNode;
}

/**
 * 공통 오류 상태 UI를 렌더링한다.
 */
export function ErrorState({ title = '문제가 발생했습니다.', message, retry }: ErrorStateProps) {
  return (
    <section
      role="alert"
      aria-live="polite"
      className="rounded-2xl border border-[var(--danger)]/40 bg-[var(--surface)] p-4"
    >
      <p className="text-sm font-semibold text-[var(--danger)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{message}</p>
      {retry ? <div className="mt-3">{retry}</div> : null}
    </section>
  );
}

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}

/**
 * 조회 결과가 없을 때 표시하는 공통 빈 상태 UI다.
 */
export function EmptyState({ title = '조회 결과가 없습니다.', message, action }: EmptyStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{message}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </section>
  );
}

interface InlineFieldErrorProps {
  id: string;
  message?: string;
}

/**
 * 입력 필드 하단 인라인 검증 오류 메시지를 렌더링한다.
 */
export function InlineFieldError({ id, message }: InlineFieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" aria-live="polite" className="mt-1 text-xs font-medium text-[var(--danger)]">
      {message}
    </p>
  );
}

interface RetryButtonProps {
  onRetry: () => void;
  label?: string;
}

/**
 * 오류 상태에서 재시도를 유도하는 공통 버튼이다.
 */
export function RetryButton({ onRetry, label = '다시 시도' }: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-muted)]"
    >
      <RetryIcon className="h-4 w-4" />
      {label}
    </button>
  );
}

