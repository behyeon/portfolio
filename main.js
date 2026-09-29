/* =========================================
   MOBILE MENU
========================================= */

const menuButton =
  document.querySelector(
    ".mobile-menu-button"
  );

const nav =
  document.querySelector(
    ".nav"
  );


if (menuButton && nav) {

  menuButton.addEventListener(
    "click",
    () => {

      const open =
        menuButton.classList.toggle(
          "open"
        );


      nav.classList.toggle(
        "open",
        open
      );


      menuButton.setAttribute(
        "aria-expanded",
        String(open)
      );

    }
  );


  nav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          menuButton.classList.remove(
            "open"
          );

          nav.classList.remove(
            "open"
          );

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

}



/* =========================================
   GENERAL FADE
========================================= */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


const revealObserver =
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


revealElements.forEach(
  (element) => {

    revealObserver.observe(
      element
    );

  }
);



/* =========================================
   HERO PARALLAX
========================================= */

const heroSection =
  document.querySelector(
    ".hero-image-section"
  );


const heroImage =
  document.querySelector(
    ".hero-image"
  );


function updateHeroParallax() {

  if (
    !heroSection ||
    !heroImage
  ) {
    return;
  }


  if (
    window.innerWidth <= 768
  ) {

    heroImage.style.transform =
      "scale(1)";

    return;

  }


  const rect =
    heroSection.getBoundingClientRect();


  const viewport =
    window.innerHeight;


  if (
    rect.bottom < 0 ||
    rect.top > viewport
  ) {
    return;
  }


  const progress =
    (
      viewport -
      rect.top
    ) /
    (
      viewport +
      rect.height
    );


  const translate =
    (
      progress -
      0.5
    ) *
    24;


  heroImage.style.transform =
    `scale(1.04) translateY(${translate}px)`;

}



/* =========================================
   TIMELINE
========================================= */

const timelineShell =
  document.querySelector(
    ".timeline-shell"
  );


const timelineVisual =
  document.querySelector(
    ".timeline-visual"
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



function clamp(
  number,
  min,
  max
) {

  return Math.min(
    Math.max(
      number,
      min
    ),
    max
  );

}



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



function updateDesktopTimeline() {

  if (
    !timelineShell ||
    !timelinePath
  ) {
    return;
  }


  const rect =
    timelineShell.getBoundingClientRect();


  const viewportHeight =
    window.innerHeight;


  /*
    timeline shell이 화면 안으로 들어온 시점부터
    shell 끝까지 스크롤하는 동안 0 → 1 진행
  */

  const start =
    viewportHeight * 0.78;


  const totalDistance =
    timelineShell.offsetHeight -
    viewportHeight * 0.35;


  const travelled =
    start -
    rect.top;


  const progress =
    clamp(
      travelled /
      totalDistance,
      0,
      1
    );


  timelinePath.style.strokeDashoffset =
    timelineLength *
    (
      1 -
      progress
    );


  /*
    12개 항목을 실제 경로 진행 순서대로 등장
  */

  timelineItems.forEach(
    (item) => {

      const order =
        Number(
          item.dataset.order
        );


      const revealAt =
        0.035 +
        order *
        0.078;


      if (
        progress >= revealAt
      ) {

        const delayWithinRow =
          (
            order %
            4
          ) *
          0.15;


        item.style.transitionDelay =
          `${delayWithinRow}s`;


        item.classList.add(
          "visible"
        );

      }

    }
  );

}



/* =========================================
   MOBILE TIMELINE
========================================= */

function updateMobileTimeline() {

  if (
    !timelineVisual
  ) {
    return;
  }


  const rect =
    timelineVisual
      .getBoundingClientRect();


  const viewportHeight =
    window.innerHeight;


  const total =
    rect.height +
    viewportHeight *
    0.5;


  const progress =
    clamp(
      (
        viewportHeight *
        0.8 -
        rect.top
      ) /
      total,
      0,
      1
    );


  timelineVisual.style.setProperty(
    "--mobile-progress",
    progress
  );


  timelineItems.forEach(
    (item, index) => {

      const revealAt =
        index /
        timelineItems.length *
        0.85;


      if (
        progress >= revealAt
      ) {

        item.style.transitionDelay =
          "0s";


        item.classList.add(
          "visible"
        );

      }

    }
  );

}



function updateTimeline() {

  if (
    window.innerWidth <= 768
  ) {

    updateMobileTimeline();

  } else {

    updateDesktopTimeline();

  }

}



/* =========================================
   ACTIVE NAV
========================================= */

const navLinks =
  Array.from(
    document.querySelectorAll(
      ".nav-link"
    )
  );


const sections = [
  document.getElementById(
    "about"
  ),
  document.getElementById(
    "portfolio"
  ),
  document.getElementById(
    "journey"
  )
];


function updateNav() {

  const currentY =
    window.scrollY +
    260;


  let activeIndex = 0;


  sections.forEach(
    (section, index) => {

      if (!section) {
        return;
      }


      if (
        currentY >=
        section.offsetTop
      ) {

        activeIndex =
          index;

      }

    }
  );


  navLinks.forEach(
    (link, index) => {

      link.classList.toggle(
        "active",
        index === activeIndex
      );

    }
  );

}



/* =========================================
   SCROLL LOOP
========================================= */

let ticking = false;


function updateEffects() {

  updateHeroParallax();

  updateTimeline();

  updateNav();

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
