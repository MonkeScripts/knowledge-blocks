// ==========================================
// KNOWLEDGE BLOCKS DATA
// Add your blocks to the knowledgeBlocks array.
// Each block needs: slug, title, icon, description, tags, sources
// Then create blocks/{slug}.html and public/resources/{slug}.html
// ==========================================
export const PORTFOLIO_DATA = {
  name: "Knowledge Blocks",

  knowledgeBlocks: [
    {
      slug: 'example',
      title: 'Example Block',
      icon: '📖',
      description: 'A starter knowledge block showing the format — replace with your own topics',
      tags: ['getting-started', 'template'],
      sources: [
        { title: 'Knowledge Blocks GitHub', url: 'https://github.com' }
      ]
    }
  ]
};
