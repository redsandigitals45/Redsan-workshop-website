document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  // Sticky bottom bar — show after scrolling past the masthead
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

  // Category filter chips
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.mag-card');
  var emptyState = document.getElementById('blogEmpty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');

      var filter = chip.getAttribute('data-filter');
      var visible = 0;

      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
    });
  });

  // Newsletter form (placeholder — wire to real ESP)
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

  // Load more (placeholder — wire to CMS pagination)
  var loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      loadMoreBtn.textContent = 'No More Dispatches (Yet)';
      loadMoreBtn.disabled = true;
    });
  }

});
