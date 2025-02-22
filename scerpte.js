// امپورت کتابخانه kaboom.js
kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
  });
  
  // لود منابع
  loadRoot('https://i.imgur.com/');
  loadSprite('mario', 'Wb1qfhK.png');
  loadSprite('block', 'M6rwarW.png');
  loadSprite('ground1', 'https://i.imgur.com/qojJ0sb.png');
  loadSprite('ground2', 'https://i.imgur.com/qojJ0sb.png');
  loadSprite('ground3', 'https://i.imgur.com/qojJ0sb.png');
  loadSprite('ground4', 'https://i.imgur.com/qojJ0sb.png');
  loadSprite('ground5', 'https://i.imgur.com/qojJ0sb.png');
  
  // تنظیمات بازی
  const MOVE_SPEED = 120;
  const JUMP_FORCE = 360;
  const FALL_DEATH = 400;
  let CURRENT_LEVEL = 0;
  
  // سطح‌ها
  const LEVELS = [
    [
      '                             ',
      '                             ',
      '         ===                 ',
      '                             ',
      '                             ',
      '           ===               ',
      '                             ',
      '   @                         ',
      'xxx|xxx|xxx|xxx|xxx|xxx|xxx|x',
    ],
    [
      '                             ',
      '                             ',
      '         ==                  ',
      '                             ',
      '                             ',
      '           ==                ',
      '                             ',
      '     @                       ',
      'xxx|xxx|xxx|xxx|xxx|xxx|xxx|x',
    ],
    [
      '                             ',
      '                             ',
      '         ===                 ',
      '                             ',
      '                             ',
      '           ===               ',
      '                             ',
      '   @                         ',
      'xxx|xxx|xxx|xxx|xxx|xxx|xxx|x',
    ],
    [
      '                             ',
      '                             ',
      '         ==                  ',
      '                             ',
      '                             ',
      '           ==                ',
      '                             ',
      '     @                       ',
      'xxx|xxx|xxx|xxx|xxx|xxx|xxx|x',
    ],
    [
      '                             ',
      '                             ',
      '         ===                 ',
      '                             ',
      '                             ',
      '           ===               ',
      '                             ',
      '   @                         ',
      'xxx|xxx|xxx|xxx|xxx|xxx|xxx|x',
    ]
  ];
  
  // سوالات مرتبط با رشته کامپیوتری
  const questions = [
    'وظیفه اصلی CPU چیست؟',
    'RAM مخفف چیست؟',
    'الگوریتم چیست؟',
    'تفاوت بین سخت‌افزار و نرم‌افزار چیست؟',
    'زبان برنامه‌نویسی چیست؟',
  ];
  
  // تنظیم سطوح
  scene('game', ({ levelId }) => {
    layers(['bg', 'obj', 'ui'], 'obj');
  
    const groundSprite = `ground${levelId + 1}`;
    add([sprite(groundSprite), layer('bg')]);
  
    const level = addLevel(LEVELS[levelId], {
      width: 20,
      height: 20,
      'x': [sprite('block'), solid()],
      '@': [sprite('mario'), body(), 'player'],
    });
  
    const player = get('player')[0];
  
    player.action(() => {
      camPos(player.pos);
      if (player.pos.y >= FALL_DEATH) {
        go('lose');
      }
    });
  
    player.collides('x', () => {
      // سوال تصادفی
      const question = questions[Math.floor(Math.random() * questions.length)];
      alert(question);  // سوال را نشان بدهد
      player.move(-MOVE_SPEED, 0);  // بازیکن را به عقب حرکت دهد
    });
  
    keyDown('left', () => {
      player.move(-MOVE_SPEED, 0);
    });
  
    keyDown('right', () => {
      player.move(MOVE_SPEED, 0);
    });
  
    keyPress('space', () => {
      if (player.grounded()) {
        player.jump(JUMP_FORCE);
      }
    });
  
    keyPress('up', () => {
      if (player.grounded()) {
        player.jump(JUMP_FORCE);
      }
    });
  
    player.collides('pipe', () => {
      if (levelId < LEVELS.length - 1) {
        go('game', { levelId: levelId + 1 });
      } else {
        alert('تبریک! شما بازی را به پایان رساندید!');
      }
    });
  
    // کنترل‌های لمسی
    mouseClick(() => {
      if (mousePos().x < width() / 2) {
        player.move(-MOVE_SPEED, 0);
      } else {
        player.move(MOVE_SPEED, 0);
      }
    });
  
    mouseDown(() => {
      if (player.grounded()) {
        player.jump(JUMP_FORCE);
      }
    });
  });
  
  // شروع بازی
  start('game', { levelId: CURRENT_LEVEL });
  