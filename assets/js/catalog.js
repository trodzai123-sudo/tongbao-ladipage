(function(){
  const products=window.TONGBAO_PRODUCTS||[];
  const grid=document.querySelector('[data-product-grid]');
  const filters=document.querySelector('[data-filters]');
  const modal=document.querySelector('[data-modal]');
  const body=document.querySelector('[data-modal-body]');
  const close=document.querySelector('[data-modal-close]');
  const groups=['Tất cả',...new Set(products.map(item=>item.group))];
  let closeTimer;

  const imagesFor=item=>Array.isArray(item.gallery)&&item.gallery.length?item.gallery:[item.image];
  const card=item=>{
    const images=imagesFor(item);
    const galleryClass=images.length>1?' product-media--gallery':'';
    const count=images.length>1?`<span class="product-gallery-count">${images.length} ảnh</span>`:'';
    return `<article class="product-card reveal" data-product-id="${item.id}"><div class="product-media${galleryClass}"><img src="${item.image}" alt="${item.name}" width="1000" height="750" loading="lazy" decoding="async"><span class="product-chip">${item.group}</span><span class="product-source">${item.source}</span>${count}</div><div class="product-body"><h3>${item.name}</h3><p>${item.short}</p><ul class="mini-specs">${item.highlights.map(value=>`<li>${value}</li>`).join('')}</ul><button class="card-link" type="button" data-open-product="${item.id}">Xem thông số →</button></div></article>`;
  };

  function render(group='Tất cả'){
    if(!grid)return;
    grid.innerHTML=products.filter(item=>group==='Tất cả'||item.group===group).map(card).join('');
    window.bindReveal?.();
  }

  function setFilter(group){
    filters?.querySelectorAll('button').forEach(button=>button.classList.toggle('is-active',button.dataset.filter===group));
    render(group);
  }

  function galleryMarkup(item){
    const images=imagesFor(item);
    if(images.length===1)return `<img src="${images[0]}" alt="${item.name}" width="1000" height="750">`;
    return `<div class="product-gallery">
      <div class="product-gallery__main"><img src="${images[0]}" alt="${item.name}" width="1000" height="750" data-gallery-main></div>
      <div class="product-gallery__thumbs" aria-label="Ảnh sản phẩm ${item.name}">
        ${images.map((src,index)=>`<button class="product-gallery__thumb${index===0?' is-active':''}" type="button" data-gallery-src="${src}" aria-label="Xem ảnh ${index+1}"><img src="${src}" alt="" loading="lazy" decoding="async"></button>`).join('')}
      </div>
    </div>`;
  }

  function openProduct(id){
    const item=products.find(product=>product.id===id);if(!item||!modal||!body)return;
    body.innerHTML=`<div class="modal-product">${galleryMarkup(item)}<div><span class="eyebrow">${item.group}</span><h2>${item.name}</h2><p class="modal-lead">${item.short}</p><div class="spec-table">${item.specs.map(([key,value])=>`<div class="spec-row"><strong>${key}</strong><span>${value}</span></div>`).join('')}</div><p class="modal-use"><strong>Ứng dụng:</strong> ${item.uses}</p><div class="modal-actions"><a class="button button-primary" href="#lien-he" data-modal-contact>Gửi mẫu để tư vấn</a></div></div></div>`;
    clearTimeout(closeTimer);modal.hidden=false;modal.classList.remove('is-open');document.body.classList.add('modal-open');void modal.offsetWidth;modal.classList.add('is-open');close?.focus();
  }

  function closeModal(){
    if(!modal||modal.hidden)return;
    modal.classList.remove('is-open');document.body.classList.remove('modal-open');clearTimeout(closeTimer);closeTimer=setTimeout(()=>modal.hidden=true,180);
  }

  if(filters)filters.innerHTML=groups.map((group,index)=>`<button class="filter-button${index?'':' is-active'}" type="button" data-filter="${group}">${group}</button>`).join('');
  render();

  filters?.addEventListener('click',event=>{
    const button=event.target.closest('[data-filter]');if(button)setFilter(button.dataset.filter);
  });

  document.addEventListener('click',event=>{
    const galleryThumb=event.target.closest('[data-gallery-src]');
    if(galleryThumb&&body){
      const main=body.querySelector('[data-gallery-main]');
      if(main){
        main.src=galleryThumb.dataset.gallerySrc;
        body.querySelectorAll('[data-gallery-src]').forEach(button=>button.classList.toggle('is-active',button===galleryThumb));
      }
      return;
    }
    const trigger=event.target.closest('[data-open-product]');if(trigger)openProduct(trigger.dataset.openProduct);
    const fit=event.target.closest('[data-fit-group]');if(fit){setFilter(fit.dataset.fitGroup);document.querySelector('#san-pham')?.scrollIntoView({behavior:'smooth'});}
    if(event.target.closest('[data-modal-contact]'))closeModal();
  });

  close?.addEventListener('click',closeModal);
  modal?.addEventListener('click',event=>{if(event.target===modal)closeModal();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal();});
})();