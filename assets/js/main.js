/* ============================================================
   ARUN PORTFOLIO — MAIN JAVASCRIPT
   Modern ES6+, WCAG accessible, performant
   ============================================================ */

'use strict';

/* ===============================================================
   1. PRELOADER
   =============================================================== */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });

  // Fallback — hide after 3 s even if load event doesn't fire quickly
  setTimeout(() => preloader.classList.add('hidden'), 3500);
})();

/* ===============================================================
   2. CUSTOM CURSOR (desktop only)
   =============================================================== */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  // Hover state on interactive elements
  const interactives = document.querySelectorAll('a, button, [tabindex], .project-card, .skill-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ===============================================================
   3. HEADER — scroll & sticky
   =============================================================== */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial call
})();

/* ===============================================================
   4. MOBILE NAVIGATION
   =============================================================== */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  if (!toggle || !mobileMenu) return;

  function openMenu() {
    toggle.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ===============================================================
   5. SMOOTH SCROLL — respect reduced motion
   =============================================================== */
(function initSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      // Move focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();

/* ===============================================================
   6. SCROLL REVEAL
   =============================================================== */
(function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');

  if (prefersReduced) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

/* ===============================================================
   7. TYPEWRITER EFFECT
   =============================================================== */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Web Developer',
    'AI-Augmented Developer',
    'Project Manager',
    'WordPress Expert',
    'Shopify Specialist',
    'Webflow Builder',
    'Pixel-Perfect Engineer',
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPING_SPEED = 90;
  const DELETE_SPEED = 50;
  const PAUSE_AFTER = 2200;
  const PAUSE_BEFORE = 300;

  function type() {
    const current = words[wordIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
      setTimeout(type, DELETE_SPEED);
    } else {
      el.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        isDeleting = true;
        setTimeout(type, PAUSE_AFTER);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    }
  }

  setTimeout(type, 1800); // start after preloader
})();

/* ===============================================================
   8. COUNTER ANIMATION
   =============================================================== */
(function initCounters() {
  const counters = document.querySelectorAll('.hero__stat-num[data-count]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.getAttribute('data-count'), 10);
      if (prefersReduced) { el.textContent = end; return; }

      const duration = 1800;
      const step = Math.ceil(duration / end);
      let current = 0;

      const timer = setInterval(() => {
        current = Math.min(current + 1, end);
        el.textContent = current;
        if (current >= end) clearInterval(timer);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ===============================================================
   9. HERO PARTICLE CANVAS
   =============================================================== */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      r: randomBetween(1, 2.5),
      alpha: randomBetween(0.1, 0.5),
      dx: randomBetween(-0.3, 0.3),
      dy: randomBetween(-0.5, -0.15),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      /* Orange-amber particle colour — matches brand palette */
      ctx.fillStyle = `rgba(201,66,0,${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.y < -5) { p.y = H + 5; p.x = randomBetween(0, W); }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  draw();
})();

/* ===============================================================
   10. PORTFOLIO FILTER TABS
   =============================================================== */
(function initFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      cards.forEach(card => {
        const catAttr = (card.getAttribute('data-category') || '').toLowerCase();
        const categories = catAttr.split(/[\s,]+/);
        const show = filter === 'all' || categories.includes(filter.toLowerCase());

        if (show) {
          card.classList.remove('hidden');
          card.removeAttribute('hidden');
        } else {
          card.classList.add('hidden');
          card.setAttribute('hidden', '');
        }
      });
    });

    // Keyboard: left/right arrows to navigate tabs
    tab.addEventListener('keydown', e => {
      const tabList = Array.from(tabs);
      const i = tabList.indexOf(tab);
      if (e.key === 'ArrowRight') {
        tabList[(i + 1) % tabList.length].focus();
      } else if (e.key === 'ArrowLeft') {
        tabList[(i - 1 + tabList.length) % tabList.length].focus();
      }
    });
  });
})();

/* ===============================================================
   11. PROJECT CARD — THUMBNAIL SWITCHER (auto-cycle + dots)
   =============================================================== */
(function initThumbnails() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const thumbs = card.querySelectorAll('.project-card__thumb');
    const dots = card.querySelectorAll('.thumb-dot');
    if (thumbs.length <= 1) return;

    let current = 0;
    let timer;

    function goTo(index) {
      thumbs[current].classList.remove('active');
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-pressed', 'false');
      current = index;
      thumbs[current].classList.add('active');
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-pressed', 'true');
    }

    function next() { goTo((current + 1) % thumbs.length); }

    function startCycle() { timer = setInterval(next, 2500); }
    function stopCycle() { clearInterval(timer); }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', e => {
        e.preventDefault();
        stopCycle();
        goTo(i);
        startCycle();
      });
    });

    card.addEventListener('mouseenter', stopCycle);
    card.addEventListener('mouseleave', startCycle);

    startCycle();
  });
})();

/* ===============================================================
   12. CONTACT FORM VALIDATION
   =============================================================== */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  function showError(inputId, msg) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId.replace('contact', '').toLowerCase() + 'Error') ||
      form.querySelector(`#${inputId} + .form-error`);
    if (input) input.classList.add('invalid');
    if (error) error.textContent = msg;
  }

  function clearError(input) {
    input.classList.remove('invalid');
    const error = input.parentElement.querySelector('.form-error');
    if (error) error.textContent = '';
  }

  // Live validation
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // Clear all errors
    form.querySelectorAll('.form-input').forEach(i => clearError(i));

    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');

    if (!name.value.trim()) {
      showError('contactName', 'Please enter your name.');
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      showError('contactEmail', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      showError('contactMessage', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) {
      form.querySelector('.invalid').focus();
      return;
    }

    // Real Web3Forms submission
    const btnText = submitBtn.querySelector('.btn__text');
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending…';

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200 && json.success) {
          form.reset();
          if (successEl) {
            successEl.hidden = false;
            successEl.style.display = 'block';
            successEl.textContent = "✅ Thank you! Your message has been sent. I'll be in touch shortly.";
            successEl.focus();
          }
        } else {
          showError('contactMessage', json.message || 'Something went wrong. Please try again.');
        }
      })
      .catch((error) => {
        showError('contactMessage', 'Network error. Please try again later.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';
      });
  });
})();

/* ===============================================================
   13. BUTTON RIPPLE EFFECT
   =============================================================== */
(function initRipple() {
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top - size / 2}px;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

/* ===============================================================
   14. BACK TO TOP
   =============================================================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    document.getElementById('header')?.focus();
  });
})();

/* ===============================================================
   15. FOOTER YEAR
   =============================================================== */
(function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ===============================================================
   16. ACTIVE NAV LINK (highlight current section)
   =============================================================== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          const active = href === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();
