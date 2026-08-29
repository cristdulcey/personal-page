# Personal page

Personal site built with [Astro](https://astro.build), deployed to GitHub Pages at [cristdulcey.com](https://cristdulcey.com).

## How it works

- **Astro** renders everything to static HTML at build time: fast loads and no unnecessary JavaScript.
- **GitHub Actions** (`.github/workflows/deploy.yml`) builds and publishes the site automatically on every push to `main`.
- **Custom domain**: `public/CNAME` tells GitHub Pages to serve the site at `cristdulcey.com`.
- **Two languages**: Spanish at `/` and English at `/en/`, with a language switcher in the navigation bar. Both pages are static routes rendered from the same layout.
- **Blog**: Markdown posts rendered with Astro content collections, at `/blog/` (Spanish) and `/en/blog/` (English).

## Local development

```bash
npm install
npm run dev      # local server at http://localhost:4321
npm run build    # builds the static site into dist/
npm run preview  # previews the build
```

## Project structure

| Path | Purpose |
| --- | --- |
| `src/i18n.ts` | All site copy in Spanish and English, plus shared profile data (social links, email, photo). Edit content here. |
| `src/styles/global.css` | All styles and animations. |
| `src/layouts/Base.astro` | Shared shell: head metadata, navigation, language switcher and footer. |
| `src/layouts/Home.astro` | Home page content, shared by both languages. |
| `src/layouts/BlogIndex.astro` / `BlogPost.astro` | Blog list and post pages, shared by both languages. |
| `src/content/blog/es/` and `en/` | Blog posts as Markdown files, one folder per language. |
| `src/content.config.ts` | Blog collection schema (frontmatter validation). |
| `src/pages/` | Routes: `/`, `/en/`, `/blog/`, `/blog/<slug>/`, `/en/blog/`, `/en/blog/<slug>/`. |
| `public/` | Static assets: profile photo, social icons, favicon and the `CNAME` file. |

## Writing blog posts

Create a Markdown file in `src/content/blog/es/` (Spanish) or `src/content/blog/en/` (English). The file name becomes the URL slug. Start it with this frontmatter:

```yaml
---
title: 'Post title'
description: 'Short summary shown in the blog list.'
date: 2026-08-29
tags: ['python', 'devops']   # optional
draft: true                  # optional: keeps the post unpublished
---
```

Write the body in Markdown below the frontmatter, push to `main`, and GitHub Actions publishes it. Posts are independent per language: translate a post by creating a file in the other language's folder.

## Editing content

Everything editable lives in `src/i18n.ts`:

- `profile`: name, email, photo and social links (language independent).
- `translations.es` / `translations.en`: navigation labels, hero copy, work areas, project cards, content cards, about text, skills and contact copy. Keep both languages in sync when you change one.

To add a third language, add its entry to `translations`, create `src/pages/<lang>/index.astro` rendering `<Home lang="<lang>" />`, and add the link to the switcher in `src/layouts/Home.astro`.

## GitHub Pages setup (already done, kept for reference)

1. Repository **Settings → Pages**: Source **GitHub Actions**, custom domain `cristdulcey.com`, Enforce HTTPS once the certificate is issued.
2. The default branch must be `main`: the `github-pages` deployment environment only accepts deployments from the default branch.
3. DNS points to GitHub Pages (A records to 185.199.108.153 / 109 / 110 / 111, or a CNAME to `cristdulcey.github.io`), so no DNS changes are needed when switching repositories.
