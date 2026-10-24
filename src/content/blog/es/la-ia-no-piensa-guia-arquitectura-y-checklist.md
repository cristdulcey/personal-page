---
title: "La IA no piensa: guía de arquitectura y checklist anti-alucinaciones"
description: "Por qué los LLM suenan como ingenieros senior mientras inventan APIs, el mapa de decisión de 4 niveles y la checklist práctica para tus code reviews."
date: 2026-10-24
tags: ["inteligencia-artificial", "arquitectura", "desarrollo-software", "llm", "code-review"]
draft: false
---

Le haces una pregunta técnica a un modelo de inteligencia artificial. Te responde con una seguridad pasmosa, una sintaxis impecable, nombres de variables elegantes y comentarios claros.

Copias el código, lo pegas en tu proyecto... y explota. Resulta que el método que te sugirió no existe en la versión de la librería que usas, o peor: se inventó un parámetro con un nombre perfectamente lógico que jamás existió en la documentación.

¿Te ha pasado?

Es la trampa más común cuando empezamos a programar con IA: **confundir elocuencia con comprensión**. El modelo no razona como tú y yo cuando diseñamos un sistema. No sabe lo que es un bug, no siente frustración cuando un build falla ni tiene un mapa mental de tu arquitectura.

Para construir software sólido con estas herramientas, necesitamos desmitificarlas. En este artículo te explico sin humo matemático qué está pasando realmente por dentro, el mapa de decisión para saber cuándo te conviene usar cada nivel de tecnología y la checklist práctica que uso a diario para auditar Pull Requests generados con IA.

---

## 1. La fórmula sin misterio: Qué hace realmente un LLM

En la literatura académica verás que un modelo autorregresivo se describe formalmente con una ecuación como esta:

$$rg\max_{w_t} P(w_t \mid w_1, w_2, \dots, w_{t-1})$$

Si nunca has sido fan de la notación matemática, esto puede sonar intimidante. Pero aterricémoslo a código y lógica cotidiana:

* **$w_1, w_2, \dots, w_{t-1}$:** Es el contexto acumulado (tu prompt, las reglas del sistema y todo lo que el modelo ya ha venido escribiendo palabra por palabra).
* **$P(w_t \mid \dots)$:** Es la distribución de probabilidad que el modelo calcula: *"Dado lo que llevamos escrito hasta aquí, ¿qué probabilidad tiene cada token del vocabulario de ser el siguiente?"*
* **$rg\max$:** Significa simplemente elegir el candidato con mayor probabilidad (o muestrear entre los mejores candidatos según la temperatura).

En pocas palabras: **el modelo es una máquina estadística que predice el siguiente fragmento de texto**. 

<div style="margin: 2rem 0; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
  <div style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a78bfa; margin-bottom: 1rem;">
    ▶ Cómo genera código un LLM paso a paso
  </div>
  <svg viewBox="0 0 800 220" width="100%" height="auto" style="display: block; font-family: system-ui, sans-serif;">
    <rect x="10" y="20" width="210" height="170" rx="10" fill="#181824" stroke="#7c3aed" stroke-width="1.5"/>
    <text x="25" y="50" fill="#a78bfa" font-size="14" font-weight="bold">1. Tu Contexto</text>
    <text x="25" y="75" fill="#9aa1b5" font-size="12">Prompt + Historial</text>
    <rect x="25" y="90" width="180" height="80" rx="6" fill="#0b0d14"/>
    <text x="35" y="115" fill="#38bdf8" font-size="11" font-family="monospace">def authenticate(user):</text>
    <text x="35" y="135" fill="#6ee7b7" font-size="11" font-family="monospace">    token = generate_jwt()</text>
    <text x="35" y="155" fill="#fbbf24" font-size="11" font-family="monospace">    return ...</text>

    <path d="M 225 105 L 285 105" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrow)"/>

    <rect x="295" y="20" width="210" height="170" rx="10" fill="#181824" stroke="#06b6d4" stroke-width="1.5"/>
    <text x="310" y="50" fill="#38bdf8" font-size="14" font-weight="bold">2. Red Neuronal</text>
    <text x="310" y="75" fill="#9aa1b5" font-size="12">Cálculo de probabilidades</text>
    <rect x="310" y="90" width="180" height="80" rx="6" fill="#0b0d14"/>
    <text x="320" y="112" fill="#e7e9f0" font-size="11">token (78%)</text>
    <rect x="385" y="104" width="90" height="8" rx="4" fill="#10b981"/>
    <text x="320" y="132" fill="#9aa1b5" font-size="11">response (14%)</text>
    <rect x="385" y="124" width="20" height="8" rx="4" fill="#64748b"/>
    <text x="320" y="152" fill="#9aa1b5" font-size="11">None (5%)</text>
    <rect x="385" y="144" width="8" height="8" rx="4" fill="#64748b"/>

    <path d="M 510 105 L 570 105" stroke="#06b6d4" stroke-width="2"/>

    <rect x="580" y="20" width="205" height="170" rx="10" fill="#181824" stroke="#10b981" stroke-width="1.5"/>
    <text x="595" y="50" fill="#6ee7b7" font-size="14" font-weight="bold">3. Salida de Token</text>
    <text x="595" y="75" fill="#9aa1b5" font-size="12">Añadido al contexto</text>
    <rect x="595" y="90" width="175" height="80" rx="6" fill="#0b0d14"/>
    <text x="610" y="125" fill="#10b981" font-size="14" font-family="monospace" font-weight="bold">"token"</text>
    <text x="610" y="150" fill="#9aa1b5" font-size="10">El ciclo se repite</text>
  </svg>
</div>

El modelo no consulta una base de datos de verdad ni ejecuta el intérprete mientras escribe. Simplemente asocia vectores de activación. Por eso, si una función inventada suena convincente en el contexto, te la va a entregar con una sonrisa.

---

## 2. Los cuatro niveles: Cuándo usar qué

Uno de los errores de diseño más caros hoy día es meter un LLM para tareas que se resuelven con código tradicional de toda la vida. Para ayudarte a elegir la herramienta correcta, divido las soluciones en cuatro niveles muy claros:

<div style="margin: 2rem 0; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
  <div style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #38bdf8; margin-bottom: 1rem;">
    ▶ Mapa de Decisión Arquitectónica
  </div>
  <svg viewBox="0 0 800 240" width="100%" height="auto" style="display: block; font-family: system-ui, sans-serif;">
    <g>
      <rect x="10" y="20" width="180" height="200" rx="8" fill="#141724" stroke="#475569" stroke-width="1"/>
      <rect x="10" y="20" width="180" height="36" rx="8" fill="#1e293b"/>
      <text x="25" y="43" fill="#e2e8f0" font-size="13" font-weight="bold">Nivel 1: Clásico</text>
      <text x="25" y="80" fill="#94a3b8" font-size="11" font-weight="bold">Tipo de Lógica:</text>
      <text x="25" y="98" fill="#cbd5e1" font-size="11">Determinista (if/else, SQL)</text>
      <text x="25" y="130" fill="#94a3b8" font-size="11" font-weight="bold">Ideal para:</text>
      <text x="25" y="148" fill="#cbd5e1" font-size="11">Cálculo de impuestos,</text>
      <text x="25" y="166" fill="#cbd5e1" font-size="11">validación de esquemas,</text>
      <text x="25" y="184" fill="#cbd5e1" font-size="11">estados financieros.</text>
    </g>

    <g>
      <rect x="210" y="20" width="180" height="200" rx="8" fill="#141724" stroke="#0284c7" stroke-width="1"/>
      <rect x="210" y="20" width="180" height="36" rx="8" fill="#0369a1"/>
      <text x="225" y="43" fill="#f0f9ff" font-size="13" font-weight="bold">Nivel 2: ML Tradicional</text>
      <text x="225" y="80" fill="#7dd3fc" font-size="11" font-weight="bold">Tipo de Lógica:</text>
      <text x="225" y="98" fill="#e0f2fe" font-size="11">Clasificación / Regresión</text>
      <text x="225" y="130" fill="#7dd3fc" font-size="11" font-weight="bold">Ideal para:</text>
      <text x="225" y="148" fill="#e0f2fe" font-size="11">Detección de fraude,</text>
      <text x="225" y="166" fill="#e0f2fe" font-size="11">scoring crediticio,</text>
      <text x="225" y="184" fill="#e0f2fe" font-size="11">recomendadores rápidos.</text>
    </g>

    <g>
      <rect x="410" y="20" width="180" height="200" rx="8" fill="#141724" stroke="#7c3aed" stroke-width="1"/>
      <rect x="410" y="20" width="180" height="36" rx="8" fill="#6d28d9"/>
      <text x="425" y="43" fill="#f5f3ff" font-size="13" font-weight="bold">Nivel 3: LLM / GenAI</text>
      <text x="425" y="80" fill="#c4b5fd" font-size="11" font-weight="bold">Tipo de Lógica:</text>
      <text x="425" y="98" fill="#ede9fe" font-size="11">Comprensión no estructurada</text>
      <text x="425" y="130" fill="#c4b5fd" font-size="11" font-weight="bold">Ideal para:</text>
      <text x="425" y="148" fill="#ede9fe" font-size="11">Extracción de datos,</text>
      <text x="425" y="166" fill="#ede9fe" font-size="11">resumen de documentos,</text>
      <text x="425" y="184" fill="#ede9fe" font-size="11">generación de borradores.</text>
    </g>

    <g>
      <rect x="610" y="20" width="180" height="200" rx="8" fill="#141724" stroke="#059669" stroke-width="1"/>
      <rect x="610" y="20" width="180" height="36" rx="8" fill="#047857"/>
      <text x="625" y="43" fill="#ecfdf5" font-size="13" font-weight="bold">Nivel 4: Agentes</text>
      <text x="625" y="80" fill="#6ee7b7" font-size="11" font-weight="bold">Tipo de Lógica:</text>
      <text x="625" y="98" fill="#d1fae5" font-size="11">Razonamiento en loop + Tools</text>
      <text x="625" y="130" fill="#6ee7b7" font-size="11" font-weight="bold">Ideal para:</text>
      <text x="625" y="148" fill="#d1fae5" font-size="11">Workflows autónomos,</text>
      <text x="625" y="166" fill="#d1fae5" font-size="11">diagnóstico y refactor,</text>
      <text x="625" y="184" fill="#d1fae5" font-size="11">orquestación multi-herramienta.</text>
    </g>
  </svg>
</div>

Si tienes reglas de negocio fijas, **usa código tradicional**. Ahorras latencia, miles de dólares en tokens y te evitas sorpresas no deterministas en producción.

---

## 3. Los tres fallos silenciosos en producción

Cuando un equipo empieza a incorporar asistentes de código a escala, suelen aparecer tres tropiezos recurrentes:

### 1. La alucinación sintácticamente válida
El código pasa el linter de TypeScript, compila sin quejas y parece escrito por un desarrollador senior. Pero invoca una API que fue deprecada hace dos años o asume que un servicio devuelve un payload que nunca ha devuelto. Es el fallo más peligroso porque engaña fácilmente al revisor en el pull request.

### 2. La ceguera de contexto en repositorios grandes
Por más que la ventana del modelo sea de 1 o 2 millones de tokens, la atención no es uniforme. Si le pasas diez archivos de golpe, el modelo tiende a fijarse en el principio y en el final, ignorando edge cases críticos del medio.

### 3. La delegación prematura
Decirle al agente: *"Arregla el bug del carrito de compras"* sin darle pistas de telemetría ni logs. El agente intentará resolverlo a ciegas modificando cosas que no tenía que tocar. Tú debes mantener el rol de arquitecto y darle la hipótesis acotada.

---

## 4. Checklist Anti-Alucinaciones para tus Code Reviews

Esta es la lista de chequeo práctica que te sugiero tener a mano antes de darle *Merge* a cualquier PR que contenga código asistido por IA:

* [ ] **1. Verificación de APIs y Librerías Externas:** ¿Los métodos, parámetros y firmas invocados existen en la versión exacta fijada en tu `package.json` o `requirements.txt`?
* [ ] **2. Validación Determinista:** ¿El código incluye tests unitarios reales que fallaban antes del fix y que ahora pasan de forma reproducible?
* [ ] **3. Cero Efectos Secundarios Ocultos:** ¿El diff se limita estrictamente al alcance de la tarea, o el modelo aprovechó para "refactorizar" métodos adyacentes sin pedirlo?
* [ ] **4. Manejo de Errores y Timeouts:** ¿Qué pasa si el endpoint falla con un 502 o tarda 30 segundos? Los LLM tienden a pintar solo el *happy path*.
* [ ] **5. Seguridad y Permisos:** ¿El código respeta el control de acceso basado en roles (RBAC) y la sanitización de inputs, o asume que quien llama está autenticado?
* [ ] **6. Criterio de Arquitectura:** ¿Esto soluciona la causa raíz del problema, o simplemente es un parche cosmético para silenciar la excepción?

---

## ¿Qué sigue?

En el **Episodio 2** de la serie en YouTube vamos a ver de dónde salió todo esto: setenta años de tropiezos, los inviernos de la inteligencia artificial y el paper de Google de 2017 (*Attention Is All You Need*) que cambió la industria para siempre.

Si tienes alguna regla o filtro personal que te haya salvado de un bug en producción, compártela en los comentarios del video. ¡Nos vemos en el próximo!
