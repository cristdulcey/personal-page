---
title: 'Hola, mundo: así funciona este blog'
description: 'Cómo escribir y publicar artículos en este sitio usando archivos Markdown, sin tocar código.'
date: 2026-08-29
tags: ['meta', 'astro']
---

¡Bienvenido al blog! Este es un artículo de ejemplo que también sirve de guía rápida para publicar.

## Cómo publicar un artículo

1. Crea un archivo `.md` en `src/content/blog/es/` (o en `en/` para la versión en inglés).
2. Copia este encabezado al inicio del archivo y ajusta los datos:

```yaml
---
title: 'Título del artículo'
description: 'Resumen corto que aparece en la lista del blog.'
date: 2026-08-29
tags: ['python', 'devops']
---
```

3. Escribe el contenido en Markdown.
4. Haz push a `main` y GitHub Actions lo publica automáticamente.

Si quieres guardar un borrador sin publicarlo, añade `draft: true` al encabezado.

## Qué puedes usar en el contenido

- **Negritas**, _cursivas_ y `código en línea`
- Enlaces, listas, citas y tablas
- Imágenes: guárdalas en `public/` y enlázalas como `/nombre.png`
- Bloques de código con resaltado de sintaxis:

```python
def saludar(nombre: str) -> str:
    return f"¡Hola, {nombre}!"
```

> Las citas se ven así. Útiles para destacar una idea.

Eso es todo: un archivo por artículo, y el resto lo hace el sitio.
