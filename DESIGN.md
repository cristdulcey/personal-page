# Design System & Visual Authority Guidelines

**Project:** Cristian Dulcey — Personal Portfolio & Technical Authority  
**Primary Surface Mode:** Persuade & Experience (Editorial Systems Engineering Showcase)  
**Standard Compliance:** WCAG AAA/AA Contrast, Zero AI-Template Tells

---

## 1. Core Purpose & Brand Identity

- **Positioning**: Lead Systems Architect & Infrastructure Engineer with sovereign-scale and high-concurrency production credentials (e.g., Chivo Wallet, Proyecto Fénix).
- **Tone**: Authoritative, editorial, rigorous, and restrained. Replaces generalist freelancer clichés and amateur micro-donations with high-conviction engineering gravitas.
- **Visual Principle**: Clean institutional typography, grounded portraits, and content-first case studies rather than decorative gimmicks.

---

## 2. Typography

- **Primary Typeface**: `Public Sans` (Google Fonts preconnected, system fallback: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`).
- **Monospace Stack**: `ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace`.
- **Typographic Scale**:
  - Hero Headline: `clamp(2.5rem, 7vw, 4.75rem)`, font-weight `800`, letter-spacing `-0.03em`.
  - Case Study Title: `clamp(2rem, 5vw, 3.25rem)`, font-weight `800`, letter-spacing `-0.03em`.
  - Section Headings (`h2`): `clamp(1.75rem, 4vw, 2.5rem)`, font-weight `800`, letter-spacing `-0.02em`.
  - Body Text: `1rem` (line-height `1.65`).

---

## 3. Color Tokens & Theme Architecture

Strictly calibrated to exceed WCAG AA requirements and avoid saturated neon/AI palette combinations:

```css
:root {
  --bg: #090a0f;                 /* Deep Obsidian ground */
  --surface: rgba(255, 255, 255, 0.035);
  --surface-hover: rgba(255, 255, 255, 0.065);
  --border: rgba(255, 255, 255, 0.09);
  --border-strong: rgba(255, 255, 255, 0.18);
  --text: #e6e8f0;               /* Primary body text (14.2:1 contrast against bg) */
  --text-bright: #ffffff;        /* Headings & key accents */
  --text-dim: #9499ad;           /* Secondary text & descriptions (6.1:1 contrast) */
  --accent-1: #2563eb;           /* Cobalt Blue primary action */
  --accent-2: #0284c7;           /* Slate Sky secondary */
  --accent-solid: #60a5fa;       /* High-contrast accessible link ink (8.2:1 contrast) */
  --radius: 12px;
  --shadow-soft: 0 1px 3px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.35);
  --shadow-high: 0 4px 12px rgba(0, 0, 0, 0.5), 0 20px 48px rgba(0, 0, 0, 0.5);
}
```

---

## 4. Hard Quality Bans (Anti-Patterns to Never Introduce)

1. **No Gradient Text (`-webkit-background-clip: text`)**: Text must always render in solid, high-contrast accessible color.
2. **No Side-Tab Accent Bars (`3px solid var(--accent)`)**: Cards and list items use full border containers and subtle hover surface changes instead of vertical left-border stripes.
3. **No Chromatic Glow Halos**: Shadows must use neutral black elevation opacities (`rgba(0, 0, 0, 0.4)`), never colored blur halos on dark grounds.
4. **No Continuous Float Animations**: Hero avatars and cards stay anchored to preserve reading focus.
5. **No Infinite Scroll-Trigger Toggle**: `IntersectionObserver` must trigger `.classList.add('visible')` and immediately call `observer.unobserve(entry.target)` to eliminate jitter.
6. **No Tip Jars**: No Buy Me a Coffee or PayPal widgets; communication centers on advisory and high-impact engineering collaboration.

---

## 5. Architectural Case Study Pattern

Flagship projects must provide an on-site route (`/projects/<slug>` and `/en/projects/<slug>`) rendering:
1. **Badges**: Entity/Client name and Specific Technical Role.
2. **Metrics Strip**: Key quantifiable architectural achievements (e.g. `300+ Microservices`, `Nation-State Scale`).
3. **Structured Content**: Context & Challenge, System Architecture & Role, Key Technical Decisions, and Measurable Impact.
4. **Outbound Link**: External live URL is provided only as a secondary reference (`↗`), keeping the visitor anchored on-site.
