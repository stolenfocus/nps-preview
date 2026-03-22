/* ============================================
   NPS 13F Portfolio — Shared JavaScript
   kstockguide.com
   ============================================ */

(function () {
  'use strict';

  // ---------- Dark Mode Toggle ----------
  const THEME_KEY = 'ksg-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function initTheme() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    document.addEventListener('click', function (e) {
      if (e.target.closest('.theme-toggle')) {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      }
    });
  }

  // ---------- Mobile Menu ----------
  function initMobileMenu() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.mobile-menu-btn')) {
        const nav = document.querySelector('.header-nav');
        if (nav) nav.classList.toggle('open');
      }
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header')) {
        const nav = document.querySelector('.header-nav');
        if (nav) nav.classList.remove('open');
      }
    });
  }

  // ---------- Number Formatting ----------
  window.NPS = window.NPS || {};

  NPS.formatNumber = function (num) {
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return '$' + (num / 1e3).toFixed(0) + 'K';
    return '$' + num.toLocaleString();
  };

  NPS.formatShares = function (num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(0) + 'K';
    return num.toLocaleString();
  };

  NPS.formatPct = function (pct) {
    var sign = pct >= 0 ? '+' : '';
    return sign + pct.toFixed(1) + '%';
  };

  // ---------- Table Sort ----------
  function initTableSort() {
    document.querySelectorAll('table[data-sortable]').forEach(function (table) {
      var headers = table.querySelectorAll('thead th[data-sort]');
      headers.forEach(function (th, index) {
        th.style.cursor = 'pointer';
        th.addEventListener('click', function () {
          sortTable(table, index, th.dataset.sort);
        });
      });
    });
  }

  function sortTable(table, colIndex, type) {
    var tbody = table.querySelector('tbody');
    var rows = Array.from(tbody.querySelectorAll('tr'));
    var asc = table.dataset.sortDir !== 'asc';
    table.dataset.sortDir = asc ? 'asc' : 'desc';

    rows.sort(function (a, b) {
      var aVal = a.cells[colIndex].dataset.value || a.cells[colIndex].textContent.trim();
      var bVal = b.cells[colIndex].dataset.value || b.cells[colIndex].textContent.trim();

      if (type === 'number') {
        aVal = parseFloat(aVal.replace(/[^0-9.\-]/g, '')) || 0;
        bVal = parseFloat(bVal.replace(/[^0-9.\-]/g, '')) || 0;
      }

      if (aVal < bVal) return asc ? -1 : 1;
      if (aVal > bVal) return asc ? 1 : -1;
      return 0;
    });

    rows.forEach(function (row) { tbody.appendChild(row); });
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initMobileMenu();
    initTableSort();
  });
})();
