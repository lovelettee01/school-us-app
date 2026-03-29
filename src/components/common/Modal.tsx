'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { AppButton } from '@/components/common/Button';

interface AppModalProps {
  /**
   * 모달 열림 여부를 제어하는 필수 상태값이다.
   */
  isOpen: boolean;
  /**
   * 모달 닫기 이벤트 핸들러다.
   * 닫기 버튼, 배경 클릭, ESC 키 입력에서 공통으로 호출한다.
   */
  onClose: () => void;
  /**
   * 모달 제목 텍스트다.
   */
  title: string;
  /**
   * 제목 아래 보조 설명 텍스트다.
   */
  description?: string;
  /**
   * 모달 본문 콘텐츠다.
   */
  children?: ReactNode;
  /**
   * 확인 버튼 라벨이다.
   */
  primaryActionLabel?: string;
  /**
   * 확인 버튼 클릭 시 실행할 핸들러다.
   */
  onPrimaryAction?: () => void;
  /**
   * 취소 버튼 라벨이다.
   */
  secondaryActionLabel?: string;
  /**
   * 취소 버튼 클릭 시 실행할 핸들러다.
   */
  onSecondaryAction?: () => void;
  /**
   * 배경 오버레이 클릭으로 닫을지 여부를 지정한다.
   */
  closeOnBackdrop?: boolean;
}

/**
 * 공통 모달 컴포넌트다.
 * 접근성을 위해 열린 동안 포커스를 모달 내부로 유도하고 ESC 닫기를 지원한다.
 */
export function AppModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  primaryActionLabel = '확인',
  onPrimaryAction,
  secondaryActionLabel = '닫기',
  onSecondaryAction,
  closeOnBackdrop = true,
}: AppModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center p-4">
      <button
        type="button"
        aria-label="모달 배경 닫기"
        onClick={() => {
          if (closeOnBackdrop) {
            onClose();
          }
        }}
        className="absolute inset-0 bg-black/45"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        aria-describedby={description ? 'app-modal-description' : undefined}
        className="relative z-[111] w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl"
      >
        <h2 id="app-modal-title" className="text-base font-bold text-[var(--text)]">
          {title}
        </h2>
        {description ? (
          <p id="app-modal-description" className="mt-1 text-sm text-[var(--text-muted)]">
            {description}
          </p>
        ) : null}

        {children ? <div className="mt-3">{children}</div> : null}

        <div className="mt-4 flex justify-end gap-2">
          <AppButton
            variant="secondary"
            onClick={() => {
              if (onSecondaryAction) {
                onSecondaryAction();
                return;
              }
              onClose();
            }}
          >
            {secondaryActionLabel}
          </AppButton>
          {onPrimaryAction ? <AppButton onClick={onPrimaryAction}>{primaryActionLabel}</AppButton> : null}
        </div>
      </div>
    </div>
  );
}
