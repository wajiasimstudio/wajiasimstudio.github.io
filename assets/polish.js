(function(){
  var d=document, h=d.documentElement, rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // scroll progress + compact bar
  var pb=d.createElement('div'); pb.className='pbar'; d.body.appendChild(pb);
  var t=false;
  function sc(){ if(t) return; t=true; requestAnimationFrame(function(){
    var m=h.scrollHeight-innerHeight; pb.style.transform='scaleX('+(m>0?Math.min(1,scrollY/m):0)+')';
    h.classList.toggle('scrolled',scrollY>40); t=false; }); }
  addEventListener('scroll',sc,{passive:true}); addEventListener('resize',sc); sc();

  // reveal on scroll
  if(!rm && 'IntersectionObserver' in window){
    var sel=['.head','.intro','.slot','.note','.about .lead','.about > div > p','.hello','.bio','.portrait','.statement','.cv > div','.email','#contact .row',
             '.lab h2','.fig','.body > p','.body > h3','.meta > div','.lead p','.toc','.viewer','.tbl','.next .wrap'].join(',');
    var els=[].slice.call(d.querySelectorAll(sel));
    h.classList.add('js');
    els.forEach(function(e){
      e.classList.add('rv');
      var sib=[].filter.call(e.parentElement.children,function(c){return els.indexOf(c)>-1;});
      var k=sib.indexOf(e); if(k>0) e.style.setProperty('--d',(Math.min(k,6)*0.08)+'s');
    });
    var io=new IntersectionObserver(function(es){es.forEach(function(en){
      if(en.isIntersecting){en.target.classList.add('in'); io.unobserve(en.target);} });},{rootMargin:'0px 0px -6% 0px',threshold:0.01});
    els.forEach(function(e){io.observe(e);});
    setTimeout(function(){els.forEach(function(e){var r=e.getBoundingClientRect(); if(r.top<innerHeight) e.classList.add('in');});},1500);
  }

  // active section in nav / contents
  var links=[].slice.call(d.querySelectorAll('nav a[href^="#"],.toc a[href^="#"]'));
  if(links.length && 'IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(en){
      var id=en.target.id; links.forEach(function(a){ if(a.getAttribute('href')==='#'+id) a.classList.toggle('on',en.isIntersecting); }); });},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(a){var s=d.getElementById(a.getAttribute('href').slice(1)); if(s) so.observe(s);});
  }

  // cursor label over projects and drawings
  if(!rm && matchMedia('(hover:hover) and (pointer:fine)').matches){
    var c=d.createElement('div'); c.className='cur'; c.setAttribute('aria-hidden','true'); c.innerHTML='<span></span>'; d.body.appendChild(c);
    var lab=c.firstChild, x=-300,y=-300,tx=x,ty=y, map=[['.slot.proj','[view]'],['.zoom','[enlarge]']];
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;},{passive:true});
    (function loop(){x+=(tx-x)*.2; y+=(ty-y)*.2; c.style.transform='translate3d('+x+'px,'+y+'px,0)'; requestAnimationFrame(loop);})();
    d.addEventListener('mouseover',function(e){
      var l=''; for(var i=0;i<map.length;i++){ if(e.target.closest && e.target.closest(map[i][0])){l=map[i][1];break;} }
      if(l){lab.textContent=l; c.classList.add('on');} else c.classList.remove('on');
    });
    d.addEventListener('mouseleave',function(){c.classList.remove('on');});
  }

  // lightbox counter + image transition
  var lb=d.getElementById('lb'), im=d.getElementById('lbimg');
  if(lb && im){
    var items=[].slice.call(d.querySelectorAll('.zoom')), cnt=d.createElement('span'); cnt.className='lbc tag'; lb.appendChild(cnt);
    var pad=function(n){return (n<10?'0':'')+n;};
    new MutationObserver(function(){
      var src=im.getAttribute('src');
      for(var i=0;i<items.length;i++){ if(items[i].dataset.src===src){ cnt.textContent=pad(i+1)+' / '+pad(items.length); break; } }
      im.classList.remove('in'); void im.offsetWidth; im.classList.add('in');
    }).observe(im,{attributes:true,attributeFilter:['src']});
  }
})();
