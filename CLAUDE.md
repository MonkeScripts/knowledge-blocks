# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build to ./dist/
npm run preview  # Preview production build
```

No linting or testing infrastructure is configured.

## Architecture

Vanilla JavaScript multi-page app (MPA) with Vite as the bundler. No framework.

**Key files:**
- `index.html` — Landing page (block index grid)
- `blocks/{slug}.html` — Entry point for each block (minimal HTML with `data-block-slug` attribute)
- `public/resources/{slug}.html` — Full guide content (fetched at runtime by block-detail.js)
- `src/shared/data.js` — `PORTFOLIO_DATA.knowledgeBlocks` array (the only place to register blocks)
- `src/pages/block-detail.js` — Renders block detail pages, handles Share with Claude
- `src/pages/memory-palace.js` — Renders the block index grid
- `src/styles/shared.css` — Design system (CSS custom properties, base styles, nav, footer)
- `src/styles/block-detail.css` — Block detail + guide content styling
- `src/styles/memory-palace.css` — Index page styling
- `vite.config.js` — Base `./`, port 3000, sourcemaps on, rollup inputs for each page

**Shared modules** (all in `src/shared/`):
- `theme.js` — Dark/light toggle, persists to `localStorage('theme')`, respects `prefers-color-scheme`
- `navigation.js` — Renders nav bar, handles relative href resolution between root and `blocks/` pages
- `footer.js` — Renders footer
- `utils.js` — Shared utilities

Every page follows the same init pattern in `DOMContentLoaded`: `renderNav()` → `initTheme()` → `initNavigation()` → page-specific render → `renderFooter()` → `initFooter()`.

## How Blocks Work

1. Block metadata (slug, title, icon, description, tags, sources) lives in `src/shared/data.js`
2. Each block has an entry page at `blocks/{slug}.html` that loads `block-detail.js`
3. `block-detail.js` reads the slug from `data-block-slug`, finds the block in data, fetches `public/resources/{slug}.html`
4. Guide HTML is injected into a `.block-guide` wrapper — all styling comes from `block-detail.css`
5. Guide resource files use specific CSS classes (`.hero`, `.section`, `.card`, `.cfg`, `.tip`, `.uc`) — no inline styles
6. "Share with Claude" button extracts guide DOM into structured markdown via `extractGuideText()` and copies to clipboard. This markdown format is designed for optimal parsing by Claude, with clear delimiters and metadata. So YOUR CLAUDE CODE CAN ALSO LEARN TO EXTRACT AND STRUCTURE CONTENT IN THIS WAY FOR BETTER KNOWLEDGE RETENTION!

## Adding a Block

Four files to touch:
1. `public/resources/{slug}.html` — Full guide content (see example block for class structure)
2. `blocks/{slug}.html` — Entry page (copy example.html, change `data-block-slug` and title)
3. `src/shared/data.js` — Add entry to `knowledgeBlocks` array
4. `vite.config.js` — Add `'block-{slug}': resolve(root, 'blocks/{slug}.html')` to rollup inputs

Or use the `/knowledge-block` skill to automate all 4 steps.

## Design System

CSS custom properties in `src/styles/shared.css`:

- **Colors:** `--color-primary` (#7C3AED purple), `--color-secondary` (#FBBF24 gold), `--color-accent` (#EC4899 pink), `--color-bg` (#FDF8F0 cream)
- **Fonts:** Bangers (headings), Inter (body), Caveat (accent), JetBrains Mono (code)
- **Shadows:** `--shadow-dramatic` is the signature 4px offset manga-style drop shadow
- **Dark mode:** Full dark theme via `[data-theme="dark"]` CSS overrides