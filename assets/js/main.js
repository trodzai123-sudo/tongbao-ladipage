(function () {
  'use strict';
  const header = document.querySelector('[data-header]');
  const button = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const mobile = matchMedia('(max-width: 980px)');
  function closeMenu(restoreFocus = false) {
    nav.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Mở menu');
    if (restoreFocus) button.focus({ preventScroll: true });
  }
  button.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true); });
  header.addEventListener('focusout', event => { if (!header.contains(event.relatedTarget)) closeMenu(); });
  mobile.addEventListener('change', () => closeMenu());
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { header.classList.toggle('is-scrolled', scrollY > 10); ticking = false; });
  }, { passive: true });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const channel = href.startsWith('tel:') ? 'phone' : href.startsWith('https://zalo.me/') ? 'zalo' : href.startsWith('https://m.me/') ? 'messenger' : null;
    if (channel) window.Tongbao.track('contact_click', { contact_channel: channel });
  });
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.failed) return;
    img.dataset.failed = 'true';
    img.hidden = true;
    const message = document.createElement('span');
    message.className = 'image-unavailable';
    message.textContent = img.alt ? `Ảnh ${img.alt} chưa tải được.` : 'Ảnh chưa tải được.';
    img.parentElement.appendChild(message);
  }, true);
})();
