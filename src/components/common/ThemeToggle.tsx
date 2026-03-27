'use client';

import { useTheme } from '@/hooks/useTheme';
import type { ThemeMode } from '@/types/theme';

const OPTIONS: Array<{ value: ThemeMode; label: string }> = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템' },
];

/**
 * 라이트/다크/시스템 3상태 테마 토글 컴포넌트다.
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
          aria-pressed={mode === option.value}
          onClick={() => setMode(option.value)}
          className={[
            'min-h-11 min-w-16 rounded-lg px-3 text-xs font-semibold transition',
            mode === option.value
              ? 'bg-[var(--primary)] text-[var(--primary-contrast)]'
              : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-muted)]',
          ].join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
