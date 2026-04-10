const NAV_LINKS = [
  { href: './', label: 'All Blocks', isPage: true }
];

function isMainPage() {
  const path = window.location.pathname;
  return path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('index.html');
}

function resolveHref(link) {
  if (link.isPage) {
    if (isMainPage()) return link.href;
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : './';
    return prefix + link.href.replace('./', '');
  }
  if (link.href.startsWith('#')) {
    if (isMainPage()) return link.href;
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    const prefix = depth > 1 ? '../'.repeat(depth - 1) : './';
    return prefix + 'index.html' + link.href;
  }
  return link.href;
}

export function renderNav(container = document.body) {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.id = 'nav';

  const logoHref = isMainPage() ? '#' : (window.location.pathname.includes('/blocks/') ? '../index.html' : './index.html');

  nav.innerHTML = `
    <div class="nav-container">
      <a href="${logoHref}" class="nav-logo">
        <span class="nav-logo-icon">📚</span>
        <span class="nav-logo-text">Knowledge Blocks</span>
      </a>
      <ul class="nav-links">
        ${NAV_LINKS.map(link => `
          <li><a href="${resolveHref(link)}" class="nav-link${link.isCta ? ' nav-link-cta' : ''}">${link.label}</a></li>
        `).join('')}
      </ul>
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
        <span class="theme-toggle-icon" id="themeIcon">🌙</span>
      </button>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  container.prepend(nav);
}

export function initNavigation() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  if (isMainPage()) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  }
}
