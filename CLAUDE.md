# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

- **개발 서버 실행**: `npm run dev` (Turbopack 사용으로 빠른 빌드)
- **빌드**: `npm run build`
- **프로덕션 실행**: `npm start`
- **개발 모드 실행**: `npm run start:dev`
- **프로덕션 모드 실행**: `npm run start:prod`
- **린트**: `npm run lint`

## 프로젝트 개요

"PetCrown"은 반려동물 투표 및 커뮤니티 플랫폼입니다. 사용자는 자신의 반려동물을 등록하고 투표에 참여하여 주간 랭킹을 경쟁할 수 있으며, 커뮤니티를 통해 소통할 수 있습니다.

### 핵심 기능

1. **투표 시스템**
   - 이메일 인증 투표 (비회원): 1표
   - 회원 로그인 투표: 추가 1표 (최대 2표)
   - SNS 공유 기능으로 더 많은 투표 유도
   - 주간 랭킹 시스템

2. **회원 관리**
   - 간소화된 회원가입 (이메일, 이름, 닉네임, 비밀번호만 필수)
   - 선택 정보: 성별, 생년월일, 전화번호
   - JWT 기반 인증 (자동 토큰 갱신)
   - 비밀번호 찾기 (이메일 + 이름)

3. **반려동물 관리**
   - 간소화된 등록 (이름 + 프로필 사진만 필수)
   - 선택 정보: 종, 품종, 성별, 생년월일, 설명, 마이크로칩 ID
   - 수정 모드에서는 모든 정보 편집 가능

4. **커뮤니티**
   - 게시글 작성 및 댓글
   - 이미지 첨부 기능
   - 공지사항 및 이벤트

5. **랭킹 시스템**
   - 주간 단위 랭킹
   - 투표 수 기반 순위
   - 메인 페이지 및 전용 랭킹 페이지

### 핵심 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **상태 관리**: Zustand
- **HTTP 클라이언트**: Axios (커스텀 인터셉터 포함)
- **UI 컴포넌트**: 자체 컴포넌트 라이브러리 + Lucide React 아이콘
- **애니메이션**: Framer Motion
- **광고**: Google AdSense 통합

### 디렉토리 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── page.tsx                  # 메인 페이지 (대시보드)
│   ├── login/                    # 로그인
│   ├── signup/                   # 회원가입
│   ├── find-id/                  # 아이디 찾기
│   ├── find-password/            # 비밀번호 찾기
│   ├── profile/                  # 프로필 및 펫 관리
│   │   └── components/           # EditPetModal, EditProfileModal, ChangePasswordModal
│   ├── vote/                     # 투표 시스템
│   │   ├── page.tsx              # 투표 목록
│   │   ├── register/             # 투표 등록
│   │   └── [id]/                 # 투표 상세
│   │       ├── page.tsx          # 투표 상세 페이지
│   │       ├── edit/             # 투표 수정
│   │       └── components/       # VoteButton, EmailVerificationModal, ShareButton
│   ├── ranking/                  # 랭킹 페이지
│   ├── community/                # 커뮤니티
│   │   ├── page.tsx              # 게시글 목록
│   │   ├── register/             # 게시글 작성
│   │   ├── [id]/                 # 게시글 상세
│   │   └── components/           # Comment 컴포넌트
│   ├── notice/                   # 공지사항
│   ├── event/                    # 이벤트
│   ├── guide/                    # 이용안내
│   ├── privacy/                  # 개인정보 처리방침
│   └── contact/                  # 문의하기
│
├── components/                   # 재사용 가능한 UI 컴포넌트
│   ├── common/                   # 공통 컴포넌트
│   │   ├── button/               # Button, CuteButton
│   │   ├── input/                # Input, RadioGroup, DateInput
│   │   ├── modal/                # Modal
│   │   ├── alert/                # Alert
│   │   ├── card/                 # CuteCard
│   │   ├── badge/                # CuteBadge
│   │   ├── avatar/               # CuteAvatar
│   │   ├── adsense/              # AdSense
│   │   └── floating/             # FloatingButtons
│   ├── layout/                   # 레이아웃 컴포넌트
│   │   ├── header/               # Header (드롭다운 메뉴 포함)
│   │   └── footer/               # Footer
│   ├── home/                     # 홈 페이지 섹션 컴포넌트
│   │   ├── banner/               # HomeBanner
│   │   ├── vote/                 # HomeVote
│   │   ├── ranking/              # HomeRanking
│   │   ├── community/            # HomeCommunity
│   │   └── notice/               # HomeNotice
│   └── vote/                     # 투표 관련 컴포넌트
│       └── PetRegisterModal.tsx  # 투표 등록 모달
│
├── libs/                         # 핵심 애플리케이션 로직
│   ├── api/                      # API 레이어
│   │   ├── user/                 # 사용자 API (userApi.ts)
│   │   ├── pet/                  # 펫 API (petApi.ts)
│   │   ├── vote/                 # 투표 API (voteApi.ts)
│   │   ├── community/            # 커뮤니티 API
│   │   ├── notice/               # 공지사항 API
│   │   ├── event/                # 이벤트 API
│   │   ├── ranking/              # 랭킹 API
│   │   └── common/               # 공통 에러 핸들러
│   ├── interface/                # TypeScript 인터페이스
│   │   └── api/                  # API 요청/응답 인터페이스
│   │       ├── user/             # 사용자 관련 인터페이스
│   │       ├── pet/              # 펫 관련 인터페이스
│   │       ├── vote/             # 투표 관련 인터페이스
│   │       ├── community/        # 커뮤니티 관련 인터페이스
│   │       └── common/           # 공통 인터페이스 (CommonResponse)
│   ├── store/                    # Zustand 상태 관리
│   │   └── user/                 # userStore.ts
│   ├── broadcastchannel/         # BroadcastChannel (탭 간 통신)
│   └── axiosInstance.ts          # Axios 인터셉터 (토큰 갱신)
│
├── common/                       # 공통 유틸리티
│   └── util/                     # 유틸리티 함수
│       └── passwordValidator.ts  # 비밀번호 검증
│
└── constants/                    # 애플리케이션 상수
```

### 인증 시스템

JWT 기반 인증 시스템으로 자동 토큰 갱신 기능을 제공합니다:

- Access Token은 localStorage에 'a_t'로 저장
- Refresh Token은 localStorage에 'r_t'로 저장
- 440 상태 코드(토큰 만료) 시 자동 토큰 갱신
- 인증 실패 시 자동으로 /login 페이지로 리다이렉트
- 모든 API 호출에 axios 인터셉터를 통한 자동 Authorization 헤더 추가

### API 아키텍처

- **Base URL**: `NEXT_PUBLIC_API_BASE_URL` 환경변수로 설정
- **응답 형식**: 모든 API는 `CommonResponse<T>` 인터페이스 사용
  ```typescript
  interface CommonResponse<T> {
    resultCode: number;
    resultMessage: string;
    resultMessageKo: string;
    result: T;
  }
  ```
- **에러 처리**:
  - axios 인터셉터에서 중앙집중식 에러 처리
  - 440 코드: 토큰 만료 시 자동 갱신
  - 401 코드: 로그인 페이지로 리다이렉트
  - `handleApiError` 함수로 일관된 에러 처리
- **도메인별 API**: user, pet, vote, community, notice, event, ranking
- **콘솔 로그 정책**: 프로덕션 환경을 위해 모든 console 문 제거됨

### UI/UX 가이드라인

#### 반응형 디자인
- **모바일 우선**: 1024px (lg) 이하는 모바일 UI
- **태블릿/데스크톱**: 1024px 이상에서 데스크톱 레이아웃
- **한글 텍스트**: `break-keep` 클래스로 자연스러운 줄바꿈
- **폰트**: Noto Sans KR (한국어 최적화)

#### 네비게이션 구조
```
Header (드롭다운 메뉴)
├── 이용안내
├── 투표 ▼
│   ├── 랭킹보기
│   └── 투표하기
├── 커뮤니티
└── 알림 ▼
    ├── 공지사항
    └── 이벤트
```

#### 공통 디자인 패턴
- **뒤로가기 링크**: `← [페이지명] 목록으로 돌아가기` (텍스트 링크 스타일)
- **버튼**: CuteButton 컴포넌트 사용 (variant: primary, secondary, danger 등)
- **카드**: CuteCard 컴포넌트로 일관된 섹션 스타일
- **배지**: CuteBadge로 태그 및 상태 표시
- **모달**: Modal 컴포넌트로 팝업 UI
- **알림**: Alert 컴포넌트로 사용자 피드백

#### 애니메이션
- Framer Motion 사용
- 페이지 진입 시 fade-in 효과
- 리스트 아이템 stagger 애니메이션
- 드롭다운/아코디언 부드러운 전환

### 데이터 정책

#### 필수 입력 항목 (최소화)
- **회원가입**: 이메일, 이름, 닉네임, 비밀번호
- **펫 등록**: 이름, 프로필 사진
- **투표 등록**: 등록된 펫 선택, 설명

#### 선택 입력 항목
- **회원 정보**: 성별, 생년월일, 전화번호
- **펫 정보**: 종, 품종, 성별, 생년월일, 설명, 마이크로칩 ID

#### 조건부 렌더링
- 선택 항목이 없는 경우 표시하지 않음
- 예: 생년월일 없으면 나이 배지 미표시
- 예: 성별 없으면 성별 배지 미표시

### 환경변수

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://www.petcrown.com
```

### SEO 및 소셜 미디어 최적화

#### Open Graph 메타데이터
- 카카오톡, 페이스북, 트위터 등 SNS 공유 시 미리보기 제공
- OG 이미지: `/public/og-image.png` (1200x630px)
- 메타데이터는 `src/app/layout.tsx`에 설정됨

#### OG 이미지 요구사항
- **크기**: 1200 x 630 픽셀
- **포맷**: PNG 또는 JPG
- **내용**: 브랜드 로고, 캐치프레이즈, 시각적 요소
- **색상**: 보라색-핑크 그라데이션 (브랜드 컬러)

#### 메타데이터 구성
- **Title**: "펫크라운 - 반려동물 투표 & 커뮤니티"
- **Description**: 투표 시스템 및 혜택 설명
- **Keywords**: 반려동물, 투표, 랭킹, 커뮤니티 관련 키워드
- **Robots**: 검색엔진 최적화 설정

### 개발 시 주의사항

1. **console 사용 금지**: 모든 console.log/error/warn 제거
2. **타입 안정성**: TypeScript strict 모드 활용
3. **이미지 최적화**: Next.js Image 컴포넌트 사용
4. **SEO**: metadata 설정 (title, description, openGraph)
5. **접근성**: 적절한 aria-label, semantic HTML
6. **모바일 최적화**: 터치 영역 충분히 확보 (최소 44px)
7. **에러 처리**: 사용자 친화적인 한글 메시지 제공