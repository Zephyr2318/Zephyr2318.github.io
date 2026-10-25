(function () {
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.getAttribute("data-theme") || (media.matches ? "dark" : "light");
  }

  function syncIcon() {
    if (toggle) toggle.textContent = currentTheme() === "dark" ? "☀" : "☾";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncIcon();
    });
  }
  media.addEventListener("change", syncIcon);
  syncIcon();

  // Hairline under the top bar once the page scrolls.
  var bar = document.querySelector(".topbar");
  function onScroll() {
    if (bar) bar.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
