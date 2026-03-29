'use client';

import { useEffect, useRef } from 'react';

import { AppButton } from '@/components/common/Button';
import { useMessageStore } from '@/store/message-store';

/**
 * 팝업 메시지 유형별 강조 색상 매핑이다.
 */
const POPUP_ACCENT_CLASS_MAP = {
  error: 'text-[var(--danger)]',
  warning: 'text-[var(--warning)]',
  success: 'text-[var(--success)]',
  info: 'text-[var(--primary)]',
} as const;

/**
 * 전역 메시지 팝업 호스트다.
 * 현재 활성 팝업이 있을 때만 렌더링하며 ESC 닫기와 포커스 복귀를 지원한다.
 */
export function MessagePopupHost() {
  const activePopup = useMessageStore((state) => state.activePopup);
  const dismissPopup = useMessageStore((state) => state.dismissPopup);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!activePopup) {
      return;
    }

    previousFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      dismissPopup();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusedElementRef.current?.focus();
    };
  }, [activePopup, dismissPopup]);

  if (!activePopup) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[130] grid place-items-center p-4">
      <button
        type="button"
        aria-label="메시지 팝업 닫기"
        onClick={dismissPopup}
        className="absolute inset-0 bg-black/45"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-popup-title"
        aria-describedby={activePopup.description ? 'message-popup-description' : undefined}
        className="relative z-[131] w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl"
      >
        <p className={["text-sm font-bold", POPUP_ACCENT_CLASS_MAP[activePopup.type]].join(' ')}>
          시스템 메시지
        </p>
        <h2 id="message-popup-title" className="mt-1 text-base font-black text-[var(--text)]">
          {activePopup.title}
        </h2>
        {activePopup.description ? (
          <p id="message-popup-description" className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            {activePopup.description}
          </p>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          {activePopup.actionLabel && activePopup.onAction ? (
            <AppButton
              variant="secondary"
              onClick={() => {
                activePopup.onAction?.();
                dismissPopup();
              }}
            >
              {activePopup.actionLabel}
            </AppButton>
          ) : null}
          <AppButton onClick={dismissPopup}>확인</AppButton>
        </div>
      </section>
    </div>
  );
}
