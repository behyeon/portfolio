const sections = document.querySelectorAll(
  "#about, #portfolio, #contact"
);

const navLinks = document.querySelectorAll(".nav-link");

function updateActiveMenu() {

  const header = document.querySelector(".header");

  const scrollPosition =
    window.scrollY + header.offsetHeight + 100;

  let currentSection = "about";

  sections.forEach((section) => {

    if (scrollPosition >= section.offsetTop) {
      currentSection = section.id;
    }

  });

  navLinks.forEach((link) => {

    link.classList.remove("active");

    if (
      link.getAttribute("href") ===
      `#${currentSection}`
    ) {
      link.classList.add("active");
    }

  });

}

window.addEventListener("scroll", updateActiveMenu);

updateActiveMenu();
