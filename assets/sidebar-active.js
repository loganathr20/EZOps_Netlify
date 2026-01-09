document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section[id]");
  const sideLinks = document.querySelectorAll("#sideNav a");

  function highlightSidebar() {
    let current = "";

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();

      if (rect.top <= 220) {
        current = section.id;
      }
    });

    /* ✅ FORCE last section when at bottom */
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
      current = sections[sections.length - 1].id;
    }

    sideLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", highlightSidebar);
  highlightSidebar(); // run on load
});



