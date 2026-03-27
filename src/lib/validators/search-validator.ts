/**
 * 공백을 제거한 뒤 비어있으면 undefined로 바꿔주는 헬퍼다.
 */
function normalizeString(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * 학교 검색 폼 입력값을 검증하고 에러 메시지를 반환한다.
 */
export function validateSchoolSearchInput(input: {
  officeCode: string;
  schoolName: string;
}): { isValid: boolean; officeCode?: string; schoolName?: string; errorMessage?: string } {
  const officeCode = normalizeString(input.officeCode);
  const schoolName = normalizeString(input.schoolName);

  if (!officeCode) {
    return { isValid: false, errorMessage: '시도교육청을 선택해 주세요.' };
  }

  if (!schoolName) {
    return { isValid: false, errorMessage: '학교명을 입력해 주세요.' };
  }

  if (schoolName.length < 2) {
    return { isValid: false, errorMessage: '학교명은 2글자 이상 입력해 주세요.' };
  }

  return {
    isValid: true,
    officeCode,
    schoolName,
  };
}
