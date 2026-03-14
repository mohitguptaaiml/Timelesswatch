/* Core site script: filters, responsive width, footer form handling, order prefill, and pre-entry modal */

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function(){
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function(){
      navMenu.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function(){
        navMenu.classList.remove('active');
      });
    });
  }
});

// Pre-entry modal logic
(function(){
  function showModal() {
    const modal = document.getElementById('preloadModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function hideModal(persist) {
    const modal = document.getElementById('preloadModal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // restore scroll
    if (persist) {
      try { localStorage.setItem('watchSiteEntered', '1'); } catch(e){}
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    // if user already entered before, don't show
    let already = false;
    try { already = !!localStorage.getItem('watchSiteEntered'); } catch(e){}
    if (!already) showModal();

    const enterBtn = document.getElementById('enterSite');
    const skipBtn = document.getElementById('skipSite');
    const closeBtn = document.getElementById('modalClose');

    if (enterBtn) enterBtn.addEventListener('click', function(){ hideModal(true); });
    if (skipBtn) skipBtn.addEventListener('click', function(){ hideModal(false); });
    if (closeBtn) closeBtn.addEventListener('click', function(){ hideModal(false); });

    // accessibility: close on ESC
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') hideModal(false);
    });
  });
})();

(() => {
  const state = { filters: {}, maxPrice: 50000 };

  function updateWidth() {
    const el = document.getElementById('screenWidth');
    if (el) el.textContent = window.innerWidth;
  }

  function initPriceRange() {
    const range = document.getElementById('priceRange');
    const value = document.getElementById('priceValue');
    if (!range || !value) return;
    value.textContent = range.value;
    state.maxPrice = parseInt(range.value, 10);
    range.addEventListener('input', (e) => {
      state.maxPrice = parseInt(e.target.value, 10);
      value.textContent = e.target.value;
      applyFilters();
    });
  }

  function toggleFilterButton(btn) {
    btn.classList.toggle('active');
    const group = btn.dataset.group;
    const value = btn.dataset.value;
    if (!group) return;
    state.filters[group] = state.filters[group] || new Set();
    if (btn.classList.contains('active')) state.filters[group].add(value);
    else state.filters[group].delete(value);
    if (state.filters[group].size === 0) delete state.filters[group];
    applyFilters();
  }

  function applyFilters() {
    const cards = document.querySelectorAll('.watch-card');
    cards.forEach(card => {
      let visible = true;
      // price check
      const price = parseInt(card.dataset.price || '0', 10);
      if (state.maxPrice && price > state.maxPrice) visible = false;

      // other filters: every active group must match
      for (const [group, set] of Object.entries(state.filters)) {
        const cardVal = (card.dataset[group] || '').toString();
        if (!set.has(cardVal)) {
          visible = false; break;
        }
      }

      card.style.display = visible ? '' : 'none';
    });
  }

  function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleFilterButton(btn));
    });
  }

  function initFooterForm() {
    const f = document.getElementById('footerContact');
    if (!f) return;
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // simulate a send — in real site this should post to an API
      const name = f.name?.value || 'Guest';
      alert(`Thanks, ${name}! We received your message and will reply soon.`);
      f.reset();
    });
  }

  function initOrderPrefill() {
    if (!window.location.search) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;
    const titleEl = document.getElementById('orderTitle');
    const hiddenId = document.getElementById('orderId');
    if (titleEl) titleEl.textContent = id.replace('-', ' ');
    if (hiddenId) hiddenId.value = id;
  }

  function initOrderForm() {
    const form = document.getElementById('orderForm');
    if (!form) return;
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      // For demo, just show a quick summary and reset
      alert(`Order placed for ${data.get('orderId') || 'unknown'}. Thank you!`);
      form.reset();
    });
  }

  function init() {
    updateWidth();
    initPriceRange();
    initFilterButtons();
    initFooterForm();
    initOrderPrefill();
    initOrderForm();
    window.addEventListener('resize', () => requestAnimationFrame(updateWidth));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();

let audioPlayed = false;

document.addEventListener("click", function () {
  if (audioPlayed) return;

  const audio = document.getElementById("siteAudio");
  if (!audio) return;

  audio.volume = 0.25;
  audio.play().catch(() => {});
  audioPlayed = true;
});
document.addEventListener("touchstart", () => {
  const video = document.querySelector(".bg-video");
  if (video.paused) {
    video.play().catch(() => {});
  }
}, { once: true });

