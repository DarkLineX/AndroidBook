
// 目录高亮
document.querySelectorAll('.toc a.item').forEach(a=>{
  if(a.getAttribute('href') && location.pathname.endsWith(a.getAttribute('href').split('/').pop())){
    a.classList.add('active');
  }
});
// 目录搜索
const q=document.getElementById('q');
if(q){
  q.addEventListener('input',()=>{
    const v=q.value.trim().toLowerCase();
    document.querySelectorAll('.toc a.item').forEach(a=>{
      a.style.display = !v || a.textContent.toLowerCase().includes(v) ? '' : 'none';
    });
    document.querySelectorAll('.toc .part').forEach(p=>{
      p.style.display = !v || p.textContent.toLowerCase().includes(v) ? '' : 'none';
    });
  });
}
// 复制按钮
document.querySelectorAll('.code').forEach(box=>{
  const btn=box.querySelector('.copy'); if(!btn) return;
  btn.addEventListener('click',async()=>{
    const txt=box.querySelector('pre').innerText;
    try{ await navigator.clipboard.writeText(txt); btn.textContent='已复制'; }
    catch(e){ btn.textContent='复制失败'; }
    setTimeout(()=>btn.textContent='复制',1400);
  });
});

// ── 本页目录：扫描正文 h2/h3 生成锚点与右侧悬浮导航 ──
(function(){
  const art = document.querySelector('.content article.chapter');
  if(!art) return;
  const heads = [...art.querySelectorAll('h2, h3')];
  if(heads.length < 2) return;                  // 只有一两个小节没必要挂导航
  const box = document.createElement('div');
  box.className = 'page-toc on';
  box.innerHTML = '<button class="page-toc-btn" type="button" aria-label="本页目录" title="本页目录">' +
                  '<span class="ic">☰</span><span class="lb">本页</span>' +
                  '<span class="n">' + heads.length + '</span></button>' +
                  '<div class="page-toc-panel"><div class="hd">本页目录 · ' + heads.length + ' 节</div></div>';
  const panel = box.querySelector('.page-toc-panel');
  const links = [];
  heads.forEach((h, i) => {
    if(!h.id) h.id = 'sec-' + (i + 1);
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.trim();
    if(h.tagName === 'H3') a.className = 'sub';
    a.addEventListener('click', () => {
      // 交给浏览器原生的锚点跳转（配合 CSS scroll-behavior:smooth 与 scroll-margin-top），
      // 比手写 scrollTo 更稳，键盘/中键/复制链接都照常工作
      box.classList.remove('open');
      links.forEach(x => x.classList.remove('on'));
      a.classList.add('on');
    });
    panel.appendChild(a);
    links.push(a);
  });
  document.body.appendChild(box);

  const btn = box.querySelector('.page-toc-btn');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const willOpen = !box.classList.contains('open');
    box.classList.toggle('open');
    if(willOpen){
      // 展开时把当前所在小节滚进面板可视区
      const cur = panel.querySelector('a.on');
      if(cur) panel.scrollTop = Math.max(0, cur.offsetTop - panel.clientHeight / 3);
    }
  });
  document.addEventListener('click', e => {
    if(!box.contains(e.target)) box.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') box.classList.remove('open');
  });

  // 滚动时高亮当前小节
  let cur = -1;
  function sync(){
    const top = window.scrollY + 96;
    let idx = 0;
    heads.forEach((h, i) => { if(h.getBoundingClientRect().top + window.scrollY <= top) idx = i; });
    if(idx === cur) return;
    cur = idx;
    links.forEach((a, i) => a.classList.toggle('on', i === idx));
  }
  let tick = false;
  window.addEventListener('scroll', () => {
    if(tick) return;
    tick = true;
    requestAnimationFrame(() => { sync(); tick = false; });
  }, {passive:true});
  sync();
})();

// ── 动图演示器：播放 / 暂停 / 逐帧 / 点选步骤 ──
document.querySelectorAll('figure.anim').forEach(fig=>{
  const img = fig.querySelector('.anim-frame');
  const dataEl = (fig.nextElementSibling &&
                  fig.nextElementSibling.classList.contains('anim-data'))
                 ? fig.nextElementSibling : null;
  let labels = [];
  try{ labels = JSON.parse(dataEl ? dataEl.textContent : '[]'); }catch(e){}
  const n = parseInt(fig.dataset.n,10) || labels.length || 1;
  const delay = parseInt(fig.dataset.delay,10) || 800;
  const key = fig.dataset.key;
  const playBtn = fig.querySelector('.anim-play');
  const bigBtn = fig.querySelector('.anim-big');
  const fill = fig.querySelector('.anim-fill');
  const count = fig.querySelector('.anim-count');
  const cap = fig.querySelector('.anim-caption');
  const stepBtns = [...fig.querySelectorAll('.anim-steps button')];
  let i = 0, timer = null;

  function src(k){ return '../assets/anim/' + key + '/f' + String(k).padStart(2,'0') + '.png'; }
  // 预加载全部帧，切帧不闪
  for(let k=0;k<n;k++){ const p=new Image(); p.src=src(k); }

  function show(k){
    i = ((k % n) + n) % n;
    img.src = src(i);
    img.alt = (labels[i] || ('第 '+(i+1)+' 帧'));
    fill.style.width = ((i+1)/n*100).toFixed(1) + '%';
    count.textContent = (i+1) + ' / ' + n;
    cap.innerHTML = '<b>第 '+(i+1)+' 步</b><span></span>';
    cap.querySelector('span').textContent = labels[i] || '';
    stepBtns.forEach((b,j)=>b.classList.toggle('on', j===i));
  }
  function play(){
    if(timer) return;
    fig.classList.add('playing');
    playBtn.textContent = '⏸ 暂停';
    timer = setInterval(()=>show(i+1), delay);
  }
  function pause(){
    if(!timer) return;
    clearInterval(timer); timer=null;
    fig.classList.remove('playing');
    playBtn.textContent = '▶ 播放';
  }
  playBtn.addEventListener('click',()=> timer ? pause() : play());
  bigBtn.addEventListener('click',e=>{ e.stopPropagation(); play(); });
  fig.querySelector('.anim-stage').addEventListener('click',()=> timer ? pause() : play());
  fig.querySelector('.anim-prev').addEventListener('click',()=>{ pause(); show(i-1); });
  fig.querySelector('.anim-next').addEventListener('click',()=>{ pause(); show(i+1); });
  stepBtns.forEach(b=>b.addEventListener('click',()=>{ pause(); show(parseInt(b.dataset.i,10)); }));
  // 离屏时自动暂停，省资源
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>{ if(es[0].isIntersecting===false) pause(); },
                             {threshold:0.05}).observe(fig);
  }
  show(0);
});
