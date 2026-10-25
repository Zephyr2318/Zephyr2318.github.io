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

  // Portrait starts covered; the photo comes into focus as the mouse gets
  // near, and a click (or tap) keeps it shown.
  var frame = document.querySelector(".portrait-frame");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  var pinned = false;
  var RANGE = 160;

  function setReveal(value) {
    frame.style.setProperty("--reveal", value.toFixed(3));
  }

  if (frame) {
    document.addEventListener("pointermove", function (e) {
      if (pinned || e.pointerType !== "mouse" || !finePointer.matches || !frame.querySelector("img")) return;
      var r = frame.getBoundingClientRect();
      var dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      var dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      setReveal(Math.max(0, 1 - Math.hypot(dx, dy) / RANGE));
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", function () {
      if (!pinned) setReveal(0);
    });

    frame.addEventListener("click", function () {
      if (!frame.querySelector("img")) return;
      pinned = !pinned;
      frame.setAttribute("aria-pressed", String(pinned));
      setReveal(pinned ? 1 : 0);
    });
  }
})();
