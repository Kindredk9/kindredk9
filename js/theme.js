/* ===================================================
   KINDRED K9 — theme.js
   Runs synchronously in <head> to prevent FOUC.
   =================================================== */
(function () {
  'use strict';

  var HTML        = document.documentElement;
  var STORAGE_KEY = 'kk9-theme';

  // Apply saved theme before first paint
  if (localStorage.getItem(STORAGE_KEY) === 'light') {
    HTML.setAttribute('data-theme', 'light');
  }

  function updateLabels() {
    var isLight = HTML.getAttribute('data-theme') === 'light';
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateLabels();

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isLight = HTML.getAttribute('data-theme') === 'light';

        document.body.classList.add('theme-transitioning');

        if (isLight) {
          HTML.removeAttribute('data-theme');
          localStorage.setItem(STORAGE_KEY, 'dark');
        } else {
          HTML.setAttribute('data-theme', 'light');
          localStorage.setItem(STORAGE_KEY, 'light');
        }

        updateLabels();
        setTimeout(function () {
          document.body.classList.remove('theme-transitioning');
        }, 350);
      });
    });
  });
})();
