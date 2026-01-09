document.addEventListener("DOMContentLoaded", () => {
  const parents = document.querySelectorAll(".lesson-with-submenu > a");
  const submenuLinks = document.querySelectorAll(".lesson-with-submenu .submenu a");
//  const submenuLinks = document.querySelectorAll(".lesson-sidebar a[href]");
  const sections = document.querySelectorAll(".section[id]");

  // Toggle submenu open/close
  parents.forEach(parent => {
    parent.addEventListener("click", e => {
      e.preventDefault();
      const submenu = parent.nextElementSibling;

      document.querySelectorAll(".submenu").forEach(s => {
        if (s !== submenu) s.classList.remove("open");
      });

      submenu.classList.toggle("open");
    });
  });

  function setActiveLink() {
    const currentHash = window.location.hash;
    const currentPath = window.location.pathname.split("/").pop();

    let currentSection = "";

    // Detect active section by scroll
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        currentSection = section.id;
      }
    });

    submenuLinks.forEach(link => {
      link.classList.remove("active");

      const href = link.getAttribute("href");

      const isHashMatch =
        href === currentHash ||
        href === `#${currentSection}`;

      const isPageMatch =
        href === currentPath ||
        href.endsWith(currentPath);

      if (isHashMatch || isPageMatch) {
        link.classList.add("active");

        // Auto-open submenu
        const parentSubmenu = link.closest(".submenu");
        if (parentSubmenu) parentSubmenu.classList.add("open");
      }
    });
  }

  // Run on load, scroll, and hash change
  setActiveLink();
  window.addEventListener("scroll", setActiveLink);
  window.addEventListener("hashchange", setActiveLink);
});
