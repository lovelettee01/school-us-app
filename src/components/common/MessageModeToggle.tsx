'use client';

import type { ComponentType } from 'react';

import { MessageIcon, PopupIcon, ToastIcon } from '@/components/common/ButtonIcons';
import { useMessageMode } from '@/hooks/useMessageMode';
import type { MessageDisplayMode } from '@/types/message';

const OPTIONS: Array<{ value: MessageDisplayMode; label: string; icon: ComponentType<{ className?: string }> }> = [
  { value: 'auto', label: '자동', icon: MessageIcon },
  { value: 'toast', label: '토스트', icon: ToastIcon },
  { value: 'popup', label: '팝업', icon: PopupIcon },
];

/**
 * 사용자에게 메시지 표시 방식(자동/토스트/팝업) 선택 UI를 제공한다.
 */
export function MessageModeToggle() {
  const { mode, setMode } = useMessageMode();

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={`메시지 ${option.label} 모드`}
          title={`메시지 ${option.label} 모드`}
          aria-pressed={mode === option.value}
          onClick={() => setMode(option.value)}
          className={[
            'inline-flex min-h-9 items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold transition',
            mode === option.value
              ? 'bg-[var(--primary)] text-[var(--primary-contrast)]'
              : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-muted)]',
          ].join(' ')}
        >
          <option.icon className="h-4 w-4" />
          <span className="hidden md:inline">{option.label}</span>
          <span className="sr-only">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
