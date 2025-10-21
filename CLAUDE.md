# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

- **개발 서버 실행**: `npm run dev` (Turbopack 사용으로 빠른 빌드)
- **빌드**: `npm run build`
- **프로덕션 실행**: `npm start`
- **개발 모드 실행**: `npm run start:dev`
- **프로덕션 모드 실행**: `npm run start:prod`
- **린트**: `npm run lint`

## 프로젝트 아키텍처

"PetCrown"이라는 한국어 기반 반려동물 커뮤니티 애플리케이션으로, 사용자 인증, 펫 프로필, 투표 시스템, 커뮤니티 게시글, 랭킹 기능을 제공합니다.

### 핵심 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **상태 관리**: Zustand
- **HTTP 클라이언트**: Axios (커스텀 인터셉터 포함)
- **UI 컴포넌트**: 자체 컴포넌트 라이브러리 + Lucide React 아이콘
- **애니메이션**: Framer Motion

### 디렉토리 구조

- **`src/app/`**: Next.js App Router 페이지 및 레이아웃
  - 라우트 기반 구성 (login, signup, profile, vote, community 등)
  - 한국어 로케일 지원 (lang="ko")
- **`src/components/`**: 재사용 가능한 UI 컴포넌트
  - `common/`: 범용 컴포넌트 (Button, Input, Modal, Alert)
  - `layout/`: Header, Footer 컴포넌트
  - 도메인별 특화 컴포넌트
- **`src/libs/`**: 핵심 애플리케이션 로직
  - `api/`: 도메인별 API 레이어 (user, pet, vote)
  - `interface/`: API 요청/응답 TypeScript 인터페이스
  - `store/`: Zustand 스토어 (현재 사용자 스토어)
  - `axiosInstance.ts`: 토큰 갱신 로직이 포함된 Axios 설정
- **`src/constants/`**: 애플리케이션 상수
- **`src/common/util/`**: 유틸리티 함수

### 인증 시스템

JWT 기반 인증 시스템으로 자동 토큰 갱신 기능을 제공합니다:

- Access Token은 localStorage에 'a_t'로 저장
- Refresh Token은 localStorage에 'r_t'로 저장
- 440 상태 코드(토큰 만료) 시 자동 토큰 갱신
- 인증 실패 시 자동으로 /login 페이지로 리다이렉트
- 모든 API 호출에 axios 인터셉터를 통한 자동 Authorization 헤더 추가

### API 아키텍처

- **Base URL**: `NEXT_PUBLIC_API_BASE_URL` 환경변수로 설정
- **응답 형식**: 모든 API는 `CommonResponse<T>` 인터페이스 사용으로 표준화된 구조
- **에러 처리**: axios 인터셉터에서 중앙집중식 에러 처리
- **도메인 구성**: 기능별로 API 구성 (user, pet, vote)

### 주요 기능

1. **사용자 관리**: 회원가입, 로그인, 프로필 관리
2. **펫 프로필**: 펫 등록 및 관리, 이미지 업로드
3. **투표 시스템**: 펫 투표 기능
4. **커뮤니티**: 게시글 작성 및 댓글
5. **랭킹**: 기간별 펫 랭킹 시스템
6. **공지사항**: 알림 시스템

### 필수 환경변수

- `NEXT_PUBLIC_API_BASE_URL`: 백엔드 API 기본 URL

### 폰트 설정

한국어 텍스트 지원을 위해 Noto Sans KR 폰트를 루트 레이아웃에서 설정했습니다.