import { defineConfig } from 'astro/config';

// GitHub Pages configuration with a custom domain.
// The site is published at https://cristdulcey.com (public/CNAME tells
// GitHub Pages which domain to claim, and with a custom domain the site
// is served from the root, without a path prefix).
//
// Languages: Spanish is served at / and English at /en/. Both routes are
// plain static pages rendered from src/layouts/Home.astro with the
// translations defined in src/i18n.ts.
export default defineConfig({
  site: 'https://cristdulcey.com',
});
