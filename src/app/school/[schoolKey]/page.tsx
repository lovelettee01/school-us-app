import { SchoolDetailPage } from '@/features/school/school-detail-page';

interface DetailPageProps {
  params: Promise<{
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
