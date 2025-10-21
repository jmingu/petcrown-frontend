/**
 * 투표 등록 request
 */
export interface VoteRegistrationRequest {
  petId: number; // 펫ID (필수)
  petModeId?: number; // 감정 ID (선택사항)
  profileImageUrl?: string; // 프로필 이미지 URL (선택사항)
  image?: File; // 이미지 파일 (선택사항)
}

/**
 * 투표 수정 request
 */
export interface VoteUpdateRequest {
  petId: number; // 펫ID (필수)
  petModeId?: number; // 감정 ID (선택사항)
  profileImageUrl?: string; // 프로필 이미지 URL (선택사항)
  image?: File; // 이미지 파일 (선택사항)
}

/**
 * 투표 목록 조회 request
 */
export interface VoteListRequest {
  page: number;
  size: number;
  status?: 'ACTIVE' | 'ENDED' | 'ALL'; // 투표 상태
  category?: string;
}

/**
 * 투표 액션 request
 */
export interface VoteActionRequest {
  email: string; // 투표자 이메일
}

/**
 * 투표 이메일 인증 확인 request
 */
export interface VotingEmailConfirmationRequest {
  email: string; // 인증할 이메일
  encryptedToken: string; // 암호화된 인증 토큰
}

/**
 * 투표 가능 인증 이메일 발송 request
 */
export interface VotingEmailVerificationRequest {
  email: string; // 인증할 이메일
}
