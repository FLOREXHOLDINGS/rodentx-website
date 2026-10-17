// RodentX V2 — hash routing, issue selector, mobile nav, FAQ, forms,
// header shadow on scroll, reveal-on-scroll, back-to-top
(function () {
  'use strict';

  // --- Per-route document title + meta description (one H1/title per view) ---
  var TITLES = {
    home: 'Finger Lakes Wildlife Removal | RodentX Wildlife Management',
    wildlife: 'Wildlife Removal by Animal | RodentX Wildlife Management',
    'mice-rats': 'Mice & Rats Removal | RodentX Wildlife Management',
    bats: 'Bats in Attic Removal | RodentX Wildlife Management',
    raccoons: 'Raccoons in Attic Removal | RodentX Wildlife Management',
    squirrels: 'Squirrels in Attic Removal | RodentX Wildlife Management',
    'other-wildlife': 'Groundhogs, Skunks, Opossums | RodentX Wildlife Management',
    services: 'Wildlife Services by Job | RodentX Wildlife Management',
    inspection: 'Wildlife Inspection | RodentX Wildlife Management',
    removal: 'Humane Wildlife Removal | RodentX Wildlife Management',
    exclusion: 'Wildlife Exclusion & Sealing | RodentX Wildlife Management',
    restoration: 'Attic Restoration | RodentX Wildlife Management',
    monitoring: 'Wildlife Monitoring | RodentX Wildlife Management',
    commercial: 'Commercial Wildlife Programs | RodentX Wildlife Management',
    territory: 'Service Areas: Finger Lakes | RodentX Wildlife Management',
    why: 'Why RodentX: The X Standard | RodentX Wildlife Management',
    resources: 'Wildlife ID Guide & FAQ | RodentX Wildlife Management',
    contact: 'Request an Inspection | RodentX Wildlife Management',
    privacy: 'Privacy Notice | RodentX Wildlife Management'
  };
  var DESCRIPTIONS = {
    home: 'RodentX Wildlife Management — Finger Lakes wildlife removal and exclusion: mice & rats, bats, raccoons, squirrels. Inspect / Remove / Exclude / Monitor.',
    wildlife: 'Wildlife removal by animal in the Finger Lakes: mice & rats, bats, raccoons, squirrels, groundhogs, skunks, opossums, birds — signs, what we do, what we seal.',
    'mice-rats': 'Mice & rats in the Finger Lakes: full rodent programs — entry survey, removal, sealing and monitoring for homes and businesses, every seal in writing.',
    bats: 'Bats in the attic in the Finger Lakes: careful, lawful, season-aware removal and exclusion. Timing restrictions are explained before any work begins.',
    raccoons: 'Raccoons in the attic: heavy noise, torn vents, damaged insulation. We remove, clean, restore and seal — documented in writing — across the Finger Lakes.',
    squirrels: 'Squirrels in the attic: daytime noise and chewed entries. We find the entry, remove the squirrels and seal it properly, across the Finger Lakes Region.',
    'other-wildlife': 'Groundhogs, skunks, opossums and birds in the Finger Lakes: burrows, denning under porches, crawl-space and vent nesting, handled species-correctly.',
    services: 'RodentX services by job in the Finger Lakes: inspection, removal, exclusion, attic restoration, monitoring and commercial programs. One job, done properly.',
    inspection: 'Wildlife inspection in the Finger Lakes: we find the entry, the run and the damage — roofline, attic and crawl space — written findings before work.',
    removal: 'Humane, lawful wildlife removal in the Finger Lakes, matched to the species and the season — always followed by exclusion, because the seal is the point.',
    exclusion: 'Wildlife exclusion in the Finger Lakes: durable, animal-proof sealing of entries, vents and gaps — every seal listed in writing. Burrow Defense below grade.',
    restoration: 'Attic restoration in the Finger Lakes: cleanouts, insulation removal, disinfection and insulation installation after removal and sealing, in writing.',
    monitoring: 'Wildlife monitoring in the Finger Lakes: follow-up checks that the seal holds and the activity stops, with the next step documented if activity returns.',
    commercial: 'Commercial wildlife programs in the Finger Lakes for restaurants, warehouses, wineries and breweries: documented findings, sealing, monitoring cadence.',
    territory: 'RodentX service areas: the Finger Lakes Region, NY only — five hubs plus the Corning–Elmira edge. Home base is Penn Yan / Yates County on Keuka Lake.',
    why: 'Why RodentX: the X Standard — Inspect / Remove / Exclude / Monitor — what you get in writing, the comeback story, and our licensing status, stated plainly.',
    resources: 'RodentX resources: identify the animal by noise, time and location, run the prevention checklist, and read straight answers to frequently asked questions.',
    contact: 'Request a wildlife inspection in the Finger Lakes: tell us the animal, the town and the signs. We reply by phone or email — same-day when available.',
    privacy: 'How the RodentX website handles your information: forms open your own email app, nothing is stored by the site, and Instagram videos load only on tap.'
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

  function closeDropdowns() {
    document.querySelectorAll('.nav-drop.open').forEach(function (d) { d.classList.remove('open'); });
    document.querySelectorAll('.nav-drop-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }

  var viaPopstate = false;
  window.addEventListener('popstate', function () { viaPopstate = true; });

  function routeFromHash(isNav) {
    // The skip link targets #main — it is not a route, leave routing alone.
    if (window.location.hash === '#main') { viaPopstate = false; return; }
    var hash = (window.location.hash || '#/').replace(/^#\/?/, '');
    // Contact form lives on home; #/contact shows the contact detail page.
    // Home sub-anchors (territory etc.) stay on home.
    var name = hash.split('/')[0].split('?')[0] || 'home';
    var scrollTarget = null;
    if (name === 'faq') { name = 'resources'; scrollTarget = 'faq'; }
    if (name === '') name = 'home';
    var found = false;
    var activePage = null;
    pages.forEach(function (p) {
      var active = p.getAttribute('data-page') === name;
      p.classList.toggle('active', active);
      if (active) { found = true; activePage = p; }
    });
    if (!found) {
      pages.forEach(function (p) {
        var isHome = p.getAttribute('data-page') === 'home';
        p.classList.toggle('active', isHome);
        if (isHome) activePage = p;
      });
      name = 'home';
      // Clean the junk route out of the address bar.
      try { window.history.replaceState(null, '', '#/'); } catch (e) { /* older browser */ }
    }
    updateMeta(name);
    navLinks.forEach(function (a) {
      var isCurrent = a.getAttribute('data-nav') === name;
      if (isCurrent) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    // Move focus to the new view's heading so keyboard / screen-reader
    // users land on the page they opened, not on a hidden element.
    if (isNav && activePage) {
      var h1 = activePage.querySelector('h1');
      if (h1) {
        if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
        h1.focus({ preventScroll: true });
      }
    }
    if (scrollTarget) {
      setTimeout(function () {
        var el = document.getElementById(scrollTarget);
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }, 60);
    } else if (!isNav || !viaPopstate) {
      // Fresh navigation starts at the top; Back/Forward (popstate) keeps
      // the browser's own scroll restoration.
      window.scrollTo(0, 0);
    }
    viaPopstate = false;
    closeMenu();
    closeDropdowns();
  }

  window.addEventListener('hashchange', function () { routeFromHash(true); });
  routeFromHash(false);

  // --- Issue selector buttons ---
  document.querySelectorAll('[data-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.location.hash = btn.getAttribute('data-go');
    });
  });

  // --- Instagram embeds: the library loads lazily on the first facade tap,
  //     so no third-party script runs for visitors who never play a video ---
  var igRequested = false;
  function processInstagram() {
    try {
      if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
    } catch (e) { /* library not ready — its load handler processes the page */ }
  }
  function ensureInstagram() {
    if (window.instgrm && window.instgrm.Embeds) { processInstagram(); return; }
    if (igRequested) return;
    igRequested = true;
    var s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    s.onload = processInstagram;
    document.body.appendChild(s);
  }

  // --- Instagram video facades (Why page): no iframe loads until a tap ---
  document.addEventListener('click', function (e) {
    var facade = e.target && e.target.closest ? e.target.closest('.ig-facade') : null;
    if (!facade) return;
    var id = facade.getAttribute('data-reel');
    if (!id) return;
    var url = 'https://www.instagram.com/reel/' + id + '/?utm_source=ig_embed&utm_campaign=loading';
    var wrap = document.createElement('div');
    wrap.className = 'ig-embed';
    var quote = document.createElement('blockquote');
    quote.className = 'instagram-media';
    quote.setAttribute('data-instgrm-permalink', url);
    quote.setAttribute('data-instgrm-version', '14');
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
    link.textContent = 'View this post on Instagram';
    quote.appendChild(link);
    wrap.appendChild(quote);
    facade.replaceWith(wrap);
    ensureInstagram();
  });

  // --- Desktop dropdowns: click toggles, Escape / outside click closes ---
  document.querySelectorAll('.nav-drop').forEach(function (drop) {
    var btn = drop.querySelector('.nav-drop-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = drop.classList.contains('open');
      closeDropdowns();
      if (!wasOpen) {
        drop.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', function () { closeDropdowns(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openDrop = document.querySelector('.nav-drop.open');
    if (openDrop) {
      var openBtn = openDrop.querySelector('.nav-drop-btn');
      closeDropdowns();
      // Return focus to the button so the panel cannot re-open under focus.
      if (openBtn) openBtn.focus();
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
    '.x-step, .hub-card, .id-card, .side-card, .contact-card, .faq-item, .section-head, .detail-hero'
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
      var phone = val('phone');
      var email = val('email');
      var town = val('town');
      var issue = val('issue');
      var msg = val('message');
      var success = form.querySelector('.form-success');
      var error = form.querySelector('.form-error');
      // Name + Town are required by the fields themselves; here we enforce
      // the one-of rule: we need a phone number OR an email to reply to.
      if (!phone && !email) {
        if (error) {
          error.textContent = 'Add a phone number or an email so we can reply.';
          error.style.display = 'block';
        }
        if (success) success.style.display = 'none';
        var phoneEl = form.querySelector('[data-field="phone"]');
        if (phoneEl) phoneEl.focus();
        return;
      }
      if (error) error.style.display = 'none';
      var lines = ['Name: ' + name];
      if (phone) lines.push('Phone: ' + phone);
      if (email) lines.push('Email: ' + email);
      lines.push('Town: ' + town);
      lines.push('Issue: ' + issue);
      lines.push('Details: ' + msg);
      lines.push('');
      lines.push('Sent from rodentxwildlife.com contact form.');
      var subject = encodeURIComponent('Inspection request — ' + issue + ' — ' + town);
      var body = encodeURIComponent(lines.join('\n'));
      if (success) success.style.display = 'block';
      window.location.href = 'mailto:contact@rodentxwildlife.com?subject=' + subject + '&body=' + body;
    });
  });
})();
