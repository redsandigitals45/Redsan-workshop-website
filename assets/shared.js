/* ============================================================
   REDSAN SYNCHRONIZED CORE CONTROLLER
   Canvas Starfield, Navbar Dropdown, Mobile Accordions & Forms
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  try {
    sessionStorage.setItem('rsd_session_seen', '1');
  } catch (e) {}
  initSpaceCanvas();
  initNavbars();
  initFaqAccordions();
  initContactForms();
  initIsoVerificationModal();
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
    let isPinnedOpen = false;

    function openMenu(pin = false) {
      clearTimeout(closeTimer);
      if (pin) isPinnedOpen = true;
      container.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu(force = false) {
      clearTimeout(closeTimer);
      if (force || !isPinnedOpen) {
        isPinnedOpen = false;
        container.classList.remove('is-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    }

    function scheduleClose() {
      if (isPinnedOpen) return;
      closeTimer = setTimeout(() => {
        closeMenu(true);
      }, 350); // 350ms grace period so options never disappear instantly
    }

    container.addEventListener('mouseenter', () => openMenu(false));
    container.addEventListener('mouseleave', scheduleClose);

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isPinnedOpen) {
          closeMenu(true);
        } else {
          openMenu(true);
        }
      });
    }

    if (menu) {
      menu.addEventListener('mouseenter', () => openMenu(false));
      menu.addEventListener('mouseleave', scheduleClose);
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          closeMenu(true);
        });
      });
    }

    // Global click outside to close dropdowns
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        closeMenu(true);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu(true);
      }
    });
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
          form.reset();
          window.location.href = '/thank-you/';
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

/* 5. ISO 9001:2015 Registration Certificate Verification Modal */
function initIsoVerificationModal() {
  if (window.__isoModalInitialized) return;
  window.__isoModalInitialized = true;

  function ensureModalElement() {
    let modal = document.getElementById('isoCertificateModal');
    if (modal) return modal;

    const modalHtml = `
<div class="iso-modal-backdrop" id="isoCertificateModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="isoModalTitle">
  <div class="iso-modal-dialog">
    <div class="iso-modal-header">
      <div class="iso-modal-title-wrap">
        <div class="iso-modal-kicker"><span class="iso-live-dot"></span>OFFICIAL CREDENTIAL VERIFICATION</div>
        <h3 id="isoModalTitle" class="iso-modal-title">ISO 9001:2015 Registration Certificate</h3>
        <p class="iso-modal-subtitle">Quality Management System · Redsan Digitals Pvt. Ltd.</p>
      </div>
      <button type="button" class="iso-modal-close" id="isoModalClose" aria-label="Close certificate verification dialog">✕</button>
    </div>

    <div class="iso-modal-body">
      <div class="iso-modal-doc-col">
        <div class="iso-cert-frame">
          <span class="crosshair tl"></span><span class="crosshair br"></span>
          <picture>
            <source srcset="/assets/ISO-registration-certificate.webp" type="image/webp">
            <img src="/assets/ISO-registration-certificate.jpeg" alt="ISO 9001:2015 Registration Certificate for Redsan Digitals" class="iso-cert-img" width="890" height="1165" loading="lazy" decoding="async">
          </picture>
        </div>
        <div class="iso-cert-actions">
          <a href="/assets/ISO-registration-certificate.jpeg" target="_blank" rel="noopener noreferrer" class="iso-btn-sub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            Open Full Resolution
          </a>
          <a href="/assets/ISO-registration-certificate.jpeg" download="ISO-9001-2015-Redsan-Certificate.jpeg" class="iso-btn-sub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download
          </a>
        </div>
      </div>

      <div class="iso-modal-info-col">
        <div class="iso-status-pill">
          <span class="iso-status-check">✓</span>
          <span>Verified Active Certification</span>
        </div>

        <div class="iso-dossier-grid">
          <div class="iso-dossier-item">
            <div class="iso-dossier-label">Certified Entity</div>
            <div class="iso-dossier-val">Redsan Digitals</div>
          </div>
          <div class="iso-dossier-item">
            <div class="iso-dossier-label">Registration Standard</div>
            <div class="iso-dossier-val highlight">ISO 9001:2015</div>
          </div>
          <div class="iso-dossier-item">
            <div class="iso-dossier-label">Certificate Number</div>
            <div class="iso-dossier-val mono">QMS/230620/9888</div>
          </div>
          <div class="iso-dossier-item">
            <div class="iso-dossier-label">Validity Period</div>
            <div class="iso-dossier-val">25 Dec 2025 to 24 Dec 2028</div>
          </div>
          <div class="iso-dossier-item full">
            <div class="iso-dossier-label">Accreditation Body</div>
            <div class="iso-dossier-val">Euro UK Accreditation Licensing Services (EUR-UK-ALS)</div>
          </div>
          <div class="iso-dossier-item full">
            <div class="iso-dossier-label">Certified Scope</div>
            <div class="iso-dossier-val sm">Information Technology Services, Digital Marketing, Advertising Solutions, Web Development, and Structured Coaching / Training Programs.</div>
          </div>
        </div>

        <div class="iso-verify-cta-box">
          <p class="iso-verify-note">To independently verify this registration status with the accreditation registry:</p>
          <a href="http://euroukals.org.uk/check-certified-org.php" target="_blank" rel="noopener noreferrer" class="iso-btn-primary">
            Verify at Registrar Portal (euroukals.org.uk) →
          </a>
        </div>
      </div>
    </div>
  </div>
</div>`;

    const placeholder = document.createElement('div');
    placeholder.innerHTML = modalHtml.trim();
    modal = placeholder.firstElementChild;
    document.body.appendChild(modal);
    return modal;
  }

  let lastActiveTrigger = null;

  function openIsoModal(triggerEl) {
    const modal = ensureModalElement();
    lastActiveTrigger = triggerEl || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.iso-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeIsoModal() {
    const modal = document.getElementById('isoCertificateModal');
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      try { lastActiveTrigger.focus(); } catch (e) {}
    }
  }

  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-iso-verify], .badge-iso, .iso-verify-trigger');
    if (trigger) {
      e.preventDefault();
      openIsoModal(trigger);
      return;
    }

    const closeBtn = e.target.closest('#isoModalClose, .iso-modal-close');
    if (closeBtn) {
      e.preventDefault();
      closeIsoModal();
      return;
    }

    const modal = document.getElementById('isoCertificateModal');
    if (modal && e.target === modal) {
      e.preventDefault();
      closeIsoModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeIsoModal();
    }
  });
}
