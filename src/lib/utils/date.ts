/**
 * Date 객체를 YYYYMMDD 문자열로 변환한다.
 */
export function toYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * YYYYMMDD 문자열을 YYYY-MM-DD 형식으로 변환한다.
 */
export function ymdToDashed(ymd: string): string {
  if (!/^\d{8}$/.test(ymd)) {
    return ymd;
  }
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}

/**
 * 문자열이 YYYYMMDD 형식인지 검증한다.
 */
export function isValidYmd(ymd: string): boolean {
  return /^\d{8}$/.test(ymd);
}

/**
 * 기준일의 주간(월~금) 시작/종료 값을 YYYYMMDD로 반환한다.
 */
export function getWeekRangeYmd(baseDate: Date): { fromYmd: string; toYmd: string } {
  const day = baseDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + diffToMonday);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    fromYmd: toYmd(monday),
    toYmd: toYmd(friday),
  };
}
