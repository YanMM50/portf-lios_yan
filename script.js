/* ============================================================
   PORTFOLIO — Yan Mendes Matos
   script.js — All interactions, animations & effects
   ============================================================ */

'use strict';

/* ===== LOADER ===== */
(function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1600);
  });
  document.body.style.overflow = 'hidden';
})();


/* ===== CUSTOM CURSOR ===== */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const interactives = 'a, button, .tech-card, .project-card, input, textarea, .contact-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    }
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '';
    follower.style.opacity = '';
  });
})();


/* ===== PARTICLE BACKGROUND (canvas) ===== */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 80;
  const ACCENT = '110, 86, 255';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${ACCENT}, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); buildParticles(); });
  resize();
  buildParticles();
  loop();
})();


/* ===== TYPEWRITER ===== */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Desenvolvedor Front-End',
    'Especialista em Suporte TI',
    'Criador de Interfaces',
    'Solucionador de Problemas',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;
  let pauseTimer  = null;

  function type() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }

  // Start after loader
  setTimeout(type, 2400);
})();


/* ===== NAVBAR SCROLL ===== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const links     = document.querySelectorAll('.nav-links a');

  function highlightLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--text)'
        : '';
    });
  }

  window.addEventListener('scroll', highlightLink, { passive: true });
})();


/* ===== MOBILE NAV TOGGLE ===== */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();


/* ===== SCROLL REVEAL ===== */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* ===== COUNTER ANIMATION ===== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target);
    const duration = 1200;
    const step     = target / (duration / 16);
    let current    = 0;

    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target + '+';
        return;
      }
      el.textContent = Math.floor(current);
      requestAnimationFrame(tick);
    };
    tick();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ===== PARALLAX on HERO ===== */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
        heroContent.style.opacity   = 1 - scrolled / (window.innerHeight * 0.75);
      }
    }
  }, { passive: true });
})();


/* ===== BACK TO TOP ===== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===== CONTACT FORM ===== */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) return;

    // Build mailto link
    const subject  = encodeURIComponent(`Contato pelo portfólio - ${name}`);
    const body     = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`);
    const mailtoURL = `mailto:yanmendes50@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoURL;

    // Visual feedback
    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const orig = span.textContent;

    span.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      span.textContent = 'Mensagem enviada!';
      btn.style.background = '#22c55e';
    }, 500);

    setTimeout(() => {
      span.textContent = orig;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 3500);
  });
})();


/* ===== SMOOTH ANCHOR SCROLL ===== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ===== CARD TILT EFFECT ===== */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card, .tech-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const maxRot = 6;
      card.style.transform = `
        translateY(-6px)
        perspective(600px)
        rotateY(${dx * maxRot}deg)
        rotateX(${-dy * maxRot}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ===== GLITCH NAV LOGO (subtle) ===== */
(function initLogoHover() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;

  logo.addEventListener('mouseenter', () => {
    logo.style.textShadow = `
      2px 0 var(--accent),
      -2px 0 var(--accent-2)
    `;
    setTimeout(() => { logo.style.textShadow = ''; }, 300);
  });
})();
