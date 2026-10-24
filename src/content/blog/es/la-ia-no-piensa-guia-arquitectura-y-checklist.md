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

Para construir software sólido con estas herramientas, necesitamos desmitificarlas. En este artículo te explico sin humo qué está pasando realmente por dentro, el mapa de decisión para saber cuándo te conviene usar cada nivel de tecnología y la checklist práctica que uso a diario para auditar Pull Requests generados con IA.

---

## 1. La fórmula sin misterio: Qué hace realmente un LLM

En la literatura académica verás que un modelo autorregresivo se describe formalmente con una ecuación como esta:

205991rg\max_{w_t} P(w_t \mid w_1, w_2, \dots, w_{t-1})205991

Si nunca has sido fan de la notación matemática, esto puede sonar intimidante. Pero aterricémoslo a código y lógica cotidiana:

* **, w_2, \dots, w_{t-1}$:** Es el contexto acumulado (tu prompt, las reglas del sistema y todo lo que el modelo ya ha venido escribiendo palabra por palabra).
* **(w_t \mid \dots)$:** Es la distribución de probabilidad que el modelo calcula: *"Dado lo que llevamos escrito hasta aquí, ¿qué probabilidad tiene cada token del vocabulario de ser el siguiente?"*
* **$rg\max$:** Significa simplemente elegir el candidato con mayor probabilidad (o muestrear entre los mejores candidatos según la temperatura).

En pocas palabras: **el modelo es una máquina estadística que predice el siguiente fragmento de texto**.

![Cómo genera código un LLM paso a paso](/blog/token-generation-flow.svg)

El modelo no consulta una base de datos de verdad ni ejecuta el intérprete mientras escribe. Simplemente asocia vectores de activación. Por eso, si una función inventada suena convincente en el contexto, te la va a entregar con una sonrisa.

---

## 2. Los cuatro niveles: Cuándo usar qué

Uno de los errores de diseño más caros hoy día es meter un LLM para tareas que se resuelven con código tradicional de toda la vida. Para ayudarte a elegir la herramienta correcta, divido las soluciones en cuatro niveles muy claros:

![Mapa de Decisión Arquitectónica](/blog/decision-map-4-levels.svg)

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

* [ ] **1. Verificación de APIs y Librerías Externas:** ¿Los métodos, parámetros y firmas invocados existen en la versión exacta fijada en tu  o ?
* [ ] **2. Validación Determinista:** ¿El código incluye tests unitarios reales que fallaban antes del fix y que ahora pasan de forma reproducible?
* [ ] **3. Cero Efectos Secundarios Ocultos:** ¿El diff se limita estrictamente al alcance de la tarea, o el modelo aprovechó para "refactorizar" métodos adyacentes sin pedirlo?
* [ ] **4. Manejo de Errores y Timeouts:** ¿Qué pasa si el endpoint falla con un 502 o tarda 30 segundos? Los LLM tienden a pintar solo el *happy path*.
* [ ] **5. Seguridad y Permisos:** ¿El código respeta el control de acceso basado en roles (RBAC) y la sanitización de inputs, o asume que quien llama está autenticado?
* [ ] **6. Criterio de Arquitectura:** ¿Esto soluciona la causa raíz del problema, o simplemente es un parche cosmético para silenciar la excepción?

---

## ¿Qué sigue?

En el **Episodio 2** de la serie en YouTube vamos a ver de dónde salió todo esto: setenta años de tropiezos, los inviernos de la inteligencia artificial y el paper de Google de 2017 (*Attention Is All You Need*) que cambió la industria para siempre.

Si tienes alguna regla o filtro personal que te haya salvado de un bug en producción, compártela en los comentarios del video. ¡Nos vemos en el próximo!
