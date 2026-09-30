(function () {
  'use strict';
  const focus = element => element?.focus({ preventScroll: true });
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const scrollBehavior = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  let active = null;
  let savedScroll = 0;
  let inertState = [];
  let savedStyles = null;
  function closeDialog({ restoreFocus = true } = {}) {
    if (!active) return;
    const previous = active;
    active = null;
    previous.element.hidden = true;
    previous.element.classList.remove('is-open');
    inertState.forEach(([element, inert]) => { element.inert = inert; });
    inertState = [];
    document.body.classList.remove('dialog-open');
    if (savedStyles) Object.assign(document.body.style, savedStyles);
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
    previous.onClose?.();
    if (restoreFocus && previous.trigger?.isConnected) {
      focus(previous.trigger.getClientRects().length ? previous.trigger : document.querySelector('[data-menu-button]'));
    }
  }
  function openDialog(element, options = {}) {
    const trigger = active?.trigger || options.trigger || document.activeElement;
    closeDialog({ restoreFocus: false });
    savedScroll = window.scrollY;
    savedStyles = { position: document.body.style.position, top: document.body.style.top, width: document.body.style.width };
    active = { element, trigger, onClose: options.onClose };
    element.hidden = false;
    element.classList.add('is-open');
    inertState = [...document.body.children].filter(child => child !== element && !['SCRIPT', 'LINK', 'STYLE'].includes(child.tagName)).map(child => [child, child.inert]);
    inertState.forEach(([child]) => { child.inert = true; });
    document.body.classList.add('dialog-open');
    Object.assign(document.body.style, { position: 'fixed', top: `-${savedScroll}px`, width: '100%' });
    focus(options.initialFocus || element.querySelector('button'));
  }
  const focusable = element => [...element.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(node => !node.disabled && node.getClientRects().length && !node.closest('[hidden]'));
  document.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape') { event.preventDefault(); closeDialog(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable(active.element);
    const first = items[0], last = items.at(-1);
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {
      event.preventDefault(); focus(last);
    } else if (!event.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {
      event.preventDefault(); focus(first);
    }
  });
  document.addEventListener('focusin', event => {
    if (active && !active.element.contains(event.target)) focus(focusable(active.element)[0]);
  });
  function track(event, detail = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...detail });
  }
  window.Tongbao = { escape, normalize, focus, scrollBehavior, openDialog, closeDialog, track, getDialogTrigger: () => active?.trigger };
})();
