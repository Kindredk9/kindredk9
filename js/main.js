/* ===================================================
   KINDRED K9 — main.js
   =================================================== */

(function () {
  'use strict';

  // ── Navigation scroll effect ──────────────────────
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav overlay ────────────────────────────
  const navToggle  = document.querySelector('.nav-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  const navClose   = document.querySelector('.nav-overlay-close');

  function openNav() {
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.contains('open') ? closeNav() : openNav();
    });
    if (navClose) navClose.addEventListener('click', closeNav);

    navOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeNav);
    });

    // Close on escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeNav();
    });
  }

  // ── Active nav link ───────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-overlay-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── Scroll-reveal animations ──────────────────────
  const animEls = document.querySelectorAll('[data-animate]');
  if (animEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    animEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show all immediately
    animEls.forEach(el => el.classList.add('visible'));
  }

  // ── FAQ accordion ─────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    if (!btn || !ans) return;

    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      ans.style.maxHeight = isOpen ? ans.scrollHeight + 'px' : '0';

      // Collapse siblings
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = '0';
        }
      });
    });
  });

  // ── Hero image carousel ───────────────────────────
  const heroA = document.querySelector('#hero-photo-a');
  const heroB = document.querySelector('#hero-photo-b');
  const heroCaption = document.querySelector('#hero-caption');

  if (heroA && heroB) {
    const slides = [
      { src: 'img/trainer-hero.jpg', caption: 'Dan & Reggie' },
      { src: 'img/hero-lab-gsd.jpg', caption: 'Well-mannered pack' },
      { src: 'img/hero-puppy.jpg', caption: 'Puppy foundations' },
      { src: 'img/hero-lab-bed.jpg', caption: 'Calm at home' },
      { src: 'img/hero-gsd-ball.jpg', caption: 'Playtime, on cue' },
      { src: 'img/hero-family-walk.jpg', caption: 'Family walks' },
      { src: 'img/hero-goldendoodle.jpg', caption: 'Loose-leash walking' },
      { src: 'img/hero-poodle-moose.jpg', caption: 'Happy at home' }
    ];

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion && slides.length > 1) {
      slides.forEach(s => { const img = new Image(); img.src = s.src; });

      let index = 0;
      let showingA = true;

      setInterval(() => {
        index = (index + 1) % slides.length;
        const incoming = showingA ? heroB : heroA;
        const outgoing = showingA ? heroA : heroB;

        incoming.src = slides[index].src;
        incoming.classList.add('is-active');
        outgoing.classList.remove('is-active');
        if (heroCaption) heroCaption.textContent = slides[index].caption;

        showingA = !showingA;
      }, 5000);
    }
  }

  // ── Testimonial carousel ──────────────────────────
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');

  if (testimonialCards.length > 1) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tIndex = 0;
    let tTimer = null;

    function showTestimonial(i) {
      tIndex = i;
      testimonialCards.forEach((card, idx) => card.classList.toggle('is-active', idx === i));
      testimonialDots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === i);
        dot.setAttribute('aria-selected', idx === i ? 'true' : 'false');
      });
    }

    function startAutoplay() {
      if (reduceMotion) return;
      tTimer = setInterval(() => {
        showTestimonial((tIndex + 1) % testimonialCards.length);
      }, 6000);
    }

    function stopAutoplay() {
      if (tTimer) clearInterval(tTimer);
    }

    testimonialDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showTestimonial(idx);
        stopAutoplay();
        startAutoplay();
      });
    });

    startAutoplay();
  }

  // ── Contact form ──────────────────────────────────
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(res => {
        if (res.ok) {
          btn.textContent = '✓ Message sent!';
          btn.style.background = 'var(--teal)';
          form.reset();
          setTimeout(() => {
            btn.textContent = orig;
            btn.disabled = false;
            btn.style.background = '';
          }, 3500);
        } else {
          btn.textContent = 'Something went wrong. Try again';
          btn.disabled = false;
        }
      })
      .catch(() => {
        btn.textContent = 'Something went wrong. Try again';
        btn.disabled = false;
      });
    });
  }

})();
