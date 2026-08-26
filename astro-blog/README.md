# Darrell TW Blog

This repository contains the Darrell TW blog during its Hexo-to-Astro migration.

## Local commands

Run commands from `astro-blog/`:

```bash
npm run build
npm run preview -- --port 4322
```

`npm run build` runs Astro type checking, builds the site, and indexes the generated output.
`npm run preview -- --port 4322` serves the local production preview on port 4322.

## Project layout

- `src/pages/`: Astro and Markdown routes
- `src/data/blog/`: blog posts
- `src/components/` and `src/layouts/`: shared UI and page layouts
- `public/`: static files and standalone pages
- `public/links/`, `public/n8n-expert/`, `public/tools/`, and `public/gallery/`: migrated static content and resources

## Upstream attribution

This project is based on [AstroPaper](https://github.com/satnaing/astro-paper). AstroPaper is authored by Sat Naing and contributors; see [LICENSE](LICENSE) for the license and copyright notice.
