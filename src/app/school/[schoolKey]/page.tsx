import { SchoolDetailPage } from '@/features/school/school-detail-page';

interface DetailPageProps {
  /**
   * Next.js App Router에서 주입하는 동적 라우트 파라미터다.
   * `schoolKey`를 해석해 상세 컨테이너에 전달한다.
   */
  params: Promise<{
    /**
     * 학교 상세를 식별하는 복합 키다.
     * 형식: `{officeCode}-{schoolCode}`
     */
    schoolKey: string;
  }>;
}

/**
 * 학교 상세 라우트 엔트리 컴포넌트다.
 */
export default async function DetailPage({ params }: DetailPageProps) {
  const resolved = await params;

  return <SchoolDetailPage schoolKey={resolved.schoolKey} />;
}
