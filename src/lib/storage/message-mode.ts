import type { MessageDisplayMode } from '@/types/message';

const MESSAGE_MODE_STORAGE_KEY = 'schoolApp:message-mode:v1';

/**
 * 브라우저 저장소에서 메시지 모드를 읽어온다.
 * 저장된 값이 유효하지 않으면 `null`을 반환한다.
 */
export function readStoredMessageMode(): MessageDisplayMode | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(MESSAGE_MODE_STORAGE_KEY);
  if (stored === 'toast' || stored === 'popup' || stored === 'auto') {
    return stored;
  }

  return null;
}

/**
 * 메시지 모드를 브라우저 저장소에 기록한다.
 */
export function writeStoredMessageMode(mode: MessageDisplayMode): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MESSAGE_MODE_STORAGE_KEY, mode);
}
