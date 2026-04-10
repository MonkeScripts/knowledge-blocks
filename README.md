# Knowledge Blocks

A personal knowledge base for deep reference documents. Each block is a detailed writeup on a specific topic with sources, code examples, and real-world use cases. Built with vanilla JS and Vite — no framework needed.

**Features:**
- Dark/light theme with system preference detection
- "Share with Claude" button exports structured markdown for AI conversations
- Responsive design with manga-inspired aesthetic
- Claude Code skill (`/knowledge-block`) to automate block creation from URLs or files

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/knowledge-blocks.git
cd knowledge-blocks
npm install
npm run dev
```

Open `http://localhost:3000` to see the block index.

## Creating Your First Block

### Option A: Use the Claude Code Skill

If you have [Claude Code](https://claude.ai/code) installed:

```
/knowledge-block https://docs.example.com/topic-you-want-to-document
```

The skill reads the source, creates all files, and verifies the build.

### Option B: Manual

1. **Create the guide content** at `public/resources/my-topic.html` using the HTML class structure (see `public/resources/example.html` for the full template)

2. **Create the entry page** at `blocks/my-topic.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Topic | Knowledge Blocks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Caveat:wght@400;600&family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
</head>
<body>
  <nav class="nav" id="nav"></nav>
  <main id="blockDetail" data-block-slug="my-topic"></main>
  <footer class="footer" id="footer"></footer>
  <script type="module" src="../src/pages/block-detail.js"></script>
</body>
</html>
```

3. **Register the block** in `src/shared/data.js`:
```js
{
  slug: 'my-topic',
  title: 'My Topic',
  icon: '🔧',
  description: 'One-line summary of what this block covers',
  tags: ['tag1', 'tag2'],
  sources: [
    { title: 'Source Name', url: 'https://example.com' }
  ]
}
```

4. **Add to Vite config** in `vite.config.js`:
```js
'block-my-topic': resolve(root, 'blocks/my-topic.html'),
```

5. Run `npm run build` to verify.

## Guide HTML Classes

Resource files use these CSS classes (no inline styles):

| Class | Purpose |
|-------|---------|
| `.hero` | Top banner with `h1` and `.subtitle` |
| `.container` | Content wrapper (max-width 1200px) |
| `.nav` | Internal navigation pills |
| `.section` | Major topic section |
| `.section-header` | Contains `.section-number` span + `h2` |
| `.prose` | Body text paragraphs |
| `.card-grid` + `.card` | Side-by-side concept cards |
| `.cfg` + `.cfg-head` + `pre` | Code/config blocks with label |
| `.tip` | Callout box with advice |
| `details` + `summary` | Collapsible sections |
| `.divider` | Visual separator |
| `.uc` | Use case block with `.uc-head`, `.uc-body` |
| `.tag` | Tag pills (`.t1` through `.t6` for colors) |

**Syntax highlighting** in `<pre>` tags:
- `<span class="c">` — comment (muted)
- `<span class="k">` — keyword (purple)
- `<span class="s">` — string (green)
- `<span class="n">` — number (gold)
- `<span class="b">` — boolean (pink)

## Customization

### Colors
Edit CSS custom properties in `src/styles/shared.css` under `:root`:
```css
--color-primary: #7C3AED;    /* purple — headings, links, accents */
--color-secondary: #FBBF24;  /* gold — highlights, gradients */
--color-accent: #EC4899;     /* pink — badges, emphasis */
--color-background: #FDF8F0; /* cream — page background */
```

### Branding
- Logo icon and text: `src/shared/navigation.js` (line 34-35)
- Footer text: `src/shared/footer.js`
- Page title: `index.html`

### Fonts
Google Fonts loaded in HTML `<head>`. Change the import URL and update `--font-heading`, `--font-body`, `--font-accent` in `shared.css`.

## Deployment

```bash
npm run build
```

The `dist/` folder is a static site. Deploy to GitHub Pages, Netlify, Vercel, or any static host.

## License

MIT
