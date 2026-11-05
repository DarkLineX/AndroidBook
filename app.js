
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
