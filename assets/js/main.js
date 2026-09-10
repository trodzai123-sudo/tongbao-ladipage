(function () {
  const products = window.TONGBAO_PRODUCTS || [];
  const grid = document.querySelector('[data-product-grid]');
  const filterWrap = document.querySelector('[data-filters]');
  const modal = document.querySelector('[data-modal]');
  const modalBody = document.querySelector('[data-modal-body]');
  const modalClose = document.querySelector('[data-modal-close]');
  const menuBtn = document.querySelector('[data-menu-btn]');
  const nav = document.querySelector('[data-nav]');
  const header = document.querySelector('.site-header');

  const iconArrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function cardTemplate(product) {
    return `
      <article class="product-card reveal" data-group="${product.group}">
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">
          <span class="product-chip">${product.group}</span>
        </div>
        <div class="product-card__body">
          <h3>${product.name}</h3>
          <p>${product.short}</p>
          <ul class="mini-specs">
            ${product.highlights.slice(0, 3).map(item => `<li>${item}</li>`).join('')}
          </ul>
          <button class="text-link" type="button" data-open-product="${product.id}">
            Xem thông số ${iconArrow}
          </button>
        </div>
      </article>`;
  }

  function renderProducts(group = 'Tất cả') {
    if (!grid) return;
    const filtered = group === 'Tất cả' ? products : products.filter(p => p.group === group);
    grid.innerHTML = filtered.map(cardTemplate).join('');
    bindReveal();
  }

  function renderFilters() {
    if (!filterWrap) return;
    const groups = ['Tất cả', ...new Set(products.map(p => p.group))];
    filterWrap.innerHTML = groups.map((group, i) => `
      <button class="filter-btn${i === 0 ? ' is-active' : ''}" type="button" data-filter="${group}">${group}</button>
    `).join('');
  }

  function openProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-product">
        <div class="modal-product__image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product__content">
          <span class="eyebrow">${product.group}</span>
          <h2>${product.name}</h2>
          <p class="modal-lead">${product.short}</p>
          <div class="spec-table" role="table" aria-label="Thông số ${product.name}">
            ${product.specs.map(([label, value]) => `
              <div class="spec-row" role="row">
                <strong role="cell">${label}</strong>
                <span role="cell">${value}</span>
              </div>`).join('')}
          </div>
          <div class="modal-use"><strong>Ứng dụng:</strong> ${product.uses}</div>
          <div class="modal-actions">
            <a class="btn btn--primary" href="tel:0337048271">Gọi tư vấn 0337 048 271</a>
            <a class="btn btn--ghost" href="https://zalo.me/0337048271" target="_blank" rel="noopener">Nhắn Zalo</a>
          </div>
        </div>
      </div>`;

    modal.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    setTimeout(() => { modal.hidden = true; }, 180);
  }

  function bindReveal() {
    const nodes = document.querySelectorAll('.reveal:not([data-reveal-bound])');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(node => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    nodes.forEach(node => {
      node.dataset.revealBound = '1';
      observer.observe(node);
    });
  }

  renderFilters();
  renderProducts();
  bindReveal();

  filterWrap?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-filter]');
    if (!btn) return;
    filterWrap.querySelectorAll('.filter-btn').forEach(el => el.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderProducts(btn.dataset.filter);
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-product]');
    if (trigger) openProduct(trigger.dataset.openProduct);
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  menuBtn?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(Boolean(open)));
  });
  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      nav.classList.remove('is-open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }, { passive: true });
})();
