/* =============================================
   POSTMARK REAL-TIME DATE GENERATOR
   ============================================= */
function updatePostmarkDate() {
    const dateElements = document.querySelectorAll('.postmark-date');
    if (dateElements.length > 0) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        const formattedDate = `${day}.${month}.${year}`;
        dateElements.forEach(el => { el.innerText = formattedDate; });
    }
}

(function () {
    const pageContent = document.getElementById('page-content');

    function navigateTo(url) {
        // Fade out current content
        pageContent.style.opacity = '0';
        pageContent.style.transform = 'translateY(8px)';

        fetch(url)
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.getElementById('page-content');
                if (!newContent) return;

                // Hide before injecting to prevent FOUC
                pageContent.style.visibility = 'hidden';
                pageContent.style.opacity = '0';

                // Swap content
                pageContent.innerHTML = newContent.innerHTML;

                // Update browser URL without reload
                history.pushState({ url }, '', url);

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    const linkFile = link.getAttribute('href').split('/').pop();
                    const currentFile = url.split('/').pop();
                    link.classList.toggle('active', linkFile === currentFile);
                });

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Wait for fonts, then reveal with fade-in
                function revealContent() {
                    pageContent.style.visibility = 'visible';
                    requestAnimationFrame(() => {
                        pageContent.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                        pageContent.style.opacity = '1';
                        pageContent.style.transform = 'translateY(0)';
                    });
                    // Re-run page scripts after reveal
                    initPageScripts();
                }

                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(revealContent);
                } else {
                    setTimeout(revealContent, 150);
                }
            })
            .catch(() => {
                window.location.href = url;
            });
    }

    // Intercept nav link clicks
    document.addEventListener('click', function (e) {
        const navLink = e.target.closest('.nav-link, .nav-logo');
        const spaLink = e.target.closest('.spa-nav');

        if (navLink && !navLink.target) {
            e.preventDefault();
            const url = navLink.getAttribute('href');
            if (url && !url.startsWith('#') && url !== window.location.pathname.split('/').pop()) {
                navigateTo(url);
            }
        } else if (spaLink) {
            e.preventDefault();
            const url = spaLink.getAttribute('data-href');
            if (url) navigateTo(url);
        }
    });

    // Mobile Navigation Drawer Toggle & Auto-Close Logic
    document.addEventListener('click', function (e) {
        const toggleBtn = e.target.closest('.nav-toggle');
        if (toggleBtn) {
            e.stopPropagation();
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                toggleBtn.classList.toggle('active');
                navLinks.classList.toggle('active');
            }
            return;
        }

        const clickedNavLink = e.target.closest('.nav-link, .nav-logo');
        const clickedInsideNav = e.target.closest('.sticky-nav');
        if (clickedNavLink || !clickedInsideNav) {
            const activeToggle = document.querySelector('.nav-toggle.active');
            const activeLinksMenu = document.querySelector('.nav-links.active');
            if (activeToggle && activeLinksMenu) {
                activeToggle.classList.remove('active');
                activeLinksMenu.classList.remove('active');
            }
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.url) {
            navigateTo(e.state.url);
        }
    });

    // Initial state for back button support
    history.replaceState({ url: window.location.href }, '', window.location.href);

    // Set initial fade-in ready state
    if (pageContent) {
        pageContent.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        pageContent.style.opacity = '1';
        pageContent.style.transform = 'translateY(0)';
    }

    function initPageScripts() {
        updatePostmarkDate();

        // Re-init sticky note observer
        const stickies = document.querySelectorAll('.sticky');
        if (stickies.length > 0) {
            const stickyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.15 });
            stickies.forEach(s => stickyObserver.observe(s));
        }

        // Re-observe scroll animations
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 1500;
                        const increment = target / (duration / 20);
                        let current = 0;
                        const update = () => {
                            current += increment;
                            if (current < target) { counter.innerText = Math.ceil(current); setTimeout(update, 20); }
                            else counter.innerText = target;
                        };
                        update();
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

        // Re-init lightbox for timeline images
        const images = document.querySelectorAll('.timeline-visual img');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightbox && lightboxImg) {
            images.forEach(img => {
                img.addEventListener('click', function () {
                    lightbox.style.display = 'flex';
                    setTimeout(() => lightbox.classList.add('show'), 10);
                    lightboxImg.src = this.src;
                });
            });
        }
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    updatePostmarkDate();
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 1500;
                        const increment = target / (duration / 20);
                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.innerText = Math.ceil(current);
                                setTimeout(updateCounter, 20);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCounter();
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // --- Lightbox Logic ---
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightbox-img">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    const images = document.querySelectorAll('.timeline-visual img');
    images.forEach(img => {
        img.addEventListener('click', function () {
            lightbox.style.display = 'flex';
            setTimeout(() => { lightbox.classList.add('show'); }, 10);
            lightboxImg.src = this.src;
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('show');
        setTimeout(() => { lightbox.style.display = 'none'; }, 300);
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) { closeLightbox(); }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeLightbox(); }
    });

    // --- Stats Modal Logic ---
    const statsModal = document.createElement('div');
    statsModal.id = 'stats-modal';
    statsModal.className = 'lightbox-modal';
    statsModal.innerHTML = `
        <div class="stats-modal-content">
            <span class="stats-close">&times;</span>
            <h3 id="stats-title">Projects</h3>
            <ul id="stats-list"></ul>
        </div>
    `;
    document.body.appendChild(statsModal);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .stats-modal-content {
            background: #1e1e24;
            padding: 30px;
            border-radius: 12px;
            border: 1px solid var(--primary);
            max-width: 400px;
            width: 90%;
            text-align: left;
            position: relative;
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }
        .stats-close {
            position: absolute; top: 10px; right: 15px;
            font-size: 24px; cursor: pointer; color: #ccc;
        }
        .stats-close:hover { color: #fff; }
        #stats-list { list-style: none; padding: 0; margin-top: 15px; }
        #stats-list li {
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            color: var(--text-muted);
        }
        #stats-list li:last-child { border-bottom: none; }
        #stats-title { margin-top: 0; color: var(--primary); font-size: 1.5rem; }
    `;
    document.head.appendChild(styleSheet);

    const statsCloseBtn = statsModal.querySelector('.stats-close');

    window.showProjectList = function (category) {
        const statsList = document.getElementById('stats-list');
        const statsTitle = document.getElementById('stats-title');
        statsList.innerHTML = '';

        let projects = [];
        let title = "";

        if (category === 'hardware') {
            title = "Hardware Projects";
            projects = ["Autonomous Mine Rover", "Crystal pickup pre-amplifier"];
        } else if (category === 'software') {
            title = "Software Projects";
            projects = ["College Clubs Portal", "Moneyloop Website"];
        } else if (category === 'patent') {
            title = "Patented Project";
            projects = ["Autonomous Mine Rover"];
        }

        statsTitle.innerText = title;
        projects.forEach(proj => {
            const li = document.createElement('li');
            li.innerText = proj;
            statsList.appendChild(li);
        });

        statsModal.style.display = 'flex';
        setTimeout(() => { statsModal.classList.add('show'); }, 10);
    };

    function closeStatsModal() {
        statsModal.classList.remove('show');
        setTimeout(() => { statsModal.style.display = 'none'; }, 300);
    }

    statsCloseBtn.addEventListener('click', closeStatsModal);
    statsModal.addEventListener('click', function (e) {
        if (e.target === statsModal) { closeStatsModal(); }
    });
});
