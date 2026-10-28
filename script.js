"use strict";


/* ============================================================
   VANTA — MASTER MOTION ENGINE
============================================================ */


/* ============================================================
   DOM
============================================================ */

const body =
    document.body;

const loader =
    document.getElementById("loader");

const loaderNumber =
    document.querySelector(".loader__number");

const loaderProgress =
    document.querySelector(".loader__progress");

const header =
    document.querySelector(".header");

const progressFill =
    document.querySelector(".page-progress__fill");

const cursor =
    document.querySelector(".cursor");

const cursorText =
    document.querySelector(".cursor__text");

const parallaxElements =
    [...document.querySelectorAll(".parallax")];

const parallaxMedia =
    [...document.querySelectorAll(".parallax-media")];

const revealElements =
    [
        ...document.querySelectorAll(
            ".reveal, .title-reveal, .word-reveal"
        )
    ];

const magneticElements =
    [...document.querySelectorAll(".magnetic")];

const cursorTargets =
    [...document.querySelectorAll(".cursor-target")];

const sectionTracks =
    [...document.querySelectorAll(".section-track")];

const sideActive =
    document.querySelector(".side-index__active");

const sideProgress =
    document.querySelector(".side-index__line div");


/* ============================================================
   ENVIRONMENT
============================================================ */

const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

const finePointer =
    window.matchMedia(
        "(pointer: fine)"
    ).matches;


/* ============================================================
   STATE
============================================================ */

const state = {

    scrollY: window.scrollY,

    viewportWidth: window.innerWidth,

    viewportHeight: window.innerHeight,

    maxScroll: 1,

    mouseX: window.innerWidth / 2,

    mouseY: window.innerHeight / 2,

    cursorX: window.innerWidth / 2,

    cursorY: window.innerHeight / 2

};


/* ============================================================
   HELPERS
============================================================ */

function lerp(start, end, amount) {

    return start + (end - start) * amount;

}


function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}


/* ============================================================
   METRICS
============================================================ */

function updateMetrics() {

    state.viewportWidth =
        window.innerWidth;

    state.viewportHeight =
        window.innerHeight;

    state.maxScroll =
        Math.max(
            document.documentElement.scrollHeight -
            state.viewportHeight,
            1
        );

}


updateMetrics();


/* ============================================================
   LOADER
============================================================ */

body.classList.add("loading");


function startLoader() {

    const duration = 1450;

    const start =
        performance.now();


    function update(time) {

        const elapsed =
            time - start;

        const ratio =
            clamp(
                elapsed / duration,
                0,
                1
            );

        const eased =
            1 - Math.pow(
                1 - ratio,
                4
            );

        const value =
            Math.round(eased * 100);


        loaderNumber.textContent =
            String(value).padStart(2, "0");

        loaderProgress.style.transform =
            `scaleX(${value / 100})`;


        if (ratio < 1) {

            requestAnimationFrame(update);

            return;

        }


        setTimeout(() => {

            loader.classList.add("hidden");

            body.classList.remove("loading");

            revealHero();

        }, 250);

    }


    requestAnimationFrame(update);

}


window.addEventListener(
    "load",
    startLoader,
    { once: true }
);


/* ============================================================
   HERO REVEAL
============================================================ */

function revealHero() {

    const heroElements =
        document.querySelectorAll(
            ".hero .reveal, .hero .title-reveal"
        );


    heroElements.forEach(
        (element, index) => {

            setTimeout(() => {

                element.classList.add("visible");

            }, index * 130);

        }
    );

}


/* ============================================================
   MASTER PARALLAX
============================================================ */

function updateParallax() {

    if (reducedMotion) {
        return;
    }


    parallaxElements.forEach(element => {

        const speed =
            Number(element.dataset.speed || 0);

        const section =
            element.closest("section");

        if (!section) {
            return;
        }


        const rect =
            section.getBoundingClientRect();

        const center =
            rect.top +
            rect.height / 2;

        const viewportCenter =
            state.viewportHeight / 2;

        const distance =
            center - viewportCenter;

        const movement =
            distance * speed;


        element.style.transform =
            `translate3d(0, ${movement}px, 0)`;

    });


    parallaxMedia.forEach(element => {

        const speed =
            Number(
                element.dataset.mediaSpeed || 0.1
            );

        const parent =
            element.parentElement;

        if (!parent) {
            return;
        }


        const rect =
            parent.getBoundingClientRect();

        if (
            rect.bottom < 0 ||
            rect.top > state.viewportHeight
        ) {

            return;

        }


        const center =
            rect.top +
            rect.height / 2;

        const viewportCenter =
            state.viewportHeight / 2;

        const distance =
            center - viewportCenter;

        const movement =
            distance * speed;


        element.style.transform =
            `translate3d(0, ${movement}px, 0) scale(1.04)`;

    });

}


/* ============================================================
   SCROLL PROGRESS
============================================================ */

function updateProgress() {

    const progress =
        clamp(
            state.scrollY /
            state.maxScroll,
            0,
            1
        );


    progressFill.style.transform =
        `scaleX(${progress})`;

}


/* ============================================================
   HEADER
============================================================ */

function updateHeader() {

    header.classList.toggle(
        "scrolled",
        state.scrollY > 60
    );

}


/* ============================================================
   SECTION TRACKING
============================================================ */

function updateSectionTracking() {

    let activeIndex = 0;


    sectionTracks.forEach(
        (section, index) => {

            const rect =
                section.getBoundingClientRect();


            if (
                rect.top <=
                state.viewportHeight * 0.5
            ) {

                activeIndex = index;

            }

        }
    );


    const activeSection =
        sectionTracks[activeIndex];


    if (!activeSection) {
        return;
    }


    sideActive.textContent =
        activeSection.dataset.section;


    const sectionProgress =
        (activeIndex + 1) /
        sectionTracks.length;


    sideProgress.style.height =
        `${sectionProgress * 100}%`;

}


/* ============================================================
   CURSOR
============================================================ */

if (finePointer) {

    window.addEventListener(
        "pointermove",
        event => {

            state.mouseX =
                event.clientX;

            state.mouseY =
                event.clientY;

        },
        { passive: true }
    );


    cursorTargets.forEach(target => {

        target.addEventListener(
            "pointerenter",
            () => {

                cursor.classList.add("active");

                cursorText.textContent =
                    target.dataset.cursor || "";

            }
        );


        target.addEventListener(
            "pointerleave",
            () => {

                cursor.classList.remove("active");

                cursorText.textContent = "";

            }
        );

    });

}


function updateCursor() {

    if (!finePointer) {
        return;
    }


    state.cursorX =
        lerp(
            state.cursorX,
            state.mouseX,
            0.18
        );

    state.cursorY =
        lerp(
            state.cursorY,
            state.mouseY,
            0.18
        );


    cursor.style.transform =
        `
        translate3d(
            ${state.cursorX}px,
            ${state.cursorY}px,
            0
        )
        translate(-50%, -50%)
        `;

}


/* ============================================================
   MAGNETIC ELEMENTS
============================================================ */

if (
    finePointer &&
    !reducedMotion
) {

    magneticElements.forEach(element => {

        element.addEventListener(
            "pointermove",
            event => {

                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                element.style.transform =
                    `
                    translate3d(
                        ${x * 0.18}px,
                        ${y * 0.18}px,
                        0
                    )
                    `;

            }
        );


        element.addEventListener(
            "pointerleave",
            () => {

                element.style.transform =
                    "translate3d(0, 0, 0)";

            }
        );

    });

}


/* ============================================================
   REVEAL OBSERVER
============================================================ */

const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }


                const element =
                    entry.target;

                const parent =
                    element.parentElement;

                let delay = 0;


                if (parent) {

                    const siblings =
                        [
                            ...parent.children
                        ].filter(child => {

                            return (
                                child.classList.contains("reveal") ||
                                child.classList.contains("title-reveal") ||
                                child.classList.contains("word-reveal")
                            );

                        });


                    const index =
                        siblings.indexOf(element);


                    if (index >= 0) {

                        delay =
                            Math.min(
                                index * 100,
                                400
                            );

                    }

                }


                setTimeout(() => {

                    element.classList.add("visible");

                }, delay);


                revealObserver.unobserve(element);

            });

        },

        {
            threshold: 0.12,

            rootMargin:
                "0px 0px -8% 0px"
        }

    );


revealElements.forEach(element => {

    if (!element.closest(".hero")) {

        revealObserver.observe(element);

    }

});


/* ============================================================
   PROJECT POINTER DEPTH
============================================================ */

if (
    finePointer &&
    !reducedMotion
) {

    document.querySelectorAll(".project").forEach(
        project => {

            const visual =
                project.querySelector(
                    ".project__visual"
                );


            if (!visual) {
                return;
            }


            project.addEventListener(
                "pointermove",
                event => {

                    const rect =
                        project.getBoundingClientRect();

                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) / rect.width - 0.5;

                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) / rect.height - 0.5;


                    visual.style.marginLeft =
                        `${x * 18}px`;

                    visual.style.marginTop =
                        `${y * 18}px`;

                }
            );


            project.addEventListener(
                "pointerleave",
                () => {

                    visual.style.marginLeft = "0px";

                    visual.style.marginTop = "0px";

                }
            );

        }
    );

}


/* ============================================================
   SMOOTH ANCHORS
============================================================ */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener(
        "click",
        event => {

            const href =
                anchor.getAttribute("href");


            if (
                !href ||
                href === "#"
            ) {

                return;

            }


            const target =
                document.querySelector(href);


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({

                behavior:
                    reducedMotion
                        ? "auto"
                        : "smooth",

                block: "start"

            });

        }
    );

});


/* ============================================================
   RENDER LOOP
============================================================ */

function render() {

    state.scrollY =
        window.scrollY;


    updateParallax();

    updateProgress();

    updateHeader();

    updateSectionTracking();

    updateCursor();


    requestAnimationFrame(render);

}


requestAnimationFrame(render);


/* ============================================================
   RESIZE
============================================================ */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(resizeTimer);


        resizeTimer =
            setTimeout(() => {

                updateMetrics();

            }, 120);

    },
    { passive: true }
);


/* ============================================================
   INITIAL
============================================================ */

updateMetrics();

updateProgress();

updateHeader();

updateSectionTracking();