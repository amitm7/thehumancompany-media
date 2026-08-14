# The Human Company — website + Keystatic CMS

A content-driven homepage built with **Astro**, editable through **Keystatic** —
a free, open-source admin panel. Every piece of text and every list on the site
is editable through friendly forms at `/keystatic`. No code required to change content.

---

## For the person editing content (non-technical)

You never touch code. You use a simple admin panel.

**1. Someone starts the site once** (a developer, or you following the section below).
Once it's running, open your browser to:

```
http://localhost:4321/keystatic
```

**2. You'll see a panel titled "The Human Company".**
Click **Homepage** in the left sidebar. Every part of the site is a labelled box:

- *Hero · Headline*, *Hero · Subtext*, and so on — just type into the box.
- *Headline highlight* fields are the words shown in italic red on the site.
- Lists (Beliefs, Pillars, Scrolling words, Facts) have an **Add** button to add a
  new item, a **trash icon** to remove one, and a **drag handle** (⠿) to reorder.

**3. Click _Save_ (top-right).**
Your changes are written straight into the site. In local preview the page updates
immediately. Once the site is deployed (see below), Save publishes to the live site
automatically within about a minute.

That's the whole job — type, add/reorder, Save.

---

## For a developer — run it locally (preview mode)

Requirements: **Node 18+**.

```bash
npm install
npm run dev
```

Then open:

- **Website:** http://localhost:4321
- **Admin panel:** http://localhost:4321/keystatic

In this mode (`storage: { kind: 'local' }` in `keystatic.config.ts`), edits save to
JSON files under `src/content/`. Great for trying it out. Content edits are just file
changes you can commit to git.

Build a production version:

```bash
npm run build
npm run preview
```

---

## Going live so a team can edit in the cloud

The site is `output: 'hybrid'` with the Node adapter, so it runs on any Node host
(and deploys cleanly to **Netlify**, **Vercel**, or **Cloudflare** with the matching
Astro adapter). Two steps to give non-technical teammates cloud editing:

1. **Put this repo on GitHub.**
2. **Switch Keystatic storage** in `keystatic.config.ts` from local to either:
   - **GitHub mode** — `storage: { kind: 'github', repo: 'owner/repo' }`. Editors log
     in with a free GitHub account; Save commits to the repo and the host redeploys.
   - **Keystatic Cloud** — `storage: { kind: 'cloud' }` plus a `cloud.project` entry.
     Editors log in with email (no GitHub account needed). Recommended for a
     non-technical team. Set it up at https://keystatic.cloud

Full docs: https://keystatic.com/docs

---

## Where things live

```
keystatic.config.ts        The editable fields (the CMS schema)
src/content/home/index.json Current homepage content (what the editor changes)
src/pages/index.astro       The homepage template (design + layout)
src/styles/global.css       All styling (colours, type, spacing, motion)
src/components/Mark.astro    The HH heart logo (inline SVG)
src/pages/keystatic/…        The admin panel route
src/pages/api/keystatic/…    The admin panel's server API
```

## Changing the design vs the content

- **Content** (words, list items, links, email) → the editor changes these at
  `/keystatic`. No developer needed.
- **Design** (colours, fonts, spacing, adding a whole new section) → edit
  `src/styles/global.css` and `src/pages/index.astro`. To add a new *editable*
  section, add fields in `keystatic.config.ts` too.

## Notes

- The contact email is currently `hello@thehumancompany.com` (placeholder) — change it
  in the admin panel under *Contact* and *Footer*, or in `src/content/home/index.json`.
- Ventures are intentionally kept abstract; there are no named sub-brands.
