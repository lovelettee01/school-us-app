import type { ReactNode } from 'react';

/**
 * 알림 배너 유형이다.
 * 메시지 심각도에 따라 배경/테두리/텍스트 색상을 구분한다.
 */
export type AlertBannerVariant = 'info' | 'success' | 'warning' | 'danger';

interface AlertBannerProps {
  /**
   * 배너 유형이다.
   */
  variant?: AlertBannerVariant;
  /**
   * 배너 제목이다.
   */
  title: string;
  /**
   * 배너 본문 메시지다.
   */
  description?: string;
  /**
   * 우측 또는 하단 액션 영역이다.
   */
  action?: ReactNode;
}

const VARIANT_CLASS_MAP: Record<AlertBannerVariant, string> = {
  info: 'border-blue-300 bg-blue-50 text-blue-800',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-300 bg-amber-50 text-amber-800',
  danger: 'border-rose-300 bg-rose-50 text-rose-800',
};

/**
 * 문맥형 안내 메시지를 표시하는 공통 배너다.
 */
export function AlertBanner({ variant = 'info', title, description, action }: AlertBannerProps) {
  return (
    <section className={["rounded-xl border p-3", VARIANT_CLASS_MAP[variant]].join(' ')}>
      <p className="text-sm font-bold">{title}</p>
      {description ? <p className="mt-1 text-xs opacity-90">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </section>
  );
}
