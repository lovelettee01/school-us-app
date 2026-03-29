'use client';

import { CloseIcon } from '@/components/common/ButtonIcons';
import { useMessageStore } from '@/store/message-store';

/**
 * 토스트 유형별 색상 스타일 매핑이다.
 */
const TOAST_STYLE_MAP = {
  error: 'border-red-300 bg-red-50/95 text-red-700',
  warning: 'border-amber-300 bg-amber-50/95 text-amber-700',
  success: 'border-emerald-300 bg-emerald-50/95 text-emerald-700',
  info: 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]',
} as const;

/**
 * 전역 토스트 메시지를 렌더링하는 뷰포트 컴포넌트다.
 */
export function MessageToastViewport() {
  const messages = useMessageStore((state) => state.toastMessages);
  const dismissToast = useMessageStore((state) => state.dismissToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[120] grid max-w-sm gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          role={message.type === 'error' ? 'alert' : 'status'}
          aria-live={message.type === 'error' ? 'assertive' : 'polite'}
          className={[
            'pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur',
            TOAST_STYLE_MAP[message.type],
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{message.title}</p>
              {message.description ? <p className="mt-1 text-xs opacity-90">{message.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(message.id)}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-xs opacity-80 hover:opacity-100"
              aria-label="토스트 닫기"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
