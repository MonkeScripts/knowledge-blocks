import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide } from 'd3-force';

/**
 * Run d3-force layout on graph data.
 * Returns a promise that resolves when simulation settles.
 * Mutates node objects to add x, y positions.
 */
export function runLayout(nodes, edges, width, height, onTick) {
  const simulation = forceSimulation(nodes)
    .force('charge', forceManyBody().strength(-300))
    .force('link', forceLink(edges)
      .id(d => d.slug)
      .distance(150)
    )
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide(50));

  if (onTick) {
    simulation.on('tick', onTick);
  }

  return simulation;
}
