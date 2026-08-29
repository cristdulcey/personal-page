# Página personal

Sitio personal construido con [Astro](https://astro.build), pensado para desplegarse en GitHub Pages.

## Cómo funciona

- **Astro** genera HTML estático en el build: carga rápida y sin JavaScript innecesario.
- **GitHub Actions** (`.github/workflows/deploy.yml`) construye y publica el sitio automáticamente en cada push a `main`.
- El sitio se sirve en `https://cristdulcey.com` (el archivo `public/CNAME` declara el dominio propio ante GitHub Pages).

## Desarrollo local

```bash
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # genera el sitio estático en dist/
npm run preview  # previsualiza el build
```

## Personalizar el contenido

Todo el contenido editable está al inicio de `src/pages/index.astro`:

- `perfil`: nombre, rol, descripción y enlaces a redes.
- `proyectos`: tarjetas de la sección de proyectos (añade o quita objetos del arreglo).
- `habilidades`: lista de chips de la sección «Sobre mí».

Los estilos viven en el mismo archivo, dentro de la etiqueta `<style is:global>`.

## Activar GitHub Pages con el dominio propio (una sola vez)

1. En el repositorio que sirve el dominio actualmente (`littlelink`), ve a
   **Settings → Pages** y elimina el dominio personalizado (o desactiva Pages).
   GitHub solo permite que un repositorio reclame cada dominio.
2. En este repositorio, ve a **Settings → Pages** y en
   **Build and deployment → Source** elige **GitHub Actions**.
3. En la misma página, en **Custom domain**, escribe `cristdulcey.com`,
   guarda y marca **Enforce HTTPS** cuando la verificación termine.
4. Haz merge de esta rama a `main`: el workflow construirá y publicará el sitio.

El DNS del dominio no necesita cambios si ya apunta a GitHub Pages
(registros A a 185.199.108.153 / 109 / 110 / 111, o CNAME a
`cristdulcey.github.io`), que es el caso cuando el dominio ya funcionaba
con el repositorio anterior.
