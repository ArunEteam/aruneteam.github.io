/* ============================================================
   CASE STUDY RENDERER — reads ?id=xxx → loads projects.json
   Used by: work/case-study.html
   ============================================================ */

'use strict';

(async function initCaseStudy() {
  const loadingEl = document.getElementById('caseLoading');
  const errorEl   = document.getElementById('caseError');
  const contentEl = document.getElementById('caseContent');

  /* ── 1. Read ?id= from URL ── */
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  function showError() {
    if (loadingEl) {
      loadingEl.hidden = true;
      loadingEl.classList.add('hidden');
      loadingEl.style.display = 'none';
    }
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.classList.remove('hidden');
      errorEl.style.display = 'block';
    }
  }

  if (!projectId) { showError(); return; }

  /* ── 2. Fetch projects.json ── */
  let projects = [];
  try {
    const res = await fetch('../assets/data/projects.json');
    if (!res.ok) throw new Error('Fetch failed');
    projects = await res.json();
  } catch (err) {
    console.error('case-study.js: could not fetch projects.json', err);
    showError(); return;
  }

  /* ── 3. Find the project ── */
  const idx     = projects.findIndex(p => p.id === projectId);
  const project = projects[idx];

  if (!project || !project.caseStudy) { showError(); return; }

  const cs      = project.caseStudy;
  const prevP   = idx > 0                   ? projects[idx - 1] : projects[projects.length - 1];
  const nextP   = idx < projects.length - 1 ? projects[idx + 1] : projects[0];

  /* ── 4. Page meta ── */
  document.title = `${project.title} — Case Study | Arun`;
  const metaDesc = document.getElementById('metaDesc');
  if (metaDesc) metaDesc.setAttribute('content', project.shortDesc);

  /* ── 5. Breadcrumb ── */
  const bc = document.getElementById('breadcrumbCurrent');
  if (bc) bc.textContent = project.title;

  /* ── 6. Tags ── */
  const tagsEl = document.getElementById('caseTags');
  if (tagsEl) {
    tagsEl.innerHTML = project.tags.map(t =>
      `<span class="project-card__tag">${t}</span>`
    ).join('');
  }

  /* ── 7. Title & summary ── */
  const titleEl   = document.getElementById('caseTitle');
  const summaryEl = document.getElementById('caseSummary');
  if (titleEl)   titleEl.textContent   = project.title;
  if (summaryEl) summaryEl.textContent = project.shortDesc;

  /* ── 8. Meta table ── */
  const metaEl = document.getElementById('caseMeta');
  if (metaEl) {
    const rows = [
      ['Client',   cs.client],
      ['Platform', cs.platform],
      ['Timeline', cs.timeline],
      ['Role',     cs.role],
    ];
    if (project.liveUrl) {
      rows.push(['Live Site', `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--clr-accent)">${project.liveUrl.replace('https://','').replace('http://','')} ↗</a>`]);
    }
    metaEl.innerHTML = rows.map(([label, value]) => `
      <div class="case-meta-item">
        <dt class="case-meta-item__label">${label}</dt>
        <dd class="case-meta-item__value">${value}</dd>
      </div>`).join('');
  }

  /* ── 9. Gallery ── */
  const galleryEl = document.getElementById('caseGallery');
  if (galleryEl && cs.gallery && cs.gallery.length) {
    const [main, ...rest] = cs.gallery;
    const mainImg = `
      <div class="case-gallery__img case-gallery__img--main">
        <img src="../${main.src}" alt="${main.alt}" width="800" height="600" loading="lazy" />
      </div>`;
    const smImgs = rest.map(g => `
      <div class="case-gallery__img case-gallery__img--sm">
        <img src="../${g.src}" alt="${g.alt}" width="400" height="266" loading="lazy" />
      </div>`).join('');
    galleryEl.innerHTML = mainImg + smImgs;
  }

  /* ── 10. Text sections ── */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }
  setText('caseChallenge', cs.challenge);
  setText('caseApproach',  cs.approach);
  setText('caseLearnings', cs.learnings);

  /* ── 11. Results ── */
  const resultsEl = document.getElementById('caseResults');
  if (resultsEl && cs.results) {
    resultsEl.innerHTML = cs.results.map(r => `
      <div class="case-result-card" role="listitem">
        <span class="case-result-card__num">${r.value}</span>
        <span class="case-result-card__label">${r.label}</span>
      </div>`).join('');
  }

  /* ── 12. Tech stack & services ── */
  function buildList(id, items) {
    const el = document.getElementById(id);
    if (el && items) el.innerHTML = items.map(i => `<li>${i}</li>`).join('');
  }
  buildList('caseTechStack', cs.techStack);
  buildList('caseServices',  cs.services);

  /* ── 13. Prev / Next nav ── */
  function detailUrl(p) {
    return `case-study.html?id=${encodeURIComponent(p.id)}`;
  }

  const prevEl      = document.getElementById('casePrev');
  const prevTitleEl = document.getElementById('casePrevTitle');
  const nextEl      = document.getElementById('caseNext');
  const nextTitleEl = document.getElementById('caseNextTitle');

  if (prevEl && prevP) {
    prevEl.href = detailUrl(prevP);
    prevEl.setAttribute('aria-label', `Previous: ${prevP.title}`);
    if (prevTitleEl) prevTitleEl.textContent = prevP.title;
  }
  if (nextEl && nextP) {
    nextEl.href = detailUrl(nextP);
    nextEl.setAttribute('aria-label', `Next: ${nextP.title}`);
    if (nextTitleEl) nextTitleEl.textContent = nextP.title;
  }

  /* ── 14. Show content, hide loader ── */
  if (loadingEl) {
    loadingEl.hidden = true;
    loadingEl.classList.add('hidden');
    loadingEl.style.display = 'none';
  }
  if (contentEl) {
    contentEl.hidden = false;
    contentEl.classList.remove('hidden');
    contentEl.style.display = 'block';
  }

  /* ── 15. Trigger reveal animations ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = contentEl.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  }

})();
