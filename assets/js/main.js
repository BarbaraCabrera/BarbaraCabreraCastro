/* Small, dependency-free interactions for the personal website. */
(() => {
  const rootElement = document.documentElement;
  const themeToggleButton = document.querySelector(".theme-toggle");
  const themeLabel = document.querySelector(".theme-label");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const storedTheme = readStoredTheme();

  rootElement.classList.add("js-enabled");
  applyTheme(storedTheme || "light");
  setupSectionReveal();

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      const isDarkThemeActive = rootElement.dataset.theme === "dark";
      applyTheme(isDarkThemeActive ? "light" : "dark");
    });
  }

  function readStoredTheme() {
    try {
      const savedTheme = window.localStorage.getItem("barbara-website-theme");
      return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
    } catch (storageError) {
      return null;
    }
  }

  function applyTheme(themeName) {
    const isDarkTheme = themeName === "dark";
    rootElement.dataset.theme = isDarkTheme ? "dark" : "light";

    if (themeToggleButton) {
      themeToggleButton.setAttribute("aria-pressed", String(isDarkTheme));
      themeToggleButton.setAttribute("aria-label", isDarkTheme ? "Switch to light theme" : "Switch to dark theme");
    }

    if (themeLabel) {
      themeLabel.textContent = isDarkTheme ? "Light mode" : "Dark mode";
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isDarkTheme ? "#171827" : "#f8f8ff");
    }

    try {
      window.localStorage.setItem("barbara-website-theme", themeName);
    } catch (storageError) {
      // The theme still works if browser storage is unavailable.
    }
  }

  function setupSectionReveal() {
    const revealSections = document.querySelectorAll(".reveal");
    if (!revealSections.length || prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      revealSections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealSections.forEach((section) => sectionObserver.observe(section));
  }
})();
