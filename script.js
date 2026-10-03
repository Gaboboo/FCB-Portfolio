(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    const btn = document.getElementById("theme-toggle");
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) { saved = null; }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    apply(saved || (prefersDark ? "dark" : "light"));

    function apply(theme) {
      root.setAttribute("data-theme", theme);
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }

    btn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("mobile-menu");
    const icon = document.getElementById("menu-icon");

    function setOpen(open) {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      icon.setAttribute("href", open ? "#i-close" : "#i-menu");
    }

    btn.addEventListener("click", function () { setOpen(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function () { setOpen(false); });
  }

  /* ---------- Infinite carousel ---------- */
  function initMarquee() {
    document.querySelectorAll(".marquee").forEach(function (box) {
      const track = box.querySelector(".track");
      const base = Array.from(track.children);
      // Fill at least one full container width, then duplicate the set for a seamless -50% loop.
      while (track.scrollWidth < box.clientWidth) {
        base.forEach(function (li) { track.appendChild(li.cloneNode(true)); });
      }
      Array.from(track.children).forEach(function (li) {
        const copy = li.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        track.appendChild(copy);
      });
      track.style.setProperty("--duration", (Number(track.dataset.speed) || 40) + "s");
    });
  }

  /* ---------- Project filter ---------- */
  function initFilter() {
    const chips = document.querySelectorAll(".chip");
    const cards = document.querySelectorAll(".project");

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        const filter = chip.dataset.filter;
        chips.forEach(function (c) {
          const active = c === chip;
          c.classList.toggle("is-active", active);
          c.setAttribute("aria-pressed", String(active));
        });
        cards.forEach(function (card) {
          card.hidden = !(filter === "all" || card.dataset.cat.split(" ").indexOf(filter) !== -1);
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMenu();
    initMarquee();
    initFilter();
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  });
})();