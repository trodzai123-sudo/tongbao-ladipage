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
  const productSection = document.querySelector('#san-pham');

  const iconArrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function productVisual(product, extraClass = '', eager = false) {
    const loading = eager ? 'eager' : 'lazy';
    const priority = eager ? ' fetchpriority="high"' : '';
    const alt = product.imageAlt || `Ảnh tham khảo ${product.name}`;
    return `<img class="product-image ${extraClass}" src="${product.image}" alt="${alt}" loading="${loading}" decoding="async" referrerpolicy="no-referrer"${priority}>`;
  }

  function sourceBadge(product) {
    return `<span class="image-ref-badge" title="Ảnh tham khảo từ nguồn web">Ảnh tham khảo</span>`;
  }

  function cardTemplate(product) {
    return `
      <article class="product-card reveal" data-group="${product.group}">
        <div class="product-media">
          ${productVisual(product)}
          <span class="product-chip">${product.group}</span>
          ${sourceBadge(product)}
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

  function setFilter(group) {
    if (!filterWrap) return;
    filterWrap.querySelectorAll('[data-filter]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.filter === group);
    });
    renderProducts(group);
  }

  function openProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product || !modal || !modalBody) return;

    const sourceLine = product.imageSourceUrl
      ? `<p class="image-source-line">Ảnh minh họa công nghệ: <a href="${product.imageSourceUrl}" target="_blank" rel="noopener noreferrer">${product.imageSource || 'Nguồn web'}</a>. Hình ảnh không dùng từ catalogue TONGBAO.</p>`
      : '';

    modalBody.innerHTML = `
      <div class="modal-product">
        <div class="modal-product__image">
          ${productVisual(product, 'product-image--modal', true)}
          ${sourceBadge(product)}
        </div>
        <div class="modal-product__content">
          <span class="eyebrow">${product.group}</span>
          <h2>${product.name}</h2>
          <p class="modal-lead">${product.short}</p>
          ${sourceLine}
          <div class="spec-table" role="table" aria-label="Thông số ${product.name}">
            ${product.specs.map(([label, value]) => `
              <div class="spec-row" role="row"><strong role="cell">${label}</strong><span role="cell">${value}</span></div>`).join('')}
          </div>
          <div class="modal-use"><strong>Ứng dụng:</strong> ${product.uses}</div>
          <div class="modal-actions"><a class="btn btn--primary" href="#lien-he" data-contact-link>Gửi mẫu để tư vấn</a></div>
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
    setFilter(btn.dataset.filter);
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-product]');
    if (trigger) openProduct(trigger.dataset.openProduct);

    const fit = event.target.closest('[data-fit-group]');
    if (fit) {
      setFilter(fit.dataset.fitGroup);
      productSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (event.target.closest('[data-contact-link]')) closeModal();
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
