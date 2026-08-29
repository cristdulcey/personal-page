---
title: 'Hello, world: how this blog works'
description: 'How to write and publish posts on this site using Markdown files, without touching code.'
date: 2026-08-29
tags: ['meta', 'astro']
---

Welcome to the blog! This is a sample post that doubles as a quick publishing guide.

## How to publish a post

1. Create a `.md` file in `src/content/blog/en/` (or in `es/` for the Spanish version).
2. Copy this header to the top of the file and adjust the values:

```yaml
---
title: 'Post title'
description: 'Short summary shown in the blog list.'
date: 2026-08-29
tags: ['python', 'devops']
---
```

3. Write the content in Markdown.
4. Push to `main` and GitHub Actions publishes it automatically.

If you want to keep a draft unpublished, add `draft: true` to the header.

## What you can use in the content

- **Bold**, _italics_ and `inline code`
- Links, lists, quotes and tables
- Images: store them in `public/` and link them as `/name.png`
- Code blocks with syntax highlighting:

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

> Quotes look like this. Handy for highlighting an idea.

That's it: one file per post, and the site does the rest.
