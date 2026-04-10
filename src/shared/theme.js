export function initTheme() {
  const toggle = document.getElementById('themeToggle')
  const icon = document.getElementById('themeIcon')
  const root = document.documentElement
  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)')

  function applyTheme(theme) {
    root.dataset.theme = theme
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙'
  }

  const saved = localStorage.getItem('theme')
  applyTheme(saved || (darkMQ.matches ? 'dark' : 'light'))

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      applyTheme(next)
    })
  }

  darkMQ.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
}
