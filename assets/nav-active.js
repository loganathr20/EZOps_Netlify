
document.addEventListener("DOMContentLoaded", () => {
  // SELECTORS
  const headerLinks = document.querySelectorAll("header.navbar nav a");
  const footerLinks = document.querySelectorAll("footer a");
  const sidebarLinks = document.querySelectorAll(".platform-sidebar a");
  const sections = document.querySelectorAll(".platform-main h3");

  // GET CURRENT PAGE
  const currentPage = location.pathname.split("/").pop() || "index.html";

  // ===== HEADER LOGIC =====
  // Determine header active link (map subpages to parent menu)
  let activeHeader = currentPage;
  if (currentPage.startsWith("lesson") || currentPage.startsWith("LinuxD")) {
    activeHeader = "devops_learn.html"; // parent menu
  }

  headerLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === activeHeader) {
      link.classList.add("active");
    }

    // Update active on click
    link.addEventListener("click", () => {
      headerLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // ===== FOOTER LOGIC =====
  footerLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }

    // Update active on click
    link.addEventListener("click", () => {
      footerLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // ===== SIDEBAR SCROLL LOGIC =====
  if (sections.length && sidebarLinks.length) {
    window.addEventListener("scroll", () => {
      let currentSection = "";
      sections.forEach(sec => {
        const sectionTop = sec.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
          currentSection = sec.getAttribute("id");
        }
      });

      sidebarLinks.forEach(link => {
        link.classList.remove("active-section");
        if (link.getAttribute("href") === "#" + currentSection) {
          link.classList.add("active-section");
        }
      });
    });

    // Optional: smooth scroll for sidebar links
    sidebarLinks.forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth"
          });
        }
      });
    });
  }
});
