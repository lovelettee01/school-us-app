import { ReactNode } from 'react';

import { RetryIcon } from '@/components/common/ButtonIcons';

interface LoadingStateProps {
  /**
   * 로딩 상태 제목이다.
   * 사용자가 현재 어떤 작업을 기다리는지 핵심 맥락을 전달한다.
   */
  title?: string;
  /**
   * 로딩 상태 상세 설명이다.
   * 작업 단계나 예상 동작을 보조적으로 안내할 때 사용한다.
   */
  description?: string;
  /**
   * 스켈레톤 블록 개수다.
   * 화면 밀도에 맞춰 로딩 플레이스홀더 수를 조절한다.
   */
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
  /**
   * 오류 상태 제목이다.
   * 기본값을 사용하거나 화면 맥락에 맞춰 커스터마이징할 수 있다.
   */
  title?: string;
  /**
   * 사용자에게 노출할 핵심 오류 메시지다.
   * 필수 값이며 가능한 명확한 행동 가이드를 포함해야 한다.
   */
  message: string;
  /**
   * 재시도 버튼 등 추가 액션 슬롯이다.
   */
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
  /**
   * 빈 상태 제목이다.
   */
  title?: string;
  /**
   * 빈 상태 설명 메시지다.
   * 조회 조건 변경 등 다음 행동을 안내하는 문구를 권장한다.
   */
  message: string;
  /**
   * 빈 상태에서 제공할 선택 액션 영역이다.
   */
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

interface RetryButtonProps {
  /**
   * 재시도 클릭 시 실행할 핸들러다.
   */
  onRetry: () => void;
  /**
   * 버튼 라벨 문자열이다.
   */
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

