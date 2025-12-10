// 게임 장애물 아이콘 컴포넌트 (게임의 실제 장애물과 동일한 디자인)

interface ObstacleIconProps {
  size?: number;
  className?: string;
}

// 발바닥 (게임과 동일)
export const PawIcon = ({ size = 60, className = '' }: ObstacleIconProps) => (
  <svg width={size} height={size} viewBox="-25 -20 50 50" className={className}>
    {/* 중앙 패드 (큰 원) - Phaser: (0, 5, r=15) */}
    <circle cx="0" cy="5" r="15" fill="#ff6b9d" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
    {/* 발가락 3개 - Phaser: (-10,-8), (0,-10), (10,-8), r=8 */}
    <circle cx="-10" cy="-8" r="8" fill="#ff6b9d" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
    <circle cx="0" cy="-10" r="8" fill="#ff6b9d" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
    <circle cx="10" cy="-8" r="8" fill="#ff6b9d" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
  </svg>
);

// 뼈다귀 (게임과 동일)
export const BoneIcon = ({ size = 60, className = '' }: ObstacleIconProps) => (
  <svg width={size} height={size} viewBox="-30 -15 60 30" className={className}>
    {/* 중앙 막대 - Phaser: rect(0,0,30,10) centered */}
    <rect x="-15" y="-5" width="30" height="10" fill="#ffd6a5" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
    {/* 왼쪽 끝 원 - Phaser: circle(-15, 0, r=10) */}
    <circle cx="-15" cy="0" r="10" fill="#ffd6a5" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
    {/* 오른쪽 끝 원 - Phaser: circle(15, 0, r=10) */}
    <circle cx="15" cy="0" r="10" fill="#ffd6a5" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
  </svg>
);

// 하트 (게임과 동일 - 2개 원 + 삼각형)
export const HeartIcon = ({ size = 60, className = '' }: ObstacleIconProps) => (
  <svg width={size} height={size} viewBox="-25 -20 50 40" className={className}>
    {/* 아래 삼각형 - Phaser: triangle(-15,0, 15,0, 0,20) at (0,15) */}
    <path d="M -15 -5 L 15 -5 L 0 15 Z" fill="#ffafcc" />
    {/* 왼쪽 원 - Phaser: circle(-8, -5, r=12) */}
    <circle cx="-8" cy="-5" r="12" fill="#ffafcc" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
    {/* 오른쪽 원 - Phaser: circle(8, -5, r=12) */}
    <circle cx="8" cy="-5" r="12" fill="#ffafcc" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
  </svg>
);

// 물고기 (게임과 동일)
export const FishIcon = ({ size = 60, className = '' }: ObstacleIconProps) => (
  <svg width={size} height={size} viewBox="-20 -15 50 30" className={className}>
    {/* 몸통 (타원) - Phaser: ellipse(0,0, 35,20) */}
    <ellipse cx="0" cy="0" rx="17.5" ry="10" fill="#a8dadc" stroke="#fff" strokeWidth="3" strokeOpacity="0.8" />
    {/* 꼬리 (삼각형) - Phaser: triangle at (15,0) with points (15,-12), (15,12), (25,0) */}
    <path d="M 15 -12 L 15 12 L 25 0 Z" fill="#a8dadc" />
    {/* 눈 - Phaser: circle(-8, -3, r=3) */}
    <circle cx="-8" cy="-3" r="3" fill="#2b2d42" />
  </svg>
);

// 공 (게임과 동일)
export const BallIcon = ({ size = 60, className = '' }: ObstacleIconProps) => (
  <svg width={size} height={size} viewBox="-25 -25 50 50" className={className}>
    {/* 공 본체 - Phaser: circle(0,0, r=20) */}
    <circle cx="0" cy="0" r="20" fill="#cdb4db" />
    {/* 공 무늬 (곡선) - Phaser: arc pattern */}
    <circle cx="0" cy="0" r="20" fill="none" stroke="#fff" strokeWidth="3" strokeOpacity="0.6" />
    <path
      d="M 0 -20 A 20 20 0 0 1 14.14 14.14"
      fill="none"
      stroke="#fff"
      strokeWidth="3"
      strokeOpacity="0.6"
    />
  </svg>
);
