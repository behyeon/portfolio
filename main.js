/* ==================================================
   MOBILE MENU
================================================== */

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


/* ==================================================
   GENERAL REVEAL
================================================== */

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


const revealObserver =
  new IntersectionObserver(

    (entries, observer) => {

      entries.forEach(
        (entry) => {

          if (
            !entry.isIntersecting
          ) {
            return;
          }


          entry.target.classList.add(
            "visible"
          );


          observer.unobserve(
            entry.target
          );

        }
      );

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


/* ==================================================
   HERO PARALLAX
================================================== */

const heroImageSection =
  document.querySelector(
    ".hero-image-section"
  );


const heroImage =
  document.querySelector(
    ".hero-image"
  );


function updateHeroParallax() {

  if (
    !heroImageSection ||
    !heroImage
  ) {
    return;
  }


  /*
    모바일에서는 이미지가 잘리면 안 되므로
    parallax 자체를 끔
  */

  if (
    window.innerWidth <= 768
  ) {

    heroImage.style.transform =
      "none";

    return;

  }


  const rect =
    heroImageSection
      .getBoundingClientRect();


  const viewportHeight =
    window.innerHeight;


  if (
    rect.bottom < 0 ||
    rect.top > viewportHeight
  ) {
    return;
  }


  const progress =
    (
      viewportHeight -
      rect.top
    ) /
    (
      viewportHeight +
      rect.height
    );


  const move =
    (
      progress -
      0.5
    ) *
    20;


  heroImage.style.transform =
    `scale(1.03) translateY(${move}px)`;

}


/* ==================================================
   TIMELINE
================================================== */

const timelineShell =
  document.querySelector(
    ".timeline-shell"
  );


const timelineCanvas =
  document.querySelector(
    ".timeline-canvas"
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
  value,
  min,
  max
) {

  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );

}


/* SVG LENGTH */

function setupTimeline() {

  if (!timelinePath) {
    return;
  }


  timelineLength =
    timelinePath.getTotalLength();


  timelinePath.style.strokeDasharray =
    `${timelineLength}`;


  timelinePath.style.strokeDashoffset =
    `${timelineLength}`;

}


/* ==================================================
   DESKTOP TIMELINE
================================================== */

function updateDesktopTimeline() {

  if (
    !timelineShell ||
    !timelinePath
  ) {
    return;
  }


  const rect =
    timelineShell
      .getBoundingClientRect();


  const viewportHeight =
    window.innerHeight;


  const startPoint =
    viewportHeight *
    0.82;


  const animationDistance =
    timelineShell.offsetHeight -
    520;


  const travelled =
    startPoint -
    rect.top;


  const progress =
    clamp(
      travelled /
      animationDistance,
      0,
      1
    );


  /* DRAW LINE */

  timelinePath.style.strokeDashoffset =
    timelineLength *
    (
      1 -
      progress
    );


  /* ITEM REVEAL */

  timelineItems.forEach(
    (item) => {

      const order =
        Number(
          item.dataset.order
        );


      /*
        0~11 진행.

        1행 0~3
        2행 4~7
        3행 8~11
      */

      const row =
        Math.floor(
          order / 4
        );


      const position =
        order % 4;


      const rowStart =
        [
          0.05,
          0.37,
          0.69
        ][row];


      const revealAt =
        rowStart +
        position *
        0.055;


      if (
        progress >=
        revealAt
      ) {

        /*
          각 행 안에서 0.15s stagger
        */

        item.style.transitionDelay =
          `${
            position *
            0.15
          }s`;


        item.classList.add(
          "visible"
        );

      }

    }
  );

}


/* ==================================================
   MOBILE TIMELINE
================================================== */

function updateMobileTimeline() {

  if (!timelineCanvas) {
    return;
  }


  const rect =
    timelineCanvas
      .getBoundingClientRect();


  const viewportHeight =
    window.innerHeight;


  const progress =
    clamp(
      (
        viewportHeight *
        0.8 -
        rect.top
      )
      /
      (
        rect.height +
        viewportHeight *
        0.35
      ),
      0,
      1
    );


  timelineCanvas.style.setProperty(
    "--mobile-progress",
    progress
  );


  /*
    모바일에서는 DOM이
    실제 시간순으로 되어 있기 때문에
    그대로 순차 등장
  */

  timelineItems.forEach(
    (item, index) => {

      const revealAt =
        (
          index /
          timelineItems.length
        ) *
        0.88;


      if (
        progress >=
        revealAt
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
    window.innerWidth <=
    768
  ) {

    updateMobileTimeline();

  } else {

    updateDesktopTimeline();

  }

}


/* ==================================================
   ACTIVE NAV
================================================== */

const navLinks =
  Array.from(
    document.querySelectorAll(
      ".nav-link"
    )
  );


const navSections = [

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


  let activeIndex =
    0;


  navSections.forEach(
    (
      section,
      index
    ) => {

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
    (
      link,
      index
    ) => {

      link.classList.toggle(
        "active",
        index === activeIndex
      );

    }
  );

}


/* ==================================================
   RAF SCROLL LOOP
================================================== */

let ticking =
  false;


function updateEffects() {

  updateHeroParallax();

  updateTimeline();

  updateNav();


  ticking =
    false;

}


function requestUpdate() {

  if (ticking) {
    return;
  }


  ticking =
    true;


  requestAnimationFrame(
    updateEffects
  );

}


/* SCROLL */

window.addEventListener(
  "scroll",
  requestUpdate,
  {
    passive: true
  }
);


/* RESIZE */

window.addEventListener(
  "resize",
  requestUpdate
);


/* LOAD */

window.addEventListener(
  "load",
  () => {

    setupTimeline();

    updateEffects();

  }
);
