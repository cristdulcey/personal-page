---
target: src/pages/index.astro
total_score: 20
max_score: 28
na_heuristics: 7,9,10
p0_count: 1
p1_count: 1
target_identity: "file:/Users/cristiandulcey/Work/personal/personal-page/src/pages/index.astro"
target_fingerprint: "sha256:621f283c69b76f0e5ce1f9d5422d66e7f3411010406a98ffbb595640e758682a"
target_path: /Users/cristiandulcey/Work/personal/personal-page/src/pages/index.astro
timestamp: 2026-10-24T05-35-14Z
slug: src-pages-index-astro
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Nav sticky presente; falta indicador activo (scrollspy) en navegación larga. |
| 2 | Match System / Real World | 3 | Taxonomía informal tipo blog personal ("Qué hago", "Mi contenido") en vez de autoridad técnica ("Práctica", "Sistemas"). |
| 3 | User Control and Freedom | 2 | Tarjetas de proyectos expulsan al usuario fuera del sitio (o a Instagram) sin permitir explorar la arquitectura técnica en el sitio. |
| 4 | Consistency and Standards | 3 | Modelo de interacción mixto: enlaces que anclan, otros que abren sitios de producción externos y otros que van a redes. |
| 5 | Error Prevention | 4 | Presentación limpia, enlaces externos y mailto válidos sin ambigüedades. |
| 6 | Recognition Rather Than Recall | 3 | El carrusel horizontal oculta el 50% de los proyectos en escritorio, obligando a usar flechas para descubrir el trabajo. |
| 7 | Flexibility and Efficiency | n/a | Superficie de portafolio/presentación sin flujos repetitivos. |
| 8 | Aesthetic and Minimalist Design | 2 | Ruido visual por paleta neón IA (púrpura/cian), emojis en habilidades y un tip jar ("Cómprame un café"/PayPal) que destruye autoridad. |
| 9 | Error Recovery | n/a | Superficie informativa estática sin formularios ni estados transaccionales. |
| 10 | Help and Documentation | n/a | Navegación lineal de portafolio sin necesidad de documentación externa. |
| **Total** | | **20/28** | **C+ (Moderado)** |

#### Design Specificity Verdict

**LLM assessment**: El diseño actual tiene una crisis de identidad profunda: Cristian Dulcey cuenta con credenciales técnicas del 1% superior (infraestructura sovereign para Chivo Wallet y Bitcoin legal tender, plataforma de tránsito masivo Fénix en Bogotá), pero la interfaz lo empaqueta como un freelancer junior de Web3 de 2022 o un creador de tutoriales buscando propinas. La composición carece de peso editorial y gravitas arquitectónica.

**Deterministic scan**: El escaneo determinista arrojó 5 advertencias de anti-patrones de template en código fuente (`src/styles/global.css`: 3x `gradient-text`, 2x `side-tab`) más 4 patrones confirmados en DOM: paleta neón púrpura/cian sobre obsidian (`ai-color-palette`), eyebrow chip superior (`HOLA, SOY`), glow shadows coloreadas y fallo de contraste WCAG AA (2.4:1 en texto blanco sobre cian en botones principales).

**Visual overlays**: Análisis determinista y DOM completado; no se activó overlay interactivo en navegador headless.

#### Overall Impression
Existe un contraste violento entre la calidad monumental de los sistemas construidos (adopción nacional de Bitcoin, movilidad urbana) y el empaque visual que los presenta (gradientes brillantes de plantilla, emojis de colores, foto circular flotante y botón de donación de PayPal). La gran oportunidad es transformar este sitio de un "portafolio de freelancer/youtuber" a un **showcase editorial de liderazgo arquitectónico**.

#### What's Working
1. **Calibre extraordinario de los proyectos reales**: Trabajar en infraestructura a escala soberana y municipal es una ventaja competitiva masiva que casi ningún desarrollador tiene.
2. **Cimiento técnico liviano y accesible**: Implementado en Astro sin JavaScript innecesario en el cliente, respetando `prefers-reduced-motion` y con soporte bilingüe nativo.
3. **Vocación pública de comunicación**: La presencia técnica activa demuestra capacidad de comunicar y enseñar conceptos complejos.

#### Priority Issues
- **[P0] Fuga de autoridad: Cero casos de estudio arquitectónicos en el sitio**
  - *Why it matters*: Un líder técnico o arquitecto es evaluado por su razonamiento técnico, métricas de escala, tolerancia a fallos y trade-offs. Redirigir a `chivowallet.com` o a un perfil de Instagram hace que el visitante abandone tu web sin entender tu aporte real.
  - *Fix*: Crear rutas de casos de estudio dentro del sitio (`/projects/chivo`, `/projects/fenix`) con diagramas de arquitectura, métricas de concurrencia y lecciones aprendidas.
  - *Suggested command*: `/impeccable shape`
- **[P1] Destructor de credibilidad: Links de propinas ("Cómprame un café" / PayPal)**
  - *Why it matters*: Un arquitecto senior o consultor de sistemas de alto impacto no pide propinas de 3 dólares en PayPal. Destruye inmediatamente la percepción de seniority ejecutiva.
  - *Fix*: Eliminar por completo el módulo de apoyo/donación y reemplazarlo por puntos de contacto de alto valor (asesoría técnica, conferencias, consultoría).
  - *Suggested command*: `/impeccable distill`
- **[P2] Clichés estéticos de template AI y fallo de contraste WCAG**
  - *Why it matters*: La paleta púrpura/cian brillante, el texto con animación de brillo (`gradient-text`), los bordes laterales de tarjeta (`side-tab`) y el contraste insuficiente (2.4:1) restan seriedad y accesibilidad.
  - *Fix*: Adoptar una tipografía editorial distintiva (ej. Geist / Plus Jakarta Sans + JetBrains Mono), eliminar gradientes en texto a favor de color sólido y garantizar ratios accesibles.
  - *Suggested command*: `/impeccable polish`
- **[P3] Copywriting pasivo y dispersión de habilidades**
  - *Why it matters*: "Hola, soy", "creador de contenido" y listas con emojis (🤖, 🐍, 📱) proyectan generalismo junior en lugar de dominio de sistemas complejos.
  - *Fix*: Reencuadrar la narrativa hacia liderazgo técnico: arquitectura de infraestructura en la nube, backends de alta concurrencia y plataformas digitales a escala.
  - *Suggested command*: `/impeccable clarify`

#### Persona Red Flags
- **VP de Ingeniería / Staff+ Hiring Manager**:
  - Ve "creador de contenido" antes de ver el seniority de ingeniería.
  - Las áreas de trabajo usan emojis y categorías básicas ("Backend con Python").
  - Chivo Wallet se menciona en 2 frases sin diagrama de arquitectura ni métricas de QPS/uptime.
  - El botón de PayPal al final liquida cualquier aura de liderazgo de alto nivel.
- **Líder Técnico / Arquitecto que busca un referente**:
  - Al hacer clic en los proyectos emblemáticos, es expulsado a sitios de marketing de terceros o Instagram en vez de encontrar lecciones arquitectónicas.
  - El contenido de TikTok se presenta con la misma jerarquía que artículos técnicos profundos.

#### Minor Observations
- **Fatiga de animación al scroll**: `IntersectionObserver` re-ejecuta animaciones cada vez que el usuario sube o baja (`classList.toggle('visible')`). Debería animar una sola vez (`unobserve`).
- **Fricción del carrusel en escritorio**: Esconder 2 de los 4 proyectos detrás de flechas horizontales reduce la visibilidad de tu mejor trabajo; un grid 2x2 o lista editorial es mucho más directo.

#### Questions to Consider
- *Si el CTO de una fintech internacional entra a tu web hoy, ¿te percibe como un arquitecto estratégico de sistemas al que debe contratar por decenas de miles de dólares, o como un desarrollador junior buscando donaciones para un café?*
- *¿Por qué Chivo y Fénix —proyectos que el 99.9% de los devs jamás tocará— son tarjetas de 2 líneas que expulsan al usuario en vez de ser piezas centrales de ingeniería explicadas a fondo?*
