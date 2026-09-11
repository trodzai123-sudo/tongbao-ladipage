(function(){
  const form=document.querySelector('[data-lead-form]');if(!form)return;

  ['company','region','material','note'].forEach(name=>{
    const field=form.elements[name];
    field?.closest('label')?.remove();
  });

  ['content','need'].forEach(name=>{
    const field=form.elements[name];
    if(!field)return;
    field.required=true;
    if(!form.querySelector(`[data-error-for="${name}"]`)){
      const error=document.createElement('small');
      error.dataset.errorFor=name;
      field.closest('label')?.appendChild(error);
    }
  });

  const formHint=form.querySelector('.form-head small');
  if(formHint)formHint.textContent='Chỉ 4 thông tin · khoảng 30 giây';

  const result=form.querySelector('.form-result');
  const output=form.querySelector('pre');
  const status=form.querySelector('.form-status');
  const messages={
    name:'Vui lòng nhập họ và tên.',
    phone:'Vui lòng nhập số điện thoại hợp lệ.',
    content:'Vui lòng chọn nội dung cần in.',
    need:'Vui lòng chọn nhu cầu hiện tại.'
  };
  const params=new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign'].forEach(key=>{const input=form.elements[key];if(input)input.value=params.get(key)||''});

  function validPhone(value){return /^(?:\+?84|0)[0-9 .-]{8,12}$/.test(value.trim())}
  function validate(){
    let valid=true;
    ['name','phone','content','need'].forEach(name=>{
      const input=form.elements[name];
      if(!input)return;
      const bad=!input.value.trim()||(name==='phone'&&!validPhone(input.value));
      input.setAttribute('aria-invalid',String(bad));
      const error=form.querySelector(`[data-error-for="${name}"]`);
      if(error)error.textContent=bad?messages[name]:'';
      if(bad)valid=false;
    });
    return valid;
  }

  function summary(data){
    return [
      'YÊU CẦU TƯ VẤN TONGBAO',
      `Họ tên: ${data.name}`,
      `Điện thoại: ${data.phone}`,
      `Nội dung cần in: ${data.content}`,
      `Nhu cầu hiện tại: ${data.need}`
    ].join('\n');
  }

  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!validate()){
      status.textContent='Bạn điền đủ 4 thông tin giúp TONGBAO nhé.';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const raw=Object.fromEntries(new FormData(form));
    output.textContent=summary(raw);
    result.hidden=false;
    status.textContent='Đã tạo nội dung. Hãy sao chép và gửi qua Zalo để được tư vấn.';
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
    window.dispatchEvent(new CustomEvent('tongbao:lead-ready',{detail:{source:raw.utm_source||'direct'}}));
  });

  form.addEventListener('input',event=>{if(event.target.matches('[aria-invalid="true"]'))validate()});
  form.addEventListener('change',event=>{if(event.target.matches('[aria-invalid="true"]'))validate()});

  form.querySelector('[data-copy-lead]')?.addEventListener('click',async event=>{
    try{
      await navigator.clipboard.writeText(output.textContent);
      event.currentTarget.textContent='Đã sao chép ✓';
    }catch{
      status.textContent='Hãy bôi đen nội dung và sao chép thủ công.';
    }
  });
})();