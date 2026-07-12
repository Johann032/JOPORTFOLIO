/* ============================================================
   script.js — Beyond-imagination interactions
   ============================================================ */
(function () {
    'use strict';

    /* ========================
       DOM
       ======================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkEls = document.querySelectorAll('.nav-link');

    /* ========================
       CUSTOM CURSOR
       ======================== */
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Dot — snappy
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        // Ring — smooth lag
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverTargets = document.querySelectorAll('a, button, .project-row, .magnetic');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* ========================
       MAGNETIC EFFECT
       ======================== */
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    /* ========================
       NAVBAR
       ======================== */
    function handleScroll() {
        const scrollY = window.scrollY;

        // Scrolled class
        navbar.classList.toggle('scrolled', scrollY > 60);

        // Active section
        const sections = document.querySelectorAll('.section, .hero-section');
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 140;
            if (scrollY >= top && scrollY < top + sec.offsetHeight) {
                current = sec.id;
            }
        });

        navLinkEls.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinkEls.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    /* ========================
       SMOOTH SCROLL
       ======================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ========================
       SCROLL REVEAL
       ======================== */
    const revealEls = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger siblings
                    const siblings = entry.target.parentElement.querySelectorAll('.reveal-up');
                    let index = 0;
                    siblings.forEach((sib, idx) => {
                        if (sib === entry.target) index = idx;
                    });
                    entry.target.style.transitionDelay = (index * 0.08) + 's';
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));

    /* ========================
       SKILL BARS
       ======================== */
    const skillFills = document.querySelectorAll('.pill-fill');

    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const w = entry.target.dataset.width;
                    entry.target.style.width = w + '%';
                    skillObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    skillFills.forEach(f => skillObserver.observe(f));

    /* ========================
       STAT COUNTERS
       ======================== */
    const metrics = document.querySelectorAll('.metric-value[data-count]');

    const metricObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 30));
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        el.textContent = current;
                    }, 40);
                    metricObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    metrics.forEach(m => metricObserver.observe(m));

    /* ========================
       TERMINAL TYPING
       ======================== */
    const terminalBody = document.getElementById('terminalBody');
    const terminalCommands = [
        { cmd: 'whoami', out: 'johann-cherian-ajish' },
        { cmd: 'cat skills.txt', out: 'Python | JavaScript | Networking\nWeb Security | Linux | Burp Suite' },
        { cmd: 'nmap -sV portfolio.dev', out: 'PORT   STATE  SERVICE\n443    open   https\n22     open   ssh (secured)' },
        { cmd: 'echo "Let\'s connect!"', out: '"Let\'s connect!"' },
    ];

    let terminalStarted = false;

    function typeText(element, text, speed, callback) {
        let i = 0;
        function step() {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
                setTimeout(step, speed + Math.random() * 40);
            } else if (callback) {
                callback();
            }
        }
        step();
    }

    function runTerminal() {
        if (terminalStarted) return;
        terminalStarted = true;
        terminalBody.innerHTML = '';

        let cmdIdx = 0;

        function nextCmd() {
            if (cmdIdx >= terminalCommands.length) {
                // Restart after delay
                setTimeout(() => {
                    terminalBody.innerHTML = '';
                    cmdIdx = 0;
                    terminalStarted = false;
                    runTerminal();
                }, 4000);
                return;
            }

            const { cmd, out } = terminalCommands[cmdIdx];
            cmdIdx++;

            // Prompt line
            const line = document.createElement('div');
            line.className = 'term-line';

            const prompt = document.createElement('span');
            prompt.className = 'term-prompt';
            prompt.textContent = '$ ';

            const cmdSpan = document.createElement('span');

            const cursor = document.createElement('span');
            cursor.className = 'term-cursor';

            line.appendChild(prompt);
            line.appendChild(cmdSpan);
            line.appendChild(cursor);
            terminalBody.appendChild(line);

            typeText(cmdSpan, cmd, 50, () => {
                cursor.remove();

                // Output
                const outEl = document.createElement('div');
                outEl.className = 'term-line term-output';
                outEl.style.whiteSpace = 'pre-wrap';
                outEl.textContent = out;
                outEl.style.opacity = '0';
                terminalBody.appendChild(outEl);

                setTimeout(() => {
                    outEl.style.transition = 'opacity 0.3s';
                    outEl.style.opacity = '1';
                    setTimeout(nextCmd, 1200);
                }, 150);
            });
        }

        nextCmd();
    }

    const aboutSection = document.getElementById('about');
    const termObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(runTerminal, 800);
                    termObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );
    termObserver.observe(aboutSection);

    /* ========================
       PARALLAX ORBS
       ======================== */
    const orbs = document.querySelectorAll('.orb');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 8;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    /* ========================
       RESUME MODAL
       ======================== */
    const btnDownloadResume = document.getElementById('btnDownloadResume');
    const resumeModal = document.getElementById('resumeModal');
    const modalCancel = document.getElementById('modalCancel');
    const modalAgree = document.getElementById('modalAgree');
    const agreeCheckbox = document.getElementById('agreeCheckbox');

    if (btnDownloadResume && resumeModal) {
        // Intercept download click
        btnDownloadResume.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent direct download
            
            // Reset modal state
            agreeCheckbox.checked = false;
            modalAgree.disabled = true;
            
            // Show modal
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Close on cancel
        modalCancel.addEventListener('click', () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on overlay click
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Toggle agree button based on checkbox
        agreeCheckbox.addEventListener('change', () => {
            modalAgree.disabled = !agreeCheckbox.checked;
        });

        // Trigger actual download on agree
        modalAgree.addEventListener('click', () => {
            // Close modal
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';

            // Create temporary link to trigger download programmatically
            const link = document.createElement('a');
            link.href = btnDownloadResume.href;
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

})();
