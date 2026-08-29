import { defineConfig } from 'astro/config';

// Configuración para GitHub Pages con dominio propio
// El sitio se publica en https://cristdulcey.com (el archivo public/CNAME
// le indica el dominio a GitHub Pages, y al usar dominio propio el sitio
// se sirve desde la raíz, sin prefijo de ruta).
export default defineConfig({
  site: 'https://cristdulcey.com',
});
