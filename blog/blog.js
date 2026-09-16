document.addEventListener('DOMContentLoaded', function () {
  try {
    sessionStorage.setItem('rsd_session_seen', '1');
  } catch (e) {}

  // Mobile nav toggle & services dropdown
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  var mobileServicesToggle = document.getElementById('mobileServicesToggle');
  var mobileServicesMenu = document.getElementById('mobileServicesMenu');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
      });
    });

    document.addEventListener('click', function (e) {
      if (!mobileNav.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }

  if (mobileServicesToggle && mobileServicesMenu) {
    mobileServicesToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      mobileServicesMenu.classList.toggle('open');
      var arrow = mobileServicesToggle.querySelector('span');
      if (arrow) {
        arrow.textContent = mobileServicesMenu.classList.contains('open') ? '▴' : '▾';
      }
    });
  }

  // Desktop Services dropdown persistent click and hover grace period
  var desktopDropdowns = document.querySelectorAll('.nav-item-dropdown');
  desktopDropdowns.forEach(function (container) {
    var trigger = container.querySelector('.dropdown-trigger');
    var closeTimer = null;
    var isPinnedOpen = false;

    function openMenu(pin) {
      clearTimeout(closeTimer);
      if (pin) isPinnedOpen = true;
      container.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu(force) {
      clearTimeout(closeTimer);
      if (force || !isPinnedOpen) {
        isPinnedOpen = false;
        container.classList.remove('is-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    }

    function scheduleClose() {
      if (isPinnedOpen) return;
      closeTimer = setTimeout(function () {
        closeMenu(true);
      }, 350);
    }

    if (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (container.classList.contains('is-open')) {
          closeMenu(true);
        } else {
          openMenu(true);
        }
      });
    }

    container.addEventListener('mouseenter', function () {
      openMenu(false);
    });

    container.addEventListener('mouseleave', function () {
      scheduleClose();
    });

    document.addEventListener('click', function (e) {
      if (!container.contains(e.target)) {
        closeMenu(true);
      }
    });
  });

  // Sticky bottom bar: show after scrolling past the masthead
  var stickyBar = document.getElementById('stickyBar');
  if (stickyBar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        stickyBar.classList.add('show');
      } else {
        stickyBar.classList.remove('show');
      }
    });
  }

  // Category & Location filter chips
  var topicChips = document.querySelectorAll('#blogFilter .chip');
  var locationChips = document.querySelectorAll('#locationFilter .chip');
  var cards = document.querySelectorAll('.mag-card');
  var emptyState = document.getElementById('blogEmpty');
  var blogSearchInput = document.getElementById('blogSearchInput');

  function applyFilters() {
    var activeTopic = document.querySelector('#blogFilter .chip.active');
    var topicFilter = activeTopic ? activeTopic.getAttribute('data-filter') : 'all';

    var activeLoc = document.querySelector('#locationFilter .chip.active');
    var locFilter = activeLoc ? activeLoc.getAttribute('data-location') : 'all';

    var query = blogSearchInput ? blogSearchInput.value.trim().toLowerCase() : '';
    var visible = 0;

    cards.forEach(function (card) {
      var cardCat = (card.getAttribute('data-category') || '').trim();
      var cardCats = cardCat.split(/\s+/);

      var matchesTopic = (
        topicFilter === 'all' ||
        cardCats.indexOf(topicFilter) !== -1 ||
        (topicFilter === 'ai-marketing-news' && (cardCats.indexOf('news') !== -1 || cardCats.indexOf('ai-marketing-news') !== -1)) ||
        (topicFilter === 'news' && (cardCats.indexOf('news') !== -1 || cardCats.indexOf('ai-marketing-news') !== -1))
      );

      var matchesLocation = (
        locFilter === 'all' ||
        cardCats.indexOf(locFilter) !== -1
      );

      var textContent = card.innerText.toLowerCase();
      var matchesSearch = !query || textContent.indexOf(query) !== -1;

      var show = matchesTopic && matchesLocation && matchesSearch;
      card.style.display = show ? 'flex' : 'none';
      if (show) visible++;
    });

    if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
  }

  topicChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      topicChips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      applyFilters();
    });
  });

  locationChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      locationChips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      applyFilters();
    });
  });

  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', function () {
      applyFilters();
    });
  }

  // Instagram Like button interactive toggle
  document.querySelectorAll('.ig-like-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('liked');
      var svg = btn.querySelector('svg');
      if (btn.classList.contains('liked')) {
        svg.setAttribute('fill', '#e2231a');
        svg.setAttribute('stroke', '#e2231a');
      } else {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
      }
    });
  });

  // Instagram Save bookmark toggle
  document.querySelectorAll('.ig-save-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('saved');
      var svg = btn.querySelector('svg');
      if (btn.classList.contains('saved')) {
        svg.setAttribute('fill', '#ffffff');
      } else {
        svg.setAttribute('fill', 'none');
      }
    });
  });

  // Interactive "... show more" toggle: expands caption on card if user clicks without leaving
  document.querySelectorAll('.ig-show-more').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var container = link.closest('.ig-caption-container');
      if (container) {
        var captionText = container.querySelector('.ig-caption-text');
        if (captionText && captionText.style.webkitLineClamp !== 'unset') {
          e.preventDefault();
          captionText.style.display = 'block';
          captionText.style.webkitLineClamp = 'unset';
          link.textContent = 'show less';
          return;
        } else if (captionText && captionText.style.webkitLineClamp === 'unset') {
          e.preventDefault();
          captionText.style.display = '-webkit-box';
          captionText.style.webkitLineClamp = '3';
          link.textContent = '... show more';
          return;
        }
      }
    });
  });

  // Newsletter form (placeholder: wire to real ESP)
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = newsletterForm.querySelector('button');
      var input = newsletterForm.querySelector('input');
      var original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
      // TODO: wire to Mailchimp / Brevo / ConvertKit API
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        input.value = '';
      }, 2500);
    });
  }

  // Load more (placeholder: wire to CMS pagination)
  var loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      loadMoreBtn.textContent = 'No More Dispatches (Yet)';
      loadMoreBtn.disabled = true;
    });
  }

  initIsoVerificationModal();
});

/* ISO 9001:2015 Registration Certificate Verification Modal */
function initIsoVerificationModal() {
  if (window.__isoModalInitialized) return;
  window.__isoModalInitialized = true;

  function ensureModalElement() {
    var modal = document.getElementById('isoCertificateModal');
    if (modal) return modal;

    var modalHtml = `
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

    var placeholder = document.createElement('div');
    placeholder.innerHTML = modalHtml.trim();
    modal = placeholder.firstElementChild;
    document.body.appendChild(modal);
    return modal;
  }

  var lastActiveTrigger = null;

  function openIsoModal(triggerEl) {
    var modal = ensureModalElement();
    lastActiveTrigger = triggerEl || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var closeBtn = modal.querySelector('.iso-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeIsoModal() {
    var modal = document.getElementById('isoCertificateModal');
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      try { lastActiveTrigger.focus(); } catch (e) {}
    }
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-iso-verify], .badge-iso, .iso-verify-trigger');
    if (trigger) {
      e.preventDefault();
      openIsoModal(trigger);
      return;
    }

    var closeBtn = e.target.closest('#isoModalClose, .iso-modal-close');
    if (closeBtn) {
      e.preventDefault();
      closeIsoModal();
      return;
    }

    var modal = document.getElementById('isoCertificateModal');
    if (modal && e.target === modal) {
      e.preventDefault();
      closeIsoModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeIsoModal();
    }
  });
}
