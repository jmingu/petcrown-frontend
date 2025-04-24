/**
 * 공통 response interface
 */
export interface CommonResponse<T> {
  resultCode: number; // 결과 코드 (200: 성공, 3000 이상은 서버에서 에러메시지 정의해서 내려줌)
	resultMessageKo: string; // 한국어 메시지
	resultMessageEn: string; // 영어 메시지
	result: T; // 결과 데이터
}