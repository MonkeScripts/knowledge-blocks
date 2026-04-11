---
name: knowledge-block
description: >
  Create or update a knowledge block. Accepts data from URLs,
  local HTML files, Notion exports, or raw text. Reads the content, checks for existing
  blocks, then either creates a new block or suggests merging into an existing one.
  Use: /knowledge-block <source>
---

You are creating or updating a knowledge block in the Knowledge Blocks system.

## What is a knowledge block

A knowledge block is a **deep reference document on one specific topic**. It is NOT a skills chart or proficiency list. A block is something you open, read the full writeup, check related sources, and use in future projects. Think of it as a personal wiki entry.

Examples of good block topics: "Zenoh", "CAN Bus Protocol", "PX4 Offboard Control", "Docker Multi-Stage Builds"
Examples of bad block topics: "Embedded Protocols" (too broad), "Languages" (category, not a topic), "Skills Overview" (not a reference)

Blocks are also nodes in a **topic graph** rendered on the index page. Edges come from an explicit `connections: ['other-slug', ...]` array on each block in `src/shared/data.js` (see `buildGraph` in `src/shared/graph.js`). Whenever you create a block that relates to existing topics, you MUST wire it into the graph — otherwise the new node will appear isolated.

## Step 1 — Read the source data

The user will provide one or more of:
- A URL (fetch it with WebFetch)
- A local file path (read it with Read)
- A Notion export or HTML file (read it)
- Raw text or pasted content

Read all provided sources. Understand what the topic is about and extract the key knowledge. If uncertain on the level of detail the user wants, always ask for further clarification.

## Step 2 — Check existing blocks

Read `src/shared/data.js` and look at the `knowledgeBlocks` array in `PORTFOLIO_DATA`. For each existing block, check:
- **Exact match**: Does a block with the same topic already exist? (e.g., user provides Zenoh data and a `zenoh` block exists)
- **Related topic**: Is the new content closely related to an existing block? (e.g., user provides "MAVROS plugins" data and a `px4-autopilot` block exists)
- **New topic**: No existing block covers this

## Step 3 — Act based on the result

### 3a. New block — no overlap with existing blocks

Create all of the following:

**1. Resource HTML file** at `public/resources/{slug}.html`

This is the full detailed guide content. It must use the following HTML class structure so that the CSS (`block-detail.css`) can style it. **Do not include any `<style>` tags or inline styles** — all styling comes from the design system.

Required HTML structure:

```html
<!-- Hero section -->
<div class="hero">
  <h1>Topic Title<br>Subtitle Line</h1>
  <div class="subtitle">// short tagline describing coverage</div>
</div>

<div class="container">

<!-- Optional: internal navigation pills linking to sections below -->
<div class="nav">
  <a href="#section-id">section name</a>
  ...
</div>

<!-- Sections — one per major topic area -->
<div class="section" id="section-id">
  <div class="section-header">
    <span class="section-number">01</span>
    <h2>Section Title</h2>
  </div>
  <p class="prose">Explanatory paragraph. Use <strong>bold</strong> for key terms and <code>inline code</code> for technical references.</p>

  <!-- Cards — for listing multiple related concepts side by side -->
  <div class="card-grid">
    <div class="card">
      <h4>Card Title</h4>
      <p>Card description. Use <code>code</code> for values and parameters.</p>
    </div>
  </div>

  <!-- Config/code blocks -->
  <div class="cfg">
    <div class="cfg-head">label for this code block</div>
    <pre>code content here
use span classes for syntax highlighting:
  <span class="c">comment</span>
  <span class="k">key/keyword</span>
  <span class="s">string value</span>
  <span class="n">number</span>
  <span class="b">boolean</span></pre>
  </div>

  <!-- Tips/callouts -->
  <div class="tip"><strong>Tip:</strong> Important note or practical advice.</div>

  <!-- Collapsible examples -->
  <details>
    <summary>Example: description</summary>
    <div class="cfg">
      <div class="cfg-head">label</div>
      <pre>code here</pre>
    </div>
  </details>
</div>

<!-- Divider before use cases -->
<div class="divider"></div>

<!-- Use cases — real-world applications of this knowledge -->
<div class="section" id="usecases">
  <div class="section-header">
    <span class="section-number">N</span>
    <h2>Real-World Use Cases</h2>
  </div>

  <div class="uc">
    <div class="uc-head">
      <div class="uc-icon">emoji</div>
      <div>
        <div class="uc-title">Use Case Title</div>
        <div class="uc-sub">domain / context / application area</div>
      </div>
    </div>
    <div class="uc-body">
      <div class="tags">
        <span class="tag t1">tag</span>  <!-- t1 through t6 for color variants -->
      </div>
      <p>Description of the use case and how this knowledge applies.</p>
      <div class="cfg">
        <div class="cfg-head">example config/code</div>
        <pre>relevant code snippet</pre>
      </div>
    </div>
  </div>
</div>

</div> <!-- end .container -->
```

Tag color classes: `t1` (purple/primary), `t2` (light purple), `t3` (pink/accent), `t4` (green), `t5` (gold/secondary), `t6` (muted/neutral).

**2. Block entry page** at `blocks/{slug}.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{Title} | Knowledge Blocks</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Caveat:wght@400;600&family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
</head>
<body>
  <nav class="nav" id="nav"></nav>
  <main id="blockDetail" data-block-slug="{slug}"></main>
  <footer class="footer" id="footer"></footer>
  <script type="module" src="../src/pages/block-detail.js"></script>
</body>
</html>
```

**3. Data entry** in `src/shared/data.js` — add to the `knowledgeBlocks` array:

```js
{
  slug: '{slug}',
  title: '{Title}',
  icon: '{emoji}',
  description: '{one-line summary of what this block covers}',
  tags: ['{tag1}', '{tag2}', ...],
  connections: ['{related-slug-1}', '{related-slug-2}'], // omit if no related blocks
  sources: [
    { title: '{source name}', url: '{url}' },
    ...
  ]
}
```

- `slug`: lowercase, hyphenated, used in URLs and file names
- `icon`: single emoji that represents the topic
- `description`: one sentence, specific, tells the reader what they'll learn
- `tags`: 2-5 lowercase keywords for the topic
- `connections`: slugs of existing blocks this topic is related to. Drives the topic graph on the index page. Omit the field entirely if there are no related blocks (do not use an empty array).
- `sources`: include ALL original URLs the user provided, plus any key documentation links discovered during reading

**4. Vite config** — add entry to `rollupOptions.input` in `vite.config.js`:

```js
'block-{slug}': resolve(root, 'blocks/{slug}.html'),
```

### 3b. New block that is related to an existing block

Do everything in 3a, plus wire it into the topic graph:

1. Tell the user which existing block(s) are related and why.
2. On the **new** block's data entry, set `connections: ['related-slug', ...]` listing every related existing slug.
3. The graph in `src/shared/graph.js` deduplicates edges by sorted slug pair, so a one-sided declaration is enough to draw the edge. Prefer declaring the connection on the new block only — leave existing blocks untouched unless the user explicitly asks to update them.
4. Mention to the user that they can also add narrative cross-references inside the writeup HTML if they want.

### 3c. Add-on to an existing block

Do NOT create new files. Instead:
- Show the user what new content the source data contains
- Show the existing block's current resource file content (read `public/resources/{slug}.html`)
- Propose specific edits: new sections to add, existing sections to expand, new use cases, new config examples
- Ask the user to confirm before making edits
- Apply edits to `public/resources/{slug}.html`
- If there are new source URLs, add them to the block's `sources` array in `data.js`

## Content quality rules

When writing the resource HTML:

1. **Be comprehensive** — include ALL the detail from the source. Do not summarize or skip sections. If the source has 10 config options, document all 10.
2. **Be practical** — every section should answer "when would I use this?" Include real-world use cases with actual config/code snippets.
3. **Use the HTML classes exactly as documented above** — the CSS depends on these class names. No custom classes, no inline styles.
4. **Syntax highlighting** — use `<span class="c/k/s/n/b">` inside `<pre>` tags for comments, keys, strings, numbers, and booleans.
5. **Structure with sections** — number them sequentially with `.section-number`. Each section covers one concept.
6. **Include tips** — practical advice in `.tip` blocks. Things that would bite someone in production.
7. **Include collapsible examples** — use `<details>` for longer config examples so the page stays scannable.
8. **Include use cases** — at least 2-3 real-world scenarios showing how this knowledge applies to actual systems.

## After creating the block

Run `npm run build` to verify everything compiles. Report any errors and fix them.

Tell the user:
- What was created and where
- How to view it: `npm run dev` then visit the block page URL
- If related blocks exist, mention them