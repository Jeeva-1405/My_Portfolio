document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Trigger Counter Animation if present
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 1500; // ms
                        const increment = target / (duration / 20); // 20ms frame

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

                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));

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

    // Add click event to all achievement photos
    const images = document.querySelectorAll('.timeline-visual img');
    images.forEach(img => {
        img.addEventListener('click', function () {
            lightbox.style.display = 'flex';
            // slight delay to allow display flex to apply before opacity transition
            setTimeout(() => { lightbox.classList.add('show'); }, 10);
            lightboxImg.src = this.src;
        });
    });

    // Close function
    function closeLightbox() {
        lightbox.classList.remove('show');
        setTimeout(() => { lightbox.style.display = 'none'; }, 300); // Wait for transition
    }

    // Close on X click
    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // --- Background "Real-Time Coding" Animation ---
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    // Config
    const fontSize = 14;
    const lineHeight = 20;
    const typingSpeed = 0.3; // Slower speed

    // Code Data: Text to type + Corresponding Output
    const codeData = [
        { text: "// Loading Profile...", output: "> Loading modules..." },
        { text: "User: You", output: "> User session: Active" },
        { text: "Developer: Jeeva", output: "> Dev profile: Verified" },
        { text: "", output: "" },
        { text: "Stats = {", output: "> Allocating memory..." },
        { text: "    Passion: '100%',", output: "> Passion set to MAX" },
        { text: "    Creativity: 'Unlimited',", output: "> Constraints detected: 0" },
        { text: "    Goal: 'Building the Future'", output: "> Target locked: FUTURE" },
        { text: "};", output: "> Object 'Stats' created OK" },
        { text: "", output: "" },
        { text: "if (Great_Idea_Detected) {", output: "> Event: IDEA_FOUND" },
        { text: "    Let's_Build_It();", output: "> Executing build process..." },
        { text: "}", output: "> Waiting for input..." },
        { text: "", output: "" },
        { text: "// Why hire me?", output: "> Running query..." },
        { text: "Result = 'Problem Solver';", output: "> Result: TRUE" },
        { text: "", output: "" },
        { text: "while (Alive) {", output: "> Main loop started" },
        { text: "    Innovate();", output: "> Innovation engine: ON" },
        { text: "    Make_Impact();", output: "> Impact factor: Rising" },
        { text: "}", output: "" },
        { text: "", output: "" },
        { text: "Contact_Me();", output: "> Opening comms channel..." },
        { text: "// Scroll down! ⬇", output: "> Rendering portfolio..." }
    ];

    let cursor = { x: 20, y: 40, lineIndex: 0, charIndex: 0 };
    let linesDrawn = []; // Buffer of code lines
    let outputLog = [];  // Buffer of output lines
    let opacity = 0.15;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        cursor.x = 50; // Increased padding from 20
        cursor.y = 40;
        cursor.lineIndex = 0;
        cursor.charIndex = 0;
        linesDrawn = [];
        outputLog = [];

        ctx.font = fontSize + "px 'Roboto Mono', monospace";
    }

    function animate() {
        requestAnimationFrame(animate);

        // Clear
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = `rgba(74, 222, 128, ${opacity})`; // Mild Green
        ctx.font = fontSize + "px 'Roboto Mono', monospace";

        // --- LEFT SIDE: Code Typing ---
        ctx.textAlign = 'left';
        for (let i = 0; i < linesDrawn.length; i++) {
            ctx.fillText(linesDrawn[i], 50, 40 + (i * lineHeight)); // Increased padding
        }

        const currentLineObj = codeData[cursor.lineIndex % codeData.length];
        const currentLineStr = currentLineObj.text;
        const currentPartial = currentLineStr.substring(0, Math.floor(cursor.charIndex));

        const cursorChar = (Math.floor(Date.now() / 500) % 2 === 0) ? "█" : "";
        ctx.fillText(currentPartial + cursorChar, 50, 40 + (linesDrawn.length * lineHeight)); // Increased padding

        // Advance Cursor
        if (Math.random() > 0.1) {
            cursor.charIndex += typingSpeed;
        }

        // Line Complete Logic
        if (cursor.charIndex > currentLineStr.length) {
            linesDrawn.push(currentLineStr);

            // Add corresponding output to the right side
            if (currentLineObj.output) {
                outputLog.push(currentLineObj.output);
                // Scroll output if full (Adjusted for larger spacing)
                if (outputLog.length > (height / (lineHeight * 1.8)) - 2) {
                    outputLog.shift();
                }
            }

            cursor.charIndex = 0;
            cursor.lineIndex++;

            // Scroll code if full
            if ((linesDrawn.length * lineHeight) > height - 60) {
                linesDrawn.shift();
            }
        }

        // --- RIGHT SIDE: Execution Output ---
        ctx.textAlign = 'right';
        for (let i = 0; i < outputLog.length; i++) {
            // Use larger spacing (lineHeight * 1.8) for right side
            ctx.fillText(outputLog[i], width - 50, 40 + (i * (lineHeight * 1.8)));
        }
        ctx.textAlign = 'left'; // Reset
    }

    // Setup events and start
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    // --- Stats Modal Logic ---
    const statsModal = document.createElement('div');
    statsModal.id = 'stats-modal';
    statsModal.className = 'lightbox-modal'; // Reuse lightbox styles
    statsModal.innerHTML = `
        <div class="stats-modal-content">
            <span class="stats-close">&times;</span>
            <h3 id="stats-title">Projects</h3>
            <ul id="stats-list"></ul>
        </div>
    `;
    document.body.appendChild(statsModal);

    // Add styles for text content since lightbox was img only
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
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #ccc;
        }
        .stats-close:hover { color: #fff; }
        #stats-list {
            list-style: none;
            padding: 0;
            margin-top: 15px;
        }
        #stats-list li {
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            color: var(--text-muted);
        }
        #stats-list li:last-child { border-bottom: none; }
        #stats-title {
            margin-top: 0;
            color: var(--primary);
            font-size: 1.5rem;
        }
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
        if (e.target === statsModal) {
            closeStatsModal();
        }
    });

});
