/* ============================================================
   COUNTDOWN — edit TARGET_DATE for each batch cycle
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
   SEATS COUNTER — set this manually per batch, or wire to a DB
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
   CHECKOUT FORM — front-end demo only.
   Replace with real Razorpay/Instamojo/PayU checkout call.
   ============================================================ */
document.getElementById('checkoutForm').addEventListener('submit', function(e){
  e.preventDefault();
  // TODO: trigger real payment gateway checkout here, then
  // show successBox only after payment confirmation webhook/callback.
  this.classList.add('hide');
  document.getElementById('successBox').classList.add('show');
});

/* ============================================================
   STICKY BAR — hide when checkout section is in view
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
