import { beforeEach, describe, expect, it } from 'vitest';

import { readStoredTheme, writeStoredTheme } from '@/lib/storage/theme';

/**
 * 테마 저장/복원 동작을 검증한다.
 */
describe('theme storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('저장된 테마가 없으면 null을 반환한다', () => {
    expect(readStoredTheme()).toBeNull();
  });

  it('light/dark/system 값을 저장하고 복원한다', () => {
    writeStoredTheme('light');
    expect(readStoredTheme()).toBe('light');

    writeStoredTheme('dark');
    expect(readStoredTheme()).toBe('dark');

    writeStoredTheme('system');
    expect(readStoredTheme()).toBe('system');
  });
});
