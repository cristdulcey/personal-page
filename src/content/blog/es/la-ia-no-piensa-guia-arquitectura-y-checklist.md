---
title: "La IA no piensa: guía de arquitectura y checklist anti-alucinaciones"
description: "Por qué los LLM suenan como ingenieros senior mientras inventan APIs, el mapa de decisión de 4 niveles y la checklist práctica para auditar PRs con código generado por IA."
date: 2026-10-24
tags:
  - ia
  - arquitectura
  - ingeniería-de-software
  - devops
draft: false
---

Tú le haces una pregunta técnica a un modelo de inteligencia artificial: una migración en Django, una consulta de agregación en PostgreSQL o un worker concurrente en Go.

Te responde en dos segundos con un código impecable, tipado, modular y con comentarios prolijos. Parece el trabajo de un ingeniero Staff. Lo despliegas a staging y en menos de cinco minutos explota una excepción de puntero nulo o descubres que el método que utilizó en la librería simplemente **no existe**.

¿Qué pasó?

No hubo mala fe ni un fallo temporal del servidor. Lo que ocurrió es que confundiste **fluidez con razonamiento**. Y en ingeniería de software, esa confusión cuesta tiempo, dinero y caídas en producción.

---

## La trampa de la fluidez: predicción estadística vs comprensión

Un modelo de lenguaje grande (LLM) no entiende tu base de código. No tiene un modelo mental de la memoria RAM, no sabe qué significa un deadlock ni experimenta la frustración de un despliegue fallido un viernes a las 6:00 PM.

Lo que hace es **completar patrones estadísticos** token por token:

1884rg\max_{w_t} P(w_t \mid w_1, w_2, \dots, w_{t-1})1884

Dado todo el contexto previo, calcula cuál es el siguiente fragmento de texto más probable. Como ha sido entrenado con millones de repositorios públicos, sabe perfectamente cómo luce una función idiomática y bien formateada. La sintaxis es perfecta porque la forma es fácil de predecir; la semántica y los efectos secundarios, no.

> **Principio clave:** Los LLM son excelentes motores de traducción, síntesis y generación sintáctica, pero son pésimos evaluadores de verdad lógica sin herramientas de ejecución externa.

---

## El mapa de decisión: 4 niveles para elegir tecnología

Uno de los errores más comunes hoy en los equipos de ingeniería es meter un LLM para resolver problemas que se solucionan con una función determinista de tres líneas.

Usa este mapa de decisión antes de comprometer arquitectura o costos de tokens:

| Nivel | Enfoque | Casos de uso ideales | Cuándo NO usarlo |
| :--- | :--- | :--- | :--- |
| **1. Automatización clásica** | Scripts deterministas, Regex, AST, Cron jobs | Cálculos financieros, validación de schemas, parsing predecible, ETLs estructuradas | Cuando la entrada es lenguaje natural ambiguo o datos no estructurados |
| **2. Machine Learning clásico** | XGBoost, Random Forest, Regresión logística, KMeans | Scoring de riesgo crediticio, detección de fraude numérico, predicción de churn | Cuando necesitas generación creativa, contexto conversacional o síntesis |
| **3. IA Generativa (LLMs directos)** | Extracción de entidades, resúmenes, traducción, redacción | Borradores de copy, extracción de datos desde PDFs desordenados, reclasificación | Cuando requieres ejecución de acciones con efectos secundarios o exactitud matemática pura |
| **4. Agentes Autónomos (LLM + Tools + Loop)** | Tool calling, orquestación MCP, depuración iterativa | Refactorización de código con ejecución de tests, triaje de soporte con APIs, investigación profunda | Tareas lineales de un solo paso; sobrediseñar con bucles agénticos añade latencia y riesgo |



---

## Los 3 fallos críticos en producción

Si tu equipo ya está integrando modelos o utilizando asistentes de codificación (Claude Code, Codex, Cursor), estos son los tres modos de fallo que debes vigilar:

1. **Alucinación silenciosa de APIs:** El modelo inventa parámetros o métodos que "deberían existir" por consistencia lingüística pero que la librería no soporta.
2. **Ceguera de contexto (Context Drift):** A medida que la ventana de contexto crece, el modelo prioriza tokens recientes y olvida invariantes críticas definidas al inicio del prompt.
3. **Delegación ciega sin arnés de verificación:** Tratar la salida del modelo como verdad final sin pasarla por compilador, linter, suite de pruebas o sandbox.

---

## Checklist anti-alucinaciones para Code Reviews

Cuando revises un Pull Request donde se utilizó IA generativa, valida punto por punto esta lista antes de dar el *Approve*:

- [ ] **1. Verificación de dependencias:** ¿Las llamadas a librerías externas corresponden a la versión exacta instalada en el  o ?
- [ ] **2. Casos de borde explícitos:** ¿El código maneja , , listas vacías y timeouts, o solo cubre el camino feliz (*happy path*)?
- [ ] **3. Aislamiento de efectos secundarios:** ¿Hay mutaciones de estado global, queries N+1 escondidas o llamadas a base de datos dentro de bucles?
- [ ] **4. Ejecución en entorno real:** ¿El autor adjuntó evidencia de ejecución real (logs de tests, curl o pruebas unitarias pasando) o solo el diff?
- [ ] **5. Sanitización de inputs:** ¿Las cadenas generadas se concatenan en queries SQL, comandos shell o prompts secundarios sin sanitizar?
- [ ] **6. Invariantes de negocio:** ¿La lógica respeta las reglas de dominio que no están escritas en el código pero sí en el contexto del producto?

---

## Conclusión y próximos pasos

La inteligencia artificial no vino a reemplazar el criterio de ingeniería; vino a multiplicarlo. El valor del desarrollador en esta era no está en escribir la sintaxis línea por línea, sino en **diseñar el arnés, definir las restricciones y auditar con rigor matemático y arquitectónico** cada línea que entra a producción.

En el próximo episodio analizaremos la historia real de 70 años que nos trajo hasta aquí y por qué el paper de los *Transformers* en 2017 cambió las reglas del juego.
