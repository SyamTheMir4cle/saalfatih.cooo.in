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
    // --- Preloader Terminal Animation ---
    const terminalText = document.getElementById("terminal-text");
    const preloader = document.getElementById("preloader");
    const words = ["Booting system...", "Loading assets...", "Compiling styles...", "Welcome to.."];
    let wordIndex = 0;
    let charIndex = 0;

    function type() {
        // Check if there are still words to type
        if (wordIndex < words.length) {
            // Check if the current word is still being typed
            if (charIndex < words[wordIndex].length) {
                terminalText.textContent += words[wordIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, 100); // Speed of typing
            } else {
                // Word is finished, prepare for the next word
                wordIndex++;
                charIndex = 0;
                setTimeout(() => {
                    terminalText.textContent = ""; // Clear the text
                    type();
                }, 1500); // Pause between words
            }
        } else {
            // All words have been typed, hide the preloader
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.75,
                onComplete: () => {
                    preloader.style.display = "none";
                }
            });
        }
    }

    type(); // Start the animation

});