import { PORTFOLIO_DATA } from '../shared/data.js';
import { initTheme } from '../shared/theme.js';
import { renderNav, initNavigation } from '../shared/navigation.js';
import { renderFooter, initFooter } from '../shared/footer.js';
import '../styles/shared.css';
import '../styles/block-detail.css';

function getBlockSlug() {
  const main = document.getElementById('blockDetail');
  if (main && main.dataset.blockSlug) return main.dataset.blockSlug;
  return window.location.pathname.split('/').pop().replace('.html', '');
}

function extractGuideText(block) {
  const guide = document.querySelector('.block-guide');
  if (!guide) return `# ${block.title}\nNo guide content loaded.`;

  let out = `# ${block.title}\n`;
  if (block.description) out += `${block.description}\n`;
  out += '\n';

  // Walk the guide DOM and build structured text
  // Sections
  guide.querySelectorAll('.section').forEach(section => {
    const num = section.querySelector('.section-number');
    const h2 = section.querySelector('h2');
    if (h2) out += `## ${num ? num.textContent.trim() + ' — ' : ''}${h2.textContent.trim()}\n\n`;

    // Prose paragraphs
    section.querySelectorAll(':scope > .prose').forEach(p => {
      out += `${p.textContent.trim()}\n\n`;
    });

    // Cards
    const cards = section.querySelectorAll('.card');
    if (cards.length) {
      cards.forEach(card => {
        const h4 = card.querySelector('h4');
        const p = card.querySelector('p');
        if (h4) out += `**${h4.textContent.trim()}**`;
        if (p) out += `: ${p.textContent.trim()}`;
        out += '\n';
      });
      out += '\n';
    }

    // Config blocks
    section.querySelectorAll(':scope > .cfg').forEach(cfg => {
      const head = cfg.querySelector('.cfg-head');
      const pre = cfg.querySelector('pre');
      if (head) out += `\`\`\`${head.textContent.trim()}\n`;
      else out += '```\n';
      if (pre) out += `${pre.textContent.trim()}\n`;
      out += '```\n\n';
    });

    // Tips
    section.querySelectorAll(':scope > .tip').forEach(tip => {
      out += `> ${tip.textContent.trim()}\n\n`;
    });

    // Collapsible details (config examples inside)
    section.querySelectorAll(':scope > details').forEach(det => {
      const summary = det.querySelector('summary');
      if (summary) out += `### ${summary.textContent.trim()}\n`;
      const cfg = det.querySelector('.cfg');
      if (cfg) {
        const pre = cfg.querySelector('pre');
        const head = cfg.querySelector('.cfg-head');
        if (head) out += `\`\`\`${head.textContent.trim()}\n`;
        else out += '```\n';
        if (pre) out += `${pre.textContent.trim()}\n`;
        out += '```\n';
      }
      out += '\n';
    });
  });

  // Use cases
  const useCases = guide.querySelectorAll('.uc');
  if (useCases.length) {
    out += `---\n## Use Cases\n\n`;
    useCases.forEach(uc => {
      const title = uc.querySelector('.uc-title');
      const sub = uc.querySelector('.uc-sub');
      if (title) out += `### ${title.textContent.trim()}`;
      if (sub) out += ` (${sub.textContent.trim()})`;
      out += '\n';

      // Tags
      const tags = uc.querySelectorAll('.tag');
      if (tags.length) {
        out += `Tags: ${Array.from(tags).map(t => t.textContent.trim()).join(', ')}\n`;
      }

      // Body prose
      uc.querySelectorAll('.uc-body > p').forEach(p => {
        out += `${p.textContent.trim()}\n`;
      });

      // Config inside use case
      const cfg = uc.querySelector('.cfg');
      if (cfg) {
        const pre = cfg.querySelector('pre');
        const head = cfg.querySelector('.cfg-head');
        if (head) out += `\`\`\`${head.textContent.trim()}\n`;
        else out += '```\n';
        if (pre) out += `${pre.textContent.trim()}\n`;
        out += '```\n';
      }
      out += '\n';
    });
  }

  // Sources
  if (block.sources && block.sources.length) {
    out += `---\nSources:\n`;
    block.sources.forEach(s => { out += `- ${s.title}: ${s.url}\n`; });
  }

  return out.trim();
}

async function loadGuideContent(slug) {
  try {
    const res = await fetch(`../resources/${slug}.html`);
    if (!res.ok) return null;
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // Extract only the body content — styles are handled by our own CSS
    const body = doc.body;
    return body ? body.innerHTML : null;
  } catch {
    return null;
  }
}

async function renderBlockDetail(block) {
  const main = document.getElementById('blockDetail');
  if (!main || !block) {
    if (main) main.innerHTML = `
      <div class="container" style="padding: var(--space-24) 0; text-align: center;">
        <h1 class="section-title">Block Not Found</h1>
        <p><a href="../memory-palace.html">Back to Memory Palace</a></p>
      </div>`;
    return;
  }

  // Load the full guide content from resources
  const guide = await loadGuideContent(block.slug);

  main.innerHTML = `
    <div class="block-detail-section">
      <div class="container">
        <a href="../memory-palace.html" class="block-back-link">← Back to Memory Palace</a>

        <div class="block-detail-header">
          <span class="block-detail-icon">${block.icon}</span>
          <div>
            <h1 class="block-detail-title">${block.title}</h1>
            ${block.description ? `<p class="block-detail-description">${block.description}</p>` : ''}
          </div>
        </div>

        <div class="block-detail-meta">
          ${block.tags && block.tags.length ? `
            <div class="block-detail-tags">
              ${block.tags.map(t => `<span class="block-detail-tag">${t}</span>`).join('')}
            </div>
          ` : ''}
          ${block.sources && block.sources.length ? `
            <div class="block-detail-sources">
              <h3 class="block-detail-sources-heading">Sources</h3>
              <ul>
                ${block.sources.map(s => `
                  <li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} <span class="block-external-icon">↗</span></a></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          <div class="block-detail-actions">
            <button class="btn btn-secondary block-copy-link">Copy Link</button>
            <button class="btn btn-primary block-share-claude">Share with Claude</button>
          </div>
        </div>
      </div>

      ${guide ? `
        <div class="block-guide">${guide}</div>
      ` : `
        <div class="container">
          <p class="block-detail-empty">No detailed guide available yet for this block.</p>
        </div>
      `}
    </div>
  `;

  // Copy link button
  main.querySelector('.block-copy-link')?.addEventListener('click', (e) => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      e.target.textContent = 'Copied!';
      setTimeout(() => { e.target.textContent = 'Copy Link'; }, 2000);
    });
  });

  // Share with Claude button — extracts full guide content as structured text
  main.querySelector('.block-share-claude')?.addEventListener('click', (e) => {
    const text = extractGuideText(block);
    navigator.clipboard.writeText(text).then(() => {
      e.target.textContent = 'Copied!';
      setTimeout(() => { e.target.textContent = 'Share with Claude'; }, 2000);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  initTheme();
  initNavigation();

  const slug = getBlockSlug();
  const block = PORTFOLIO_DATA.knowledgeBlocks.find(b => b.slug === slug);
  renderBlockDetail(block);

  renderFooter();
  initFooter();
});
