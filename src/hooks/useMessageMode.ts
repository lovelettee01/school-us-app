'use client';

import { useEffect } from 'react';

import { getPublicEnv } from '@/lib/env';
import { readStoredMessageMode, writeStoredMessageMode } from '@/lib/storage/message-mode';
import { useMessageStore } from '@/store/message-store';
import type { MessageDisplayMode } from '@/types/message';

/**
 * 메시지 표시 모드의 초기화/변경을 담당하는 훅이다.
 */
export function useMessageMode() {
  const { defaultMessageMode } = getPublicEnv();
  const mode = useMessageStore((state) => state.defaultMode);
  const setDefaultMode = useMessageStore((state) => state.setDefaultMode);

  useEffect(() => {
    const storedMode = readStoredMessageMode();
    if (storedMode) {
      setDefaultMode(storedMode);
      return;
    }

    if (defaultMessageMode === 'toast' || defaultMessageMode === 'popup' || defaultMessageMode === 'auto') {
      setDefaultMode(defaultMessageMode);
    }
  }, [defaultMessageMode, setDefaultMode]);

  const updateMode = (nextMode: MessageDisplayMode) => {
    setDefaultMode(nextMode);
    writeStoredMessageMode(nextMode);
  };

  return {
    mode,
    setMode: updateMode,
  };
}
