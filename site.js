(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const page=document.body.dataset.page;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ---------- header / menu / footer ---------- */
const IC={
li:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10.5V16M8 7.8v.01M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V16"/></svg>',
ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/></svg>',
gm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7.5l8.5 6 8.5-6"/></svg>'};
const socials=cls=>`<div class="${cls}"><a href="https://www.linkedin.com/in/alex-agudiez/" target="_blank" rel="noopener" aria-label="LinkedIn">${IC.li}</a><a href="https://www.instagram.com/agudiez_/" target="_blank" rel="noopener" aria-label="Instagram">${IC.ig}</a><a href="mailto:alex7hp@gmail.com" aria-label="Email">${IC.gm}</a></div>`;
const nav=[['index.html','Inicio','index'],['portfolioagudiez.html','Portfolio','portfolio'],['sobrealex.html','Sobre mí','about']];
document.body.insertAdjacentHTML('afterbegin',`
<div id="bar"></div><div id="cur"></div><div id="cur2"></div>
<header class="hdr">
  <a class="logo" href="index.html"><img src="portfolio/PORFOLIO PNG WHITE.png" alt="Logo Agudiez"></a>
  <nav class="pill">${nav.map(n=>`<a href="${n[0]}" class="${n[2]===page?'on':''}">${n[1]}</a>`).join('')}</nav>
  ${socials("soc")}
  <button class="burger" aria-label="Menú" aria-expanded="false"><i></i><i></i></button>
</header>
<div id="mnav">${nav.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('')}</div>`);
const burger=$('.burger'),mnav=$('#mnav');
burger.onclick=()=>{const o=burger.classList.toggle('open');mnav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};

const ft=$('#footer');
if(ft)ft.outerHTML=`
<footer class="ft"><div class="wrap">
  <p class="quote rv">Todo empieza con una idea.<br>Lo importante es saber hasta dónde puede llegar.</p>
  <a href="mailto:alex7hp@gmail.com" class="big rv" data-cursor>¿Hablamos?</a>
  <a href="mailto:alex7hp@gmail.com" class="mail">alex7hp@gmail.com</a>
  <div class="fg">
    <div><b>Contacto</b><a href="https://www.linkedin.com/in/alex-agudiez/" target="_blank" rel="noopener">Escríbeme en Redes!</a>
      ${socials("fsoc")}</div>
    <div><b>Navegación</b>${nav.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('')}</div>
    <div><b>Legal</b><a href="#">Política de Cookies</a><a href="#">Términos de Servicio</a></div>
  </div>
  <div class="fb"><p>© 2026 Alex Agudiez. Todos los derechos reservados.</p>
    <div><a href="legal.html#privacidad">Política de Privacidad</a><a href="legal.html#aviso-legal">Aviso Legal</a></div></div>
</div></footer>`;

/* ---------- loader ---------- */
const ld=$('#loader');
if(ld){
  document.body.style.overflow='hidden';
  const v=$('video',ld);let done=false;
  const hide=()=>{if(done)return;done=true;ld.classList.add('out');document.body.style.overflow='';start()};
  if(v){v.addEventListener('ended',hide);v.play&&v.play().catch(()=>setTimeout(hide,400))}
  setTimeout(hide,4500);
}else start();

/* ---------- scroll: progress, reveal, fill, parallax ---------- */
const bar=$('#bar');
const fills=$$('.fill').flatMap(e=>$$('p',e).length?$$('p',e):[e]);
fills.forEach(el=>{el.innerHTML=el.textContent.trim().split(/\s+/).map(w=>`<span class="w">${w}</span>`).join(' ')});
const par=$$('[data-speed]');
function onScroll(){
  const h=document.documentElement,y=scrollY;
  bar.style.transform=`scaleX(${y/(h.scrollHeight-innerHeight||1)})`;
  fills.forEach(el=>{const ws=$$('.w',el);ws.forEach((w,i)=>{const r=w.getBoundingClientRect();w.classList.toggle('on',r.top<innerHeight*.72)})});
  par.forEach(e=>{const r=e.getBoundingClientRect();e.style.transform=`translateY(${(r.top-innerHeight/2)*parseFloat(e.dataset.speed)}px)`});
}
addEventListener('scroll',onScroll,{passive:true});

function start(){
  $$('[data-split]').forEach(el=>{
    el.innerHTML=el.innerHTML.split(/(<[^>]+>)/).map(t=>t.startsWith('<')?t:t.split(/\s+/).filter(Boolean).map(w=>`<span class="sp"><span>${w}</span></span>`).join(' ')).join('');
    $$('.sp>span',el).forEach((s,i)=>s.style.setProperty('--d',i*.07+'s'));
  });
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  $$('.rv,.clip,[data-split]').forEach(e=>io.observe(e));
  onScroll();
  // counters
  const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const t=+e.target.dataset.count,s=performance.now();
    (function f(n){const p=Math.min((n-s)/1600,1);e.target.textContent=(e.target.dataset.pre||'')+Math.round(t*(1-Math.pow(1-p,4)))+(e.target.dataset.suf||'');p<1&&requestAnimationFrame(f)})(s)}),{threshold:.6});
  $$('[data-count]').forEach(e=>co.observe(e));
}

/* ---------- cursor ---------- */
if(fine){
  const c=$('#cur'),c2=$('#cur2');let x=0,y=0,x2=0,y2=0;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;c.style.transform=`translate(${x}px,${y}px)`});
  (function l(){x2+=(x-x2)*.15;y2+=(y-y2)*.15;c2.style.transform=`translate(${x2}px,${y2}px)`;requestAnimationFrame(l)})();
  document.addEventListener('mouseover',e=>c2.classList.toggle('big',!!e.target.closest('[data-cursor],.pc,.pn,.rail .it')));
  // magnetic buttons
  $$('.btn,.pill a').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});
    b.addEventListener('mouseleave',()=>b.style.transform='');
  });
  // tilt
  $$('.vidcard,.pc .im,.ah .pic').forEach(t=>{
    t.addEventListener('mousemove',e=>{const r=t.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;t.style.transform=`perspective(900px) rotateY(${px*10}deg) rotateX(${-py*10}deg)`});
    t.addEventListener('mouseleave',()=>t.style.transform='');
  });
  // hero blob follows mouse
  const bl=$('.blob');if(bl)addEventListener('mousemove',e=>bl.style.transform=`translate(${e.clientX-innerWidth*.275}px,${e.clientY-innerWidth*.275}px)`);
}

/* ---------- rotating word ---------- */
const rot=$('.rot');
if(rot){const ws=['UXer.','Marketer.'];let i=0;const s=$('span',rot);
  setInterval(()=>{s.classList.add('out');setTimeout(()=>{i=(i+1)%ws.length;s.textContent=ws[i];s.style.transition='none';s.style.transform='translateY(100%)';s.offsetHeight;s.style.transition='';s.style.transform='';s.classList.remove('out')},700)},2600)}

/* ---------- marquees (duplicate content) ---------- */
$$('.tr').forEach(t=>{t.innerHTML+=t.innerHTML});

/* ---------- services accordion ---------- */
const pn=$$('.pn'),mob=matchMedia('(max-width:860px)');
const sync=()=>{if(mob.matches)pn.forEach(p=>p.classList.remove('on'));else if(pn.length&&!pn.some(p=>p.classList.contains('on')))pn[0].classList.add('on')};
sync();mob.addEventListener('change',sync);
pn.forEach(p=>p.addEventListener('click',()=>{if(mob.matches){const was=p.classList.contains('on');pn.forEach(x=>x.classList.toggle('on',x===p&&!was))}else act(p)}));
function act(p){pn.forEach(x=>x.classList.toggle('on',x===p))}

/* ---------- portfolio detail ---------- */
const det=$('#det');
if(det&&typeof projectData!=='undefined'){
  const clean=s=>s.replace(/[\u200b\u200d\ufe0f]|\p{Extended_Pictographic}/gu,'').trim();
  let cur=0;
  const open=id=>{
    const i=projectData.findIndex(p=>p.id==id),p=projectData[i];cur=i;
    const body=['p1','p2','p3','p4','p5','p6','p7','p8','p9'].filter(k=>p[k]).map(k=>/^\d.?\u20e3/u.test(p[k])?`<h3>${p[k]}</h3>`:`<p>${p[k]}</p>`).join('');
    const nxt=projectData[(i+1)%projectData.length];
    $('.c',det).innerHTML=`<h2>${p.title}</h2>${body}<div class="imgs">${[p.img1,p.img2,p.img3].filter(Boolean).map(s=>`<img src="${s}" alt="${clean(p.title)}" loading="lazy">`).join('')}</div>
      <div class="nx"><button class="btn" data-close>← Volver</button><button class="btn" data-next="${nxt.id}">Siguiente proyecto →</button></div>`;
    det.classList.add('open');det.scrollTop=0;document.body.style.overflow='hidden';
  };
  const close=()=>{det.classList.remove('open');document.body.style.overflow=''};
  $$('.pc').forEach(c=>c.addEventListener('click',()=>open(c.dataset.id)));
  det.addEventListener('click',e=>{if(e.target.closest('[data-close]'))close();const n=e.target.closest('[data-next]');if(n)open(n.dataset.next)});
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}
})();
