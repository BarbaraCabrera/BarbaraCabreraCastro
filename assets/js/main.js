/*
  Site interactions: theme toggle, mobile navigation and scroll reveal.
  Everything is progressive: the page is fully usable without this script.
*/
(function () {
  "use strict";

  var themeStorageKey = "barbara-website-theme";
  var rootElement = document.documentElement;
  var themeToggleButton = document.querySelector(".theme-toggle");
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');
  var menuToggleButton = document.querySelector(".menu-toggle");
  var primaryNavigation = document.getElementById("primary-navigation");
  var mobileMediaQuery = window.matchMedia("(max-width: 820px)");
  var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  rootElement.classList.add("has-javascript");

  setupTheme();
  setupMobileNavigation();
  setupScrollReveal();
  updateCurrentYear();

  /* ---------- Theme ---------- */

  function setupTheme() {
    var initialTheme = rootElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(initialTheme, false);

    if (!themeToggleButton) {
      return;
    }

    themeToggleButton.addEventListener("click", function () {
      var isDarkThemeActive = rootElement.getAttribute("data-theme") === "dark";
      applyTheme(isDarkThemeActive ? "light" : "dark", true);
    });
  }

  function applyTheme(themeName, shouldSaveTheme) {
    var isDarkTheme = themeName === "dark";
    rootElement.setAttribute("data-theme", isDarkTheme ? "dark" : "light");

    if (themeToggleButton) {
      // The button name stays constant; aria-pressed communicates the state.
      themeToggleButton.setAttribute("aria-pressed", String(isDarkTheme));
      themeToggleButton.setAttribute("title", isDarkTheme ? "Switch to light theme" : "Switch to dark theme");
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isDarkTheme ? "#15162a" : "#f8f8ff");
    }

    if (shouldSaveTheme) {
      saveTheme(themeName);
    }
  }

  function saveTheme(themeName) {
    try {
      window.localStorage.setItem(themeStorageKey, themeName);
    } catch (storageError) {
      // Storage can be unavailable (private mode, blocked cookies). The theme still changes for this visit.
    }
  }

  /* ---------- Mobile navigation ---------- */

  function setupMobileNavigation() {
    if (!menuToggleButton || !primaryNavigation) {
      return;
    }

    menuToggleButton.addEventListener("click", function () {
      var isMenuOpen = menuToggleButton.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isMenuOpen);
    });

    primaryNavigation.addEventListener("click", function (clickEvent) {
      if (clickEvent.target.closest("a") && mobileMediaQuery.matches) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", function (keyboardEvent) {
      var isMenuOpen = menuToggleButton.getAttribute("aria-expanded") === "true";
      if (keyboardEvent.key === "Escape" && isMenuOpen) {
        setMenuOpen(false);
        menuToggleButton.focus();
      }
    });

    var handleViewportChange = function () {
      if (!mobileMediaQuery.matches) {
        setMenuOpen(false);
      }
    };

    if (typeof mobileMediaQuery.addEventListener === "function") {
      mobileMediaQuery.addEventListener("change", handleViewportChange);
    } else if (typeof mobileMediaQuery.addListener === "function") {
      mobileMediaQuery.addListener(handleViewportChange);
    }
  }

  function setMenuOpen(isMenuOpen) {
    menuToggleButton.setAttribute("aria-expanded", String(isMenuOpen));
    primaryNavigation.classList.toggle("is-open", isMenuOpen);
  }

  /* ---------- Scroll reveal ---------- */

  function setupScrollReveal() {
    var revealElements = document.querySelectorAll(".reveal");
    var canUseObserver = "IntersectionObserver" in window;

    if (!revealElements.length || !canUseObserver || reducedMotionQuery.matches) {
      return;
    }

    rootElement.classList.add("can-reveal");

    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });

    // When a link jumps straight to a section, show it immediately.
    window.addEventListener("hashchange", revealTargetSection);
    revealTargetSection();
  }

  function revealTargetSection() {
    if (!window.location.hash) {
      return;
    }

    var targetElement = document.getElementById(window.location.hash.slice(1));
    var revealContainer = targetElement ? targetElement.closest(".reveal") : null;

    if (revealContainer) {
      revealContainer.classList.add("is-visible");
    }
  }

  /* ---------- Footer year ---------- */

  function updateCurrentYear() {
    var yearElement = document.querySelector(".current-year");
    if (yearElement) {
      yearElement.textContent = String(new Date().getFullYear());
    }
  }
})();
