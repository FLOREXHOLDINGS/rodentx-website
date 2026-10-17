// RodentX — site behaviour only (no routing; every page is a real document):
// mobile drawer, desktop dropdowns, FAQ accordions, Instagram facades,
// contact forms, header shadow, reveal-on-scroll, back-to-top.
(function () {
  'use strict';

  function closeDropdowns(except) {
    document.querySelectorAll('.nav-drop.open').forEach(function (d) {
      if (d === except) return;
      d.classList.remove('open');
      var b = d.querySelector('.nav-drop-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

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

  // --- Mobile drawer: white panel slides in from the right over a dimmed
  //     backdrop; links stagger in; Escape / backdrop / close all dismiss ---
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileMenu');
  var backdrop = document.getElementById('drawerBackdrop');
  var closeBtn = document.getElementById('drawerClose');
  var hideTimer = null;

  function setToggleLabel(open) {
    if (!toggle) return;
    var label = toggle.querySelector('.nav-toggle-label');
    if (label) label.textContent = open ? 'Close' : 'Menu';
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  function openDrawer() {
    if (!drawer) return;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    if (backdrop) backdrop.hidden = false;
    // Force a frame so the slide transition runs from the hidden state.
    void drawer.offsetWidth;
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (toggle) {
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('menu-open');
    setToggleLabel(true);
    var first = drawer.querySelector('.drawer-close') || drawer.querySelector('a');
    if (first) first.focus();
  }
  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (toggle) {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-open');
    setToggleLabel(false);
    hideTimer = setTimeout(function () { if (backdrop) backdrop.hidden = true; }, 350);
    if (toggle) toggle.focus();
  }
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeDrawer();
    });
  }

  // --- Issue selector buttons (home): data-go holds a real relative path ---
  document.querySelectorAll('[data-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.location.href = btn.getAttribute('data-go');
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
      var scope = item.closest('.faq') || document;
      var wasOpen = item.classList.contains('open');
      scope.querySelectorAll('.faq-item').forEach(function (o) {
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
