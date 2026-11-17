/**
 * ============================================================
 * PROJECTS ARCHIVE JAVASCRIPT (projects-list.js)
 * Live Search, Category Filtering, Dynamic Rendering
 * Direct Client Website Redirection (target="_blank")
 * ============================================================
 */

'use strict';

(function initProjectsArchive() {
  const grid = document.getElementById('projectsGrid');
  const emptyState = document.getElementById('projectsEmpty');
  const searchInput = document.getElementById('projectSearch');
  const searchClear = document.getElementById('searchClear');
  const filterPillsContainer = document.getElementById('filterPills');
  const resultsCountEl = document.getElementById('resultsCount');

  if (!grid) return;

  let allProjects = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // 1. Fetch Projects Data
  fetch('assets/data/all-projects.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load projects data');
      return res.json();
    })
    .then((data) => {
      allProjects = data;
      renderFilterPills();
      applyFilterAndSearch();
    })
    .catch((err) => {
      console.error('Error loading projects:', err);
      grid.innerHTML = `
        <div class="projects-empty visible" style="grid-column: 1 / -1;">
          <h3 class="projects-empty__title">Unable to load projects</h3>
          <p class="projects-empty__desc">There was an issue fetching the projects archive. Please refresh or try again later.</p>
        </div>
      `;
    });

  // 2. Define Category Definitions
  const categories = [
    { id: 'all', label: 'All Projects', matcher: () => true },
    {
      id: 'wordpress',
      label: 'WordPress',
      matcher: (p) =>
        (p.category && p.category.includes('wordpress')) ||
        (p.platform && p.platform.toLowerCase() === 'wordpress')
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce',
      matcher: (p) =>
        (p.category && (p.category.includes('ecom') || p.category.includes('shopify'))) ||
        (p.domain && /commerce|shop|store|apparel/i.test(p.domain)) ||
        (p.platform && p.platform.toLowerCase() === 'shopify')
    },
    {
      id: 'duda',
      label: 'Duda Platform',
      matcher: (p) =>
        (p.category && p.category.includes('duda')) ||
        (p.platform && p.platform.toLowerCase() === 'duda')
    },
    {
      id: 'shopify',
      label: 'Shopify',
      matcher: (p) =>
        (p.category && p.category.includes('shopify')) ||
        (p.platform && p.platform.toLowerCase() === 'shopify')
    },
    {
      id: 'webflow',
      label: 'Webflow',
      matcher: (p) =>
        (p.category && p.category.includes('webflow')) ||
        (p.platform && p.platform.toLowerCase() === 'webflow')
    },
    {
      id: 'api',
      label: 'API & Integrations',
      matcher: (p) =>
        (p.category && p.category.includes('api')) ||
        (p.tech && p.tech.some((t) => /api|salesforce|cURL|webhook|brevo|calendly/i.test(t))) ||
        (p.description && /api|integration|intellikid|brevo|calendly/i.test(p.description))
    }
  ];

  // 3. Render Filter Pills with dynamic counts
  function renderFilterPills() {
    if (!filterPillsContainer) return;

    filterPillsContainer.innerHTML = categories
      .map((cat) => {
        const count = allProjects.filter(cat.matcher).length;
        const isActive = cat.id === currentFilter ? 'active' : '';
        return `
          <button 
            type="button" 
            class="filter-pill ${isActive}" 
            data-category="${cat.id}"
            role="tab"
            aria-selected="${cat.id === currentFilter}"
          >
            ${cat.label}
            <span class="filter-pill__count">${count}</span>
          </button>
        `;
      })
      .join('');

    // Attach click handlers
    filterPillsContainer.querySelectorAll('.filter-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.category;
        if (currentFilter === catId) return;

        currentFilter = catId;
        filterPillsContainer.querySelectorAll('.filter-pill').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        applyFilterAndSearch();
      });
    });
  }

  // 4. Filter and Search Logic
  function applyFilterAndSearch() {
    const activeCategoryDef =
      categories.find((c) => c.id === currentFilter) || categories[0];
    const cleanQuery = searchQuery.trim().toLowerCase();

    const filtered = allProjects.filter((project) => {
      // Category match
      const matchesCategory = activeCategoryDef.matcher(project);
      if (!matchesCategory) return false;

      // Search match
      if (!cleanQuery) return true;

      const inName = project.name && project.name.toLowerCase().includes(cleanQuery);
      const inDomain = project.domain && project.domain.toLowerCase().includes(cleanQuery);
      const inPlatform = project.platform && project.platform.toLowerCase().includes(cleanQuery);
      const inCountry = project.country && project.country.toLowerCase().includes(cleanQuery);
      const inLocation = project.location && project.location.toLowerCase().includes(cleanQuery);
      const inDesc = project.description && project.description.toLowerCase().includes(cleanQuery);
      const inTech =
        Array.isArray(project.tech) &&
        project.tech.some((t) => t.toLowerCase().includes(cleanQuery));

      return inName || inDomain || inPlatform || inCountry || inLocation || inDesc || inTech;
    });

    renderProjects(filtered);
    updateResultsCount(filtered.length);
  }

  // 5. Render Project Cards
  function renderProjects(projects) {
    if (!projects.length) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.add('visible');
      return;
    }

    if (emptyState) emptyState.classList.remove('visible');

    const html = projects
      .map((p) => {
        const locationText = p.country
          ? `${p.country}${p.location ? ' · ' + p.location : ''}`
          : 'Global';

        const techTagsHtml = Array.isArray(p.tech)
          ? p.tech
              .slice(0, 6)
              .map((tag) => `<span class="tech-tag">${escapeHtml(tag)}</span>`)
              .join('')
          : '';

        return `
          <a 
            href="${escapeHtml(p.url)}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="project-item"
            aria-label="Visit ${escapeHtml(p.name)} live website (opens in a new tab)"
          >
            <div class="project-item__header">
              <div class="project-item__badges">
                <span class="badge-platform">${escapeHtml(p.platform || 'Web')}</span>
                <span class="badge-country">
                  <span aria-hidden="true">📍</span> ${escapeHtml(locationText)}
                </span>
              </div>
              <span class="project-item__link-btn" aria-hidden="true" title="Open live website">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </span>
            </div>

            <div class="project-item__body">
              <span class="project-item__domain">${escapeHtml(p.domain || 'Commercial Web')}</span>
              <h2 class="project-item__title">${escapeHtml(p.name)}</h2>
              <p class="project-item__desc">${escapeHtml(p.description || '')}</p>
            </div>

            <div class="project-item__footer">
              <div class="project-item__tech-list" aria-label="Technologies used">
                ${techTagsHtml}
              </div>
              <span class="project-item__live-cta">
                Visit Live Website <span aria-hidden="true">↗</span>
              </span>
            </div>
          </a>
        `;
      })
      .join('');

    grid.innerHTML = html;
  }

  // 6. Update Results Counter
  function updateResultsCount(count) {
    if (!resultsCountEl) return;
    resultsCountEl.innerHTML = `Showing <strong>${count}</strong> of ${allProjects.length} projects`;
  }

  // 7. Search Input Handlers
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClear) {
        searchClear.classList.toggle('visible', searchQuery.length > 0);
      }
      applyFilterAndSearch();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClear.classList.remove('visible');
      searchInput.focus();
      applyFilterAndSearch();
    });
  }

  // Helper: XSS escape
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
