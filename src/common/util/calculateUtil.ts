/**
 * 나이 계산 함수
 * yyyy-mm-dd 형식의 생년월일을 입력받아 현재 연도와의 차이를 계산하여 나이를 반환합니다.
 */
export const calculateAge = (birthdate: string) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
};