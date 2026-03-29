import type { ReactNode } from 'react';

interface AppCardProps {
  /**
   * 카드 제목 텍스트다.
   */
  title?: string;
  /**
   * 카드 상단 우측 액션/메타 영역이다.
   */
  headerRight?: ReactNode;
  /**
   * 카드 본문 콘텐츠다.
   */
  children: ReactNode;
  /**
   * 카드 하단 보조 액션 영역이다.
   */
  footer?: ReactNode;
  /**
   * 카드 외곽에 추가할 클래스명이다.
   */
  className?: string;
}

/**
 * 공통 카드 레이아웃 컴포넌트다.
 * 화면별 정보 블록을 같은 구조와 간격 체계로 제공한다.
 */
export function AppCard({ title, headerRight, children, footer, className }: AppCardProps) {
  return (
    <article className={["card-surface p-4", className ?? ''].filter(Boolean).join(' ')}>
      {title || headerRight ? (
        <header className="mb-3 flex items-center justify-between gap-2">
          {title ? <h3 className="text-sm font-bold text-[var(--text)]">{title}</h3> : <span />}
          {headerRight}
        </header>
      ) : null}

      <div>{children}</div>

      {footer ? <footer className="mt-3 border-t border-[var(--border)] pt-3">{footer}</footer> : null}
    </article>
  );
}
