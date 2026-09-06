/* ============================================================
   REDSAN SHARED CORE SCRIPTS
   Interactive Canvas, Navigation, Accordions & Lead Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSpaceCanvas();
  initMobileNav();
  initFaqAccordions();
  initContactForms();
  initContactModal();
});

/* 1. Interactive Starfield / Space Canvas */
function initSpaceCanvas() {
  const canvas = document.getElementById('space-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  const starCount = 85;

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

/* 2. Mobile Nav Toggle */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileNav');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== toggle) {
      menu.classList.remove('open');
    }
  });
}

/* 3. FAQ Accordion */
function initFaqAccordions() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');
      const ans = item.querySelector('.faq-answer');

      // Close other items in the same container
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

/* 4. Web3Forms AJAX Lead Capture */
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

/* 5. Contact Modal Controller */
function initContactModal() {
  const modal = document.getElementById('contactModal');
  if (!modal) return;
  const closeBtn = document.getElementById('contactModalClose');

  function openModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Delegated open for modal triggers
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-open-modal="contact"]');
    if (link) {
      openModal(e);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}
