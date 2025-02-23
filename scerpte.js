// import kaboom from "kaboom"; // وارد کردن کتابخانه Kaboom


// Initialize Kaboom
kaboom(); // شروع به کار Kaboom

// Load assets
loadSprite("mario", "sprites/mario.png"); // بارگذاری تصویر ماریو
loadSprite("block", "sprites/block.png"); // بارگذاری تصویر بلوک
loadSprite("background1", "sprites/background1.png"); // بارگذاری پس‌زمینه مرحله ۱
loadSprite("background2", "sprites/background2.png"); // بارگذاری پس‌زمینه مرحله ۲
loadSprite("background3", "sprites/background3.png"); // بارگذاری پس‌زمینه مرحله ۳
loadSprite("background4", "sprites/background4.png"); // بارگذاری پس‌زمینه مرحله ۴
loadSprite("background5", "sprites/background5.png"); // بارگذاری پس‌زمینه مرحله ۵

// Define levels
const levels = [ // تعریف مراحل بازی
    [
        "              ",
        "              ",
        "    xxxx      ",
        "              ",
        "        xxxx  ",
        "              ",
        "              ",
        "xxxxxxxxxxxxxx",
    ],
    [
        "          xxxx",
        "              ",
        "xxxx          ",
        "              ",
        "      xxxx    ",
        "              ",
        "              ",
        "xxxxxxxxxxxxxx",
    ],
    [
        "xxxx          ",
        "              ",
        "          xxxx",
        "              ",
        "    xxxx      ",
        "              ",
        "              ",
        "xxxxxxxxxxxxxx",
    ],
    [
        "    xxxx      ",
        "              ",
        "      xxxx    ",
        "              ",
        "xxxx          ",
        "              ",
        "          xxxx",
        "xxxxxxxxxxxxxx",
    ],
    [
        "              ",
        "              ",
        "xxxxxxxxxxxxxx",
        "              ",
        "        xxxx  ",
        "              ",
        "    xxxx      ",
        "xxxxxxxxxxxxxx",
    ]
];

const questions = [ //  سوالات مربوط به رشته کامپیوتر
    "HTML مخفف چیست؟",
    "هدف اصلی CSS چیست؟",
    "جاوا اسکریپت برای چه استفاده می‌شود؟",
    "مفهوم پایگاه داده را توضیح دهید.",
    "تفاوت بین توسعه فرانت‌اند و بک‌اند چیست؟"
];

const backgrounds = [ // تعریف پس‌زمینه‌های مراحل
    "background1",
    "background2",
    "background3",
    "background4",
    "background5",
];

let currentLevel = 0; // سطح فعلی بازی

const loadLevel = (levelIndex) => { // تابع برای بارگذاری سطح بازی
    layers(["bg", "game", "ui"], "game"); // تعریف لایه‌ها
    add([ // افزودن پس‌زمینه به سطح
        sprite(backgrounds[levelIndex]),
        scale(width() / 240, height() / 240),
        origin("topleft"),
        layer("bg"),
    ]);
    addLevel(levels[levelIndex], { // افزودن سطح به بازی
        width: 20,
        height: 20,
        "x": () => [
            sprite("block"),
            area(),
            solid(),
            "block",
        ],
    });
};

// Add Mario
const mario = add([ // افزودن شخصیت ماریو به بازی
    sprite("mario"),
    pos(0, 0),
    body(),
]);

// Define actions
onUpdate(() => { // تعریف اقدامات بازی
    if (mario.pos.y > height()) { // اگر ماریو به پایین صفحه بیفتد
        go("game"); // بازی را مجددا شروع کن
    }
});

// Define controls
onKeyPress("space", () => { // تعریف کلید کنترل بازی
    if (mario.grounded()) { // اگر ماریو روی زمین است
        mario.jump(); // پرش ماریو
    }
});

// Collision with block
mario.collides("block", (b) => { // تعریف برخورد ماریو با بلوک
    const question = questions[currentLevel]; // گرفتن سوال مربوط به سطح فعلی
    destroy(b); // از بین بردن بلوک
    alert(question); // نمایش سوال
});

// Mobile controls
onTouchStart(() => { // تعریف کنترل لمسی برای موبایل
    if (mario.grounded()) { // اگر ماریو روی زمین است
        mario.jump(); // پرش ماریو
    }
});

onTouchEnd(() => { // تعریف حرکت ماریو با پایان لمس
    mario.move(200, 0); // حرکت ماریو به سمت جلو
});

// Scene management
scene("game", () => { // تعریف صحنه بازی
    loadLevel(currentLevel); // بارگذاری سطح فعلی
});
// Level completion
mario.action(() => { // تعریف اقدامات ماریو
    if (mario.pos.x > width()) { // اگر ماریو از عرض صفحه عبور کند
        currentLevel++; // افزایش سطح فعلی
        if (currentLevel < levels.length) { // اگر سطح فعلی کمتر از تعداد مراحل باشد
            go("game"); // به مرحله بعد برو
        } else {
            // End game logic
            add([
                text("تبریک! شما بازی را به اتمام رساندید."),
                pos(width() / 2, height() / 2),
                origin("center"),
            ]);
        }
    }
});

go("game"); // شروع بازی