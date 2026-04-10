import { PORTFOLIO_DATA } from './data.js';

/**
 * Build graph from explicit connections only.
 * Returns { nodes: [{ slug, block }], edges: [{ source, target }] }
 */
export function buildGraph(blocks = PORTFOLIO_DATA.knowledgeBlocks) {
  const slugSet = new Set(blocks.map(b => b.slug));
  const nodes = blocks.map(b => ({ slug: b.slug, block: b }));
  const edgeSet = new Set();
  const edges = [];

  for (const block of blocks) {
    if (!block.connections) continue;
    for (const target of block.connections) {
      if (!slugSet.has(target)) continue;
      const key = [block.slug, target].sort().join('::');
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      edges.push({ source: block.slug, target });
    }
  }

  return { nodes, edges };
}

/**
 * Get blocks connected to a given slug via explicit connections.
 */
export function getRelatedBlocks(slug, blocks = PORTFOLIO_DATA.knowledgeBlocks) {
  const block = blocks.find(b => b.slug === slug);
  if (!block) return [];

  const directSlugs = new Set(block.connections || []);

  // Also find blocks that connect TO this slug
  for (const b of blocks) {
    if (b.slug === slug) continue;
    if (b.connections && b.connections.includes(slug)) {
      directSlugs.add(b.slug);
    }
  }

  return Array.from(directSlugs)
    .map(s => blocks.find(b => b.slug === s))
    .filter(Boolean);
}

/**
 * Build tag → slugs index for search/filter.
 */
export function getTagIndex(blocks = PORTFOLIO_DATA.knowledgeBlocks) {
  const index = new Map();
  for (const block of blocks) {
    for (const tag of (block.tags || [])) {
      if (!index.has(tag)) index.set(tag, []);
      index.get(tag).push(block.slug);
    }
  }
  return index;
}

/**
 * Search blocks by query string. Matches title, description, tags.
 * Returns matching blocks sorted by relevance.
 */
export function searchBlocks(query, blocks = PORTFOLIO_DATA.knowledgeBlocks) {
  if (!query || !query.trim()) return blocks;
  const q = query.toLowerCase().trim();

  const scored = blocks.map(block => {
    let score = 0;
    if (block.title.toLowerCase().includes(q)) score += 10;
    if (block.description && block.description.toLowerCase().includes(q)) score += 5;
    if (block.tags && block.tags.some(t => t.toLowerCase().includes(q))) score += 3;
    return { block, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.block);
}
