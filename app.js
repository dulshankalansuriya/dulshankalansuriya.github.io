(() => {
  'use strict';
  const projects = window.portfolioProjects || [];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asset = name => `${name}.webp?v=fyp-revised-20261025`;
  const grid = document.getElementById('project-grid');
  const projectDialog = document.getElementById('project-dialog');
  const imageDialog = document.getElementById('image-dialog');
  let currentProject = null;
  let currentImage = 0;
  const lockScroll = () => document.body.classList.toggle('modal-open', Boolean(projectDialog?.open || imageDialog?.open));
  function renderProjects(filter = 'all') {
    const items = projects.filter(p => p.id !== 'rubber-wrapping' && (filter === 'all' || p.category === filter));
    grid.innerHTML = items.map(p => `<article class="project-card"><button class="card-image" data-project="${escape(p.id)}" aria-label="View ${escape(p.title)} case study"><span class="project-index">${escape(p.number)} / NERDC</span><img src="${asset(p.image)}" alt="${escape(p.imageAlt)}" loading="lazy"><span class="card-arrow" aria-hidden="true">↗</span></button><div class="card-body"><p class="eyebrow">${escape(p.subtitle)}</p><h3>${escape(p.title)}</h3><p>${escape(p.summary)}</p><div class="project-tags">${p.tools.slice(0,3).map(t=>`<span>${escape(t)}</span>`).join('')}</div><button class="text-link" data-project="${escape(p.id)}">View case study <span aria-hidden="true">↗</span></button></div></article>`).join('');
    document.getElementById('filter-status').textContent = `${items.length} industrial project${items.length===1?'':'s'} shown.`;
  }
  renderProjects();
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => {const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
    renderProjects(button.dataset.filter);
  }));
  function showGallery() {
    if (!currentProject) return;
    const [name,caption] = currentProject.gallery[currentImage];
    const image = document.getElementById('gallery-image');
    image.src = asset(name);image.alt = caption;
    document.getElementById('gallery-caption').textContent = caption;
    document.getElementById('gallery-count').textContent = `${String(currentImage+1).padStart(2,'0')} / ${String(currentProject.gallery.length).padStart(2,'0')}`;
  }
  function openProject(id) {
    const p = projects.find(project => project.id === id);
    if (!p) return;
    currentProject = p;currentImage = 0;
    const parameters = p.parameters ? `<div class="case-block"><h3>${p.id==='rubber-wrapping'?'Preliminary design references':'Prototype specification'}</h3><div class="case-parameters">${p.parameters.map(([a,b])=>`<div><span>${escape(a)}</span><strong>${escape(b)}</strong></div>`).join('')}</div>${p.parameterNote?`<p class="case-note">${escape(p.parameterNote)}</p>`:''}</div>` : '';
    document.getElementById('case-content').innerHTML = `<div class="case-header"><p class="eyebrow">PROJECT ${escape(p.number)} / ${escape(p.subtitle)}</p><h2 id="case-title">${escape(p.title)}</h2><p>${escape(p.context)}</p><span class="status">${escape(p.status)}</span></div><div class="case-gallery"><button class="gallery-image-button" id="expand-image" aria-label="Enlarge current project image"><img id="gallery-image" src="${asset(p.gallery[0][0])}" alt="${escape(p.gallery[0][1])}"></button><div class="gallery-controls"><button data-gallery="-1" aria-label="Previous project image">←</button><button data-gallery="1" aria-label="Next project image">→</button><span id="gallery-count" class="gallery-count"></span><p id="gallery-caption" aria-live="polite"></p></div></div><div class="case-body"><p class="case-lead">${escape(p.summary)}</p><div class="project-tags">${p.tools.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="case-columns"><div><h3>Engineering objective</h3><p>${escape(p.objective)}</p><div class="case-block"><h3>My role</h3><p>${escape(p.role)}</p></div></div><div><h3>My contribution</h3><ul>${p.contributions.map(t=>`<li>${escape(t)}</li>`).join('')}</ul></div></div><div class="case-block"><h3>Design and manufacturing process</h3><p>${escape(p.process)}</p></div>${p.challenge?`<div class="case-block"><h3>Engineering challenge</h3><p>${escape(p.challenge)}</p></div>`:''}${parameters}<div class="case-block"><h3>Outcome and current status</h3><p>${escape(p.outcome)}</p></div>${p.credit?`<p class="case-note">${escape(p.credit)}</p>`:''}<div class="case-sources"><p><strong>Project records</strong> · ${escape(p.sources)}</p><p>Original photographs, CAD screenshots and drawings are taken from my supplied project and training records.</p><div class="case-actions"><a href="case-study.html?id=${encodeURIComponent(p.id)}" target="_blank" rel="noopener">Open printable project brief ↗</a><a href="#contact" id="case-contact">Discuss this work ↗</a></div></div></div>`;
    showGallery();
    if (!projectDialog.open) projectDialog.showModal();
    projectDialog.scrollTop = 0;lockScroll();
  }
  document.addEventListener('click', event => {
    const projectButton = event.target.closest('[data-project]');
    if (projectButton) {openProject(projectButton.dataset.project);return;}
    const galleryButton = event.target.closest('[data-gallery]');
    if (galleryButton && currentProject) {currentImage=(currentImage+Number(galleryButton.dataset.gallery)+currentProject.gallery.length)%currentProject.gallery.length;showGallery();return;}
    if (event.target.closest('#expand-image') && currentProject) {
      const [name,caption]=currentProject.gallery[currentImage];document.getElementById('large-image').src=asset(name);document.getElementById('large-image').alt=caption;document.getElementById('large-caption').textContent=caption;imageDialog.showModal();lockScroll();
    }
    if (event.target.closest('#case-contact')) projectDialog.close();
  });
  document.getElementById('close-project').addEventListener('click',()=>projectDialog.close());
  document.getElementById('close-image').addEventListener('click',()=>imageDialog.close());
  [projectDialog,imageDialog].forEach(dialog=>{dialog.addEventListener('close',lockScroll);dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});});
  const menuButton=document.querySelector('.menu-toggle');
  const navigation=document.getElementById('navigation');
  menuButton.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}));
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navigation.querySelectorAll('a').forEach(a=>a.classList.toggle('current',a.getAttribute('href')===`#${entry.target.id}`));}});},{rootMargin:'-15% 0px -65% 0px',threshold:0});
    document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));
  }
  document.getElementById('copy-email').addEventListener('click',async()=>{
    const status=document.getElementById('copy-status');
    try{await navigator.clipboard.writeText('agsdulshan@gmail.com');status.textContent='Email address copied.';}catch{status.textContent='Email: agsdulshan@gmail.com';}
  });
  const initial=new URLSearchParams(location.search).get('project');if(initial)openProject(initial);
})();
