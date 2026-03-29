/**
 * 메시지 표현 방식을 제어하는 전역 모드 타입이다.
 * `auto`는 메시지 중요도/액션 필요 여부에 따라 토스트 또는 팝업을 자동 선택한다.
 */
export type MessageDisplayMode = 'toast' | 'popup' | 'auto';

/**
 * 사용자에게 전달할 메시지의 의미 타입이다.
 */
export type UiMessageType = 'error' | 'warning' | 'success' | 'info';

/**
 * 메시지 push 시 호출부에서 전달하는 입력 타입이다.
 * `mode`를 지정하면 전역 기본 모드를 덮어쓴다.
 */
export interface PushMessageInput {
  type: UiMessageType;
  title: string;
  description?: string;
  mode?: Exclude<MessageDisplayMode, 'auto'>;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
  dedupeKey?: string;
  source?: string;
}

/**
 * 실제 렌더러에서 사용하는 정규화된 메시지 엔티티다.
 */
export interface UiMessage extends PushMessageInput {
  id: number;
  createdAt: number;
  resolvedMode: 'toast' | 'popup';
}
