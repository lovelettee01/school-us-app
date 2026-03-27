import { SearchPage } from '@/features/search/search-page';

/**
 * 홈 라우트 페이지다.
 * 실제 검색 상호작용은 SearchPage 클라이언트 컴포넌트가 담당한다.
 */
export default function HomePage() {
  return <SearchPage />;
}
