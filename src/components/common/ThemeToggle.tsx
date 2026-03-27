'use client';

import type { ComponentType } from 'react';

import { MoonIcon, SunIcon, SystemIcon } from '@/components/common/ButtonIcons';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeMode } from '@/types/theme';

const OPTIONS: Array<{ value: ThemeMode; label: string; icon: ComponentType<{ className?: string }> }> = [
  { value: 'light', label: '라이트', icon: SunIcon },
  { value: 'dark', label: '다크', icon: MoonIcon },
  { value: 'system', label: '시스템', icon: SystemIcon },
];

/**
 * 라이트/다크/시스템 3상태 테마 토글 컴포넌트다.
 * 요청사항에 따라 아이콘만 표시하고 활성 상태를 색상으로 구분한다.
 */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={`${option.label} 모드`}
          title={option.label}
          aria-pressed={mode === option.value}
          onClick={() => setMode(option.value)}
          className={[
            'inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-semibold transition',
            mode === option.value
              ? 'bg-[var(--primary)] text-[var(--primary-contrast)]'
              : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-muted)]',
          ].join(' ')}
        >
          <option.icon className="h-4 w-4" />
          <span className="sr-only">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
