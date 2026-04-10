import { PORTFOLIO_DATA } from '../shared/data.js';
import { initTheme } from '../shared/theme.js';
import { renderNav, initNavigation } from '../shared/navigation.js';
import { renderFooter, initFooter } from '../shared/footer.js';
import { searchBlocks, getTagIndex } from '../shared/graph.js';
import '../styles/shared.css';
import '../styles/memory-palace.css';

let graphController = null;
let currentView = localStorage.getItem('palace-view') || 'grid';
let activeFilters = [];
let searchQuery = '';

function getAllTags(blocks) {
  const tags = new Set();
  blocks.forEach(b => (b.tags || []).forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

function getFilteredBlocks() {
  const blocks = PORTFOLIO_DATA.knowledgeBlocks;
  let filtered = searchQuery ? searchBlocks(searchQuery, blocks) : blocks;

  if (activeFilters.length > 0) {
    filtered = filtered.filter(b =>
      activeFilters.every(tag => (b.tags || []).includes(tag))
    );
  }

  return filtered;
}

function applyFilters() {
  const filtered = getFilteredBlocks();
  const filteredSlugs = new Set(filtered.map(b => b.slug));

  // Update grid cards
  document.querySelectorAll('.palace-block-card').forEach(card => {
    const slug = card.getAttribute('data-slug');
    card.classList.toggle('hidden', !filteredSlugs.has(slug));
  });

  // Update graph if active
  if (graphController && currentView === 'graph') {
    if (searchQuery || activeFilters.length > 0) {
      graphController.highlight(Array.from(filteredSlugs));
    } else {
      graphController.resetHighlight();
    }
  }

  // Update active filters display
  renderActiveFilters();
}

function renderActiveFilters() {
  const container = document.querySelector('.palace-active-filters');
  if (!container) return;

  if (activeFilters.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = activeFilters.map(tag =>
    `<span class="palace-filter-tag">${tag}<button class="palace-filter-remove" data-tag="${tag}">&times;</button></span>`
  ).join('');

  container.querySelectorAll('.palace-filter-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tag = btn.getAttribute('data-tag');
      activeFilters = activeFilters.filter(t => t !== tag);
      applyFilters();
    });
  });
}

function toggleTag(tag) {
  if (activeFilters.includes(tag)) {
    activeFilters = activeFilters.filter(t => t !== tag);
  } else {
    activeFilters.push(tag);
  }
  applyFilters();
}

function switchView(view) {
  currentView = view;
  localStorage.setItem('palace-view', view);

  const grid = document.querySelector('.palace-blocks-grid');
  const graphContainer = document.querySelector('.palace-graph-container');
  const gridBtn = document.querySelector('.palace-view-btn[data-view="grid"]');
  const graphBtn = document.querySelector('.palace-view-btn[data-view="graph"]');

  if (view === 'grid') {
    grid.classList.remove('hidden');
    graphContainer.classList.add('hidden');
    gridBtn.classList.add('active');
    graphBtn.classList.remove('active');
  } else {
    grid.classList.add('hidden');
    graphContainer.classList.remove('hidden');
    gridBtn.classList.remove('active');
    graphBtn.classList.add('active');

    // Lazy-init graph
    if (!graphController) {
      import('../shared/graph-renderer.js').then(({ renderGraph }) => {
        graphController = renderGraph(graphContainer, PORTFOLIO_DATA.knowledgeBlocks);
        applyFilters();
      });
    }
  }
}

function initMemoryPalace() {
  const main = document.getElementById('memoryPalace');
  if (!main) return;

  const blocks = PORTFOLIO_DATA.knowledgeBlocks;

  main.innerHTML = `
    <section class="palace-section">
      <div class="container">
        <div class="palace-header">
          <span class="section-subtitle">Your Personal Knowledge Base</span>
          <h1 class="section-title">Knowledge Blocks</h1>
          <p class="palace-description">Deep-dive reference documents on specific topics. Click a block to read the full writeup, check sources, and use the knowledge in future projects.</p>
        </div>

        <div class="palace-toolbar">
          <div class="palace-search-bar">
            <input type="text" class="palace-search-input" placeholder="Search blocks...">
          </div>
          <div class="palace-view-toggle">
            <button class="palace-view-btn ${currentView === 'grid' ? 'active' : ''}" data-view="grid">Grid</button>
            <button class="palace-view-btn ${currentView === 'graph' ? 'active' : ''}" data-view="graph">Graph</button>
          </div>
        </div>
        <div class="palace-active-filters"></div>

        <div class="palace-blocks-grid ${currentView === 'graph' ? 'hidden' : ''}">
          ${blocks.map(block => `
            <a href="./blocks/${block.slug}.html" class="palace-block-card" data-slug="${block.slug}">
              <div class="palace-block-card-icon">${block.icon}</div>
              <div class="palace-block-card-body">
                <h3 class="palace-block-card-title">${block.title}</h3>
                ${block.description ? `<p class="palace-block-card-desc">${block.description}</p>` : ''}
                ${block.tags && block.tags.length ? `
                  <div class="palace-block-card-tags">
                    ${block.tags.map(t => `<span class="palace-block-card-tag" data-tag="${t}">${t}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
              <span class="palace-block-card-arrow">&rarr;</span>
            </a>
          `).join('')}
        </div>

        <div class="palace-graph-container ${currentView === 'grid' ? 'hidden' : ''}"></div>

        ${blocks.length === 0 ? `
          <div class="palace-empty">
            <p>No knowledge blocks yet. Use the <code>/knowledge-block</code> skill in Claude Code to create your first one.</p>
          </div>
        ` : ''}
      </div>
    </section>
  `;

  // Search input
  const searchInput = main.querySelector('.palace-search-input');
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value;
      applyFilters();
    }, 150);
  });

  // Clickable tags on cards
  main.querySelectorAll('.palace-block-card-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleTag(tag.getAttribute('data-tag'));
    });
  });

  // View toggle
  main.querySelectorAll('.palace-view-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.getAttribute('data-view')));
  });

  // Read URL params
  const params = new URLSearchParams(window.location.search);
  const tagParam = params.get('tag');
  const qParam = params.get('q');

  if (tagParam) {
    activeFilters = [tagParam];
  }
  if (qParam) {
    searchQuery = qParam;
    searchInput.value = qParam;
  }
  if (tagParam || qParam) {
    applyFilters();
  }

  // Init graph if that's the saved view
  if (currentView === 'graph') {
    const graphContainer = main.querySelector('.palace-graph-container');
    import('../shared/graph-renderer.js').then(({ renderGraph }) => {
      graphController = renderGraph(graphContainer, PORTFOLIO_DATA.knowledgeBlocks);
      applyFilters();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  initTheme();
  initNavigation();
  initMemoryPalace();
  renderFooter();
  initFooter();
});
