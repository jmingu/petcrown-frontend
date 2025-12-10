import * as Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {
  private player?: Phaser.GameObjects.Container;
  private obstacles?: Phaser.Physics.Arcade.Group;
  private powerups?: Phaser.Physics.Arcade.Group;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: { [key: string]: Phaser.Input.Keyboard.Key };
  private score: number = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private gameOverFlag: boolean = false;
  private obstacleSpeed: number = 200;
  private obstacleTimer?: Phaser.Time.TimerEvent;
  private difficultyTimer?: Phaser.Time.TimerEvent;
  private powerupTimer?: Phaser.Time.TimerEvent;
  private petImageUrl: string;
  private touchX: number = 0;
  private isTouching: boolean = false;
  private isShield: boolean = false;
  private shieldGraphics?: Phaser.GameObjects.Graphics;
  private mobileDirection: 'left' | 'right' | 'none' = 'none';
  private backgroundParticles?: Phaser.GameObjects.Particles.ParticleEmitter;
  private playerTrail?: Phaser.GameObjects.Graphics;
  private glowLayer?: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PlayScene' });
    this.petImageUrl = '';
  }

  // 모바일 화살표 버튼 제어
  setMobileDirection(direction: 'left' | 'right' | 'none') {
    this.mobileDirection = direction;
  }

  init(data: { petImageUrl: string }) {
    this.petImageUrl = data.petImageUrl || 'default';
    this.score = 0;
    this.gameOverFlag = false;
    this.obstacleSpeed = 300; // 초기 속도 증가 (200 → 300)
  }

  preload() {
    // Phaser 로더에 CORS 설정
    this.load.setCORS('anonymous');

    // 반려동물 이미지 로드 (동적 URL)
    if (this.petImageUrl && this.petImageUrl !== 'default') {
      // 캐시 버스팅: URL에 타임스탬프 추가하여 매번 새로 로드
      const cacheBustedUrl = `${this.petImageUrl}${this.petImageUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
      this.load.image('petFace', cacheBustedUrl);
    }

    // 장애물 SVG 이미지 로드
    this.load.svg('obstacle-paw', '/game/obstacles/paw.svg', { scale: 0.8 });
    this.load.svg('obstacle-bone', '/game/obstacles/bone.svg', { scale: 1.2 });
    this.load.svg('obstacle-heart', '/game/obstacles/heart.svg', { scale: 1.2 });
    this.load.svg('obstacle-fish', '/game/obstacles/fish.svg', { scale: 1.5 });
    this.load.svg('obstacle-ball', '/game/obstacles/ball.svg', { scale: 0.8 });

    // 파워업 SVG 이미지 로드
    this.load.svg('powerup-shield', '/game/obstacles/shield.svg', { scale: 0.6 });
    this.load.svg('powerup-slow', '/game/obstacles/hourglass.svg', { scale: 0.6 });
  }

  create() {
    const { width, height } = this.cameras.main;

    // 트랜디한 그라데이션 배경
    this.createModernBackground();

    // 플레이어 생성 (반려동물 캐릭터)
    this.createPlayer();

    // 장애물 그룹 생성
    this.obstacles = this.physics.add.group();

    // 파워업 그룹 생성
    this.powerups = this.physics.add.group();

    // 입력 설정 (키보드)
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D') as { [key: string]: Phaser.Input.Keyboard.Key };

    // 터치/마우스 입력
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isTouching = true;
      this.touchX = pointer.x;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isTouching) {
        this.touchX = pointer.x;
      }
    });

    this.input.on('pointerup', () => {
      this.isTouching = false;
    });

    // 점수 표시 (귀여운 스타일)
    this.scoreText = this.add.text(width / 2, 40, '생존시간: 0초', {
      fontSize: '28px',
      color: '#ff6b9d',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 5,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#ffafcc',
        blur: 5,
        fill: true,
      },
    }).setOrigin(0.5);

    // 점수 배경 (귀여운 구름 모양)
    const scoreBackground = this.add.graphics();
    scoreBackground.fillStyle(0xffffff, 0.85);
    scoreBackground.fillRoundedRect(width / 2 - 130, 20, 260, 50, 25);
    scoreBackground.lineStyle(4, 0xffafcc, 1);
    scoreBackground.strokeRoundedRect(width / 2 - 130, 20, 260, 50, 25);
    scoreBackground.setDepth(-1);
    this.scoreText.setDepth(1);

    // 점수판 귀여운 장식 (별)
    const scoreDecor1 = this.add.star(width / 2 - 140, 45, 4, 8, 4, 0xffd700, 1);
    const scoreDecor2 = this.add.star(width / 2 + 140, 45, 4, 8, 4, 0xffd700, 1);

    this.tweens.add({
      targets: [scoreDecor1, scoreDecor2],
      angle: 360,
      scaleX: { from: 0.8, to: 1.2 },
      scaleY: { from: 0.8, to: 1.2 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // 충돌 감지
    this.physics.add.overlap(this.player!, this.obstacles!, this.hitObstacle, undefined, this);
    this.physics.add.overlap(this.player!, this.powerups!, this.collectPowerup, undefined, this);

    // 장애물 생성 타이머 (초기 0.7초마다 - 더 빠르게)
    this.obstacleTimer = this.time.addEvent({
      delay: 700,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    // 파워업 생성 타이머 (10초마다)
    this.powerupTimer = this.time.addEvent({
      delay: 10000,
      callback: this.spawnPowerup,
      callbackScope: this,
      loop: true,
    });

    // 난이도 증가 타이머 (3초마다 - 더 빠르게)
    this.difficultyTimer = this.time.addEvent({
      delay: 3000,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true,
    });

    // 점수 카운터 (0.1초마다)
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (!this.gameOverFlag) {
          this.score += 0.1;
          this.scoreText?.setText(`생존시간: ${this.score.toFixed(1)}초`);
        }
      },
      loop: true,
    });
  }

  createModernBackground() {
    const { width, height } = this.cameras.main;

    // 파스텔 그라데이션 배경 (귀여운 반려동물 느낌)
    const bg = this.add.graphics();
    // 핑크-라벤더-민트 그라데이션
    bg.fillGradientStyle(0xffc8dd, 0xffc8dd, 0xbde0fe, 0xa2d2ff, 1);
    bg.fillRect(0, 0, width, height);

    // 떠다니는 귀여운 도형들 (발바닥, 하트, 별)
    const particles = this.add.particles(0, 0, 'default', {
      x: { min: 0, max: width },
      y: { min: -20, max: 0 },
      lifespan: 10000,
      speed: { min: 15, max: 50 },
      angle: 90,
      scale: { start: 0.4, end: 0.1 },
      alpha: { start: 0.6, end: 0 },
      tint: [0xffafcc, 0xcdb4db, 0xffc8dd, 0xa2d2ff, 0xbde0fe],
      frequency: 300,
    });
    this.backgroundParticles = particles;

    // 귀여운 구름 모양 장식
    const clouds = [
      { x: width * 0.2, y: height * 0.15, scale: 1 },
      { x: width * 0.7, y: height * 0.25, scale: 0.8 },
      { x: width * 0.5, y: height * 0.8, scale: 0.9 },
    ];

    clouds.forEach(cloud => {
      const cloudGraphics = this.add.graphics();
      cloudGraphics.fillStyle(0xffffff, 0.15);
      // 구름 모양 (3개의 원)
      cloudGraphics.fillCircle(cloud.x - 30 * cloud.scale, cloud.y, 25 * cloud.scale);
      cloudGraphics.fillCircle(cloud.x, cloud.y - 10 * cloud.scale, 30 * cloud.scale);
      cloudGraphics.fillCircle(cloud.x + 30 * cloud.scale, cloud.y, 25 * cloud.scale);

      // 구름 흔들림 애니메이션
      this.tweens.add({
        targets: cloudGraphics,
        y: cloud.y - 10,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // 반짝이는 별
    for (let i = 0; i < 15; i++) {
      const star = this.add.star(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        4,
        8,
        4,
        0xffd700,
        0.3
      );

      this.tweens.add({
        targets: star,
        alpha: { from: 0.2, to: 0.6 },
        scale: { from: 0.8, to: 1.2 },
        duration: 1000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  createPlayer() {
    const { width, height } = this.cameras.main;

    // 컨테이너 생성
    this.player = this.add.container(width / 2, height - 100);

    // 글로우 레이어
    this.glowLayer = this.add.graphics();

    const bodySize = 70;

    // 얼굴 (반려동물 사진 또는 기본 스타일)
    if (this.petImageUrl && this.petImageUrl !== 'default' && this.textures.exists('petFace')) {
      const faceSize = bodySize + 10;

      // 글로우 효과 (컨테이너에 직접 추가)
      const glow = this.add.graphics();
      glow.fillStyle(0xc77dff, 0.15);
      for (let i = 0; i < 3; i++) {
        glow.fillCircle(0, 0, faceSize / 2 + 5 + i * 3);
      }

      // 부드러운 그림자 (캐릭터 아래)
      const shadow = this.add.ellipse(0, faceSize / 2 + 12, faceSize * 0.7, faceSize * 0.2, 0x000000, 0.2);

      // 동그란 마스크 생성 (Scene에 추가하되 visible false로 설정)
      const maskGraphics = this.add.graphics({ x: this.player.x, y: this.player.y });
      maskGraphics.fillStyle(0xffffff);
      maskGraphics.fillCircle(0, 0, faceSize / 2);
      maskGraphics.setVisible(false); // 마스크 그래픽 자체는 보이지 않게

      // 펫 이미지
      const faceImage = this.add.image(0, 0, 'petFace')
        .setDisplaySize(faceSize, faceSize)
        .setOrigin(0.5);

      // 이미지에 마스크 적용
      const mask = maskGraphics.createGeometryMask();
      faceImage.setMask(mask);

      // 파스텔 필터 오버레이 (투명도 낮춤)
      const pastelOverlay = this.add.circle(0, 0, faceSize / 2, 0xffc8dd, 0.05);

      // 흰색/보라색 보더 (3-5px)
      const border1 = this.add.graphics();
      border1.lineStyle(5, 0xffffff, 1);
      border1.strokeCircle(0, 0, faceSize / 2 + 2.5);

      const border2 = this.add.graphics();
      border2.lineStyle(3, 0xc77dff, 1);
      border2.strokeCircle(0, 0, faceSize / 2 + 7);

      // 반짝이 파티클
      const sparkles = this.add.particles(0, 0, 'default', {
        x: { min: -faceSize / 2, max: faceSize / 2 },
        y: { min: faceSize / 2, max: faceSize / 2 + 15 },
        lifespan: 1000,
        speed: { min: 10, max: 30 },
        angle: { min: 250, max: 290 },
        scale: { start: 0.4, end: 0 },
        alpha: { start: 0.8, end: 0 },
        tint: [0xffd700, 0xffc8dd, 0xc77dff, 0xffffff],
        frequency: 150,
      });

      // 올바른 z-order로 컨테이너에 추가: 글로우 -> 그림자 -> 이미지 -> 오버레이 -> 보더
      this.player.add([glow, shadow, faceImage, pastelOverlay, border1, border2, sparkles]);

      // 마스크 그래픽을 player와 함께 움직이도록 업데이트 함수 추가
      this.events.on('update', () => {
        if (this.player && maskGraphics) {
          maskGraphics.setPosition(this.player.x, this.player.y);
        }
      });

      // 둥실둥실 애니메이션
      this.tweens.add({
        targets: this.player,
        y: height - 105,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      // 귀여운 강아지 기본 캐릭터 (배경 없이 깔끔하게)
      const faceSize = bodySize * 0.85;

      // 강아지 얼굴 (흰색 원)
      const face = this.add.circle(0, -5, faceSize / 2, 0xffffff);

      // 강아지 귀 (늘어진 귀)
      const leftEar = this.add.ellipse(-faceSize / 2 + 5, -faceSize / 2 - 5, 20, 30, 0xd4a574);
      const rightEar = this.add.ellipse(faceSize / 2 - 5, -faceSize / 2 - 5, 20, 30, 0xd4a574);

      // 코 (검정)
      const nose = this.add.circle(0, 5, 8, 0x2b2d42);

      // 눈 (반짝반짝)
      const leftEye = this.add.circle(-12, -8, 6, 0x2b2d42);
      const rightEye = this.add.circle(12, -8, 6, 0x2b2d42);
      const leftSparkle = this.add.circle(-10, -11, 2, 0xffffff);
      const rightSparkle = this.add.circle(14, -11, 2, 0xffffff);

      // 입 (귀여운 미소)
      const mouth = this.add.graphics();
      mouth.lineStyle(2, 0xff6b9d, 1);
      mouth.beginPath();
      mouth.moveTo(-8, 12);
      // Phaser의 arc를 사용하여 곡선 그리기
      mouth.arc(0, 10, 10, Math.PI * 0.2, Math.PI * 0.8, false);
      mouth.strokePath();

      // 혀 (약간 삐죽)
      const tongue = this.add.ellipse(0, 16, 6, 8, 0xff9eb3);

      // 반점 (강아지 무늬)
      const spot1 = this.add.circle(-15, -15, 8, 0xd4a574, 0.7);
      const spot2 = this.add.circle(18, -12, 6, 0xd4a574, 0.7);

      // 테두리 (얼굴 주위)
      const border = this.add.graphics();
      border.lineStyle(4, 0xffafcc, 1);
      border.strokeCircle(0, -5, faceSize / 2 + 3);

      this.player.add([
        leftEar, rightEar, face, border,
        spot1, spot2, leftEye, rightEye, leftSparkle, rightSparkle,
        nose, mouth, tongue
      ]);

      // 얼굴 바운스 애니메이션
      this.tweens.add({
        targets: [face, border],
        scaleX: { from: 0.95, to: 1.05 },
        scaleY: { from: 1.05, to: 0.95 },
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // 귀 흔들림
      this.tweens.add({
        targets: [leftEar, rightEar],
        angle: { from: -10, to: 10 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      // 혀 흔들림
      this.tweens.add({
        targets: tongue,
        scaleY: { from: 0.9, to: 1.1 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    }

    // 트레일 이펙트용 그래픽
    this.playerTrail = this.add.graphics();

    this.physics.add.existing(this.player);
    // 플레이어 충돌 박스를 더 작게 설정 (실제 몸통 크기만)
    const hitboxRadius = bodySize * 0.28; // 원래 크기의 28%로 매우 작게
    (this.player.body as Phaser.Physics.Arcade.Body).setCircle(hitboxRadius);
  }

  spawnObstacle() {
    if (this.gameOverFlag) return;

    const { width } = this.cameras.main;
    const x = Phaser.Math.Between(50, width - 50);

    // 장애물 타입 정의 (SVG 사용)
    const obstacleTypes = [
      { key: 'obstacle-paw', shape: 'paw', hitboxSize: 8 },
      { key: 'obstacle-bone', shape: 'bone', hitboxSize: 9 },
      { key: 'obstacle-heart', shape: 'heart', hitboxSize: 8 },
      { key: 'obstacle-fish', shape: 'fish', hitboxSize: 9 },
      { key: 'obstacle-ball', shape: 'ball', hitboxSize: 8 },
    ];
    const type = Phaser.Utils.Array.GetRandom(obstacleTypes);

    // SVG 이미지를 사용한 장애물 생성
    const obstacle = this.add.image(x, -50, type.key);
    this.obstacles?.add(obstacle);
    this.physics.add.existing(obstacle);

    const body = obstacle.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(this.obstacleSpeed);
    // 더 작은 히트박스로 정밀한 충돌 감지
    body.setCircle(type.hitboxSize);

    // 귀여운 흔들림 + 회전 효과
    this.tweens.add({
      targets: obstacle,
      angle: type.shape === 'heart' ? 0 : 360,
      scaleX: { from: 0.95, to: 1.05 },
      scaleY: { from: 0.95, to: 1.05 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 화면 밖으로 나가면 제거
    obstacle.setData('removeCheck', this.time.addEvent({
      delay: 100,
      callback: () => {
        if (obstacle.y > this.cameras.main.height + 100) {
          obstacle.destroy();
        }
      },
      loop: true,
    }));

    // 충돌 체크
    this.physics.add.overlap(this.player!, obstacle, this.hitObstacle, undefined, this);
  }

  spawnPowerup() {
    if (this.gameOverFlag) return;

    const { width } = this.cameras.main;
    const x = Phaser.Math.Between(50, width - 50);

    // 귀여운 파워업 (간식 테마)
    const powerupTypes = [
      { type: 'shield', imageName: 'powerup-shield', name: '물' }, // 실드
      { type: 'slow', imageName: 'powerup-slow', name: '슬로우' }, // 슬로우
    ];
    const powerup = Phaser.Utils.Array.GetRandom(powerupTypes);

    const powerupContainer = this.add.container(x, -50);

    // SVG 이미지 사용
    const powerupImage = this.add.image(0, 0, powerup.imageName);
    powerupImage.setScale(1);

    // 반짝임 효과
    const sparkle1 = this.add.star(-15, -15, 4, 4, 2, 0xffffff, 0.9);
    const sparkle2 = this.add.star(15, -10, 4, 3, 1.5, 0xffffff, 0.7);

    powerupContainer.add([powerupImage, sparkle1, sparkle2]);

    // 반짝임 애니메이션
    [sparkle1, sparkle2].forEach((sparkle, i) => {
      this.tweens.add({
        targets: sparkle,
        alpha: { from: 0.5, to: 1 },
        scaleX: { from: 0.8, to: 1.2 },
        scaleY: { from: 0.8, to: 1.2 },
        duration: 500 + i * 200,
        yoyo: true,
        repeat: -1,
      });
    });

    powerupContainer.setData('type', powerup.type);

    this.powerups?.add(powerupContainer);
    this.physics.add.existing(powerupContainer);

    const body = powerupContainer.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(150);
    body.setCircle(20);

    // 귀여운 흔들림 효과
    this.tweens.add({
      targets: powerupContainer,
      angle: { from: -15, to: 15 },
      scaleX: { from: 0.9, to: 1.1 },
      scaleY: { from: 0.9, to: 1.1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 화면 밖으로 나가면 제거
    powerupContainer.setData('removeCheck', this.time.addEvent({
      delay: 100,
      callback: () => {
        if (powerupContainer.y > this.cameras.main.height + 100) {
          powerupContainer.destroy();
        }
      },
      loop: true,
    }));
  }

  collectPowerup(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    powerupObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  ) {
    const powerup = powerupObj as Phaser.GameObjects.Container & { getData: (key: string) => string };
    const type = powerup.getData('type');

    // 수집 이펙트
    this.tweens.add({
      targets: powerup,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => powerup.destroy(),
    });

    if (type === 'shield') {
      // 실드 효과 (5초간 무적)
      this.isShield = true;

      // 실드 이펙트
      if (!this.shieldGraphics) {
        this.shieldGraphics = this.add.graphics();
      }

      this.time.delayedCall(5000, () => {
        this.isShield = false;
        if (this.shieldGraphics) {
          this.shieldGraphics.clear();
        }
      });
    } else if (type === 'slow') {
      // 슬로우 효과 (5초간 장애물 속도 감소)
      const originalSpeed = this.obstacleSpeed;
      this.obstacleSpeed = Math.max(100, this.obstacleSpeed * 0.5);

      this.time.delayedCall(5000, () => {
        this.obstacleSpeed = originalSpeed;
      });
    }
  }

  increaseDifficulty() {
    if (this.gameOverFlag) return;

    // 속도 증가 (20 → 35로 더 빠르게)
    this.obstacleSpeed += 35;

    // 생성 빈도는 타이머 재생성으로 조정 (더 빠르게 최소값 도달)
    if (this.obstacleTimer) {
      const newDelay = Math.max(250, 700 - (this.score * 15));
      this.obstacleTimer.remove();
      this.obstacleTimer = this.time.addEvent({
        delay: newDelay,
        callback: this.spawnObstacle,
        callbackScope: this,
        loop: true,
      });
    }
  }

  hitObstacle(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    obstacle: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  ) {
    if (this.gameOverFlag) return;

    // 실드 활성화 중이면 장애물만 파괴 (귀여운 폭발 효과)
    if (this.isShield) {
      // 귀여운 폭발 이펙트 (하트와 별)
      const explosion = this.add.particles(
        (obstacle as any).x,
        (obstacle as any).y,
        'default',
        {
          speed: { min: 80, max: 200 },
          scale: { start: 0.8, end: 0 },
          alpha: { start: 1, end: 0 },
          tint: [0xffafcc, 0xffc8dd, 0xa8dadc, 0xffd700],
          lifespan: 600,
          quantity: 15,
        }
      );

      this.time.delayedCall(600, () => explosion.destroy());
      obstacle.destroy();
      return;
    }

    this.gameOverFlag = true;
    this.physics.pause();

    // 타이머 중지
    this.obstacleTimer?.remove();
    this.difficultyTimer?.remove();

    // 게임 오버 화면 (귀여운 스타일)
    const { width, height } = this.cameras.main;

    // 파스텔 오버레이
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0xffc8dd, 0.7);

    // 귀여운 배경 장식 (하트들)
    for (let i = 0; i < 10; i++) {
      const heartX = Phaser.Math.Between(0, width);
      const heartY = Phaser.Math.Between(0, height);
      const heart = this.add.star(heartX, heartY, 5, 15, 7, 0xffafcc, 0.3);

      this.tweens.add({
        targets: heart,
        y: heartY - 50,
        alpha: { from: 0.3, to: 0 },
        duration: 2000 + Math.random() * 1000,
        repeat: -1,
      });
    }

    // 게임 오버 텍스트 (귀여운 효과)
    const gameOverText = this.add.text(width / 2, height / 2 - 80, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff6b9d',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 8,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#ffafcc',
        blur: 10,
        fill: true,
      },
    }).setOrigin(0.5);

    // 점수 텍스트
    const scoreText = this.add.text(width / 2, height / 2, `최종 점수: ${Math.floor(this.score)}초`, {
      fontSize: '36px',
      color: '#a8dadc',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 5,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#bde0fe',
        blur: 8,
        fill: true,
      },
    }).setOrigin(0.5);

    // 재시작 안내
    const restartText = this.add.text(width / 2, height / 2 + 80, '클릭하여 재시작 ♡', {
      fontSize: '28px',
      color: '#cdb4db',
      fontStyle: 'bold',
      stroke: '#ffffff',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // 귀여운 장식 별들
    const star1 = this.add.star(width / 2 - 160, height / 2 - 80, 5, 20, 10, 0xffd700, 1);
    const star2 = this.add.star(width / 2 + 160, height / 2 - 80, 5, 20, 10, 0xffd700, 1);

    // 텍스트 애니메이션
    this.tweens.add({
      targets: gameOverText,
      scaleX: { from: 0.95, to: 1.05 },
      scaleY: { from: 0.95, to: 1.05 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: restartText,
      alpha: { from: 0.6, to: 1 },
      scaleY: { from: 0.98, to: 1.02 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: [star1, star2],
      angle: 360,
      scaleX: { from: 0.8, to: 1.2 },
      scaleY: { from: 0.8, to: 1.2 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
    });

    // 재시작 입력
    this.input.once('pointerdown', () => {
      this.scene.restart({ petImageUrl: this.petImageUrl });
    });

    // 부모 컴포넌트에 게임 오버 알림 (소수점 1자리)
    const finalScore = parseFloat(this.score.toFixed(1));
    this.events.emit('gameOver', finalScore);
  }

  update() {
    if (this.gameOverFlag || !this.player) return;

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const { width } = this.cameras.main;

    // 귀여운 실드 효과 (물방울 보호막)
    if (this.isShield && this.shieldGraphics) {
      this.shieldGraphics.clear();

      const time = this.time.now / 1000;
      const pulse = Math.sin(time * 4) * 0.15 + 0.85;

      // 물방울 실드 링
      this.shieldGraphics.lineStyle(6, 0xa8dadc, 0.6 * pulse);
      this.shieldGraphics.strokeCircle(this.player.x, this.player.y, 80);

      this.shieldGraphics.lineStyle(4, 0xbde0fe, 0.8 * pulse);
      this.shieldGraphics.strokeCircle(this.player.x, this.player.y, 75);

      this.shieldGraphics.lineStyle(2, 0xffffff, 1 * pulse);
      this.shieldGraphics.strokeCircle(this.player.x, this.player.y, 70);

      // 반짝이는 물방울들
      const dropCount = 8;
      for (let i = 0; i < dropCount; i++) {
        const angle = (Math.PI * 2 / dropCount) * i + time * 2;
        const x = this.player.x + Math.cos(angle) * 75;
        const y = this.player.y + Math.sin(angle) * 75;
        const size = 3 + Math.sin(time * 3 + i) * 1.5;

        this.shieldGraphics.fillStyle(0xa8dadc, 0.7 * pulse);
        this.shieldGraphics.fillCircle(x, y, size);
        this.shieldGraphics.fillStyle(0xffffff, 0.5);
        this.shieldGraphics.fillCircle(x - 1, y - 1, size * 0.5);
      }
    }

    // 귀여운 이동 트레일 (작은 원)
    if (this.playerTrail && Math.abs(playerBody.velocity.x) > 50) {
      this.playerTrail.clear();

      const trailLength = 5;
      for (let i = 0; i < trailLength; i++) {
        const alpha = (1 - i / trailLength) * 0.5;
        const offsetX = -playerBody.velocity.x * 0.05 * (i + 1);
        const size = (8 - i * 1.2);

        // 작은 파스텔 원 트레일
        this.playerTrail.fillStyle(0xffafcc, alpha);
        this.playerTrail.fillCircle(this.player.x + offsetX, this.player.y, size);

        // 반짝이는 중심
        this.playerTrail.fillStyle(0xffffff, alpha * 0.6);
        this.playerTrail.fillCircle(this.player.x + offsetX - 1, this.player.y - 1, size * 0.4);
      }
    }

    // 키보드 입력 처리
    if (this.cursors?.left.isDown || this.wasd?.A.isDown || this.mobileDirection === 'left') {
      playerBody.setVelocityX(-300);
    } else if (this.cursors?.right.isDown || this.wasd?.D.isDown || this.mobileDirection === 'right') {
      playerBody.setVelocityX(300);
    } else if (this.isTouching) {
      // 터치 입력 처리 (드래그) - 계속 움직이도록 수정
      const playerX = this.player.x;
      const diff = this.touchX - playerX;

      // 터치 위치가 플레이어보다 왼쪽/오른쪽에 있으면 계속 움직임
      if (diff < -5) {
        playerBody.setVelocityX(-300);
      } else if (diff > 5) {
        playerBody.setVelocityX(300);
      } else {
        // 거의 도달했을 때만 정지
        playerBody.setVelocityX(0);
      }
    } else {
      playerBody.setVelocityX(0);
    }

    // 화면 경계 제한
    this.player.x = Phaser.Math.Clamp(this.player.x, 30, width - 30);
  }
}
