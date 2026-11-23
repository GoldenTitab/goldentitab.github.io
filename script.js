(function () {
    'use strict';

    // Formspree endpoint ID for the contact form. If empty, the form falls back to the visitor's email app.
    var FORMSPREE_ID = "xkjrprpb";
    // Site music file: sent by Ali 2026-11-23 — Odysseus_KLICKAUD.mp3 (8:41, 7.1 MB, loop, preload=none).
    var MUSIC_SRC = "/audio/Odysseus_KLICKAUD.mp3";

    var HERO_STEPS = 30; // scroll-frame hero: 30 steps simulated from 3 key images (not 240 JPGs)

    // ===== TRANSLATIONS (EN + FA, every string on all 3 pages) =====
    var translations = {
        en: {
            pageTitleIndex: 'Ali D. Shah — UI/UX Designer & Flutter Developer',
            pageTitleExperience: 'Journey — Ali D. Shah',
            pageTitleWorld: 'World — Ali D. Shah',
            pageTitle404: '404 — Page not found — Ali D. Shah',
            skipLink: 'Skip to main content',
            navLabel: 'Main navigation',
            menuLabel: 'Menu',
            navIndex: 'Index', navProjects: 'Projects', navContact: 'Contact', navJourney: 'Journey', navWorld: 'World',
            menuOpenLabel: 'Open menu', menuCloseLabel: 'Close menu',
            themeToggleLabel: 'Switch theme', langToggleLabel: 'Switch to Persian', langAnnounce: 'Language switched to English',
            backToTopLabel: 'Back to top',
            gateEyebrow: 'A designer & developer portfolio',
            gateEnter: 'Enter', gateEnterSilent: 'Enter without audio',
            avatarAlt: 'Ali D. Shah',
            heroEyebrow: 'Available for freelance',
            heroName: 'Ali D. Shah — Designer & Developer',
            heroTitle: 'Designer & Developer',
            heroCreating: 'Creating the', heroUnexpected: 'unexpected',
            heroSub: 'Computer Engineering student building simple, intuitive digital experiences. Focused on UI/UX Design, Flutter, and Product Thinking.',
            heroCta1: 'View Projects', heroCta2: 'GitHub Profile', heroWorldLink: 'Enter the World',
            scrollHint: 'scroll',
            levelMaster: 'Master', levelAdvanced: 'Advanced', levelIntermediate: 'Intermediate', levelBeginner: 'Beginner',
            phName: 'Your name', phEmail: 'your@email.com', phMessage: 'Tell me about your project...', backHome: 'Back to home', musicLabel: 'Toggle music',
            aboutLabel: 'About', aboutTitle: 'Who I am',
            aboutP1: 'I\'m a <strong>Computer Engineering student</strong> at Vali-e-Asr University of Rafsanjan, passionate about the intersection of technology and design.',
            aboutP2: 'My journey started with <strong>HTML &amp; CSS</strong> and basic JavaScript, then expanded into WordPress, UI/UX design with Figma, and now <strong>Flutter &amp; Dart</strong> for mobile apps.',
            aboutP3: 'I believe good design is invisible — it guides people naturally without getting in the way.',
            aboutP4: 'When I\'m not coding, you\'ll find me watching movies and series, listening to music, or learning English and German.',
            stat1Num: '4+', stat1Label: 'Years learning', stat2Num: '8+', stat2Label: 'Projects built',
            skillsLabel: 'Capabilities', skillsTitle: 'What I work with',
            skillsSubtitle: 'Tools and technologies I use to bring ideas to life',
            skillGroup1: 'UI / UX', skillGroup2: 'Front-End', skillGroup3: 'Mobile & Dev', skillGroup4: 'Tools', skillGroup5: 'Soft Skills', skillGroup6: 'Learning',
            projectsLabel: 'Selected Works', projectsTitle: 'Things I\'ve built',
            projectsSubtitle: 'A selection of projects I\'ve worked on recently',
            filtersLabel: 'Filter projects',
            projectsCarouselLabel: 'Projects',
            stackPrevLabel: 'Previous project',
            stackNextLabel: 'Next project',
            filterAll: 'All', filterFlutter: 'Flutter', filterWeb: 'Web', filterDart: 'Dart', filterDesign: 'Design',
            projectOpenCta: 'View repository ↗',
            project1Alt: 'German language learning illustration: open book and flashcards',
            project2Alt: 'Anime franchise tracker illustration: poster shelf with progress bars',
            project3Alt: 'Music player illustration: headphones, vinyl and sound waves',
            project4Alt: 'Pirate adventure illustration: straw hat on a ship deck',
            project5Alt: 'Titab AI Telegram Bot illustration: robot assistant chatting in a messaging app',
            project6Alt: 'Dart CLI Calculator illustration: pocket calculator on a desk with a notebook',
            project7Alt: 'Dart Fundamentals Exercises illustration: stepping-stone learning path with a laptop',
            project8Alt: 'Gibberish Decoder illustration: scattered keyboard keys becoming an orderly keyboard',
            project1Name: 'German Pronunciation & Language Learning',
            project1Desc: 'Single-page web app for learning German from A0 to C1: vocabulary, grammar, verbs, cases, reading, quizzes, spaced-repetition flashcards and a pronunciation masterclass.',
            project2Name: 'Aurora — Anime Franchise Tracker',
            project2Desc: 'Offline-first anime franchise tracker built with Flutter: seasons, movies and OVAs grouped under one franchise, with data from AniList and MyAnimeList and a Persian (RTL) interface.',
            project3Name: 'Aurora Music Player',
            project3Desc: 'Flutter music player with online streaming, Firebase authentication, light and dark themes, a Persian (RTL) interface and full player controls.',
            project4Name: 'Monkey D. Luffy Fan Site',
            project4Desc: 'Fan-made biography website for Monkey D. Luffy from One Piece, with a light/dark theme, scroll animations and a responsive Persian (RTL) layout.',
            project5Name: 'Titab AI Telegram Bot',
            project5Desc: 'Telegram bot that answers with an AI model: raw Telegram Bot API long polling, per-chat memory, and Hugging Face chat completions, with tokens kept in a local .env file.',
            project6Name: 'Dart CLI Calculator',
            project6Desc: 'Command-line calculator in Dart with an interactive prompt, operator input, and clean exit handling.',
            project7Name: 'Dart Fundamentals Exercises',
            project7Desc: 'A 23-exercise path through Dart fundamentals: input handling, collections, classes, and small console programs.',
            project8Name: 'Gibberish Decoder',
            project8Desc: 'Chrome extension that fixes text typed on the wrong keyboard layout (Persian ↔ English) in chat boxes, plus Persian half-spaces and number conversion. Fully local, no text sent to any server.',
            journeyLabel: 'Journey', journeyTitle: 'How I got here',
            journeySubtitle: 'My path from beginner to where I am today',
            journeyTeaserText: 'From C and Java at university to Flutter, UI/UX and product design — six stops along the way.',
            journeyTeaserCta: 'View the timeline ↗',
            journey1Year: '2022', journey1Title: 'Started Programming', journey1Desc: 'Began learning C and Java at university. Built my first console applications.',
            journey2Year: '2023', journey2Title: 'Started Web Development', journey2Desc: 'Learned HTML, CSS and the basics of JavaScript. Built first landing pages and responsive websites.',
            journey3Year: '2024', journey3Title: 'Expanded into UI/UX Design', journey3Desc: 'Dove deep into UI/UX with Figma. Started building interactive prototypes and applied software engineering principles.',
            journey4Year: '2025', journey4Title: 'Learning WordPress', journey4Desc: 'Built websites and learned how to customize them using the Elementor plugin.',
            journey5Year: '2026', journey5Title: 'Learning Flutter & Dart', journey5Desc: 'Building mobile apps and working toward becoming a Product Designer. Exploring cross-platform development.',
            journey6Year: '2027', journey6Title: 'Product Designer', journey6Desc: 'Goal: ship real products, build a personal brand, launch a freelance career, and contribute to open-source.',
            worldLabel: 'World', worldTitle: 'The World',
            worldSubtitle: 'Drag the globe to explore, then browse every project below.',
            globeLabel: 'Rotating wireframe globe',
            worldHint: 'Drag to rotate', worldNote: 'Tiles use the existing project artwork.',
            worldCta: 'View all projects ↗',
            contactLabel: 'Contact', contactTitle: 'Let\'s work together',
            contactSubtitle: 'Have a project in mind? Let\'s discuss how we can collaborate',
            contactHeading: 'Get in touch',
            contactDesc: 'Open to freelance projects, collaborations, and internship opportunities. I\'m always excited to work on new challenges.',
            contactEmail: 'Email', contactLocation: 'Location', contactLocationValue: 'Kerman, Iran',
            formName: 'Name', formEmail: 'Email', formScope: 'Project scope',
            scopeFreelance: 'Freelance project', scopeCollab: 'Collaboration', scopeInternship: 'Internship', scopeOther: 'Other',
            formMessage: 'Message', formSubmit: 'Send Message',
            formSending: 'Sending…', formSent: 'Message sent — thank you!',
            formFallback: 'Formspree is not set up yet — opening your email app instead.',
            formError: 'Something went wrong. Please email me directly.',
            musicOff: 'Music: Off', musicOn: 'Music: On', musicPending: 'Music: Off — file pending',
            footerGithubLabel: 'GitHub',
            footerEmailLabel: 'Email',
            footerTwitterLabel: 'Twitter',
            footerInstagramLabel: 'Instagram',
            footerTelegramLabel: 'Telegram',
            footerText: 'built by Ali D. Shah — Kerman, Iran',
            error404Label: 'Error',
            error404Title: 'Page not found',
            error404Desc: 'The page you are looking for does not exist or has moved.',
            error404Cta: 'Back to home ↗'
        },
        fa: {
            pageTitleIndex: 'علی د. شاه — طراح UI/UX و توسعه‌دهنده فلاتر',
            pageTitleExperience: 'مسیر — علی د. شاه',
            pageTitleWorld: 'دنیا — علی د. شاه',
            pageTitle404: '۴۰۴ — صفحه یافت نشد — علی د. شاه',
            skipLink: 'رفتن به محتوای اصلی',
            navLabel: 'ناوبری اصلی',
            menuLabel: 'منو',
            navIndex: 'خانه', navProjects: 'پروژه‌ها', navContact: 'تماس', navJourney: 'مسیر', navWorld: 'دنیا',
            menuOpenLabel: 'باز کردن منو', menuCloseLabel: 'بستن منو',
            themeToggleLabel: 'تغییر تم', langToggleLabel: 'تغییر به انگلیسی', langAnnounce: 'زبان به فارسی تغییر کرد',
            backToTopLabel: 'برگشت به بالا',
            gateEyebrow: 'پورتفولیوی طراح و توسعه‌دهنده',
            gateEnter: 'ورود', gateEnterSilent: 'ورود بدون صدا',
            avatarAlt: 'علی د. شاه',
            heroEyebrow: 'آماده همکاری فریلنسری',
            heroName: 'علی د. شاه — طراح و توسعه‌دهنده',
            heroTitle: 'طراح و توسعه‌دهنده',
            heroCreating: 'خلقِ', heroUnexpected: 'غیرمنتظره',
            heroSub: 'دانشجوی مهندسی کامپیوتر که تجربه‌های دیجیتالی ساده و کاربرپسند می‌سازد. تخصصم در طراحی UI/UX، فلاتر و تفکر محصول‌محور است.',
            heroCta1: 'مشاهده پروژه‌ها', heroCta2: 'پروفایل گیت‌هاب', heroWorldLink: 'ورود به دنیا',
            scrollHint: 'اسکرول',
            levelMaster: 'حرفه‌ای', levelAdvanced: 'پیشرفته', levelIntermediate: 'متوسط', levelBeginner: 'مبتدی',
            phName: 'نام شما', phEmail: 'you@example.com', phMessage: 'درباره پروژه‌ات بگو...', backHome: 'بازگشت به خانه', musicLabel: 'روشن/خاموش کردن موزیک',
            aboutLabel: 'درباره من', aboutTitle: 'کی هستم',
            aboutP1: 'من یک <strong>دانشجوی مهندسی کامپیوتر</strong> در دانشگاه ولی‌عصر رفسنجان هستم که به نقطه تلاقی فناوری و طراحی علاقه دارم.',
            aboutP2: 'مسیرم از <strong>HTML و CSS</strong> و جاوااسکریپت پایه شروع شد، سپس به وردپرس، طراحی UI/UX با فیگما و الان <strong>فلاتر و دارت</strong> برای اپ‌های موبایل رسیده.',
            aboutP3: 'باورم اینه که طراحی خوب دیده نمی‌شه — بدون دردسر، آدم‌ها رو هدایت می‌کنه.',
            aboutP4: 'وقتی کدنویسی نمی‌کنم، فیلم و سریال می‌بینم، موسیقی گوش می‌دم یا زبان انگلیسی و آلمانی یاد می‌گیرم.',
            stat1Num: '۴+', stat1Label: 'سال یادگیری', stat2Num: '۸+', stat2Label: 'پروژه تموم‌شده',
            skillsLabel: 'توانمندی‌ها', skillsTitle: 'با چی کار می‌کنم',
            skillsSubtitle: 'ابزارها و فناوری‌هایی که برای زنده کردن ایده‌ها استفاده می‌کنم',
            skillGroup1: 'UI / UX', skillGroup2: 'فرانت‌اند', skillGroup3: 'موبایل و توسعه', skillGroup4: 'ابزارها', skillGroup5: 'مهارت‌های نرم', skillGroup6: 'در حال یادگیری',
            projectsLabel: 'آثار برگزیده', projectsTitle: 'چیزایی که ساختم',
            projectsSubtitle: 'چندتا از پروژه‌هایی که اخیراً روشون کار کردم',
            filtersLabel: 'فیلتر پروژه‌ها',
            projectsCarouselLabel: 'پروژه‌ها',
            stackPrevLabel: 'پروژه قبلی',
            stackNextLabel: 'پروژه بعدی',
            filterAll: 'همه', filterFlutter: 'فلاتر', filterWeb: 'وب', filterDart: 'دارت', filterDesign: 'دیزاین',
            projectOpenCta: 'مشاهده مخزن ↗',
            project1Alt: 'تصویرسازی یادگیری زبان آلمانی: کتاب باز و فلش‌کارت‌ها',
            project2Alt: 'تصویرسازی ردیاب فرنچایز انیمه: قفسه پوسترها با نوار پیشرفت',
            project3Alt: 'تصویرسازی موزیک‌پلیر: هدفون، صفحه وینیل و امواج صدا',
            project4Alt: 'تصویرسازی ماجراجویی دزدان دریایی: کلاه حصیری روی عرشه کشتی',
            project5Alt: 'تصویرسازی ربات تلگرام هوش مصنوعی تیتاب: دستیار ربات در حال گفتگو',
            project6Alt: 'تصویرسازی ماشین‌حساب خط فرمان دارت: ماشین‌حساب روی میز کنار دفترچه',
            project7Alt: 'تصویرسازی تمرین‌های مبانی دارت: مسیر یادگیری پله‌به‌پله با لپ‌تاپ',
            project8Alt: 'تصویرسازی مبدل حروف اشتباه کیبورد: کلیدهای پراکنده تبدیل‌شونده به کیبورد مرتب',
            project1Name: 'یادگیری آلمانی و تلفظ',
            project1Desc: 'وب‌اپ تک‌صفحه‌ای برای یادگیری آلمانی از A0 تا C1: واژگان، گرامر، صرف فعل، حالت‌ها، خواندن، آزمون، فلش‌کارت با تکرار فاصله‌دار و بخش تلفظ.',
            project2Name: 'آرورا — ردیاب فرنچایز انیمه',
            project2Desc: 'ردیاب آفلاین فرنچایزهای انیمه با فلاتر: فصل‌ها، فیلم‌ها و OVAها زیر یک فرنچایز، با داده‌های AniList و MyAnimeList و رابط فارسی راست‌به‌چپ.',
            project3Name: 'موزیک‌پلیر آرورا',
            project3Desc: 'موزیک‌پلیر فلاتر با پخش آنلاین، ورود با فایربیس، تم روشن و تیره، رابط فارسی راست‌به‌چپ و کنترل‌های کامل پخش.',
            project4Name: 'سایت فن‌مید مانکی دی. لوفی',
            project4Desc: 'وب‌سایت فن‌مید برای بیوگرافی مانکی دی. لوفی از وان پیس، با تم روشن و تیره، انیمیشن‌های اسکرول و چیدمان فارسی راست‌به‌چپ.',
            project5Name: 'ربات تلگرام هوش مصنوعی تیتاب',
            project5Desc: 'بات تلگرامی که با یه مدل AI جواب می‌ده: long polling خام با Telegram Bot API، حافظه مخصوص هر چت، و chat completions با Hugging Face، با توکن‌هایی که فقط توی یه فایل .env لوکال نگه داشته می‌شن.',
            project6Name: 'ماشین‌حساب خط فرمان دارت',
            project6Desc: 'ماشین‌حساب خط فرمانی با Dart، با پرامپت تعاملی، ورودی عملگرها، و خروج تمیز از برنامه.',
            project7Name: 'تمرین‌های مبانی دارت',
            project7Desc: 'یه مسیر 23 تمرینی برای یادگیری مبانی Dart: مدیریت ورودی، کالکشن‌ها، کلاس‌ها، و برنامه‌های کنسولی کوچیک.',
            project8Name: 'مبدل حروف اشتباه کیبورد',
            project8Desc: 'اکستنشن کروم که متن تایپ‌شده با کیبورد اشتباه (فارسی ↔ انگلیسی) رو توی باکس‌های چت درست می‌کنه، به‌علاوه نیم‌فاصله فارسی و تبدیل عددها. کاملا آفلاین، هیچ متنی به هیچ سروری فرستاده نمی‌شه.',
            journeyLabel: 'مسیر', journeyTitle: 'چطور اینجا رسیدم',
            journeySubtitle: 'مسیر من از مبتدی تا جایی که الان هستم',
            journeyTeaserText: 'از C و Java در دانشگاه تا فلاتر، UI/UX و طراحی محصول — شش ایستگاه در این مسیر.',
            journeyTeaserCta: 'مشاهده تایم‌لاین ↗',
            journey1Year: '۲۰۲۲', journey1Title: 'شروع برنامه‌نویسی', journey1Desc: 'یادگیری C و Java در دانشگاه. اولین اپ‌های کنسولی رو ساختم.',
            journey2Year: '۲۰۲۳', journey2Title: 'شروع توسعه وب', journey2Desc: 'HTML، CSS و مبانی جاوااسکریپت رو یاد گرفتم. اولین لندینگ پیج‌ها و سایت‌های ریسپانسیو رو ساختم.',
            journey3Year: '۲۰۲۴', journey3Title: 'ورود به طراحی UI/UX', journey3Desc: 'رفتم توی دنیای UI/UX با فیگما. شروع به ساخت پروتوتایپ‌های تعاملی و به‌کارگیری اصول مهندسی نرم‌افزار کردم.',
            journey4Year: '۲۰۲۵', journey4Title: 'یادگیری وردپرس', journey4Desc: 'سایت ساختم و یاد گرفتم چطور با پلاگین المنتور اون‌ها رو سفارشی‌سازی کنم.',
            journey5Year: '۲۰۲۶', journey5Title: 'یادگیری فلاتر و دارت', journey5Desc: 'دارم اپ‌های موبایل می‌سازم و هدفم اینه که طراح محصول بشم. دارم توسعه چندپلتفرمه رو کاوش می‌کنم.',
            journey6Year: '۲۰۲۷', journey6Title: 'طراح محصول', journey6Desc: 'هدف: عرضه محصول واقعی، ساخت برند شخصی، شروع کار فریلنسری، و مشارکت در اوپن‌سورس.',
            worldLabel: 'دنیا', worldTitle: 'دنیا',
            worldSubtitle: 'کره رو بکش تا بچرخه، بعد همه پروژه‌ها رو پایین ببین.',
            globeLabel: 'کره سیمی چرخان',
            worldHint: 'برای چرخوندن بکش', worldNote: 'کاشی‌ها از عکس‌های فعلی پروژه‌ها استفاده می‌کنن.',
            worldCta: 'مشاهده همه پروژه‌ها ↗',
            contactLabel: 'تماس', contactTitle: 'بزن بریم کار کنیم',
            contactSubtitle: 'یه پروژه توی ذهنت داری؟ بیا ببینیم چطور می‌تونیم همکاری کنیم',
            contactHeading: 'ارتباط با من',
            contactDesc: 'آماده همکاری توی پروژه‌های فریلنسری، پروژه‌های مشترک، و کارآموزی هستم. همیشه از کار روی چالش‌های جدید هیجان‌زده می‌شم.',
            contactEmail: 'ایمیل', contactLocation: 'موقعیت', contactLocationValue: 'کرمان، ایران',
            formName: 'نام', formEmail: 'ایمیل', formScope: 'نوع پروژه',
            scopeFreelance: 'پروژه فریلنسری', scopeCollab: 'همکاری', scopeInternship: 'کارآموزی', scopeOther: 'دیگه',
            formMessage: 'پیام', formSubmit: 'ارسال پیام',
            formSending: 'در حال ارسال…', formSent: 'پیام ارسال شد — ممنون!',
            formFallback: 'فورم‌اسپری هنوز تنظیم نشده — در عوض برنامه ایمیل باز می‌شه.',
            formError: 'یه مشکلی پیش اومد. لطفاً مستقیم ایمیل بزن.',
            musicOff: 'موزیک: خاموش', musicOn: 'موزیک: روشن', musicPending: 'موزیک: خاموش — فایل در انتظار',
            footerGithubLabel: 'گیت‌هاب',
            footerEmailLabel: 'ایمیل',
            footerTwitterLabel: 'توییتر / X',
            footerInstagramLabel: 'اینستاگرام',
            footerTelegramLabel: 'تلگرام',
            footerText: 'ساخته‌شده توسط علی د. شاه — کرمان، ایران',
            error404Label: 'خطا',
            error404Title: 'صفحه یافت نشد',
            error404Desc: 'صفحهٔ مورد نظر وجود ندارد یا جابه‌جا شده است.',
            error404Cta: 'بازگشت به خانه ↗'
        }
    };

    // Storage can throw (private mode / blocked cookies) — never let that kill the whole script.
    function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
    function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
    function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
    var currentLang = lsGet('aliLang') === 'fa' ? 'fa' : 'en';
    var storedTheme = lsGet('aliTheme');
    var currentTheme = (storedTheme === 'dark' || storedTheme === 'light')
        ? storedTheme
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches || (navigator.connection && navigator.connection.saveData);
    var isCoarse = window.matchMedia('(pointer: coarse)').matches;
    var html = document.documentElement;
    var t = function (key) { var tr = translations[currentLang] || translations.en; return tr[key] !== undefined ? tr[key] : (translations.en[key] || key); };

    // ===== THEME =====
    function applyTheme(theme) {
        currentTheme = theme;
        html.setAttribute('data-theme', theme);
        lsSet('aliTheme', theme);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a14' : '#f6eef2');
    }
    function toggleTheme() { applyTheme(currentTheme === 'dark' ? 'light' : 'dark'); }

    // ===== LANGUAGE =====
    function setLanguage(lang, announce) {
        currentLang = lang;
        lsSet('aliLang', lang);
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
        var langLabel = document.getElementById('langLabel');
        if (langLabel) langLabel.textContent = lang === 'en' ? 'EN' : 'FA';
        var tr = translations[lang] || translations.en;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (tr[key] !== undefined) el.innerHTML = tr[key];
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
                var kv = pair.split(':');
                if (kv.length === 2 && tr[kv[1]] !== undefined) el.setAttribute(kv[0], tr[kv[1]]);
            });
        });
        var sp = document.getElementById('stackPrev'), sn = document.getElementById('stackNext');
        if (sp) sp.textContent = lang === 'fa' ? '→' : '←';
        if (sn) sn.textContent = lang === 'fa' ? '←' : '→';
        var langToggle = document.getElementById('langToggle');
        if (langToggle) langToggle.setAttribute('aria-label', tr.langToggleLabel);
        var pageType = document.body ? document.body.getAttribute('data-page') : '';
        var titleMap = {
            index: tr.pageTitleIndex,
            experience: tr.pageTitleExperience,
            world: tr.pageTitleWorld,
            '404': tr.pageTitle404
        };
        if (pageType && titleMap[pageType]) document.title = titleMap[pageType];
        var announcer = document.getElementById('langAnnouncer');
        if (announce && announcer) announcer.textContent = tr.langAnnounce;
        updateMusicLabel();
    }

    // ===== MUSIC — audio/Odysseus_KLICKAUD.mp3; on/off + position kept in sessionStorage across pages =====
    // (A full page load still has a short silence between pages; truly gapless needs a single-page app.)
    var audio = document.getElementById('siteAudio');
    var musicWanted = ssGet('auroraMusicWanted') === '1';
    var lastSave = 0;
    function saveMusicState() {
        ssSet('auroraMusicWanted', musicWanted ? '1' : '0');
        if (audio && isFinite(audio.currentTime) && audio.currentTime > 0) ssSet('auroraMusicTime', String(audio.currentTime));
    }
    function savedMusicTime() { var s = parseFloat(ssGet('auroraMusicTime')); return isFinite(s) && s > 0 ? s : 0; }
    function updateMusicLabel() {
        var el = document.querySelector('#musicToggle .music-state');
        var btn = document.getElementById('musicToggle');
        var on = musicWanted && !!MUSIC_SRC;
        if (el) el.textContent = !MUSIC_SRC ? t('musicPending') : (musicWanted ? t('musicOn') : t('musicOff'));
        if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('is-on', on); }
    }
    function tryPlayMusic() {
        if (!MUSIC_SRC || !audio) return;
        if (!audio.getAttribute('src')) {
            // preload="none" never fires loadedmetadata until play() is called, so play first, seek once metadata arrives.
            var startAt = savedMusicTime();
            audio.preload = 'auto';
            audio.src = MUSIC_SRC;
            if (startAt > 0) audio.addEventListener('loadedmetadata', function () {
                try { if (startAt < audio.duration - 1) audio.currentTime = startAt; } catch (e) { /* seek not ready */ }
            }, { once: true });
        }
        var p = audio.play();
        if (p && p.catch) p.catch(function () {
            // Autoplay blocked on this page load — resume on the first user gesture instead.
            var resume = function () { if (musicWanted) audio.play().catch(function () {}); };
            document.addEventListener('pointerdown', resume, { once: true });
            document.addEventListener('keydown', resume, { once: true });
        });
    }
    function resumeMusicIfWanted() { if (musicWanted && ssGet('aliGateSeen')) tryPlayMusic(); }
    function toggleMusic() {
        musicWanted = !musicWanted;
        if (musicWanted) tryPlayMusic(); else if (audio) audio.pause();
        saveMusicState();
        updateMusicLabel();
    }
    if (audio) {
        audio.addEventListener('timeupdate', function () { if (Date.now() - lastSave > 3000) { lastSave = Date.now(); saveMusicState(); } });
        audio.addEventListener('error', function () { if (audio.getAttribute('src')) { musicWanted = false; saveMusicState(); updateMusicLabel(); } });
        window.addEventListener('pagehide', saveMusicState);
    }

    function scrollToHash() {
        if (!location.hash || location.hash.length < 2) return;
        var id; try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
        var target = document.getElementById(id);
        if (target) target.scrollIntoView();
    }
    function setShellInert(on) {
        document.querySelectorAll('nav, main, footer, .back-to-top').forEach(function (n) { if (on) n.setAttribute('inert', ''); else n.removeAttribute('inert'); });
    }

    // ===== ENTER GATE — once per tab =====
    function initGate() {
        var gate = document.getElementById('gate');
        if (!gate) return;
        if (ssGet('aliGateSeen')) { gate.remove(); return; }
        var done = false;
        var onGateEsc;
        setShellInert(true);
        document.body.style.overflow = 'hidden';
        var enter = function (withAudio) {
            if (done) return; done = true;
            document.removeEventListener('keydown', onGateEsc);
            musicWanted = !!withAudio;
            ssSet('aliGateSeen', '1');
            saveMusicState();
            gate.classList.add('is-hidden');
            document.body.style.overflow = '';
            setShellInert(false);
            if (withAudio) tryPlayMusic();
            updateMusicLabel();
            setTimeout(function () { gate.remove(); }, 650);
            scrollToHash();
        };
        onGateEsc = function (e) { if (e.key === 'Escape') enter(false); };
        var enterBtn = document.getElementById('gateEnter');
        enterBtn.addEventListener('click', function () { enter(true); });
        document.getElementById('gateEnterSilent').addEventListener('click', function () { enter(false); });
        document.addEventListener('keydown', onGateEsc);
        enterBtn.focus({ preventScroll: true });
    }

    // ===== FULLSCREEN MENU =====
    function initMenu() {
        var menu = document.getElementById('fullscreenMenu');
        var openBtn = document.getElementById('menuToggle');
        var closeBtn = document.getElementById('menuClose');
        if (!menu || !openBtn) return;
        var open = function () {
            menu.hidden = false; openBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; setShellInert(true);
            if (closeBtn) closeBtn.focus();
        };
        var close = function () {
            menu.hidden = true; openBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; setShellInert(false);
            openBtn.focus({ preventScroll: true });
        };
        openBtn.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);
        menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
        document.addEventListener('keydown', function (e) {
            if (menu.hidden) return;
            if (e.key === 'Escape') { close(); return; }
            if (e.key !== 'Tab') return; // simple focus trap
            var f = menu.querySelectorAll('a[href], button');
            if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });
    }

    // ===== HERO SCROLL-FRAME — 30 steps from 3 key images, rAF-throttled, pauses off-screen =====
    function initHero() {
        var hero = document.querySelector('.hero');
        var frames = Array.prototype.slice.call(document.querySelectorAll('.hero-frame'));
        var countEl = document.getElementById('frameCount');
        if (!hero || !frames.length) return;
        if (reducedMotion || reducedData || isCoarse || window.innerWidth <= 720) {
            frames.forEach(function (f, i) { f.classList.toggle('is-active', i === 0); });
            if (countEl) countEl.textContent = '01';
            return; // static fallback on mobile / reduced motion
        }
        var heroVisible = true, ticking = false, mx = 0, my = 0;
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { heroVisible = entries[0].isIntersecting; }, { threshold: 0 }).observe(hero);
        }
        var update = function () {
            ticking = false;
            if (!heroVisible || document.hidden) return;
            var rect = hero.getBoundingClientRect();
            var total = hero.offsetHeight - window.innerHeight;
            var p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
            var step = Math.min(Math.floor(p * HERO_STEPS), HERO_STEPS - 1);
            var imgIdx = Math.min(Math.floor(p * frames.length), frames.length - 1);
            frames.forEach(function (f, i) {
                f.classList.toggle('is-active', i === imgIdx);
                if (i === imgIdx) {
                    f.style.transform = 'scale(' + (1.03 + p * 0.14).toFixed(3) + ') translate3d(' + (-mx).toFixed(1) + 'px, ' + (-p * 24 - my).toFixed(1) + 'px, 0)';
                }
            });
            if (countEl) countEl.textContent = String(step + 1).padStart(2, '0');
        };
        var scheduleUpdate = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
        document.addEventListener('visibilitychange', function () { if (!document.hidden) update(); });
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        hero.addEventListener('pointermove', function (e) {
            mx = ((e.clientX / window.innerWidth) - 0.5) * 14;
            my = ((e.clientY / window.innerHeight) - 0.5) * 10;
            scheduleUpdate();
        }, { passive: true });
        hero.addEventListener('pointerleave', function () {
            mx = 0; my = 0;
            scheduleUpdate();
        });
        update();
    }

    // ===== ARSENAL BARS — widths come from data-pct (values sent by Ali), animated on reveal =====
    function initArsenal() {
        var fills = document.querySelectorAll('.arsenal-fill[data-pct]');
        if (!fills.length) return;
        var setWidths = function () {
            fills.forEach(function (f) { f.style.width = f.getAttribute('data-pct') + '%'; });
        };
        if (reducedMotion || reducedData) { setWidths(); return; }
        var arsenal = document.querySelector('.arsenal');
        if (arsenal && 'IntersectionObserver' in window) {
            var ob = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) { if (en.isIntersecting) { setWidths(); ob.disconnect(); } });
            }, { threshold: 0.3 });
            ob.observe(arsenal);
        } else setWidths();
    }

    // ===== PROJECTS STACK & UNSEEN INDEX STRIP =====
    function initStack() {
        var stack = document.getElementById('projectStack');
        if (!stack) return;
        var wrap = stack.closest('.stack-wrap') || stack;
        var allCards = Array.prototype.slice.call(stack.querySelectorAll('.stack-card'));
        var visible = allCards.slice();
        var idx = 0;
        var curEl = document.getElementById('stackCurrent');
        var totEl = document.getElementById('stackTotal');
        var stripEl = document.getElementById('projectIndexStrip');
        var rtl = function () { return html.getAttribute('dir') === 'rtl'; };
        var indexBtns = [];
        var render = function () {
            var nextIdx = visible.length > 1 ? (idx + 1) % visible.length : -1;
            allCards.forEach(function (card, cardPos) { // every card, so a filtered-out card never keeps is-active
                var i = visible.indexOf(card);
                card.classList.toggle('is-active', i === idx);
                card.classList.toggle('is-next', i !== -1 && i === nextIdx);
                card.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
                card.tabIndex = i === idx ? 0 : -1;
                if (indexBtns[cardPos]) {
                    indexBtns[cardPos].hidden = (i === -1);
                    indexBtns[cardPos].classList.toggle('is-current', i === idx);
                    indexBtns[cardPos].setAttribute('aria-pressed', i === idx ? 'true' : 'false');
                }
            });
            if (curEl) curEl.textContent = visible.length ? idx + 1 : 0;
            if (totEl) totEl.textContent = visible.length;
        };
        if (stripEl) {
            stripEl.innerHTML = '';
            allCards.forEach(function (card, cardPos) {
                var titleEl = card.querySelector('.project-name');
                var nameKey = titleEl ? titleEl.getAttribute('data-i18n') : '';
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'project-index-btn';
                var num = document.createElement('span');
                num.className = 'project-index-num';
                num.setAttribute('dir', 'ltr');
                num.textContent = String(cardPos + 1).padStart(2, '0');
                var lbl = document.createElement('span');
                lbl.className = 'project-index-label';
                if (nameKey) {
                    lbl.setAttribute('data-i18n', nameKey);
                    lbl.innerHTML = t(nameKey);
                } else if (titleEl) {
                    lbl.textContent = titleEl.textContent;
                }
                btn.appendChild(num);
                btn.appendChild(lbl);
                btn.addEventListener('click', function () {
                    var targetIdx = visible.indexOf(card);
                    if (targetIdx !== -1) {
                        idx = targetIdx;
                        render();
                    }
                });
                stripEl.appendChild(btn);
                indexBtns.push(btn);
            });
        }
        var go = function (d) { if (!visible.length) return; idx = (idx + d + visible.length) % visible.length; render(); };
        document.getElementById('stackPrev').addEventListener('click', function () { go(-1); });
        document.getElementById('stackNext').addEventListener('click', function () { go(1); });
        document.addEventListener('keydown', function (e) {
            if (!wrap.contains(document.activeElement) && !wrap.matches(':hover')) return;
            if (e.key === 'ArrowLeft') go(rtl() ? 1 : -1);
            if (e.key === 'ArrowRight') go(rtl() ? -1 : 1);
        });
        // swipe on touch screens; a swipe must not also open the project link
        var sx = null, swiped = false;
        stack.addEventListener('pointerdown', function (e) { sx = e.clientX; swiped = false; });
        stack.addEventListener('pointerup', function (e) {
            if (sx === null) return;
            var dx = e.clientX - sx; sx = null;
            if (Math.abs(dx) > 50) { swiped = true; go((dx < 0) !== rtl() ? 1 : -1); }
        });
        stack.addEventListener('click', function (e) { if (swiped) { e.preventDefault(); swiped = false; } }, true);
        var filters = document.querySelectorAll('.stack-filter');
        filters.forEach(function (btn) {
            btn.setAttribute('aria-pressed', String(btn.classList.contains('is-active')));
            btn.addEventListener('click', function () {
                filters.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
                btn.classList.add('is-active'); btn.setAttribute('aria-pressed', 'true');
                var f = btn.getAttribute('data-filter');
                visible = f === 'all' ? allCards.slice() : allCards.filter(function (c) { return (c.getAttribute('data-cat') || '').split(' ').indexOf(f) !== -1; });
                idx = 0;
                render();
            });
        });
        render();
    }

    // ===== WORLD GLOBE — light 2D canvas wireframe, drag to rotate =====
    function initGlobe() {
        var canvas = document.getElementById('globeCanvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var rot = 0, vel = 0.0018, dragging = false, lastX = 0, visible = true;
        var DPR = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.5 : 2);
        var size = 640;
        function resize() {
            var w = canvas.clientWidth || 640;
            canvas.width = w * DPR; canvas.height = w * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            size = w;
        }
        function draw() {
            var cx = size / 2, cy = size / 2, r = size * 0.36;
            var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00B6F0';
            ctx.clearRect(0, 0, size, size);
            ctx.strokeStyle = accent; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.85;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
            var i, j, x, y, z, px, py, pen;
            for (i = -3; i <= 3; i++) { // latitude lines
                ctx.beginPath();
                pen = false;
                for (j = 0; j <= 64; j++) {
                    var a = (j / 64) * Math.PI * 2;
                    var lat = (i / 4) * (Math.PI / 2);
                    x = Math.cos(a) * Math.cos(lat); y = Math.sin(lat); z = Math.sin(a) * Math.cos(lat);
                    var xr = x * Math.cos(rot) + z * Math.sin(rot), zr = -x * Math.sin(rot) + z * Math.cos(rot);
                    px = cx + xr * r; py = cy + y * r;
                    if (zr < -0.15) { pen = false; continue; }
                    ctx.globalAlpha = 0.25 + 0.6 * Math.max(zr, 0);
                    if (!pen) { ctx.moveTo(px, py); pen = true; } else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
            for (i = 0; i < 12; i++) { // longitude lines
                ctx.beginPath();
                pen = false;
                for (j = 0; j <= 64; j++) {
                    var b = (j / 64) * Math.PI;
                    x = Math.sin(b) * Math.cos((i / 12) * Math.PI * 2); y = Math.cos(b); z = Math.sin(b) * Math.sin((i / 12) * Math.PI * 2);
                    var xr2 = x * Math.cos(rot) + z * Math.sin(rot), zr2 = -x * Math.sin(rot) + z * Math.cos(rot);
                    px = cx + xr2 * r; py = cy + y * r;
                    if (zr2 < -0.15) { pen = false; continue; }
                    ctx.globalAlpha = 0.25 + 0.6 * Math.max(zr2, 0);
                    if (!pen) { ctx.moveTo(px, py); pen = true; } else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.fillStyle = accent;
            var mlat = 0.35, mlon = 0.9 + rot * 0 ; // marker pinned to the sphere, rotates with it
            var mx = Math.cos(mlon) * Math.cos(mlat), my = Math.sin(mlat), mz = Math.sin(mlon) * Math.cos(mlat);
            var mxr = mx * Math.cos(rot) + mz * Math.sin(rot), mzr = -mx * Math.sin(rot) + mz * Math.cos(rot);
            if (mzr > 0) { ctx.beginPath(); ctx.arc(cx + mxr * r, cy - my * r, 5, 0, Math.PI * 2); ctx.fill(); }
        }
        function loop() {
            if (visible && !document.hidden) { if (!dragging && !reducedMotion && !reducedData) rot += vel; draw(); }
            requestAnimationFrame(loop);
        }
        canvas.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); });
        canvas.addEventListener('pointermove', function (e) { if (!dragging) return; rot += (e.clientX - lastX) * 0.008; lastX = e.clientX; draw(); });
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { canvas.addEventListener(ev, function () { dragging = false; }); });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(canvas);
        }
        window.addEventListener('resize', function () { resize(); draw(); });
        resize(); draw();
        if (!reducedMotion && !reducedData) loop(); else draw();
    }

    // ===== SCROLL REVEALS / NAV / BACK-TO-TOP / SMOOTH SCROLL =====
    function initChrome() {
        var prefersReduced = reducedMotion || reducedData;
        var reveals = document.querySelectorAll('.reveal, .float-in-left, .float-in-right');
        if (prefersReduced) { reveals.forEach(function (el) { el.classList.add('visible'); }); }
        else if ('IntersectionObserver' in window) {
            var ob = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visible'); ob.unobserve(en.target); } });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
            reveals.forEach(function (el) { ob.observe(el); });
        } else { reveals.forEach(function (el) { el.classList.add('visible'); }); }
        var pageType = document.body ? document.body.getAttribute('data-page') : '';
        var activeHrefMap = {
            index: ['#top', 'index.html'],
            experience: ['experience.html'],
            world: ['world.html']
        };
        var matches = activeHrefMap[pageType] || [];
        document.querySelectorAll('.nav-center a, .menu-list a').forEach(function (a) {
            var href = (a.getAttribute('href') || '').replace(/^\//, '');
            if (matches.indexOf(href) !== -1) {
                a.classList.add('active');
                a.setAttribute('aria-current', 'page');
            }
        });
        var heroEl = document.querySelector('.hero');
        var nav = document.querySelector('nav');
        var backToTop = document.getElementById('backToTop');
        var lastY = 0, ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return; ticking = true;
            requestAnimationFrame(function () {
                var y = window.scrollY;
                var topThreshold = heroEl ? Math.max(480, heroEl.offsetHeight - window.innerHeight + 120) : 480;
                if (nav) nav.classList.toggle('nav-hidden', y > lastY && y > 200);
                if (backToTop) backToTop.classList.toggle('visible', y > topThreshold);
                lastY = y; ticking = false;
            });
        }, { passive: true });
        if (backToTop) backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }); });
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = link.getAttribute('href');
                if (href && href.length > 1) {
                    var target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
                        try { history.pushState(null, '', href); } catch (err) { /* file:// etc. */ }
                        if (target.id) { if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
                    }
                }
            });
        });
    }

    // ===== CONTACT FORM — Formspree when FORMSPREE_ID is set, mailto fallback otherwise =====
    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;
        var submitBtn = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (form.elements._gotcha && form.elements._gotcha.value) return; // honeypot: bots fill hidden fields
            var status = document.getElementById('formStatus');
            var name = form.elements.name.value, email = form.elements.email.value;
            var scope = form.elements.projectScope.value, message = form.elements.message.value;
            if (!FORMSPREE_ID) {
                if (status) { status.textContent = t('formFallback'); status.className = ''; }
                var subject = encodeURIComponent('Portfolio contact from ' + name + ' [' + scope + ']');
                var body = encodeURIComponent(message + '\n\nFrom: ' + name + ' <' + email + '>');
                window.location.href = 'mailto:suicidewithmeagain@gmail.com?subject=' + subject + '&body=' + body;
                return;
            }
            if (submitBtn) submitBtn.disabled = true; // no double submits
            if (status) { status.textContent = t('formSending'); status.className = ''; }
            fetch('https://formspree.io/f/' + FORMSPREE_ID, {
                method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, email: email, projectScope: scope, message: message })
            }).then(function (res) {
                if (res.ok) { if (status) { status.textContent = t('formSent'); status.className = 'is-ok'; } form.reset(); }
                else if (status) { status.textContent = t('formError'); status.className = 'is-error'; }
            }).catch(function () {
                if (status) { status.textContent = t('formError'); status.className = 'is-error'; }
            }).then(function () { if (submitBtn) submitBtn.disabled = false; });
        });
    }

    function init() {
        applyTheme(currentTheme);
        var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();
        var themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
        setLanguage(currentLang, false);
        var langBtn = document.getElementById('langToggle');
        if (langBtn) langBtn.addEventListener('click', function () { setLanguage(currentLang === 'en' ? 'fa' : 'en', true); });
        var musicBtn = document.getElementById('musicToggle');
        if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
        updateMusicLabel();
        initGate(); resumeMusicIfWanted(); initMenu(); initHero(); initArsenal(); initStack(); initGlobe(); initChrome(); initContactForm();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
