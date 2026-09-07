document.addEventListener('DOMContentLoaded', function () {

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

  // Category filter chips
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.mag-card');
  var emptyState = document.getElementById('blogEmpty');
  var blogSearchInput = document.getElementById('blogSearchInput');

  function applyFilters() {
    var activeChip = document.querySelector('.chip.active');
    var filter = activeChip ? activeChip.getAttribute('data-filter') : 'all';
    var query = blogSearchInput ? blogSearchInput.value.trim().toLowerCase() : '';
    var visible = 0;

    cards.forEach(function (card) {
      var matchesCategory = (filter === 'all' || card.getAttribute('data-category') === filter);
      var textContent = card.innerText.toLowerCase();
      var matchesSearch = !query || textContent.indexOf(query) !== -1;

      var show = matchesCategory && matchesSearch;
      card.style.display = show ? 'flex' : 'none';
      if (show) visible++;
    });

    if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
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

});
