(function(){
  const header=document.querySelector('[data-header]');const button=document.querySelector('[data-menu-button]');const nav=document.querySelector('[data-nav]');
  window.bindReveal=function(){const nodes=document.querySelectorAll('.reveal:not([data-reveal-bound])');if(!('IntersectionObserver'in window)){nodes.forEach(node=>node.classList.add('is-visible'));return}const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');obs.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -30px'});nodes.forEach(node=>{node.dataset.revealBound='1';observer.observe(node)})};
  window.bindReveal();
  button?.addEventListener('click',()=>{const open=nav?.classList.toggle('is-open');button.setAttribute('aria-expanded',String(Boolean(open)))});nav?.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('is-open');button?.setAttribute('aria-expanded','false')}});
  let ticking=false;addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{header?.classList.toggle('is-scrolled',scrollY>10);ticking=false});ticking=true}},{passive:true});
})();
