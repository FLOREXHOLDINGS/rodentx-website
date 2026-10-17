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


  // --- Per-route document title + meta description (one H1/title per view) ---
  var TITLES = {
    home: 'RodentX Wildlife Management — Finger Lakes Wildlife Removal | Mice & Rats, Bats, Raccoons, Squirrels',
    wildlife: 'Wildlife Removal by Animal — RodentX Wildlife Management',
    'mice-rats': 'Mice & Rats Removal — RodentX Wildlife Management',
    bats: 'Bats in Attic Removal — RodentX Wildlife Management',
    raccoons: 'Raccoons in Attic Removal — RodentX Wildlife Management',
    squirrels: 'Squirrels in Attic Removal — RodentX Wildlife Management',
    'other-wildlife': 'Groundhogs, Skunks, Opossums & Birds — RodentX Wildlife Management',
    services: 'Services by Job — RodentX Wildlife Management',
    inspection: 'Inspection — RodentX Wildlife Management',
    removal: 'Removal — RodentX Wildlife Management',
    exclusion: 'Exclusion — RodentX Wildlife Management',
    restoration: 'Attic Restoration — RodentX Wildlife Management',
    monitoring: 'Monitoring — RodentX Wildlife Management',
    commercial: 'Commercial Wildlife Programs — RodentX Wildlife Management',
    territory: 'Service Areas — Finger Lakes Region — RodentX Wildlife Management',
    why: 'Why RodentX — RodentX Wildlife Management',
    resources: 'Resources: Identify It, Prevent It, FAQ — RodentX Wildlife Management',
    contact: 'Request an Inspection — RodentX Wildlife Management'
  };
  var DESCRIPTIONS = {
    home: 'RodentX Wildlife Management — Finger Lakes wildlife removal and exclusion. Mice & rats, bats in attic, raccoons in attic, squirrels in attic, exclusion + attic restoration. RodentX is back — rebuilt properly.',
    wildlife: 'Wildlife removal by animal: mice & rats, bats, raccoons, squirrels, groundhogs, skunks, opossums, birds. Signs, what we do, what we seal.',
    'mice-rats': 'Mice & rats: full rodent programs — entry, harborage, removal, seal, monitor. Finger Lakes Region, NY.',
    bats: 'Bats in attic: careful, lawful, season-aware work. Timing restrictions explained before work.',
    raccoons: 'Raccoons in attic: remove, clean, seal — and keep them out.',
    squirrels: 'Squirrels in attic: daytime noise, chewed entry. Find the entry, remove, seal it properly.',
    'other-wildlife': 'Groundhogs, skunks, opossums, birds: yard, crawl space, chimney, and vent wildlife, handled species-correctly.',
    services: 'Services by job: inspection, removal, exclusion, attic restoration, monitoring, commercial programs. One job at a time, done properly.',
    inspection: 'Inspection: find the entry, the run, and the damage — written findings before work.',
    removal: 'Removal: humane, lawful, species-correct removal. Removal alone does not keep animals out — exclusion is the point.',
    exclusion: 'Exclusion: the seal that lasts. Durable, animal-proof materials — every seal listed in writing.',
    restoration: 'Attic restoration: cleanouts, insulation removal, disinfection, insulation installation.',
    monitoring: 'Monitoring: proof the seal holds. Follow-up check, signs to watch, next step if activity returns.',
    commercial: 'Commercial wildlife programs for businesses that can\u2019t afford a sighting, a shutdown, or a repeat. Documented, discreet, sealed.',
    territory: 'Service areas: Finger Lakes Region, NY only. Five hubs, one standard. Keuka is home — Penn Yan / Yates County.',
    why: 'Why RodentX: the X Standard, what you get in writing, the comeback, licensing.',
    resources: 'Resources: identify the animal, prevention checklist, and straight answers to frequently asked questions.',
    contact: 'Request an inspection: tell us the animal, the town, and where you are hearing or seeing it. We reply by phone or email.'
  };
  function updateMeta(name) {
    if (TITLES[name]) document.title = TITLES[name];
    var meta = document.querySelector('meta[name="description"]');
    if (meta && DESCRIPTIONS[name]) meta.setAttribute('content', DESCRIPTIONS[name]);
  }

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
    updateMeta(name);
    navLinks.forEach(function (a) {
      var isCurrent = a.getAttribute('data-nav') === name;
      if (isCurrent) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (scrollTarget) {
      setTimeout(function () {
        var el = document.getElementById(scrollTarget);
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
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
      if (open) {
        var firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }

  // --- Close mobile menu when resizing up to desktop (avoids stuck scroll lock) ---
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && menu && menu.classList.contains('open')) closeMenu();
  });

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
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
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
      document.querySelectorAll('.faq-item').forEach(function (o) {
        o.classList.remove('open');
        var b = o.querySelector('.faq-q');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Contact forms (home + contact page): open email with details filled in ---
  document.querySelectorAll('.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      function val(field) {
        var el = form.querySelector('[data-field="' + field + '"]');
        return el ? el.value.trim() : '';
      }
      var name = val('name');
      var contact = val('contact');
      var town = val('town');
      var issue = val('issue');
      var msg = val('message');
      var subject = encodeURIComponent('Inspection request — ' + issue + ' — ' + town);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Phone/email: ' + contact + '\n' +
        'Town: ' + town + '\n' +
        'Issue: ' + issue + '\n' +
        'Details: ' + msg + '\n\n' +
        'Sent from rodentxwildlife.com contact form.'
      );
      var success = form.querySelector('.form-success');
      if (success) success.style.display = 'block';
      window.location.href = 'mailto:contact@rodentxwildlife.com?subject=' + subject + '&body=' + body;
    });
  });
})();
