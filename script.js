(function () {
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
            navJourney: 'مسیر',
            navContact: 'تماس',
            menuOpenLabel: 'باز کردن منو',
            menuCloseLabel: 'بستن منو',
            themeToggleLabel: 'تغییر به حالت روشن',
            themeToggleLabelLight: 'تغییر به حالت تاریک',
            langToggleLabel: 'تغییر به انگلیسی',
            langAnnounce: 'زبان به فارسی تغییر کرد',
            backToTopLabel: 'برگشت به بالا',
            heroEyebrow: 'آماده همکاری فریلنسری',
            heroName: 'علی د. شاه',
            heroTitle: 'طراح و توسعه‌دهنده',
            heroSub: 'دانشجوی مهندسی کامپیوتر که تجربه‌های دیجیتالی ساده و کاربرپسند می‌سازد. تخصصم در طراحی UI/UX، فلاتر و تفکر محصول‌محور است.',
            heroCta1: 'مشاهده پروژه‌ها',
            heroCta2: 'پروفایل گیت‌هاب',
            scrollHint: 'اسکرول',
            aboutLabel: '// درباره من',
            aboutTitle: 'کی هستم',
            aboutP1: 'من یک <strong>دانشجوی مهندسی کامپیوتر</strong> از کرمان، ایران هستم که به نقطه تلاقی فناوری و طراحی علاقه دارم.',
            aboutP2: 'مسیرم از HTML و CSS شروع شد و به <strong>طراحی UI/UX</strong>، توسعه وردپرس، و الان <strong>فلاتر و دارت</strong> برای اپ‌های موبایل رسیده.',
            aboutP3: 'باورم اینه که طراحی خوب دیده نمی‌شه — بدون دردسر، آدم‌ها رو هدایت می‌کنه.',
            stat1Num: '۲+',
            stat1Label: 'سال یادگیری',
            stat2Num: '۴+',
            stat2Label: 'پروژه تموم‌شده',
            stat3Num: '۱۰۰٪',
            stat3Label: 'HTML / CSS',
            stat4Num: '۹۰٪',
            stat4Label: 'فیگما',
            skillsLabel: '// مهارت‌ها',
            skillsTitle: 'با چی کار می‌کنم',
            skillGroup1: 'UI / UX',
            skillGroup2: 'فرانت‌اند',
            skillGroup3: 'موبایل و توسعه',
            projectsLabel: '// پروژه‌ها',
            projectsTitle: 'چیزایی که ساختم',
            project1Name: 'صفحه اصلی بازار خودرو',
            project1Desc: 'لندینگ پیج ریسپانسیو و مدرن برای یه پلتفرم خرید و فروش خودرو، با بخش‌های CTA و کامپوننت‌های قیمت‌گذاری.',
            project2Name: 'صفحه اصلی ارز دیجیتال',
            project2Desc: 'کانسپت لندینگ پیج برای یه پلتفرم کریپتو، شامل هدر اصلی، آمار و رابط داشبورد.',
            project3Name: 'کیس استادی‌های UI/UX',
            project3Desc: 'مجموعه‌ای از بررسی‌های طراحی، شامل کانسپت‌های ریدیزاین، آدیت UX و تحلیل محصول.',
            project4Name: 'اپ فلاتر (در حال توسعه)',
            project4Desc: 'اپلیکیشن موبایل که با فلاتر و دارت داره ساخته می‌شه؛ بخشی از مسیرم به سمت توسعه چندپلتفرمه.',
            journeyLabel: '// مسیر',
            journeyTitle: 'چطور اینجا رسیدم',
            journey1Year: '۲۰۲۵',
            journey1Title: 'شروع توسعه وب',
            journey1Desc: 'HTML، CSS و اصول طراحی UI رو یاد گرفتم. اولین لندینگ پیج‌هام رو ساختم.',
            journey2Year: '۲۰۲۶',
            journey2Title: 'ورود به طراحی و JS',
            journey2Desc: 'جاوااسکریپت و وردپرس یاد گرفتم و رفتم توی دنیای UI/UX با فیگما.',
            journey3Year: 'الان',
            journey3Title: 'یادگیری فلاتر و دارت',
            journey3Desc: 'دارم اپ‌های موبایل می‌سازم و هدفم اینه که طراح محصول بشم.',
            journey4Year: 'بعدی',
            journey4Title: 'طراح محصول',
            journey4Desc: 'هدف: عرضه محصول واقعی، ساخت برند شخصی، و شروع کار فریلنسری.',
            contactLabel: '// تماس',
            contactTitle: 'بزن بریم کار کنیم',
            contactDesc: 'آماده همکاری توی پروژه‌های فریلنسری، پروژه‌های مشترک، و کارآموزی هستم.',
            contactBtn1: 'گیت‌هاب',
            contactBtn2: 'ایمیل بزن',
            footerText: 'ساخته‌شده توسط علی د. شاه — کرمان، ایران 🇮🇷'
        }
    };

    // ===== INITIAL STATE =====
    let currentLang = localStorage.getItem('aliLang') || 'en';
    let currentTheme = localStorage.getItem('aliTheme') || 'dark';
    let isThemeTransitioning = false;

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

    // ===== THEME OVERLAY TRANSITION =====
    function createThemeOverlay() {
        let overlay = document.getElementById('theme-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'theme-overlay';
            overlay.style.cssText = `
                position: fixed; inset: 0; z-index: 9999;
                pointer-events: none; opacity: 0;
                background: radial-gradient(circle at var(--ox,50%) var(--oy,50%), var(--overlay-color) 0%, transparent 70%);
                transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1);
            `;
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    function setTheme(theme, originX, originY) {
        if (isThemeTransitioning) return;
        isThemeTransitioning = true;

        const overlay = createThemeOverlay();
        const ox = originX != null ? originX : 50;
        const oy = originY != null ? originY : 50;
        overlay.style.setProperty('--ox', ox + '%');
        overlay.style.setProperty('--oy', oy + '%');
        overlay.style.setProperty('--overlay-color', theme === 'light' ? '#f1f5f9' : '#0a0a0f');

        overlay.style.opacity = '1';

        setTimeout(() => {
            currentTheme = theme;
            html.setAttribute('data-theme', theme);
            localStorage.setItem('aliTheme', theme);
            if (themeCheckbox) themeCheckbox.checked = (theme === 'dark');
            const t = translations[currentLang] || translations.en;
            if (themeCheckbox) {
                themeCheckbox.setAttribute('aria-label', theme === 'dark' ? t.themeToggleLabel : t.themeToggleLabelLight);
            }

            overlay.style.opacity = '0';
            setTimeout(() => { isThemeTransitioning = false; }, 600);
        }, 280);
    }

    function toggleTheme(e) {
        let ox = 50, oy = 10;
        if (e && e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            ox = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
            oy = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
        }
        setTheme(currentTheme === 'dark' ? 'light' : 'dark', ox, oy);
    }

    // ===== LANGUAGE FUNCTIONS =====
    function setLanguage(lang, announce) {
        currentLang = lang;
        localStorage.setItem('aliLang', lang);
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
        if (langLabel) langLabel.textContent = lang === 'en' ? 'EN' : 'FA';

        const t = translations[lang] || translations.en;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                if (key === 'aboutP1' || key === 'aboutP2' || key === 'aboutP3') {
                    el.innerHTML = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
        });

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

        if (themeSwitchContainer) {
            themeSwitchContainer.setAttribute('aria-label', currentTheme === 'dark' ? t.themeToggleLabel : t.themeToggleLabelLight);
        }
        if (langToggle) langToggle.setAttribute('aria-label', t.langToggleLabel);
        if (navToggle) {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-label', isOpen ? t.menuCloseLabel : t.menuOpenLabel);
        }
        if (backToTop) backToTop.setAttribute('aria-label', t.backToTopLabel);

        if (announce && langAnnouncer) langAnnouncer.textContent = t.langAnnounce;
    }

    function toggleLanguage() {
        setLanguage(currentLang === 'en' ? 'fa' : 'en', true);
    }

    // ===== MOBILE NAV MENU =====
    function openMenu() {
        if (!navCenter || !navToggle) return;
        navCenter.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', (translations[currentLang] || translations.en).menuCloseLabel);
        navToggle.classList.add('is-active');
        document.body.style.overflow = '';
    }

    function closeMenu() {
        if (!navCenter || !navToggle) return;
        navCenter.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', (translations[currentLang] || translations.en).menuOpenLabel);
        navToggle.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    function isMenuOpen() {
        return !!(navCenter && navCenter.classList.contains('open'));
    }

    function initMobileNav() {
        if (!navToggle || !navCenter) return;

        navToggle.addEventListener('click', () => {
            isMenuOpen() ? closeMenu() : openMenu();
        });

        navLinks.forEach(link => link.addEventListener('click', () => closeMenu()));

        document.addEventListener('click', (e) => {
            if (!isMenuOpen()) return;
            const nav = document.querySelector('nav');
            if (nav && !nav.contains(e.target)) closeMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen()) {
                closeMenu();
                navToggle.focus();
            }
        });

        const mq = window.matchMedia('(min-width: 769px)');
        const handleViewportChange = (e) => { if (e.matches) closeMenu(); };
        if (mq.addEventListener) mq.addEventListener('change', handleViewportChange);
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        const reveals = document.querySelectorAll('.reveal, .stagger-children, .float-in-left, .float-in-right, .scale-in');
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
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    // ===== SCROLLSPY =====
    function initScrollSpy() {
        const sections = Array.from(document.querySelectorAll('main section[id]'));
        if (!sections.length || !navLinks.length) return;

        const linkBySection = {};
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) linkBySection[href.slice(1)] = link;
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
            const visible = entries.filter(e => e.isIntersecting);
            if (visible.length > 0) {
                visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                setActive(visible[0].target.id);
            }
        }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

        sections.forEach(section => observer.observe(section));
    }

    // ===== SMOOTH SCROLL =====
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
            backToTop.classList.toggle('visible', window.scrollY > 480);
        };
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        });
    }

    // ===== CURSOR GLOW EFFECT (desktop only) =====
    function initCursorGlow() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const glow = document.createElement('div');
        glow.id = 'cursor-glow';
        glow.style.cssText = `
            position:fixed; pointer-events:none; z-index:9998;
            width:400px; height:400px; border-radius:50%;
            background: radial-gradient(circle, rgba(0,217,255,0.04) 0%, transparent 70%);
            transform:translate(-50%,-50%); transition:opacity 0.3s ease;
            opacity:0; will-change:transform;
        `;
        document.body.appendChild(glow);

        let raf;
        let mx = -9999, my = -9999;
        document.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            if (!raf) {
                raf = requestAnimationFrame(() => {
                    glow.style.left = mx + 'px';
                    glow.style.top = my + 'px';
                    glow.style.opacity = '1';
                    raf = null;
                });
            }
        });
        document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    }

    // ===== TYPEWRITER EFFECT FOR HERO =====
    function initTypewriter() {
        const el = document.querySelector('.hero-eyebrow');
        if (!el) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const origText = el.textContent.trim();
        el.textContent = '';
        el.style.opacity = '1';

        let i = 0;
        const speed = 40;
        setTimeout(() => {
            const type = () => {
                if (i < origText.length) {
                    el.textContent = origText.slice(0, ++i);
                    setTimeout(type, speed);
                }
            };
            type();
        }, 600);
    }

    // ===== COUNTER ANIMATION FOR STATS =====
    function initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const text = el.getAttribute('data-target') || el.textContent;
                const numMatch = text.match(/[\d.]+/);
                if (!numMatch) return;
                const end = parseFloat(numMatch[0]);
                const suffix = text.replace(/[\d.]+/, '');
                const duration = 1200;
                const start = performance.now();

                const tick = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.round(eased * end);
                    el.textContent = (currentLang === 'fa' ? toFarsiNums(value.toString()) : value) + suffix;
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => {
            el.setAttribute('data-target', el.textContent);
            observer.observe(el);
        });
    }

    function toFarsiNums(str) {
        return str.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    }

    // ===== NAV SCROLL HIDE/SHOW =====
    function initNavScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        let lastY = 0;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    if (y > 80) {
                        nav.classList.toggle('nav-hidden', y > lastY && y > 200 && !isMenuOpen());
                    } else {
                        nav.classList.remove('nav-hidden');
                    }
                    lastY = y;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== INITIALIZATION =====
    function init() {
        setTheme(currentTheme);
        if (themeCheckbox) {
            themeCheckbox.addEventListener('change', toggleTheme);
        }

        setLanguage(currentLang, false);
        if (langToggle) langToggle.addEventListener('click', toggleLanguage);

        initMobileNav();
        initScrollAnimations();
        initScrollSpy();
        initSmoothScroll();
        initBackToTop();
        initCursorGlow();
        initTypewriter();
        initCounters();
        initNavScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
