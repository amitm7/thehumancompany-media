// year
  document.getElementById('yr').textContent = new Date().getFullYear();

  // nav solidify
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // scroll reveals
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.14, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // smooth scroll scoped to in-page anchors (keeps INP clean elsewhere)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if(id.length < 2) return;
      const t = document.querySelector(id);
      if(!t) return;
      e.preventDefault();
      t.scrollIntoView({behavior:'smooth', block:'start'});
      history.pushState(null,'',id);
    });
  });
