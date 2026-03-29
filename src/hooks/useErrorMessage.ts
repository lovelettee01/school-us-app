'use client';

import { useEffect, useRef } from 'react';

import { useMessageStore } from '@/store/message-store';
import type { PushMessageInput } from '@/types/message';

/**
 * 에러 조건이 충족될 때 동일 메시지를 1회만 전역 메시지로 발행하는 훅이다.
 */
export function useErrorMessage(enabled: boolean, message?: string, options?: Partial<PushMessageInput>) {
  const pushMessage = useMessageStore((state) => state.pushMessage);
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !message) {
      return;
    }

    if (lastMessageRef.current === message) {
      return;
    }

    lastMessageRef.current = message;

    pushMessage({
      type: 'error',
      title: '오류가 발생했습니다.',
      description: message,
      mode: options?.mode,
      actionLabel: options?.actionLabel,
      onAction: options?.onAction,
      dedupeKey: options?.dedupeKey,
      source: options?.source,
    });
  }, [enabled, message, options?.actionLabel, options?.dedupeKey, options?.mode, options?.onAction, options?.source, pushMessage]);
}
