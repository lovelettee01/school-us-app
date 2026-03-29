'use client';

import { create } from 'zustand';

import type { MessageDisplayMode, PushMessageInput, UiMessage } from '@/types/message';

interface MessageStore {
  defaultMode: MessageDisplayMode;
  toastMessages: UiMessage[];
  activePopup: UiMessage | null;
  popupQueue: UiMessage[];
  setDefaultMode: (mode: MessageDisplayMode) => void;
  pushMessage: (input: PushMessageInput) => void;
  dismissToast: (id: number) => void;
  dismissPopup: () => void;
  clearMessages: () => void;
}

const DEDUPE_WINDOW_MS = 3000;
const DEFAULT_TOAST_DURATION_MS = 3200;
let nextMessageId = 1;
const lastMessageTimestampByKey = new Map<string, number>();

/**
 * 전역 기본 모드와 메시지 속성을 바탕으로 실제 표시 모드를 결정한다.
 * 호출부에서 명시 모드를 전달하면 해당 모드를 우선 적용한다.
 */
function resolveDisplayMode(
  defaultMode: MessageDisplayMode,
  input: PushMessageInput,
): 'toast' | 'popup' {
  if (input.mode === 'toast' || input.mode === 'popup') {
    return input.mode;
  }

  if (defaultMode === 'toast' || defaultMode === 'popup') {
    return defaultMode;
  }

  const needsAction = Boolean(input.actionLabel && input.onAction);
  if (input.type === 'error' || needsAction) {
    return 'popup';
  }

  return 'toast';
}

/**
 * 중복 억제 키를 생성한다.
 * 동일한 키의 메시지가 짧은 시간에 반복되는 경우 사용자 피로도를 낮추기 위해 삽입을 건너뛴다.
 */
function buildDedupeKey(input: PushMessageInput): string {
  if (input.dedupeKey) {
    return input.dedupeKey;
  }

  const description = input.description ?? '';
  return `${input.type}:${input.title}:${description}`;
}

/**
 * 공통 메시지 큐(토스트/팝업)를 관리하는 Zustand 스토어다.
 */
export const useMessageStore = create<MessageStore>((set, get) => ({
  defaultMode: 'auto',
  toastMessages: [],
  activePopup: null,
  popupQueue: [],
  setDefaultMode: (mode) => {
    set({ defaultMode: mode });
  },
  pushMessage: (input) => {
    const dedupeKey = buildDedupeKey(input);
    const now = Date.now();
    const lastTimestamp = lastMessageTimestampByKey.get(dedupeKey);
    if (typeof lastTimestamp === 'number' && now - lastTimestamp < DEDUPE_WINDOW_MS) {
      return;
    }
    lastMessageTimestampByKey.set(dedupeKey, now);

    const resolvedMode = resolveDisplayMode(get().defaultMode, input);
    const message: UiMessage = {
      ...input,
      id: nextMessageId,
      createdAt: now,
      resolvedMode,
    };
    nextMessageId += 1;

    if (resolvedMode === 'toast') {
      set((state) => ({
        toastMessages: [...state.toastMessages, message],
      }));

      const durationMs = input.durationMs ?? DEFAULT_TOAST_DURATION_MS;
      window.setTimeout(() => {
        set((state) => ({
          toastMessages: state.toastMessages.filter((item) => item.id !== message.id),
        }));
      }, durationMs);

      return;
    }

    set((state) => {
      if (!state.activePopup) {
        return { activePopup: message };
      }

      return {
        popupQueue: [...state.popupQueue, message],
      };
    });
  },
  dismissToast: (id) => {
    set((state) => ({
      toastMessages: state.toastMessages.filter((item) => item.id !== id),
    }));
  },
  dismissPopup: () => {
    set((state) => {
      const [nextPopup, ...restQueue] = state.popupQueue;
      return {
        activePopup: nextPopup ?? null,
        popupQueue: restQueue,
      };
    });
  },
  clearMessages: () => {
    set({
      toastMessages: [],
      activePopup: null,
      popupQueue: [],
    });
  },
}));
