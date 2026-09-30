(function () {
  'use strict';
  const products = window.TONGBAO_PRODUCTS || [];
  const { escape: esc, normalize, openDialog, closeDialog, track, scrollBehavior } = window.Tongbao;
  const grid = document.querySelector('[data-product-grid]');
  const filters = document.querySelector('[data-filters]');
  const search = document.querySelector('[data-product-search]');
  const count = document.querySelector('[data-product-count]');
  const empty = document.querySelector('[data-catalog-empty]');
  const reset = document.querySelector('[data-catalog-reset]');
  const modal = document.querySelector('[data-modal]');
  const body = document.querySelector('[data-modal-body]');
  if (!grid || !modal) return;
  const groups = ['Tất cả', ...new Set(products.map(item => item.group))];
  let group = 'Tất cả';
  const imagesFor = item => item.gallery?.length ? item.gallery : [item.image];
  const searchable = new Map(products.map(item => [item.id, normalize([item.name, item.group, item.short, item.uses, ...item.highlights, ...item.specs.flat()].join(' '))]));
  function card(item) {
    const images = imagesFor(item);
    return `<article class="product-card" data-product-id="${esc(item.id)}">
      <div class="product-media${images.length > 1 ? ' product-media--gallery' : ''}">
        <img src="${esc(item.image)}" alt="${esc(item.name)}" width="1000" height="750" loading="lazy" decoding="async">
        <span class="product-chip">${esc(item.group)}</span>
        ${images.length > 1 ? `<span class="product-gallery-count">${images.length} ảnh</span>` : ''}
      </div>
      <div class="product-body"><h3>${esc(item.name)}</h3><p>${esc(item.short)}</p>
        <ul class="mini-specs">${item.highlights.map(value => `<li>${esc(value)}</li>`).join('')}</ul>
        <button class="card-link" type="button" data-open-product="${esc(item.id)}" aria-label="Xem thông số ${esc(item.name)}">Xem thông số</button>
      </div></article>`;
  }
  function render() {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const result = products.filter(item => (group === 'Tất cả' || item.group === group) && words.every(word => searchable.get(item.id).includes(word)));
    grid.innerHTML = result.map(card).join('');
    count.textContent = `${result.length} / ${products.length} cấu hình${group === 'Tất cả' ? '' : ` · ${group}`}`;
    empty.hidden = result.length !== 0;
    reset.hidden = group === 'Tất cả' && !search.value;
    filters.querySelectorAll('button').forEach(button => {
      const selected = button.dataset.filter === group;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  filters.innerHTML = groups.map(value => `<button class="filter-button" type="button" data-filter="${esc(value)}" aria-pressed="false">${esc(value)} <span>${value === 'Tất cả' ? products.length : products.filter(item => item.group === value).length}</span></button>`).join('');
  render();
  search.addEventListener('input', render);
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (button) { group = button.dataset.filter; render(); track('product_filter', { product_group: group }); }
  });
  document.querySelectorAll('[data-catalog-reset]').forEach(button => button.addEventListener('click', () => {
    group = 'Tất cả'; search.value = ''; render(); search.focus({ preventScroll: true });
  }));
  function openProduct(id, trigger) {
    const item = products.find(product => product.id === id);
    if (!item) return;
    const images = imagesFor(item);
    const gallery = `<div class="product-gallery"><div class="product-gallery__main"><img src="${esc(images[0])}" alt="${esc(item.name)} — ảnh 1" width="1000" height="750" data-gallery-main></div>${images.length > 1 ? `<div class="product-gallery__thumbs" aria-label="Ảnh ${esc(item.name)}">${images.map((src, index) => `<button class="product-gallery__thumb${index === 0 ? ' is-active' : ''}" type="button" data-gallery-src="${esc(src)}" data-gallery-index="${index + 1}" aria-label="Xem ảnh ${index + 1}" aria-pressed="${index === 0}"><img src="${esc(src)}" alt="" width="120" height="90" loading="lazy"></button>`).join('')}</div>` : ''}</div>`;
    body.innerHTML = `<div class="modal-product">${gallery}<div><span class="eyebrow">${esc(item.group)}</span><h2 id="product-title" tabindex="-1">${esc(item.name)}</h2><p class="modal-lead">${esc(item.short)}</p><dl class="spec-table">${item.specs.map(([key, value]) => `<div class="spec-row"><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p class="modal-use"><strong>Ứng dụng:</strong> ${esc(item.uses)}</p>${item.note ? `<p class="modal-note">${esc(item.note)}</p>` : ''}<div class="modal-actions"><button class="button button-primary" type="button" data-consult-product="${esc(item.id)}">Tư vấn cấu hình này</button><a class="button button-secondary" href="tel:0337018271">Gọi tư vấn</a></div></div></div>`;
    openDialog(modal, { trigger, initialFocus: body.querySelector('h2') });
    track('product_view', { product_id: item.id, product_group: item.group });
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-product]');
    if (trigger) openProduct(trigger.dataset.openProduct, trigger);
    const fit = event.target.closest('[data-fit-group]');
    if (fit) {
      group = fit.dataset.fitGroup; search.value = ''; render();
      document.querySelector('#san-pham').scrollIntoView({ behavior: scrollBehavior() });
      search.focus({ preventScroll: true });
    }
    const thumb = event.target.closest('[data-gallery-src]');
    if (thumb) {
      const main = body.querySelector('[data-gallery-main]');
      main.hidden = false;
      delete main.dataset.failed;
      main.parentElement.querySelector('.image-unavailable')?.remove();
      main.src = thumb.dataset.gallerySrc;
      main.alt = `${body.querySelector('h2').textContent} — ảnh ${thumb.dataset.galleryIndex}`;
      body.querySelectorAll('[data-gallery-src]').forEach(button => {
        button.classList.toggle('is-active', button === thumb);
        button.setAttribute('aria-pressed', String(button === thumb));
      });
    }
  });
  document.querySelector('[data-modal-close]').addEventListener('click', () => closeDialog());
  modal.addEventListener('click', event => { if (event.target === modal) closeDialog(); });
})();
