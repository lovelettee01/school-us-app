'use client';

import { useEffect, useRef } from 'react';

import { useToastStore } from '@/store/toast-store';

/**
 * 에러 메시지 변경 시 토스트를 1회 노출하는 훅이다.
 */
export function useErrorToast(enabled: boolean, message?: string) {
  const pushToast = useToastStore((state) => state.pushToast);
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !message) {
      return;
    }

    if (lastMessageRef.current === message) {
      return;
    }

    lastMessageRef.current = message;
    pushToast({ message, type: 'error' });
  }, [enabled, message, pushToast]);
}
