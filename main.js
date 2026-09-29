/* MOBILE MENU */

const menuButton =
  document.querySelector(".mobile-menu-button");

const nav =
  document.querySelector(".nav");


if (menuButton && nav) {

  menuButton.addEventListener(
    "click",
    () => {

      const open =
        menuButton.classList.toggle("open");

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

          menuButton.classList.remove("open");
          nav.classList.remove("open");

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

}


/* GENERAL FADE */

const revealElements =
  document.querySelectorAll(".reveal");


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


revealElements.forEach((element) => {

  revealObserver.observe(element);

});


/* HERO PARALLAX */

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


  if (window.innerWidth <= 768) {

    heroImage.style.transform =
      "translateY(0)";

    return;

  }


  const rect =
    heroImageSection.getBoundingClientRect();


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
    (progress - 0.5) * 24;


  heroImage.style.transform =
    `scale(1.04) translateY(${move}px)`;

}


/* TIMELINE */

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


function clamp(value, min, max) {

  return Math.min(
    Math.max(value, min),
    max
  );

}


function setupTimeline() {

  if (!timelinePath) return;


  timelineLength =
    timelinePath.getTotalLength();


  timelinePath.style.strokeDasharray =
    `${timelineLength}`;


  timelinePath.style.strokeDashoffset =
    `${timelineLength}`;

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


  const startPoint =
    viewportHeight * 0.82;


  const animationDistance =
    timelineShell.offsetHeight - 500;


  const travelled =
    startPoint - rect.top;


  const progress =
    clamp(
      travelled /
      animationDistance,
      0,
      1
    );


  timelinePath.style.strokeDashoffset =
    timelineLength *
    (1 - progress);


  timelineItems.forEach((item) => {

    const order =
      Number(
        item.dataset.order
      );


    const revealAt =
      0.035 +
      order * 0.075;


    if (progress >= revealAt) {

      item.classList.add(
        "visible"
      );

    }

  });

}


function updateMobileTimeline() {

  if (!timelineCanvas) return;


  const rect =
    timelineCanvas.getBoundingClientRect();


  const viewportHeight =
    window.innerHeight;


  const progress =
    clamp(
      (
        viewportHeight * 0.8 -
        rect.top
      ) /
      (
        rect.height +
        viewportHeight * 0.4
      ),
      0,
      1
    );


  timelineCanvas.style.setProperty(
    "--mobile-progress",
    progress
  );


  timelineItems.forEach(
    (item, index) => {

      const revealAt =
        index /
        timelineItems.length *
        0.9;


      if (
        progress >= revealAt
      ) {

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


/* ACTIVE NAV */

const navLinks =
  Array.from(
    document.querySelectorAll(
      ".nav-link"
    )
  );


const navSections = [
  document.getElementById("about"),
  document.getElementById("portfolio"),
  document.getElementById("journey")
];


function updateNav() {

  const currentY =
    window.scrollY + 260;


  let activeIndex = 0;


  navSections.forEach(
    (section, index) => {

      if (!section) return;


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


/* SCROLL LOOP */

let ticking = false;


function updateEffects() {

  updateHeroParallax();
  updateTimeline();
  updateNav();

  ticking = false;

}


function requestUpdate() {

  if (ticking) return;


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
