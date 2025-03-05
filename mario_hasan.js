// تنظیمات اولیه بازی
kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

// ثابت‌های مرتبط با سرعت حرکت و نیروی پرش
const MOVE_SPEED = 120;
const JUMP_FORCE = 360;
const BIG_JUMP_FORCE = 550;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
let isJumping = true;
const FALL_DEATH = 400;

// سوالات کامپیوتری برای بازی
const computerQuestions = [
  {
    question: "وظیفه اصلی سیستم‌عامل چیست؟",
    answer: "مدیریت منابع",
  },
  {
    question: "واحد اصلی اطلاعات در رایانه چیست؟",
    answer: "بیت",
  },
  {
    question: "وظیفه یک CPU چیست؟",
    answer: "پردازش داده‌ها",
  },
  {
    question: "تفاوت RAM و ROM چیست؟",
    answer: "RAM حافظه فرار است، ROM حافظه غیرفرار",
  },
  {
    question: "HTTP مخفف چیست؟",
    answer: "HyperText Transfer Protocol",
  },
];

// بارگذاری تصاویر مربوط به اشیا بازی
loadRoot('https://i.imgur.com/');
loadSprite('coin', 'wbKxhcd.png');
loadSprite('evil-shroom', 'KPO3fR9.png');
loadSprite('brick', 'pogC9x5.png');
loadSprite('block', 'M6rwarW.png');
loadSprite('mario', 'Wb1qfhK.png');
loadSprite('mushroom', '0wMd92p.png');
loadSprite('surprise', 'gesQ1KP.png');
loadSprite('unboxed', 'bdrLpi6.png');
loadSprite('pipe-top-left', 'ReTPiWY.png');
loadSprite('pipe-top-right', 'hj2GK4n.png');
loadSprite('pipe-bottom-left', 'c1cYSbt.png');
loadSprite('pipe-bottom-right', 'nqQ79eI.png');
loadSprite('blue-block', 'fVscIbn.png');
loadSprite('blue-brick', '3e5YRQd.png');
loadSprite('blue-steel', 'gqVoI2b.png');
loadSprite('blue-evil-shroom', 'SvV4ueD.png');
loadSprite('blue-surprise', 'RMqCc1G.png');

// تعریف بازیکن خارج از تابع صحنه بازی
let player;

scene("game", ({ level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj');

  // تعریف نقشه‌های بازی
  const maps = [
    [
      '                                      ',
      '                                      ',
      '                                      ',
      '                                      ',
      '                                      ',
      '     %   =*=%=                        ',
      '                                      ',
      '                            -+        ',
      '                    ^   ^   ()        ',
      '==============================   =====',
    ],
    [
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£                                       £',
      '£        @@@@@@              x x        £',
      '£                          x x x        £',
      '£                        x x x x  x   -+£',
      '£               z   z  x x x x x  x   ()£',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    ],
    [
      '                                      ',
      '                                      ',
      '                                      ',
      '                                      ',
      '                                      ',
      '     @   =*=@=                        ',
      '                                      ',
      '                         -+           ',
      '                     ^   ^   ()       ',
      '===============================  =====',
    ],
    [
      '                                      ',
      '                                      ',
      '                                      ',
      '         @@@@@@                       ',
      '      *    *    *                     ',
      '    *     *     *                     ',
      '   *      *      *                    ',
      '  *       *       *                   ',
      '££££££££££££££££££££££££££££££££££££££',
    ],
    [
      '                                        ',
      '                                        ',
      '                 %%%%%%%                ',
      '               %%%%%%%%%%%              ',
      '             %%%%%%%%%%%%%%%            ',
      '           %%%%%%%%%%%%%%%%%%%          ',
      '         %%%%%%%%%%%%%%%%%%%%%%%        ',
      '       %%%%%%%%%%%%%%%%%%%%%%%%%%%      ',
      '     %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    ',
      '£££££££££££££££££££££££££££££££££££££££',
    ],
  ];

  // تنظیمات نقشه بازی
  const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('block'), solid()],
    '$': [sprite('coin'), 'coin'],
    '%': [sprite('surprise'), solid(), 'coin-surprise', 'question-block'],
    '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
    '}': [sprite('unboxed'), solid()],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
    '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
    '^': [sprite('evil-shroom'), solid(), 'dangerous'],
    '#': [sprite('mushroom'), solid(), 'mushroom', body()],
    '!': [sprite('blue-block'), solid(), scale(0.5)],
    '£': [sprite('blue-brick'), solid(), scale(0.5)],
    'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
    '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
    'x': [sprite('blue-steel'), solid(), scale(0.5)],
  };

  // ایجاد سطح بازی
  const gameLevel = addLevel(maps[level], levelCfg);

  // برچسب امتیاز
  const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer('ui'),
    {
      value: score,
    }
  ]);

  // برچسب سطح
  add([text('level ' + parseInt(level + 1)), pos(40, 6)]);

  // تابع تغییر حالت بزرگ بازیکن
  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);
        timer = time;
        isBig = true;
      }
    };
  }

  // ایجاد بازیکن
  player = add([
    sprite('mario'), solid(),
    pos(30, 0),
    body(),
    big(),
    origin('bot')
  ]);

  // کنترل حرکت و پرش
  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0);
  });

  keyPress('up', () => {
    if (player.grounded()) {
      isJumping = true
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

  if (player.grounded()) {
    isJumping = true;
    player.jump(CURRENT_JUMP_FORCE);
  }

  // تشخیص فرود
  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  });

  action('mushroom', (m) => {
    m.move(20, 0);
  });

  // برخورد بازیکن با موانع
  player.on("headbump", (obj) => {
    if (obj.is('coin-surprise') || obj.is('mushroom-surprise')) {
      const randomIndex = Math.floor(Math.random() * computerQuestions.length);
      const userQuestion = computerQuestions[randomIndex].question;
      const correctAnswer = computerQuestions[randomIndex].answer;
      const userAnswer = prompt(userQuestion);
      if (userAnswer === correctAnswer) {
        if (obj.is('coin-surprise')) {
          gameLevel.spawn('$', obj.gridPos.sub(0, 1));
        } else if (obj.is('mushroom-surprise')) {
          gameLevel.spawn('#', obj.gridPos.sub(0, 1));
          player.biggify(6);
        }
      }
      destroy(obj);
      gameLevel.spawn('}', obj.gridPos.sub(0, 0));
    } else {
        // اجازه می‌دهد که بازیکن ادامه دهد حتی اگر پاسخ نادرست باشد
    }
  });

  // برخورد بازیکن با قارچ
  player.collides('mushroom', (m) => {
    destroy(m);
    player.biggify(6);
  });

  // برخورد بازیکن با سکه
  player.collides('coin', (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  });

  // سرعت دشمنان
  const ENEMY_SPEED = 20;

  // حرکت دشمنان
  action('dangerous', (d) => {
    d.move(-ENEMY_SPEED, 0);
  });

  // برخورد بازیکن با دشمنان
  player.collides('dangerous', (d) => {
    if (player.pos.y < d.pos.y) {
      // اگر بازیکن از بالا برخورد کند دشمن را نابود کن
      destroy(d);
    } else {
      // اگر برخورد از بغل یا پایین بود بازیکن بازنده می‌شود
      go('lose', { score: scoreLabel.value });
    }
  });

  // به‌روزرسانی موقعیت دوربین نسبت به بازیکن
  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      go('lose', { score: scoreLabel.value });
    }
  });

  // برخورد بازیکن با لوله‌ها
  player.collides('pipe', () => {
    keyPress('down', () => {
      if (player.grounded()) {
        go('game', {
          level: (level + 1) % maps.length,
          score: scoreLabel.value
        });
      }
    });
  });
});

// تعریف صحنه باخت
scene('lose', ({ score }) => {
  add([
    text(score, 32),
    origin('center'),
    pos(width() / 2, height() / 2)
  ]);
});

// شروع بازی
start("game", { level: 0, score: 0 });

// افزودن کنترل‌های لمسی برای حرکت و پرش
const touchLeft = document.getElementById('touchLeft');
const touchRight = document.getElementById('touchRight');
const touchJump = document.getElementById('touchJump');

touchLeft.addEventListener('touchstart', () => {
  player.move(-MOVE_SPEED, 0);
});

touchRight.addEventListener('touchstart', () => {
  player.move(MOVE_SPEED, 0);
});

touchJump.addEventListener('touchstart', () => {
  if (player.grounded()) {
    isJumping = true;
    player.jump(CURRENT_JUMP_FORCE);
  }
});
