/**
 * 서버 전용 환경변수를 읽어온다.
 * 값이 없을 때는 빈 문자열을 반환하여 런타임에서 사용자 친화 오류로 처리할 수 있게 한다.
 */
export function getServerEnv() {
  const neisAllowInsecureTls = process.env.NEIS_API_ALLOW_INSECURE_TLS === 'true';

  return {
    neisApiKey: process.env.NEIS_API_KEY ?? '',
    neisBaseUrl: process.env.NEIS_API_BASE_URL ?? 'https://open.neis.go.kr/hub',
    neisAllowInsecureTls,
  };
}

/**
 * 클라이언트에서 참조 가능한 공개 환경변수를 반환한다.
 */
export function getPublicEnv() {
  return {
    kakaoMapAppKey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? '',
    defaultTheme: process.env.NEXT_PUBLIC_DEFAULT_THEME ?? 'system',
    defaultMessageMode: process.env.NEXT_PUBLIC_MESSAGE_DISPLAY_MODE ?? 'auto',
    recentMaxCount: Number(process.env.NEXT_PUBLIC_RECENT_MAX_COUNT ?? 10),
  };
}
