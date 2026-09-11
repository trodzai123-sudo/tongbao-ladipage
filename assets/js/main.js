(function(){
  const header=document.querySelector('[data-header]');
  const button=document.querySelector('[data-menu-button]');
  const nav=document.querySelector('[data-nav]');

  window.bindReveal=function(){
    const nodes=document.querySelectorAll('.reveal:not([data-reveal-bound])');
    if(!('IntersectionObserver'in window)){
      nodes.forEach(node=>node.classList.add('is-visible'));
      return;
    }
    const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    }),{threshold:.08,rootMargin:'0px 0px -30px'});
    nodes.forEach(node=>{node.dataset.revealBound='1';observer.observe(node)});
  };
  window.bindReveal();

  button?.addEventListener('click',()=>{
    const open=nav?.classList.toggle('is-open');
    button.setAttribute('aria-expanded',String(Boolean(open)));
  });
  nav?.addEventListener('click',event=>{
    if(event.target.closest('a')){
      nav.classList.remove('is-open');
      button?.setAttribute('aria-expanded','false');
    }
  });

  let ticking=false;
  addEventListener('scroll',()=>{
    if(!ticking){
      requestAnimationFrame(()=>{
        header?.classList.toggle('is-scrolled',scrollY>10);
        ticking=false;
      });
      ticking=true;
    }
  },{passive:true});

  const CONTACT={
    phone:'0337018271',
    phoneDisplay:'0337 018 271',
    zalo:'https://zalo.me/0337018271',
    messenger:'https://m.me/61593898667207',
    advisor:'Mrs.Miến'
  };

  const modal=document.createElement('div');
  modal.className='consult-modal';
  modal.hidden=true;
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-labelledby','consult-title');
  modal.innerHTML=`
    <div class="consult-dialog" data-consult-dialog>
      <button class="consult-close" type="button" aria-label="Đóng biểu mẫu" data-consult-close>×</button>
      <div class="consult-head">
        <span class="eyebrow">Nhận tư vấn nhanh</span>
        <h2 id="consult-title">Để lại 4 thông tin — TONGBAO tư vấn đúng nhu cầu.</h2>
        <p>Biểu mẫu tối giản, chỉ mất khoảng 30 giây. Sau đó bạn có thể gọi, gửi Zalo cho ${CONTACT.advisor} hoặc nhắn Messenger.</p>
        <div class="consult-channel-note">Biểu mẫu tư vấn nhanh — chỉ 4 thông tin.</div>
      </div>
      <div class="consult-body">
        <form class="consult-form" data-consult-form novalidate>
          <div class="consult-grid">
            <label><span>Họ và tên *</span><input name="name" autocomplete="name" required placeholder="Nguyễn Văn A"><small class="consult-error" data-consult-error="name"></small></label>
            <label><span>Số điện thoại *</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="09xx xxx xxx"><small class="consult-error" data-consult-error="phone"></small></label>
            <label><span>Nội dung cần in *</span><select name="content" required><option value="">Chọn nội dung cần in</option><option>Ngày sản xuất / hạn dùng</option><option>Số lô / serial</option><option>QR / mã vạch</option><option>Logo / đồ họa</option><option>Khắc vĩnh viễn</option></select><small class="consult-error" data-consult-error="content"></small></label>
            <label><span>Nhu cầu hiện tại *</span><select name="need" required><option value="">Chọn nhu cầu hiện tại</option><option>Mua máy mới</option><option>Thay máy cũ</option><option>Cần test mẫu</option><option>Cần tư vấn thêm</option></select><small class="consult-error" data-consult-error="need"></small></label>
          </div>
          <button class="button button-primary consult-submit" type="submit">Tạo nội dung gửi tư vấn</button>
          <p class="consult-status" data-consult-status aria-live="polite"></p>
          <div class="consult-result" data-consult-result hidden>
            <h3>Nội dung đã sẵn sàng</h3>
            <pre data-consult-summary></pre>
            <button class="button button-secondary consult-copy" type="button" data-consult-copy>Sao chép nội dung</button>
          </div>
          <div class="consult-actions" aria-label="Chọn kênh liên hệ">
            <a class="consult-action consult-action--phone" href="tel:${CONTACT.phone}">Gọi ${CONTACT.phoneDisplay}</a>
            <a class="consult-action consult-action--zalo" href="${CONTACT.zalo}" target="_blank" rel="noopener">Zalo ${CONTACT.advisor}</a>
            <a class="consult-action consult-action--messenger" href="${CONTACT.messenger}" target="_blank" rel="noopener">Messenger Facebook</a>
          </div>
        </form>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const consultForm=modal.querySelector('[data-consult-form]');
  const consultResult=modal.querySelector('[data-consult-result]');
  const consultSummary=modal.querySelector('[data-consult-summary]');
  const consultStatus=modal.querySelector('[data-consult-status]');
  let lastFocus=null;
  const canAutoFocus=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const focusWithoutScroll=element=>{
    if(!element)return;
    try{element.focus({preventScroll:true})}
    catch{if(canAutoFocus)element.focus()}
  };

  function openConsult(){
    lastFocus=document.activeElement;
    modal.hidden=false;
    document.body.classList.add('consult-open');
    requestAnimationFrame(()=>modal.classList.add('is-open'));
    // Avoid opening the software keyboard and dragging iOS/Android to the
    // DOM position of this fixed modal. Desktop keyboard users still receive
    // focus inside the dialog.
    if(canAutoFocus)setTimeout(()=>focusWithoutScroll(consultForm?.elements.name),100);
  }

  function closeConsult(){
    if(modal.hidden)return;
    modal.classList.remove('is-open');
    document.body.classList.remove('consult-open');
    setTimeout(()=>{
      modal.hidden=true;
      if(canAutoFocus&&lastFocus&&typeof lastFocus.focus==='function')focusWithoutScroll(lastFocus);
    },180);
  }

  function validPhone(value){return /^(?:\+?84|0)[0-9 .-]{8,12}$/.test(value.trim())}
  function validateConsult(){
    const messages={
      name:'Vui lòng nhập họ và tên.',
      phone:'Vui lòng nhập số điện thoại hợp lệ.',
      content:'Vui lòng chọn nội dung cần in.',
      need:'Vui lòng chọn nhu cầu hiện tại.'
    };
    let valid=true;
    ['name','phone','content','need'].forEach(name=>{
      const input=consultForm.elements[name];
      const bad=!input.value.trim()||(name==='phone'&&!validPhone(input.value));
      input.setAttribute('aria-invalid',String(bad));
      const error=modal.querySelector(`[data-consult-error="${name}"]`);
      if(error)error.textContent=bad?messages[name]:'';
      if(bad)valid=false;
    });
    return valid;
  }

  function buildSummary(data){
    return [
      'YÊU CẦU TƯ VẤN TONGBAO',
      `Họ tên: ${data.name}`,
      `Điện thoại: ${data.phone}`,
      `Nội dung cần in: ${data.content}`,
      `Nhu cầu hiện tại: ${data.need}`
    ].join('\n');
  }

  // Chỉ các CTA nhận tư vấn mới mở biểu mẫu.
  // Ba nút nổi Gọi / Zalo / Messenger giữ nguyên hành vi liên hệ trực tiếp theo href.
  document.addEventListener('click',event=>{
    const consultLink=event.target.closest('a[href="#lien-he"]');
    if(consultLink){
      event.preventDefault();
      openConsult();
    }
  });

  modal.querySelector('[data-consult-close]')?.addEventListener('click',closeConsult);
  modal.addEventListener('click',event=>{if(event.target===modal)closeConsult()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.hidden)closeConsult()});

  consultForm?.addEventListener('input',event=>{
    if(event.target.matches('[aria-invalid="true"]'))validateConsult();
  });
  consultForm?.addEventListener('change',event=>{
    if(event.target.matches('[aria-invalid="true"]'))validateConsult();
  });

  consultForm?.addEventListener('submit',event=>{
    event.preventDefault();
    if(!validateConsult()){
      consultStatus.textContent='Bạn điền đủ 4 thông tin giúp TONGBAO nhé.';
      consultForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const data=Object.fromEntries(new FormData(consultForm));
    consultSummary.textContent=buildSummary(data);
    consultResult.hidden=false;
    consultStatus.textContent='Đã tạo nội dung. Chọn Gọi, Zalo hoặc Messenger ngay bên dưới để liên hệ.';
    consultResult.scrollIntoView({behavior:'smooth',block:'nearest'});
  });

  modal.querySelector('[data-consult-copy]')?.addEventListener('click',async event=>{
    try{
      await navigator.clipboard.writeText(consultSummary.textContent);
      event.currentTarget.textContent='Đã sao chép ✓';
    }catch{
      consultStatus.textContent='Hãy bôi đen nội dung và sao chép thủ công.';
    }
  });
})();
