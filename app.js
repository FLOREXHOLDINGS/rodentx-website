// RodentX V2 — hash routing, logos, issue selector, mobile nav, FAQ, form,
// header shadow on scroll, reveal-on-scroll, back-to-top
(function () {
  'use strict';

  // --- Logos (from assets/logos.js — same artwork, background made transparent) ---
  var logos = window.RODENTX_LOGOS || {};
  function setLogo(id, src, fallbackAlt) {
    var el = document.getElementById(id);
    if (!el) return;
    if (src) { el.src = src; }
    else { el.alt = fallbackAlt || el.alt; }
  }
  setLogo('headerLogo', logos.LOGO_A, 'RODENTX — WILDLIFE MANAGEMENT');
  setLogo('footerLogo', logos.LOGO_REV, 'RODENTX — WILDLIFE MANAGEMENT, reversed on black');
  setLogo('comebackLogoB', logos.LOGO_REV, 'RODENTX — WILDLIFE MANAGEMENT');

  // --- Hash routing: #/ , #/mice-rats, #/bats, ... ---
  var pages = Array.prototype.slice.call(document.querySelectorAll('[data-page]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var menu = document.getElementById('mobileMenu');
  var toggle = document.getElementById('navToggle');

  function setToggleLabel(open) {
    var label = toggle ? toggle.querySelector('.nav-toggle-label') : null;
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (toggle) toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function closeMenu() {
    if (menu) menu.classList.remove('open');
    if (toggle) {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-open');
    setToggleLabel(false);
  }

  function routeFromHash() {
    var hash = (window.location.hash || '#/').replace(/^#\/?/, '');
    // Contact form lives on home; #/contact shows the contact detail page.
    // Home sub-anchors (territory etc.) stay on home.
    var name = hash.split('/')[0].split('?')[0] || 'home';
    var scrollTarget = null;
    if (name === 'faq') { name = 'resources'; scrollTarget = 'faq'; }
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
    if (scrollTarget) {
      setTimeout(function () {
        var el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      window.scrollTo(0, 0);
    }
    closeMenu();
  }

  window.addEventListener('hashchange', routeFromHash);
  routeFromHash();

  // --- Issue selector buttons ---
  document.querySelectorAll('[data-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.location.hash = btn.getAttribute('data-go');
    });
  });

  // --- Desktop dropdowns: click toggles, Escape / outside click closes ---
  document.querySelectorAll('.nav-drop').forEach(function (drop) {
    var btn = drop.querySelector('.nav-drop-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = drop.classList.contains('open');
      document.querySelectorAll('.nav-drop.open').forEach(function (d) { d.classList.remove('open'); });
      document.querySelectorAll('.nav-drop-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      if (!wasOpen) {
        drop.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-drop.open').forEach(function (d) { d.classList.remove('open'); });
    document.querySelectorAll('.nav-drop-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-drop.open').forEach(function (d) { d.classList.remove('open'); });
      document.querySelectorAll('.nav-drop-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
  });

  // --- Mobile nav: hamburger animates to X, menu slides down ---
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('menu-open', open);
      setToggleLabel(open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }

  // --- Header shadow on scroll ---
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Back to top ---
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Reveal-on-scroll: fade + 12px rise, staggered per group ---
  var revealTargets = document.querySelectorAll(
    '.dossier, .x-step, .hub, .hub-card, .id-card, .side-card, .contact-card, .faq-item, .section-head, .detail-hero'
  );
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      // Stagger siblings inside the same grid by up to 180ms
      el.style.transitionDelay = ((i % 4) * 60) + 'ms';
      io.observe(el);
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

  // --- Contact form: opens email with the details filled in ---
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
        'Sent from rodentxwildlife.com contact form.'
      );
      var success = document.getElementById('formSuccess');
      if (success) success.style.display = 'block';
      window.location.href = 'mailto:contact@rodentxwildlife.com?subject=' + subject + '&body=' + body;
    });
  }
})();
