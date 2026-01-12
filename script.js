// Untitled Toast – subtle UI motion
// No tracking, no analytics, no external dependencies

document.addEventListener("DOMContentLoaded", () => {
  fadeInOnLoad();
  revealOnScroll();
  addButtonHover();
});

/* -----------------------------
   Fade in page on load
-------------------------------- */
function fadeInOnLoad() {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.4s ease";

  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });
}

/* -----------------------------
   Reveal cards on scroll
-------------------------------- */
function revealOnScroll() {
  const elements = document.querySelectorAll(
    ".info-card, .app-card"
  );

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.style.opacity = "1");
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transform = "translateY(0)";
          entry.target.style.opacity = "1";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  elements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition =
      "opacity 0.4s ease, transform 0.4s ease";
    observer.observe(el);
  });
}

/* -----------------------------
   Button micro-interaction
-------------------------------- */
function addButtonHover() {
  const buttons = document.querySelectorAll("button");

  buttons.forEach(button => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-1px)";
      button.style.transition = "transform 0.15s ease";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
    });
  });
}
