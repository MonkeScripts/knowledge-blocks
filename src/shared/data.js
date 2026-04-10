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
    },
    {
      slug: 'docker',
      title: 'Docker',
      icon: '🐳',
      description: 'Container runtime — images, Dockerfiles, volumes, networking, multi-stage builds',
      tags: ['containers', 'devops', 'infrastructure'],
      connections: ['kubernetes', 'ci-cd'],
      sources: [
        { title: 'Docker Docs', url: 'https://docs.docker.com' }
      ]
    },
    {
      slug: 'kubernetes',
      title: 'Kubernetes',
      icon: '☸️',
      description: 'Container orchestration — pods, services, deployments, scaling, Helm charts',
      tags: ['containers', 'devops', 'orchestration'],
      connections: ['docker', 'ci-cd'],
      sources: [
        { title: 'Kubernetes Docs', url: 'https://kubernetes.io/docs' }
      ]
    },
    {
      slug: 'ci-cd',
      title: 'CI/CD Pipelines',
      icon: '🔄',
      description: 'Continuous integration and delivery — GitHub Actions, build stages, deploy strategies',
      tags: ['devops', 'automation', 'pipelines'],
      connections: ['docker', 'kubernetes'],
      sources: [
        { title: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions' }
      ]
    }
  ]
};
