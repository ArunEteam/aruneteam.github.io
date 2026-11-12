/* ============================================================
   PORTFOLIO RENDERER — loads projects.json → renders cards
   Used by: index.html
   ============================================================ */

'use strict';

(async function initPortfolio() {
  const grid        = document.getElementById('portfolioGrid');
  const loadingEl   = document.getElementById('portfolioLoading');
  const filterTabs  = document.querySelectorAll('.filter-tab');
  if (!grid) return;

  /* ── 1. Fetch data ── */
  let projects = [];
  try {
    const res = await fetch('assets/data/projects.json');
    if (!res.ok) throw new Error('Network response not ok');
    projects = await res.json();
  } catch (err) {
    console.error('Portfolio: could not load projects.json', err);
    if (loadingEl) loadingEl.innerHTML = '<p style="color:var(--clr-accent-2)">Could not load projects. Please refresh.</p>';
    return;
  }

  /* ── 2. Build HTML for one card ── */
  function buildCard(project, index) {
    const cs = project.caseStudy;
    const detailUrl = `work/case-study.html?id=${encodeURIComponent(project.id)}`;

    // Thumbnails
    const thumbsHtml = project.thumbnails.map((t, i) =>
      `<img class="project-card__thumb${i === 0 ? ' active' : ''}"
            src="${t.src}"
            alt="${t.alt}"
            width="720" height="480"
            loading="${index < 3 ? 'eager' : 'lazy'}" />`
    ).join('');

    // Dot nav
    const dotsHtml = project.thumbnails.map((t, i) =>
      `<button class="thumb-dot${i === 0 ? ' active' : ''}"
               aria-label="View image ${i + 1}"
               aria-pressed="${i === 0 ? 'true' : 'false'}"></button>`
    ).join('');

    // Tags
    const tagsHtml = project.tags.map(tag =>
      `<span class="project-card__tag">${tag}</span>`
    ).join('');

    // Stats
    const statsHtml = project.stats.map(s =>
      `<span><strong>${s.value}</strong> ${s.label}</span>`
    ).join('');

    // Normalize category: supports array ["html", "wordpress"] or string "html wordpress" or "html"
    const categoryAttr = Array.isArray(project.category)
      ? project.category.join(' ')
      : (project.category || '');

    return `
      <article class="project-card reveal"
               data-category="${categoryAttr}"
               data-id="${project.id}"
               aria-label="Project: ${project.title}">
        <a href="${detailUrl}" class="project-card__link"
           aria-label="View case study for ${project.title}">
          <div class="project-card__media">
            <div class="project-card__thumbs">${thumbsHtml}</div>
            ${project.thumbnails.length > 1
              ? `<div class="project-card__thumb-nav" aria-label="Image thumbnails for ${project.title}">${dotsHtml}</div>`
              : ''}
            <div class="project-card__overlay" aria-hidden="true">
              <span>View Case Study</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
          </div>
        </a>
        <div class="project-card__body">
          <div class="project-card__meta">${tagsHtml}</div>
          <h3 class="project-card__title">
            <a href="${detailUrl}">${project.title}</a>
          </h3>
          <p class="project-card__desc">${project.shortDesc}</p>
          <div class="project-card__footer">
            <div class="project-card__stats" aria-label="Project results">${statsHtml}</div>
            <a href="${detailUrl}" class="project-card__cta"
               aria-label="Read full case study for ${project.title}">
              Case Study
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
      </article>`;
  }

  /* ── 3. Render all cards ── */
  if (loadingEl) loadingEl.remove();

  grid.innerHTML = projects.map((p, i) => buildCard(p, i)).join('');

  /* ── 4. Re-init scroll-reveal for new DOM nodes ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const newCards = grid.querySelectorAll('.reveal');

  if (prefersReduced) {
    newCards.forEach(el => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    newCards.forEach(el => revealObserver.observe(el));
  }

  /* ── 5. Re-init thumbnail switcher ── */
  grid.querySelectorAll('.project-card').forEach(card => {
    const thumbs = card.querySelectorAll('.project-card__thumb');
    const dots   = card.querySelectorAll('.thumb-dot');
    if (thumbs.length <= 1) return;

    let current = 0;
    let timer;

    function goTo(i) {
      thumbs[current].classList.remove('active');
      if (dots[current]) { dots[current].classList.remove('active'); dots[current].setAttribute('aria-pressed','false'); }
      current = i;
      thumbs[current].classList.add('active');
      if (dots[current]) { dots[current].classList.add('active'); dots[current].setAttribute('aria-pressed','true'); }
    }
    function next()  { goTo((current + 1) % thumbs.length); }
    function start() { timer = setInterval(next, 2500); }
    function stop()  { clearInterval(timer); }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', e => { e.preventDefault(); stop(); goTo(i); start(); });
    });
    card.addEventListener('mouseenter', stop);
    card.addEventListener('mouseleave', start);
    start();
  });

  /* ── 6. Filter tabs ── */
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');
      filterTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');

      grid.querySelectorAll('.project-card').forEach(card => {
        const catAttr = (card.getAttribute('data-category') || '').toLowerCase();
        const categories = catAttr.split(/[\s,]+/);
        const show = filter === 'all' || categories.includes(filter.toLowerCase());
        card.classList.toggle('hidden', !show);
        show ? card.removeAttribute('hidden') : card.setAttribute('hidden','');
      });
    });

    tab.addEventListener('keydown', e => {
      const list = Array.from(filterTabs);
      const i = list.indexOf(tab);
      if (e.key === 'ArrowRight') list[(i + 1) % list.length].focus();
      else if (e.key === 'ArrowLeft') list[(i - 1 + list.length) % list.length].focus();
    });
  });

})();
