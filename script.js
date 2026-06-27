(function() {
    'use strict';

    // ===== TRANSLATIONS =====
    const translations = {
        en: {
            skipLink: 'Skip to main content',
            navAbout: 'About',
            navSkills: 'Skills',
            navProjects: 'Projects',
            navJourney: 'Journey',
            navContact: 'Contact',
            menuOpenLabel: 'Open menu',
            menuCloseLabel: 'Close menu',
            themeToggleLabel: 'Switch to light theme',
            themeToggleLabelLight: 'Switch to dark theme',
            langToggleLabel: 'Switch to Persian',
            langAnnounce: 'Language switched to English',
            backToTopLabel: 'Back to top',
            heroEyebrow: 'Available for freelance',
            heroName: 'Ali D. Shah',
            heroTitle: 'Designer & Developer',
            heroSub: 'Computer Engineering student building simple, intuitive digital experiences. Focused on UI/UX Design, Flutter, and Product Thinking.',
            heroCta1: 'View Projects',
            heroCta2: 'GitHub Profile',
            scrollHint: 'scroll',
            aboutLabel: '// about me',
            aboutTitle: 'Who I am',
            aboutP1: 'I\'m a <strong>Computer Engineering student</strong> from Kerman, Iran, passionate about the intersection of technology and design.',
            aboutP2: 'My journey started with HTML &amp; CSS and grew into <strong>UI/UX Design</strong>, WordPress development, and now <strong>Flutter &amp; Dart</strong> for mobile apps.',
            aboutP3: 'I believe good design is invisible — it guides people naturally without getting in the way.',
            stat1Num: '2+',
            stat1Label: 'Years learning',
            stat2Num: '4+',
            stat2Label: 'Projects built',
            stat3Num: '100%',
            stat3Label: 'HTML / CSS',
            stat4Num: '90%',
            stat4Label: 'Figma',
            skillsLabel: '// skills',
            skillsTitle: 'What I work with',
            skillGroup1: 'UI / UX',
            skillGroup2: 'Front-End',
            skillGroup3: 'Mobile & Dev',
            projectsLabel: '// projects',
            projectsTitle: 'Things I\'ve built',
            project1Name: 'Car Marketplace Landing Page',
            project1Desc: 'Modern responsive landing page for a vehicle marketplace platform with CTA sections and pricing components.',
            project2Name: 'Crypto Landing Page',
            project2Desc: 'Landing page concept for a cryptocurrency platform with hero section, statistics and dashboard UI.',
            project3Name: 'UI/UX Case Studies',
            project3Desc: 'Collection of design explorations including redesign concepts, UX audits, and product analysis.',
            project4Name: 'Flutter App (In Progress)',
            project4Desc: 'Mobile application being built with Flutter and Dart as part of my journey into cross-platform development.',
            journeyLabel: '// journey',
            journeyTitle: 'How I got here',
            journey1Year: '2025',
            journey1Title: 'Started Web Development',
            journey1Desc: 'Learned HTML, CSS and the basics of UI design. Built first landing pages.',
            journey2Year: '2026',
            journey2Title: 'Expanded into Design & JS',
            journey2Desc: 'Picked up JavaScript, WordPress, and dove deep into UI/UX with Figma.',
            journey3Year: 'Now',
            journey3Title: 'Learning Flutter & Dart',
            journey3Desc: 'Building mobile apps and working toward becoming a Product Designer.',
            journey4Year: 'Next',
            journey4Title: 'Product Designer',
            journey4Desc: 'Goal: ship real products, build a personal brand, launch a freelance career.',
            contactLabel: '// contact',
            contactTitle: 'Let\'s work together',
            contactDesc: 'Open to freelance projects, collaborations, and internship opportunities.',
            contactBtn1: 'GitHub',
            contactBtn2: 'Email Me',
            footerText: 'built by Ali D. Shah — Kerman, Iran 🇮🇷'
        },
        fa: {
            skipLink: 'رفتن به محتوای اصلی',
            navAbout: 'درباره من',
            navSkills: 'مهارت‌ها',
            navProjects: 'پروژه‌ها',
            navContact: 'تماس',
            menuOpenLabel: 'باز کردن منو',
            menuCloseLabel: 'بستن منو',
            themeToggleLabel: 'تغییر به تم روشن',
            themeToggleLabelLight: 'تغییر به تم تاریک',
            langToggleLabel: 'تغییر به انگلیسی',
            langAnnounce: 'زبان به فارسی تغییر کرد',
            backToTopLabel: 'بازگشت به بالا',
            heroEyebrow: 'در دسترس برای همکاری',
            heroName: 'علی د. شاه',
            heroTitle: 'طراح و توسعه‌دهنده',
            heroSub: 'دانشجوی مهندسی کامپیوتر که تجربه‌های دیجیتالی ساده و شهودی می‌سازد. متمرکز بر طراحی UI/UX، فلاتر و تفکر محصول.',
            heroCta1: 'مشاهده پروژه‌ها',
            heroCta2: 'پروفایل گیت‌هاب',
            scrollHint: 'اسکرول',
            aboutLabel: '// درباره من',
            aboutTitle: 'من کیستم',
            aboutP1: 'من <strong>دانشجوی مهندسی کامپیوتر</strong> از کرمان، ایران هستم و به تقاطع فناوری و طراحی علاقه دارم.',
            aboutP2: 'سفر من با HTML و CSS شروع شد و به <strong>طراحی UI/UX</strong>، توسعه وردپرس و اکنون <strong>فلاتر و دارت</strong> برای اپلیکیشن‌های موبایل رسید.',
            aboutP3: 'من معتقدم طراحی خوب نامرئی است — به طور طبیعی کاربران را راهنمایی می‌کند بدون اینکه مانع ایجاد کند.',
            stat1Num: '۲+',
            stat1Label: 'سال یادگیری',
            stat2Num: '۴+',
            stat2Label: 'پروژه ساخته شده',
            stat3Num: '۱۰۰٪',
            stat3Label: 'HTML / CSS',
            stat4Num: '۹۰٪',
            stat4Label: 'فیگما',
            skillsLabel: '// مهارت‌ها',
            skillsTitle: 'چه چیزهایی کار می‌کنم',
            skillGroup1: 'UI / UX',
            skillGroup2: 'فرانت‌اند',
            skillGroup3: 'موبایل و توسعه',
            projectsLabel: '// پروژه‌ها',
            projectsTitle: 'چیزهایی که ساخته‌ام',
            project1Name: 'صفحه فرود بازار خودرو',
            project1Desc: 'صفحه فرود پاسخگوی مدرن برای پلتفرم بازار خودرو با بخش‌های CTA و اجزای قیمت‌گذاری.',
            project2Name: 'صفحه فرود ارز دیجیتال',
            project2Desc: 'کنسپت صفحه فرود برای پلتفرم ارز دیجیتال با بخش قهرمان، آمار و داشبورد UI.',
            project3Name: 'مطالعات موردی UI/UX',
            project3Desc: 'مجموعه‌ای از اکتشافات طراحی شامل مفاهیم بازطراحی، ممیزی UX و تحلیل محصول.',
            project4Name: 'اپلیکیشن فلاتر (در حال توسعه)',
            project4Desc: 'اپلیکیشن موبایل در حال ساخت با فلاتر و دارت به عنوان بخشی از سفر من به توسعه چندسکویی.',
            journeyLabel: '// مسیر',
            journeyTitle: 'چطور به اینجا رسیدم',
            journey1Year: '۲۰۲۵',
            journey1Title: 'شروع توسعه وب',
            journey1Desc: 'HTML، CSS و اصول طراحی UI را یاد گرفتم. اولین صفحات فرود را ساختم.',
            journey2Year: '۲۰۲۶',
            journey2Title: 'گسترش به طراحی و JS',
            journey2Desc: 'جاوااسکریپت، وردپرس و عمیقاً UI/UX با فیگما را یاد گرفتم.',
            journey3Year: 'اکنون',
            journey3Title: 'یادگیری فلاتر و دارت',
            journey3Desc: 'در حال ساخت اپلیکیشن‌های موبایل و تلاش برای تبدیل شدن به یک طراح محصول.',
            journey4Year: 'بعدی',
            journey4Title: 'طراح محصول',
            journey4Desc: 'هدف: عرضه محصولات واقعی، ساخت برند شخصی، شروع حرفه فریلنسری.',
            contactLabel: '// تماس',
            contactTitle: 'بیایید همکاری کنیم',
            contactDesc: 'برای پروژه‌های فریلنسری، همکاری‌ها و فرصت‌های کارآموزی باز هستم.',
            contactBtn1: 'گیت‌هاب',
            contactBtn2: 'ایمیل به من',
            footerText: 'ساخته شده توسط علی د. شاه — کرمان، ایران 🇮🇷'
        }
    };

    // ===== INITIAL STATE =====
    let currentLang = localStorage.getItem('aliLang') || 'en';
    let currentTheme = localStorage.getItem('aliTheme') || 'dark';

    const html = document.documentElement;
    const themeCheckbox = document.getElementById('themeCheckbox');
    const themeSwitchContainer = document.querySelector('.theme-switch__container');
    const langLabel = document.getElementById('langLabel');
    const langToggle = document.getElementById('langToggle');
    const langAnnouncer = document.getElementById('langAnnouncer');
    const navToggle = document.getElementById('navToggle');
    const navCenter = document.getElementById('navCenter');
    const navLinks = navCenter ? Array.from(navCenter.querySelectorAll('a')) : [];
    const backToTop = document.getElementById('backToTop');

    // ===== THEME FUNCTIONS =====
    function setTheme(theme, announce) {
        currentTheme = theme;
        html.setAttribute('data-theme', theme);
        localStorage.setItem('aliTheme', theme);
        if (themeCheckbox) {
            themeCheckbox.checked = (theme === 'dark');
        }
        const t = translations[currentLang] || translations.en;
        if (themeCheckbox) {
            themeCheckbox.setAttribute(
                'aria-label',
                theme === 'dark' ? t.themeToggleLabel : t.themeToggleLabelLight
            );
        }
    }

    function toggleTheme() {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    // ===== LANGUAGE FUNCTIONS =====
    function setLanguage(lang, announce) {
        currentLang = lang;
        localStorage.setItem('aliLang', lang);
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
        if (langLabel) {
            langLabel.textContent = lang === 'en' ? 'EN' : 'FA';
        }

        const t = translations[lang] || translations.en;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                // Some values contain HTML (e.g., about paragraphs)
                if (key === 'aboutP1' || key === 'aboutP2' || key === 'aboutP3') {
                    el.innerHTML = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (t[key] !== undefined) {
                el.setAttribute('aria-label', t[key]);
            }
        });

        // Update hero split title (separate spans)
        const heroName = document.querySelector('.hero h1 span:not(.gradient-text)');
        if (heroName) {
            const key = heroName.getAttribute('data-i18n');
            if (key && t[key] !== undefined) heroName.textContent = t[key];
        }
        const heroTitle = document.querySelector('.hero h1 .gradient-text');
        if (heroTitle) {
            const key = heroTitle.getAttribute('data-i18n');
            if (key && t[key] !== undefined) heroTitle.textContent = t[key];
        }

        // Update theme switch aria-label to match new language
        if (themeSwitchContainer) {
            themeSwitchContainer.setAttribute(
                'aria-label',
                currentTheme === 'dark' ? t.themeToggleLabel : t.themeToggleLabelLight
            );
        }

        // Update lang toggle aria-label (says what it will switch TO)
        if (langToggle) {
            langToggle.setAttribute('aria-label', t.langToggleLabel);
        }

        // Update nav toggle aria-label depending on open state
        if (navToggle) {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-label', isOpen ? t.menuCloseLabel : t.menuOpenLabel);
        }

        // Update back-to-top aria-label
        if (backToTop) {
            backToTop.setAttribute('aria-label', t.backToTopLabel);
        }

        // Announce language change to screen reader users
        if (announce && langAnnouncer) {
            langAnnouncer.textContent = t.langAnnounce;
        }
    }

    function toggleLanguage() {
        setLanguage(currentLang === 'en' ? 'fa' : 'en', true);
    }

    // ===== MOBILE NAV MENU =====
    function openMenu() {
        if (!navCenter || !navToggle) return;
        navCenter.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        const t = translations[currentLang] || translations.en;
        navToggle.setAttribute('aria-label', t.menuCloseLabel);
        navToggle.classList.add('is-active');
    }

    function closeMenu() {
        if (!navCenter || !navToggle) return;
        navCenter.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const t = translations[currentLang] || translations.en;
        navToggle.setAttribute('aria-label', t.menuOpenLabel);
        navToggle.classList.remove('is-active');
    }

    function isMenuOpen() {
        return !!(navCenter && navCenter.classList.contains('open'));
    }

    function initMobileNav() {
        if (!navToggle || !navCenter) return;

        navToggle.addEventListener('click', () => {
            if (isMenuOpen()) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => closeMenu());
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!isMenuOpen()) return;
            const nav = document.querySelector('nav');
            if (nav && !nav.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen()) {
                closeMenu();
                navToggle.focus();
            }
        });

        // Close menu automatically if viewport grows back to desktop size
        const mq = window.matchMedia('(min-width: 701px)');
        const handleViewportChange = (e) => {
            if (e.matches) closeMenu();
        };
        if (mq.addEventListener) {
            mq.addEventListener('change', handleViewportChange);
        }
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        const reveals = document.querySelectorAll('.reveal, .stagger-children');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            reveals.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    // ===== SCROLLSPY (active nav link) =====
    function initScrollSpy() {
        const sections = Array.from(document.querySelectorAll('main section[id]'));
        if (!sections.length || !navLinks.length) return;

        const linkBySection = {};
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                linkBySection[href.slice(1)] = link;
            }
        });

        const setActive = (id) => {
            navLinks.forEach(link => {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            });
            const active = linkBySection[id];
            if (active) {
                active.setAttribute('aria-current', 'true');
                active.classList.add('active');
            }
        };

        const observer = new IntersectionObserver((entries) => {
            // Pick the entry closest to the top that is intersecting
            const visible = entries.filter(e => e.isIntersecting);
            if (visible.length > 0) {
                visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                setActive(visible[0].target.id);
            }
        }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

        sections.forEach(section => observer.observe(section));
    }

    // ===== SMOOTH SCROLL FOR NAV =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const navHeight = document.querySelector('nav').offsetHeight;
                        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
                        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                        target.setAttribute('tabindex', '-1');
                        target.focus({ preventScroll: true });
                    }
                }
            });
        });
    }

    // ===== BACK TO TOP =====
    function initBackToTop() {
        if (!backToTop) return;

        const toggleVisibility = () => {
            if (window.scrollY > 480) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        backToTop.addEventListener('click', () => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    // ===== INITIALIZATION =====
    function init() {
        // Theme
        setTheme(currentTheme);
        if (themeCheckbox) {
            themeCheckbox.addEventListener('change', toggleTheme);
        }

        // Language
        setLanguage(currentLang, false);
        if (langToggle) {
            langToggle.addEventListener('click', toggleLanguage);
        }

        // Mobile nav, scroll animations, scrollspy, smooth scroll, back-to-top
        initMobileNav();
        initScrollAnimations();
        initScrollSpy();
        initSmoothScroll();
        initBackToTop();
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
