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

  // On Vercel with Vite: set VITE_WEB3FORMS_KEY in environment variables
  // On static hosting: fallback key is used
  const WEB3FORMS_KEY = import.meta.env?.VITE_WEB3FORMS_KEY || '3b25e456-e167-4921-acca-33315e0b490c';

  // Favicon theme switcher
  (function() {
    const darkIcon = 'icon-dark.ico';
    const lightIcon = 'icon-light.ico';

    function setFavicon() {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const icon = isDark ? darkIcon : lightIcon;
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = icon;
    }

    setFavicon();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setFavicon);
  })();

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = form.querySelector('input[name="name"]')?.value?.trim()     || '';
      const email   = form.querySelector('input[name="email"]')?.value?.trim()    || '';
      const message = form.querySelector('textarea[name="message"]')?.value?.trim() || '';

      if (!name || !email || !message) {
        if (formNote) {
          formNote.textContent = 'Please fill in all fields.';
          formNote.className   = 'form-note form-note-error';
        }
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      if (formNote)  { formNote.textContent = ''; formNote.className = 'form-note'; }

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name,
            email,
            message,
            subject:   `New message from ${name} — Dream Way website`,
            from_name: 'Dream Way Website',
          }),
        });

        const data = await res.json();

        if (data.success) {
          if (formNote) {
            formNote.textContent = "Message sent! We'll get back to you soon.";
            formNote.className   = 'form-note form-note-success';
          }
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch {
        if (formNote) {
          formNote.textContent = 'Failed to send. Please email us at dreamway.gamestudio@gmail.com directly.';
          formNote.className   = 'form-note form-note-error';
        }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
      }
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
