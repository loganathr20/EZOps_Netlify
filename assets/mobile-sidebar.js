document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mobileSidebarBtn");
  const sidebar = document.querySelector(".lesson-sidebar");

  btn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Close when clicking a link
  sidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  });
});


