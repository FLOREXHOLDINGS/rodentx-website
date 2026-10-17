// RodentX V2 — hash routing, logos, issue selector, mobile nav, FAQ, form placeholder
(function () {
  'use strict';

  // --- Exact logos (from assets/logos.js, byte-for-byte originals) ---
  var logos = window.RODENTX_LOGOS || {};
  function setLogo(id, src, fallbackAlt) {
    var el = document.getElementById(id);
    if (!el) return;
    if (src) { el.src = src; }
    else { el.alt = fallbackAlt || el.alt; }
  }
  setLogo('headerLogo', logos.LOGO_A, 'RODENTX — WILDLIFE MANAGEMENT');
  setLogo('footerLogo', logos.LOGO_REV, 'RODENTX — WILDLIFE MANAGEMENT, reversed on black');
  setLogo('comebackLogoB', logos.LOGO_B, 'RODENTX stacked logo');

  // --- Hash routing: #/ , #/mice-rats, #/bats, ... ---
  var pages = Array.prototype.slice.call(document.querySelectorAll('[data-page]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));

  function routeFromHash() {
    var hash = (window.location.hash || '#/').replace(/^#\/?/, '');
    // Contact form lives on home; #/contact shows the contact detail page.
    // Home sub-anchors (territory etc.) stay on home.
    var name = hash.split('/')[0].split('?')[0] || 'home';
    if (name === 'territory') {
      // Territory preview is on home; the full territory page is #/territory too — show it.
      name = 'territory';
    }
    if (name === '') name = 'home';
    var found = false;
    pages.forEach(function (p) {
      var active = p.getAttribute('data-page') === name;
      p.classList.toggle('active', active);
      if (active) found = true;
    });
    if (!found) {
      pages.forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-page') === 'home'); });
      name = 'home';
    }
    navLinks.forEach(function (a) {
      var isCurrent = a.getAttribute('data-nav') === name;
      if (isCurrent) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
    // Close mobile menu on navigation
    var menu = document.getElementById('mobileMenu');
    var toggle = document.getElementById('navToggle');
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  }

  window.addEventListener('hashchange', routeFromHash);
  routeFromHash();

  // --- Issue selector buttons ---
  document.querySelectorAll('[data-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.location.hash = btn.getAttribute('data-go');
    });
  });

  // --- Mobile nav ---
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // --- Contact form: mailto placeholder — does NOT fake a submission endpoint ---
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('fName').value.trim();
      var contact = document.getElementById('fContact').value.trim();
      var town = document.getElementById('fTown').value.trim();
      var issue = document.getElementById('fIssue').value;
      var msg = document.getElementById('fMsg').value.trim();
      var subject = encodeURIComponent('Inspection request — ' + issue + ' — ' + town);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Phone/email: ' + contact + '\n' +
        'Town: ' + town + '\n' +
        'Issue: ' + issue + '\n' +
        'Details: ' + msg + '\n\n' +
        'Sent from rodentxwildlife.com contact form (mailto placeholder).'
      );
      var success = document.getElementById('formSuccess');
      if (success) success.style.display = 'block';
      window.location.href = 'mailto:contact@rodentxwildlife.com?subject=' + subject + '&body=' + body;
    });
  }
})();
