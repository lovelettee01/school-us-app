'use client';

import { create } from 'zustand';

interface ToastItem {
  id: number;
  message: string;
  type: 'error' | 'info';
}

interface ToastStore {
  toasts: ToastItem[];
  pushToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: number) => void;
}

let nextToastId = 1;

/**
 * 전역 토스트 메시지 큐를 관리하는 Zustand 스토어다.
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = nextToastId;
    nextToastId += 1;

    set((state) => ({
      toasts: [...state.toasts, { id, ...toast }],
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((item) => item.id !== id),
      }));
    }, 3200);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    }));
  },
}));
