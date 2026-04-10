import { buildGraph } from './graph.js';
import { runLayout } from './force-layout.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

/**
 * Render interactive SVG graph into container.
 * Returns controller with highlight/reset/destroy methods.
 */
export function renderGraph(container, blocks) {
  const { nodes, edges } = buildGraph(blocks);
  const width = container.clientWidth || 800;
  const height = Math.max(500, container.clientHeight || 500);

  // Clear
  container.innerHTML = '';

  const svg = createSVGElement('svg', {
    class: 'graph-svg',
    width: '100%',
    height: height,
    viewBox: `0 0 ${width} ${height}`
  });
  container.appendChild(svg);

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'graph-tooltip';
  container.appendChild(tooltip);

  // Edge group
  const edgeGroup = createSVGElement('g', { class: 'graph-edges' });
  svg.appendChild(edgeGroup);

  // Node group
  const nodeGroup = createSVGElement('g', { class: 'graph-nodes' });
  svg.appendChild(nodeGroup);

  // Create edge lines
  const edgeEls = edges.map(edge => {
    const line = createSVGElement('line', { class: 'graph-edge' });
    edgeGroup.appendChild(line);
    return { el: line, data: edge };
  });

  // Create node groups
  const nodeEls = nodes.map(node => {
    const g = createSVGElement('g', {
      class: 'graph-node',
      'data-slug': node.slug,
      style: 'cursor: pointer'
    });

    const circle = createSVGElement('circle', { r: 28 });
    g.appendChild(circle);

    const icon = createSVGElement('text', {
      class: 'graph-node-icon',
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      dy: '-2'
    });
    icon.textContent = node.block.icon;
    g.appendChild(icon);

    const label = createSVGElement('text', {
      class: 'graph-node-label',
      'text-anchor': 'middle',
      dy: '42'
    });
    label.textContent = node.block.title.length > 18
      ? node.block.title.slice(0, 16) + '...'
      : node.block.title;
    g.appendChild(label);

    // Hover
    g.addEventListener('mouseenter', () => {
      highlightNode(node.slug);
      tooltip.textContent = node.block.description || node.block.title;
      tooltip.classList.add('visible');
    });
    g.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 8) + 'px';
    });
    g.addEventListener('mouseleave', () => {
      resetHighlight();
      tooltip.classList.remove('visible');
    });

    // Click → navigate
    g.addEventListener('click', () => {
      window.location.href = `./blocks/${node.slug}.html`;
    });

    nodeGroup.appendChild(g);
    return { el: g, data: node };
  });

  // Drag state
  let dragNode = null;
  let dragOffset = { x: 0, y: 0 };

  svg.addEventListener('mousedown', (e) => {
    const nodeG = e.target.closest('.graph-node');
    if (!nodeG) return;
    e.preventDefault();
    const slug = nodeG.getAttribute('data-slug');
    dragNode = nodes.find(n => n.slug === slug);
    if (dragNode) {
      dragOffset.x = e.offsetX - (dragNode.x || 0);
      dragOffset.y = e.offsetY - (dragNode.y || 0);
      dragNode.fx = dragNode.x;
      dragNode.fy = dragNode.y;
      simulation.alphaTarget(0.3).restart();
    }
  });

  svg.addEventListener('mousemove', (e) => {
    if (!dragNode) return;
    dragNode.fx = e.offsetX - dragOffset.x;
    dragNode.fy = e.offsetY - dragOffset.y;
  });

  svg.addEventListener('mouseup', () => {
    if (dragNode) {
      dragNode.fx = null;
      dragNode.fy = null;
      simulation.alphaTarget(0);
      dragNode = null;
    }
  });

  // Run simulation
  const simulation = runLayout(nodes, edges, width, height, () => {
    // Update edge positions
    edgeEls.forEach(({ el, data }) => {
      el.setAttribute('x1', data.source.x);
      el.setAttribute('y1', data.source.y);
      el.setAttribute('x2', data.target.x);
      el.setAttribute('y2', data.target.y);
    });

    // Update node positions
    nodeEls.forEach(({ el, data }) => {
      el.setAttribute('transform', `translate(${data.x}, ${data.y})`);
    });
  });

  // Highlight helpers
  function highlightNode(slug) {
    const connectedSlugs = new Set([slug]);
    edges.forEach(e => {
      const src = typeof e.source === 'string' ? e.source : e.source.slug;
      const tgt = typeof e.target === 'string' ? e.target : e.target.slug;
      if (src === slug) connectedSlugs.add(tgt);
      if (tgt === slug) connectedSlugs.add(src);
    });

    nodeEls.forEach(({ el, data }) => {
      el.classList.toggle('dimmed', !connectedSlugs.has(data.slug));
      el.classList.toggle('highlighted', data.slug === slug);
    });
    edgeEls.forEach(({ el, data }) => {
      const src = typeof data.source === 'string' ? data.source : data.source.slug;
      const tgt = typeof data.target === 'string' ? data.target : data.target.slug;
      el.classList.toggle('highlighted', src === slug || tgt === slug);
      el.classList.toggle('dimmed', src !== slug && tgt !== slug);
    });
  }

  function resetHighlight() {
    nodeEls.forEach(({ el }) => {
      el.classList.remove('dimmed', 'highlighted');
    });
    edgeEls.forEach(({ el }) => {
      el.classList.remove('dimmed', 'highlighted');
    });
  }

  function highlightSlugs(slugs) {
    const slugSet = new Set(slugs);
    if (slugSet.size === 0) {
      resetHighlight();
      return;
    }
    nodeEls.forEach(({ el, data }) => {
      el.classList.toggle('dimmed', !slugSet.has(data.slug));
      el.classList.remove('highlighted');
    });
    edgeEls.forEach(({ el, data }) => {
      const src = typeof data.source === 'string' ? data.source : data.source.slug;
      const tgt = typeof data.target === 'string' ? data.target : data.target.slug;
      el.classList.toggle('dimmed', !slugSet.has(src) || !slugSet.has(tgt));
    });
  }

  function destroy() {
    simulation.stop();
    container.innerHTML = '';
  }

  return { highlight: highlightSlugs, resetHighlight, destroy };
}
