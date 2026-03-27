'use client';

import { KeyboardEvent } from 'react';

export type TabKey = 'info' | 'meal' | 'timetable';

interface TabsProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const TAB_ITEMS: Array<{ key: TabKey; label: string }> = [
  { key: 'info', label: '학교정보/위치' },
  { key: 'meal', label: '급식' },
  { key: 'timetable', label: '시간표' },
];

/**
 * 상세 페이지에서 사용하는 접근성 준수 탭 네비게이션 컴포넌트다.
 */
export function Tabs({ activeTab, onChange }: TabsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const nextIndex =
      event.key === 'ArrowRight'
        ? (index + 1) % TAB_ITEMS.length
        : (index - 1 + TAB_ITEMS.length) % TAB_ITEMS.length;

    onChange(TAB_ITEMS[nextIndex].key);
  };

  return (
    <div role="tablist" aria-label="학교 상세 탭" className="grid grid-cols-3 gap-2">
      {TAB_ITEMS.map((tab, index) => (
        <button
          key={tab.key}
          id={`tab-${tab.key}`}
          role="tab"
          aria-selected={activeTab === tab.key}
          aria-controls={`panel-${tab.key}`}
          tabIndex={activeTab === tab.key ? 0 : -1}
          type="button"
          onClick={() => onChange(tab.key)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={[
            'min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition',
            activeTab === tab.key
              ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-contrast)]'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)]',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
