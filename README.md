# Página personal

Sitio personal construido con [Astro](https://astro.build), pensado para desplegarse en GitHub Pages.

## Cómo funciona

- **Astro** genera HTML estático en el build: carga rápida y sin JavaScript innecesario.
- **GitHub Actions** (`.github/workflows/deploy.yml`) construye y publica el sitio automáticamente en cada push a `main`.
- El sitio queda disponible en `https://cristdulcey.github.io/personal-page/`.

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

## Activar GitHub Pages (una sola vez)

1. En GitHub, ve a **Settings → Pages** del repositorio.
2. En **Build and deployment → Source**, elige **GitHub Actions**.
3. Haz merge de esta rama a `main` (o push directo): el workflow publicará el sitio.
