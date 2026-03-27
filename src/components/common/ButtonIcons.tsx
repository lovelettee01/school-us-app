import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

interface StarIconProps extends IconProps {
  filled?: boolean;
}

/**
 * 공통 버튼 아이콘 스타일을 적용하기 위한 기본 래퍼다.
 */
function BaseIcon({ className = 'h-4 w-4', ...props }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} />;
}

/** 검색 아이콘 */
export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </BaseIcon>
  );
}

/** 초기화 아이콘 */
export function ResetIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v4h4" />
    </BaseIcon>
  );
}

/** 상세 이동 아이콘 */
export function DetailIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </BaseIcon>
  );
}

/** 즐겨찾기 아이콘 */
export function StarIcon({ filled = false, ...props }: StarIconProps) {
  return (
    <BaseIcon fill={filled ? 'currentColor' : 'none'} {...props}>
      <path d="m12 3 2.9 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.8 6.2 20.6l1.1-6.4L2.7 9.7l6.4-.9Z" />
    </BaseIcon>
  );
}

/** 홈 이동 아이콘 */
export function HomeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </BaseIcon>
  );
}

/** 더보기 아이콘 */
export function MoreIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </BaseIcon>
  );
}

/** 재시도 아이콘 */
export function RetryIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M21 12a9 9 0 1 1-3.2-6.9" />
      <path d="M21 3v6h-6" />
    </BaseIcon>
  );
}

/** 테마 라이트 아이콘 */
export function SunIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.9 19.1 1.4-1.4" />
      <path d="m17.7 6.3 1.4-1.4" />
    </BaseIcon>
  );
}

/** 테마 다크 아이콘 */
export function MoonIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
    </BaseIcon>
  );
}

/** 테마 시스템 아이콘 */
export function SystemIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </BaseIcon>
  );
}

/** 탭 정보 아이콘 */
export function InfoIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

/** 탭 급식 아이콘 */
export function MealIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 4v7" />
      <path d="M7 4v7" />
      <path d="M4 7h3" />
      <path d="M7 11v9" />
      <path d="M14 4v8a2 2 0 0 0 2 2h0v6" />
      <path d="M18 4v16" />
    </BaseIcon>
  );
}

/** 탭 시간표 아이콘 */
export function TimetableIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h8" />
      <path d="M8 18h5" />
    </BaseIcon>
  );
}

/** 길찾기 아이콘 */
export function RouteIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 6h4a4 4 0 0 1 4 4v4" />
    </BaseIcon>
  );
}

/** 거리 계산 아이콘 */
export function DistanceIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 17 17 3" />
      <path d="M7 17H3v-4" />
      <path d="M17 7V3h4" />
    </BaseIcon>
  );
}

/** 링크/주소 복사 아이콘 */
export function CopyIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <rect x="4" y="4" width="11" height="11" rx="2" />
    </BaseIcon>
  );
}

/** 도보 아이콘 */
export function WalkIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="4" r="2" />
      <path d="m10 11 2-3 2 2 3 1" />
      <path d="m12 8-3 4-3 1" />
      <path d="m11 15 2 3" />
      <path d="m8 22 2-5" />
      <path d="m16 22-1-4" />
    </BaseIcon>
  );
}

/** 자전거 아이콘 */
export function BikeIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="m6 18 5-8h3" />
      <path d="m11 10 4 8" />
      <path d="M14 10h4" />
    </BaseIcon>
  );
}

/** 차량 아이콘 */
export function CarIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 16h14l-1.2-5a2 2 0 0 0-1.9-1.5H8.1A2 2 0 0 0 6.2 11L5 16Z" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
      <path d="M4 16h16" />
    </BaseIcon>
  );
}
