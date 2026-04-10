export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function renderMarkdown(text) {
  if (!text) return '';
  return text
    .trim()
    .replace(/^### (.+)$/gm, '<h4 class="writeup-h3">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="writeup-h2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br><br>');
}