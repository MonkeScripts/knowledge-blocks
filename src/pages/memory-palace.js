import { PORTFOLIO_DATA } from '../shared/data.js';
import { initTheme } from '../shared/theme.js';
import { renderNav, initNavigation } from '../shared/navigation.js';
import { renderFooter, initFooter } from '../shared/footer.js';
import '../styles/shared.css';
import '../styles/memory-palace.css';

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

        <div class="palace-blocks-grid">
          ${blocks.map(block => `
            <a href="./blocks/${block.slug}.html" class="palace-block-card">
              <div class="palace-block-card-icon">${block.icon}</div>
              <div class="palace-block-card-body">
                <h3 class="palace-block-card-title">${block.title}</h3>
                ${block.description ? `<p class="palace-block-card-desc">${block.description}</p>` : ''}
                ${block.tags && block.tags.length ? `
                  <div class="palace-block-card-tags">
                    ${block.tags.map(t => `<span class="palace-block-card-tag">${t}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
              <span class="palace-block-card-arrow">&rarr;</span>
            </a>
          `).join('')}
        </div>

        ${blocks.length === 0 ? `
          <div class="palace-empty">
            <p>No knowledge blocks yet. Use the <code>/knowledge-block</code> skill in Claude Code to create your first one.</p>
          </div>
        ` : ''}

        <div class="palace-instructions">
          <p>Each block is a detailed reference document with sources and writeups — a personal wiki for things worth remembering.</p>
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  initTheme();
  initNavigation();
  initMemoryPalace();
  renderFooter();
  initFooter();
});
