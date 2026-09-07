/* ============================================================
   REDSAN SYNCHRONIZED CORE CONTROLLER
   Canvas Starfield, Navbar Dropdown, Mobile Accordions & Forms
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSpaceCanvas();
  initNavbars();
  initFaqAccordions();
  initContactForms();
});

/* 1. Dynamic Space Starfield Canvas */
function initSpaceCanvas() {
  const canvas = document.getElementById('space-bg-canvas');
  // Skip 2D canvas on pages that use the custom 3D WebGL space background (e.g. homepage)
  if (!canvas || document.getElementById('rsd-cinema') || window.initGlobalSpaceBg) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width, height;
  let stars = [];
  const starCount = 80;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseDir: 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.speedX;
      s.y += s.speedY;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      s.alpha += s.pulseSpeed * s.pulseDir;
      if (s.alpha > 0.9) { s.alpha = 0.9; s.pulseDir = -1; }
      else if (s.alpha < 0.2) { s.alpha = 0.2; s.pulseDir = 1; }

      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* 2. Unified Navbar & Mobile Navigation */
function initNavbars() {
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileServicesToggle = document.getElementById('mobileServicesToggle');
  const mobileServicesMenu = document.getElementById('mobileServicesMenu');

  if (toggle && mobileNav && !toggle.dataset.bound) {
    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
    });

    // Auto-close drawer when clicking on standard navigation links
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }

  // Desktop Services dropdown persistent click & hover grace period
  const desktopDropdowns = document.querySelectorAll('.nav-item-dropdown');
  desktopDropdowns.forEach((container) => {
    if (container.dataset.bound) return;
    container.dataset.bound = 'true';
    const trigger = container.querySelector('.dropdown-trigger');
    const menu = container.querySelector('.dropdown-menu');
    let closeTimer = null;

    function openMenu() {
      clearTimeout(closeTimer);
      container.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function scheduleClose() {
      closeTimer = setTimeout(() => {
        container.classList.remove('is-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }, 250); // 250ms grace period so options never disappear instantly
    }

    container.addEventListener('mouseenter', openMenu);
    container.addEventListener('mouseleave', scheduleClose);

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        // Toggle on click
        e.preventDefault();
        e.stopPropagation();
        if (container.classList.contains('is-open')) {
          container.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          openMenu();
        }
      });
    }

    if (menu) {
      menu.addEventListener('mouseenter', openMenu);
      menu.addEventListener('mouseleave', scheduleClose);
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          container.classList.remove('is-open');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });

  // Global click outside to close dropdowns
  document.addEventListener('click', (e) => {
    desktopDropdowns.forEach((container) => {
      if (!container.contains(e.target)) {
        container.classList.remove('is-open');
        const trigger = container.querySelector('.dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      desktopDropdowns.forEach((container) => {
        container.classList.remove('is-open');
        const trigger = container.querySelector('.dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  if (mobileServicesToggle && mobileServicesMenu && !mobileServicesToggle.dataset.bound) {
    mobileServicesToggle.dataset.bound = 'true';
    mobileServicesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      mobileServicesMenu.classList.toggle('open');
      const arrow = mobileServicesToggle.querySelector('span');
      if (arrow) {
        arrow.textContent = mobileServicesMenu.classList.contains('open') ? '▴' : '▾';
      }
    });
  }
}

/* 3. FAQ Accordion Logic */
function initFaqAccordions() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');
      const ans = item.querySelector('.faq-answer');

      const container = item.closest('.faq-grid') || document;
      container.querySelectorAll('.faq-item').forEach((other) => {
        other.classList.remove('open');
        const otherAns = other.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isOpen && ans) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* 4. Asynchronous Lead Form Submissions */
function initContactForms() {
  const forms = document.querySelectorAll('form[action*="web3forms.com/submit"]');
  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const statusBox = form.querySelector('.form-status') || form.nextElementSibling;
      const origText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Lead... ⏳';
      }
      if (statusBox && statusBox.classList.contains('form-status')) {
        statusBox.style.display = 'none';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          if (statusBox && statusBox.classList.contains('form-status')) {
            statusBox.style.display = 'block';
            statusBox.style.background = 'rgba(34, 197, 94, 0.15)';
            statusBox.style.border = '1px solid #22c55e';
            statusBox.style.color = '#22c55e';
            statusBox.innerHTML = '✓ Thank you! Your request has been received. Our team will connect within 2 hours.';
          }
          form.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        if (statusBox && statusBox.classList.contains('form-status')) {
          statusBox.style.display = 'block';
          statusBox.style.background = 'rgba(239, 68, 68, 0.15)';
          statusBox.style.border = '1px solid #ef4444';
          statusBox.style.color = '#ef4444';
          statusBox.innerHTML = '✕ Unable to submit form directly. Please WhatsApp us at +91 9664365954 or email redsandigitals@gmail.com.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
      }
    });
  });
}
