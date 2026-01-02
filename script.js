(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('#site-nav');
  const yearEl = document.querySelector('#year');
  const form = document.querySelector('.form');
  const formNote = document.querySelector('#form-note');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const setNavOpen = (open) => {
    if (!navToggle || !siteNav) return;

    siteNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = !siteNav.classList.contains('is-open');
      setNavOpen(open);
    });

    siteNav.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.matches && t.matches('a.nav-link')) setNavOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 640) setNavOpen(false);
    });
  }

  if (form) {
    form.addEventListener('submit', () => {
      const name = form.querySelector('input[name="name"]')?.value?.trim() || '';
      const email = form.querySelector('input[name="email"]')?.value?.trim() || '';
      const message = form.querySelector('textarea[name="message"]')?.value?.trim() || '';

      if (!name || !email || !message) {
        if (formNote) formNote.textContent = 'Please fill in all fields.';
        return;
      }

      if (formNote) formNote.textContent = 'Message prepared (demo). Connect backend/email service to send.';
      form.reset();
    });
  }

  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    const revealNow = (el) => el.classList.add('is-revealed');

    if ('IntersectionObserver' in window) {
      const revealIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            revealNow(e.target);
            revealIo.unobserve(e.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );

      revealEls.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
        revealIo.observe(el);
      });
    } else {
      revealEls.forEach(revealNow);
    }
  }

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.site-nav .nav-link'));

  if (sections.length && navLinks.length) {
    const linkById = new Map(navLinks.map((a) => [a.getAttribute('href')?.slice(1), a]));

    const setActive = (id) => {
      navLinks.forEach((a) => a.classList.remove('is-active'));
      const a = linkById.get(id);
      if (a) a.classList.add('is-active');
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.6] }
    );

    sections.forEach((s) => io.observe(s));
  }
})();
