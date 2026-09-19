try {
  sessionStorage.setItem('rsd_session_seen', '1');
} catch (e) {}

/* ============================================================
   COUNTDOWN: edit TARGET_DATE for each batch cycle
   ============================================================ */
const TARGET_DATE = new Date('2026-08-03T23:59:59+05:30').getTime();
function updateCountdown(){
  const now = new Date().getTime();
  let diff = TARGET_DATE - now;
  if(diff < 0) diff = 0;
  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff/(1000*60*60))%24);
  const m = Math.floor((diff/(1000*60))%60);
  const s = Math.floor((diff/1000)%60);
  const cdd = document.getElementById('cd-d');
  if(cdd) cdd.textContent = String(d).padStart(2,'0');
  const cdh = document.getElementById('cd-h');
  if(cdh) cdh.textContent = String(h).padStart(2,'0');
  const cdm = document.getElementById('cd-m');
  if(cdm) cdm.textContent = String(m).padStart(2,'0');
  const cds = document.getElementById('cd-s');
  if(cds) cds.textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   SEATS COUNTER: set this manually per batch, or wire to a DB
   ============================================================ */
const SEATS_TOTAL = 40;
const SEATS_LEFT = 9; // <-- edit manually each batch
const seatsLine = document.getElementById('seatsLine');
if (seatsLine) seatsLine.textContent = `Only ${SEATS_LEFT} of ${SEATS_TOTAL} seats left`;

/* ============================================================
   ACCORDIONS
   ============================================================ */
document.querySelectorAll('.acc-item').forEach(item=>{
  const q = item.querySelector('.acc-q');
  const a = item.querySelector('.acc-a');
  q.addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    item.closest('.accordion').querySelectorAll('.acc-item').forEach(other=>{
      other.classList.remove('open');
      other.querySelector('.acc-a').style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

/* ============================================================
   CHECKOUT FORM: Razorpay Payment Integration
   ============================================================ */
const checkoutForm = document.getElementById('checkoutForm');
const paymentGatewayUrl = 'https://rzp.io/rzp/L3ZzMX0';

if (checkoutForm) {
  checkoutForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('cf-name') ? document.getElementById('cf-name').value.trim() : '';
    const email = document.getElementById('cf-email') ? document.getElementById('cf-email').value.trim() : '';
    const phone = document.getElementById('cf-phone') ? document.getElementById('cf-phone').value.trim() : '';
    const message = document.getElementById('cf-message') ? document.getElementById('cf-message').value.trim() : '';

    try {
      if (window.localStorage) {
        localStorage.setItem('redsan_workshop_lead', JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          message: message,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.warn('Unable to persist lead locally', err);
    }

    // Redirect to Razorpay payment page
    window.location.href = paymentGatewayUrl;
  });
}

// Auto-display success state if returned from payment with status flag
const checkoutParams = new URLSearchParams(window.location.search);
if (checkoutParams.get('payment') === 'success' || checkoutParams.get('status') === 'success' || window.location.hash === '#success') {
  if (checkoutForm) checkoutForm.classList.add('hide');
  const successBox = document.getElementById('successBox');
  if (successBox) successBox.classList.add('show');
}

/* ============================================================
   STICKY BAR: hide when checkout section is in view
   ============================================================ */
const stickyBar = document.getElementById('stickyBar');
const checkoutEl = document.getElementById('checkout');
const stickyObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    stickyBar.classList.toggle('hidden', entry.isIntersecting);
  });
},{threshold:0.15});
stickyObserver.observe(checkoutEl);

/* ============================================================
   SCROLL REVEALS
   ============================================================ */
const revealTargets = document.querySelectorAll('.reveal, .problem-line, .wa-bubble');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add('in'), i*70 % 400);
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.2});
revealTargets.forEach(t=>revealObserver.observe(t));


/* Live-ish join counter tick (cosmetic, deterministic not random-inflated) */
let base = 512;
const heroCount = document.getElementById('heroCount');
const badgeCount = document.getElementById('badgeCount');
setInterval(()=>{
  base += 1;
  if(heroCount) heroCount.textContent = base;
  if(badgeCount) badgeCount.textContent = base + '+ Students Joined';
}, 45000);

/* ISO 9001:2015 Registration Certificate Verification Modal */
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

initIsoVerificationModal();
