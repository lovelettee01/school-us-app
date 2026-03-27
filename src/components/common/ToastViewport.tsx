'use client';

import { useToastStore } from '@/store/toast-store';

/**
 * 전역 토스트 뷰포트 컴포넌트다.
 */
export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] grid max-w-sm gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          aria-live="polite"
          className={[
            'pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur',
            toast.type === 'error'
              ? 'border-red-300 bg-red-50/95 text-red-700'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]',
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-2">
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded px-1 text-xs opacity-80 hover:opacity-100"
              aria-label="토스트 닫기"
            >
              닫기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
