import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />

        {/* 메인 컨텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 40,
            padding: '60px 80px 70px 80px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* 왕관 아이콘 (텍스트로 대체) */}
          <div
            style={{
              fontSize: 100,
              marginBottom: 30,
              lineHeight: 1,
            }}
          >
            👑
          </div>

          {/* 로고/제목 */}
          <div
            style={{
              fontSize: 90,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 35,
              lineHeight: 1.2,
            }}
          >
            펫크라운
          </div>

          {/* 서브 타이틀 */}
          <div
            style={{
              fontSize: 42,
              color: '#374151',
              marginBottom: 25,
              textAlign: 'center',
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            우리 반려동물이 세상에서 제일 귀여워요! 💕
          </div>

          {/* 설명 */}
          <div
            style={{
              fontSize: 32,
              color: '#6b7280',
              textAlign: 'center',
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            투표하고 랭킹 1위에 도전하세요! 🏆
          </div>
        </div>

        {/* 하단 아이콘 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            gap: 20,
            fontSize: 60,
          }}
        >
          🐶 🐱 🐰
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
