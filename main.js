document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(SplitText, CustomEase);
    CustomEase.create("hop", ".87, .0, .13, 1");

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- DOM Element Selectors ---
    const container = document.querySelector(".container");
    const menuToggleBtn = document.querySelector(".menu-toggle-btn");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuOverlayContainer = document.querySelector(".menu-overlay-content");
    const menuMediaWrapper = document.querySelector(".menu-media-wrapper");
    const menuToggleLabel = document.querySelector(".menu-toggle-label p");
    const hamburgerIcon = document.querySelector(".menu-hamburger-icon");
    const menuLinks = document.querySelectorAll(".menu-link a"); // Get all menu links

    // --- State Variables ---
    let isMenuOpen = false;
    let isAnimating = false;

    // --- SplitText Setup for Menu Animations ---
    const textContainers = document.querySelectorAll(".menu-col");
    let splitTextByContainer = [];

    textContainers.forEach((container) => {
        const textElements = container.querySelectorAll("a, p");
        let containerSplits = [];

        textElements.forEach((textElement) => {
            const split = SplitText.create(textElement, {
                type: "lines",
                mask: "lines",
                lineClass: "lines"
            });
            containerSplits.push(split);
            gsap.set(split.lines, { y: "-110%" });
        });
        splitTextByContainer.push(containerSplits);
    });

    // --- Menu Functions ---

    /**
     * Opens the menu with a GSAP timeline animation.
     */
    function openMenu() {
        if (isAnimating || isMenuOpen) return;
        isAnimating = true;
        lenis.stop(); // Stop smooth scrolling when menu is open

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                isMenuOpen = true;
            }
        });

        tl.to(menuToggleLabel, {
            y: "-110%",
            duration: 1,
            ease: "hop",
        }).to(
            container, {
                y: "100svh",
                duration: 1,
                ease: "hop",
            },
            "<"
        ).to(
            menuOverlay, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 1,
                ease: "hop",
            },
            "<"
        ).to(
            menuOverlayContainer, {
                yPercent: 0,
                duration: 1,
                ease: "hop",
            },
            "<"
        ).to(
            menuMediaWrapper, {
                opacity: 1,
                duration: 0.75,
                ease: "power2.out",
                delay: 0.25,
            },
            "<"
        );

        // Animate text lines into view
        splitTextByContainer.forEach((containerSplits) => {
            const copyLines = containerSplits.flatMap((split) => split.lines);
            tl.to(
                copyLines, {
                    y: "0%",
                    duration: 1.2,
                    ease: "hop",
                    stagger: -0.065,
                },
                "-=0.85" // Overlap with previous animations
            );
        });

        hamburgerIcon.classList.add("active");
    }

    /**
     * Closes the menu and optionally scrolls to a target.
     * @param {string|null} target - The selector of the element to scroll to (e.g., "#portfolio").
     */
    function closeMenu(target = null) {
        if (isAnimating || !isMenuOpen) return;
        isAnimating = true;
        lenis.start(); // Resume smooth scrolling

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                isMenuOpen = false;
                // Reset text lines to their initial hidden state
                const allLines = splitTextByContainer.flatMap(containerSplits => containerSplits.flatMap(split => split.lines));
                gsap.set(allLines, { y: "-110%" });

                // After the menu is closed, scroll to the target section
                if (target) {
                    // A small delay to ensure the page is ready for scrolling
                    setTimeout(() => {
                         lenis.scrollTo(target, {
                            offset: 0, 
                            duration: 1.5, 
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        });
                    }, 100);
                }
            }
        });

        tl.to(container, {
            y: "0svh",
            duration: 1,
            ease: "hop",
        }).to(
            menuOverlay, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                duration: 1,
                ease: "hop",
            },
            "<"
        ).to(
            menuToggleLabel, {
                y: "0%",
                duration: 1,
                ease: "hop",
            },
            "<"
        );

        hamburgerIcon.classList.remove("active");
    }

    // --- Event Listeners ---

    // Listener for the main menu toggle button
    menuToggleBtn.addEventListener("click", () => {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Listener for each link inside the menu
    menuLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor behavior to allow for smooth scroll
            const target = link.getAttribute('href');
            
            // Check if the menu is open and a valid target exists on the page
            if (isMenuOpen && target && document.querySelector(target)) {
                closeMenu(target);
            } else if (isMenuOpen) {
                // If the link is invalid but menu is open, just close it
                closeMenu();
                console.warn(`Peringatan: Target navigasi "${target}" tidak ditemukan di halaman.`);
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
        const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to full screen size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters to use for the rain (Katakana is classic for Matrix)
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const charArray = characters.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize; // Number of columns for the rain

    // Array to track the y-position of each drop
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    // Function to draw the animation frame by frame
    function draw() {
        // Fill canvas with a semi-transparent black to create the fading trail effect
        ctx.fillStyle = 'rgba(23, 23, 23, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set the color and font for the falling characters
        ctx.fillStyle = '#00FF41'; // Green color, matching your terminal
        ctx.font = fontSize + 'px monospace';

        // Loop through each column (each drop)
        for (let i = 0; i < drops.length; i++) {
            // Get a random character to draw
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Draw the character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reset the drop to the top if it goes off screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Move the drop down by one position
            drops[i]++;
        }
    }

    // Start the animation loop
    setInterval(draw, 33);
    
    
    
    // --- Modern Terminal Preloader ---
    const terminal = document.getElementById("terminal");
    const preloader = document.getElementById("preloader");
    const prompts = [
        "Booting renderer...",
        "Loading custom fonts...",
        "Calibrating color palettes...",
        "Compiling GSAP animations...",
        "Syamil Alfatih - Online."
    ];

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function typeLine(lineText) {
        const line = document.createElement("div");
        line.className = "terminal-line";

        // This is the updated part that creates the colorful prompt
        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.innerHTML = `<span class="prompt-user">syamil@portfolio</span><span class="prompt-symbol">:~$</span>`;

        const text = document.createElement("span");
        const cursor = document.createElement("span");
        cursor.className = "cursor";

        line.appendChild(prompt);
        line.appendChild(text);
        line.appendChild(cursor);
        terminal.appendChild(line);

        for (let i = 0; i < lineText.length; i++) {
            text.textContent += lineText.charAt(i);
            await delay(75);
        }

        line.removeChild(cursor);
    }

    async function runSequence() {
        await delay(500);

        for (const promptText of prompts) {
            await typeLine(promptText);
            await delay(400);
        }

        await delay(1000);

        // --- NEW: Scatter and Reveal Animation ---
        
        // 1. Select all the text lines that have been created
        const lines = terminal.querySelectorAll(".terminal-line");

        // 2. Use SplitText to break the lines into individual characters
        const split = new SplitText(lines, { type: "chars" });
        const chars = split.chars; // An array of all character elements

        // 3. Create the GSAP timeline
        const tl = gsap.timeline({
            onComplete: () => {
                preloader.style.display = "none"; // Hide preloader when done
            }
        });

        // 4. Add the animations to the timeline
        tl.to(chars, {
            duration: 0.5,
            opacity: 0,
            x: () => gsap.utils.random(-400, 400),
            y: () => gsap.utils.random(-300, 300),
            rotation: () => gsap.utils.random(-360, 360),
            ease: "power2.inOut",
            stagger: {
                each: 0.02,
                from: "random"
            }
        }).to("#background-canvas", {
            duration: 0.5,
            opacity: 0
        }, "<0.5"); // Start fading the canvas 0.5s after the scatter starts
    }

    runSequence();

});