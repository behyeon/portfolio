/* ========================================
   MOBILE MENU
======================================== */

const menuToggle =
  document.querySelector(".menu-toggle");

const navigation =
  document.querySelector(".nav");


if (menuToggle && navigation) {

  menuToggle.addEventListener(
    "click",
    () => {

      const open =
        menuToggle.classList.toggle(
          "active"
        );

      navigation.classList.toggle(
        "open",
        open
      );

      menuToggle.setAttribute(
        "aria-expanded",
        open
      );

    }
  );


  navigation
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          menuToggle.classList.remove(
            "active"
          );

          navigation.classList.remove(
            "open"
          );

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

}


/* ========================================
   GENERAL FADE-IN
======================================== */

const fadeElements =
  document.querySelectorAll(
    ".fade-in-up"
  );


const fadeObserver =
  new IntersectionObserver(

    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }


        entry.target.classList.add(
          "visible"
        );


        observer.unobserve(
          entry.target
        );

      });

    },

    {
      threshold: 0.1
    }

  );


fadeElements.forEach((element) => {

  fadeObserver.observe(element);

});


/* ========================================
   HERO PARALLAX
======================================== */

const heroVisual =
  document.querySelector(
    ".hero-visual"
  );

const heroImage =
  document.querySelector(
    ".hero-visual-image"
  );


function updateParallax() {

  if (!heroVisual || !heroImage) {
    return;
  }


  if (window.innerWidth <= 768) {

    heroImage.style.transform =
      "translateY(-5%)";

    return;

  }


  const rect =
    heroVisual.getBoundingClientRect();


  const screenHeight =
    window.innerHeight;


  if (
    rect.bottom < 0 ||
    rect.top > screenHeight
  ) {
    return;
  }


  const progress =
    (
      screenHeight -
      rect.top
    ) /
    (
      screenHeight +
      rect.height
    );


  const movement =
    -9 +
    progress * 7;


  heroImage.style.transform =
    `translateY(${movement}%)`;

}


/* ========================================
   TIMELINE
======================================== */

const timeline =
  document.querySelector(
    ".timeline"
  );

const timelinePath =
  document.querySelector(
    ".timeline-path-progress"
  );

const timelineItems =
  Array.from(
    document.querySelectorAll(
      ".timeline-item"
    )
  );


let timelineLength = 0;


function setupTimeline() {

  if (!timelinePath) {
    return;
  }


  timelineLength =
    timelinePath.getTotalLength();


  timelinePath.style.strokeDasharray =
    timelineLength;


  timelinePath.style.strokeDashoffset =
    timelineLength;

}


function clamp(
  value,
  min,
  max
) {

  return Math.min(
    Math.max(value, min),
    max
  );

}


function updateTimeline() {

  if (!timeline) {
    return;
  }


  const rect =
    timeline.getBoundingClientRect();


  const screenHeight =
    window.innerHeight;


  const start =
    screenHeight * 0.8;


  const travel =
    rect.height +
    screenHeight * 0.6;


  const rawProgress =
    (
      start -
      rect.top
    ) /
    travel;


  const progress =
    clamp(
      rawProgress,
      0,
      1
    );


  /* DESKTOP SVG */

  if (
    timelinePath &&
    window.innerWidth > 768
  ) {

    timelinePath.style.strokeDashoffset =
      timelineLength *
      (
        1 -
        progress
      );

  }


  /* MOBILE LINE */

  timeline.style.setProperty(
    "--mobile-progress",
    progress
  );


  /* TIMELINE ITEMS */

  timelineItems.forEach(
    (item) => {

      const order =
        Number(
          item.dataset.order
        );


      const revealPoint =
        0.03 +
        order * 0.075;


      if (
        progress >=
        revealPoint
      ) {

        const delay =
          (
            order %
            4
          ) *
          0.15;


        item.style.transitionDelay =
          `${delay}s`;


        item.classList.add(
          "visible"
        );

      }

    }
  );

}


/* ========================================
   ACTIVE NAVIGATION
======================================== */

const sections =
  document.querySelectorAll(
    "#about, #portfolio, #journey"
  );


const navLinks =
  document.querySelectorAll(
    ".nav-link"
  );


function updateNavigation() {

  const scrollPosition =
    window.scrollY +
    200;


  let current =
    "about";


  sections.forEach(
    (section) => {

      if (
        scrollPosition >=
        section.offsetTop
      ) {

        current =
          section.id;

      }

    }
  );


  navLinks.forEach(
    (link) => {

      link.classList.remove(
        "active"
      );


      const href =
        link.getAttribute(
          "href"
        );


      if (
        href ===
        `#${current}`
      ) {

        link.classList.add(
          "active"
        );

      }

    }
  );

}


/* ========================================
   SCROLL
======================================== */

let ticking = false;


function updateEffects() {

  updateParallax();
  updateTimeline();
  updateNavigation();

  ticking = false;

}


function requestUpdate() {

  if (ticking) {
    return;
  }


  ticking = true;


  requestAnimationFrame(
    updateEffects
  );

}


window.addEventListener(
  "scroll",
  requestUpdate,
  {
    passive: true
  }
);


window.addEventListener(
  "resize",
  requestUpdate
);


window.addEventListener(
  "load",
  () => {

    setupTimeline();
    updateEffects();

  }
);
