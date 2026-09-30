(function () {
  'use strict';
  const form = document.querySelector('[data-lead-form]');
  if (!form) return;
  const { escape: esc, openDialog, closeDialog, track, scrollBehavior } = window.Tongbao;
  const products = window.TONGBAO_PRODUCTS || [];
  const home = document.querySelector('[data-form-home]');
  const modal = document.querySelector('[data-consult-modal]');
  const slot = modal.querySelector('[data-consult-slot]');
  const result = form.querySelector('[data-form-result]');
  const output = form.querySelector('[data-lead-summary]');
  const status = form.querySelector('[data-form-status]');
  const copyButton = form.querySelector('[data-copy-lead]');
  const selectedProduct = form.elements.product;
  selectedProduct.innerHTML += products.map(item => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('');
  const required = ['name', 'phone', 'content', 'need'];
  const messages = { name: 'Vui lòng nhập họ và tên.', phone: 'Nhập số di động Việt Nam gồm 10 số hoặc bắt đầu bằng +84.', content: 'Vui lòng chọn nội dung cần in.', need: 'Vui lòng chọn nhu cầu hiện tại.' };
  const normalizedPhone = value => {
    let phone = value.replace(/[\s().-]/g, '');
    if (/^\+?84/.test(phone)) phone = '0' + phone.replace(/^\+?84/, '');
    return phone;
  };
  function validate() {
    let valid = true;
    required.forEach(name => {
      const input = form.elements[name];
      const bad = !input.value.trim() || (name === 'phone' && !/^0[35789]\d{8}$/.test(normalizedPhone(input.value)));
      input.setAttribute('aria-invalid', String(bad));
      form.querySelector(`[data-error-for="${name}"]`).textContent = bad ? messages[name] : '';
      valid = valid && !bad;
    });
    return valid;
  }
  function invalidateSummary() {
    if (!result.hidden) {
      result.hidden = true;
      status.textContent = 'Thông tin đã thay đổi. Bấm “Tạo nội dung gửi tư vấn” để cập nhật.';
    }
    copyButton.textContent = '1. Sao chép nội dung';
  }
  function openConsult(productId) {
    if (products.some(item => item.id === productId) && selectedProduct.value !== productId) {
      selectedProduct.value = productId;
      invalidateSummary();
    }
    const trigger = window.Tongbao.getDialogTrigger() || document.activeElement;
    closeDialog({ restoreFocus: false });
    home.style.minHeight = `${form.offsetHeight}px`;
    slot.appendChild(form);
    openDialog(modal, {
      trigger,
      initialFocus: modal.querySelector('h2'),
      onClose: () => { home.appendChild(form); home.style.minHeight = ''; }
    });
    track('consultation_open', { product_id: selectedProduct.value || 'undecided' });
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href="#lien-he"], [data-consult-product]');
    if (link) { event.preventDefault(); openConsult(link.dataset.consultProduct); }
  });
  modal.querySelector('[data-consult-close]').addEventListener('click', () => closeDialog());
  modal.addEventListener('click', event => { if (event.target === modal) closeDialog(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate()) {
      status.textContent = 'Vui lòng kiểm tra các mục được đánh dấu bên dưới.';
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    const values = Object.fromEntries(new FormData(form));
    const product = products.find(item => item.id === values.product);
    output.textContent = [
      'YÊU CẦU TƯ VẤN TONGBAO',
      `Họ tên: ${values.name.trim()}`,
      `Điện thoại: ${normalizedPhone(values.phone)}`,
      `Sản phẩm quan tâm: ${product?.name || 'Cần tư vấn chọn máy'}`,
      `Nội dung cần in: ${values.content}`,
      `Nhu cầu hiện tại: ${values.need}`,
      values.material?.trim() && `Vật liệu / sản phẩm cần in: ${values.material.trim()}`,
      values.note?.trim() && `Ghi chú: ${values.note.trim()}`
    ].filter(Boolean).join('\n');
    result.hidden = false;
    copyButton.textContent = '1. Sao chép nội dung';
    status.textContent = 'Nội dung đã sẵn sàng, chưa được gửi. Sao chép rồi dán vào cuộc trò chuyện Zalo.';
    result.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
    track('consultation_prepared', { product_id: values.product || 'undecided' });
  });
  function handleEdit(event) {
    invalidateSummary();
    if (event.target.getAttribute('aria-invalid') === 'true') validate();
  }
  form.addEventListener('input', handleEdit);
  form.addEventListener('change', handleEdit);
  copyButton.addEventListener('click', async () => {
    const text = output.textContent;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if (result.hidden || output.textContent !== text) return;
      copyButton.textContent = 'Đã sao chép';
      status.textContent = 'Đã sao chép. Mở Zalo, dán nội dung và bấm Gửi cho Mrs.Miến.';
      track('consultation_copied', { product_id: selectedProduct.value || 'undecided' });
    } catch {
      const range = document.createRange();
      range.selectNodeContents(output);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      status.textContent = 'Trình duyệt chưa cho phép sao chép tự động. Chọn Sao chép từ vùng nội dung được bôi đen, sau đó mở Zalo.';
    }
  });
})();
