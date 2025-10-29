/**
 * 나이 계산 함수
 * yyyy-mm-dd 형식의 생년월일을 입력받아 현재 연도와의 차이를 계산하여 나이를 반환합니다.
 * 유효하지 않은 날짜인 경우 null을 반환합니다.
 */
export const calculateAge = (birthdate: string | null | undefined): number | null => {
    if (!birthdate || birthdate.trim() === '') {
        return null;
    }

    const birthDate = new Date(birthdate);

    // Invalid Date 체크
    if (isNaN(birthDate.getTime())) {
        return null;
    }

    const birthYear = birthDate.getFullYear();
    const currentYear = new Date().getFullYear();

    // 유효한 연도 범위 체크 (1900년 ~ 현재 연도)
    if (birthYear < 1900 || birthYear > currentYear) {
        return null;
    }

    return currentYear - birthYear;
};