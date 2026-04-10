export function renderFooter(container = document.body) {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <p class="footer-text">
          Made with <span class="footer-heart">❤️</span> and curiosity
        </p>
        <p class="footer-copyright"></p>
      </div>
    </div>
  `;
  container.appendChild(footer);
}

export function initFooter() {
  const footerCopyright = document.querySelector('.footer-copyright');
  if (footerCopyright) {
    footerCopyright.textContent = `\u00A9 ${new Date().getFullYear()} Knowledge Blocks. All rights reserved.`;
  }
}
