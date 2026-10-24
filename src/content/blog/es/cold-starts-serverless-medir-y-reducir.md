---
title: "Cold starts en serverless: cómo medirlos y sobre quién dejas que caigan"
description: "El arranque en frío no se elimina, se reduce y se esconde. Cómo separar el tiempo de arranque del de ejecución, qué pesa en cada runtime y cuándo vale la concurrencia aprovisionada."
date: 2026-10-25
tags: ["serverless", "aws-lambda", "rendimiento", "arquitectura", "backend"]
draft: false
---

Tu función serverless es rápida, barata y escala al infinito. O al menos eso fue lo que te vendieron, antes de ver ese retraso de tres segundos en producción.

No es que tu código sea lento. Es que antes de correr, la nube tiene que despertar tu función desde cero.

Y aquí está la parte que casi nadie plantea bien: **el frío siempre va a existir**. Lo que de verdad decides es sobre quién cae.

## Qué pasa antes de tu primera línea

Serverless no mantiene tu código prendido. Cuando no hay tráfico, apaga todo. Cuando llega una petición, tiene que:

1. **Levantar el entorno de ejecución** — crear el sandbox, montar tu paquete. Decenas de milisegundos.
2. **Cargar el runtime** — arrancar Node, Python, la JVM. De milisegundos a segundos según el lenguaje.
3. **Inicializar tu código** — los `import`, abrir conexiones, leer configuración, instanciar clientes SDK.
4. **Ejecutar tu handler** — por fin, tu lógica.

![Línea de tiempo de un cold start: entorno, runtime, init y por fin tu handler](/blog/cold-start-timeline.svg)

Los pasos 1 a 3 son el **cold start**. La primera llamada los paga completos. Las siguientes, mientras la instancia siga viva, entran directo al paso 4.

Por eso tu función "de cuarenta milisegundos" puede tardar tres segundos: tus cuarenta milisegundos son reales, pero son solo el paso 4.

## Lo que casi nadie mide: no es un cold start, son muchos

Aquí está el malentendido más caro.

Mucha gente asume que el cold start es "el primer usuario del día". No lo es. **Cada instancia concurrente es un arranque.**

Si llegan cien peticiones simultáneas y solo tenías dos instancias calientes, la plataforma levanta noventa y ocho más. Noventa y ocho usuarios pagan el arranque completo, al mismo tiempo, en pleno pico de tráfico.

No es un caso raro de madrugada. Es exactamente el momento en que más te importa.

## Cómo medirlo de verdad

Lo primero es dejar de mirar la latencia total, que mezcla arranque y ejecución.

**En AWS Lambda**, los logs traen el dato directo. Busca el campo `Init Duration`, que solo aparece en invocaciones en frío:

```sql
-- CloudWatch Logs Insights
filter @type = "REPORT"
| stats
    count(*) as invocaciones,
    sum(ispresent(@initDuration)) as en_frio,
    avg(@initDuration) as init_promedio_ms,
    pct(@initDuration, 95) as init_p95_ms,
    avg(@duration) as ejecucion_promedio_ms
  by bin(1h)
```

Con eso respondes las dos preguntas que importan:

- **¿Qué porcentaje de mis llamadas son en frío?** Si es el 1%, probablemente te estás preocupando de más.
- **¿Cuánto pesa el arranque frente a la ejecución?** Si `Init Duration` es 2.400 ms y `Duration` es 40 ms, tu problema no es el código.

En **Cloud Run** mides `container/startup_latency`. En **Azure Functions**, la diferencia entre `FunctionExecutionTimeMs` y la latencia que ve el cliente.

Una advertencia sobre la métrica: un p50 bonito esconde el problema. **Mira siempre el p95 y el p99**, porque el cold start es por definición un evento de cola.

## Qué pesa en cada runtime

Los números varían con el tamaño del paquete, pero el orden de magnitud se mantiene bastante estable:

| Runtime | Arranque típico | Qué lo empeora |
|---|---|---|
| **Go, Rust** | 100-300 ms | Casi nada; el binario ya está compilado |
| **Node.js** | 200-600 ms | `require` de SDKs completos, árboles de dependencias grandes |
| **Python** | 300-900 ms | `import` pesados (pandas, boto3 completo), paquetes con binarios |
| **Java, .NET** | 1-5 s | Arranque de la JVM/CLR, escaneo de classpath, frameworks con inyección de dependencias |

La regla práctica: **lo que importa no es el lenguaje, es cuánto trabajo haces antes del handler**.

## Las tres palancas

### 1. Achica el equipaje

Importa lo que usas, no la librería entera. En el SDK v3 de AWS para JavaScript, esto:

```js
// mal: arrastra el cliente completo
import AWS from 'aws-sdk';

// bien: solo lo que necesitas
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
```

Y empaqueta con un bundler (`esbuild`, `webpack`). Pasar de 40 MB a 3 MB se nota directo en `Init Duration`.

### 2. Saca de la función lo que no depende de la petición

Todo lo que inicialices **fuera** del handler se reutiliza entre invocaciones de la misma instancia:

```python
import boto3

# Fuera del handler: se ejecuta una vez por instancia, no por petición.
dynamodb = boto3.resource("dynamodb")
tabla = dynamodb.Table("pedidos")

def handler(event, context):
    # Aquí dentro solo lo que de verdad depende del evento.
    return tabla.get_item(Key={"id": event["id"]})
```

Esto no reduce el cold start, pero evita pagar la inicialización **en cada petición caliente**, que suele ser la ganancia más grande y la que más se pasa por alto.

### 3. Si el tráfico es predecible, mantén instancias listas

La **concurrencia aprovisionada** (AWS) o las **instancias mínimas** (Cloud Run) mantienen entornos ya inicializados.

Esto cuesta dinero: pagas por tenerlos prendidos aunque no entre tráfico. Solo vale la pena cuando:

- El que espera es un usuario real, no un proceso de fondo.
- El tráfico tiene una franja predecible (horario laboral, campaña, lanzamiento).
- Ya mediste y el arranque sí es una parte significativa de la latencia.

Si cumples esas tres, aprovisiona solo la franja que importa con una regla de autoescalado programado. Si no las cumples, te estás gastando plata en un problema que no tienes.

## Checklist de cold starts

1. **¿Mediste `Init Duration` por separado de `Duration`?** Sin esa separación, estás optimizando a ciegas.
2. **¿Qué porcentaje de invocaciones son en frío?** Si es menos del 1%, probablemente no es tu cuello de botella.
3. **¿Quién paga el arranque: un usuario o un robot?** Esa respuesta decide cuánto esfuerzo merece.
4. **¿Cuánto pesa tu paquete desplegado?** Por encima de 10 MB vale la pena revisar.
5. **¿Hay algo inicializándose dentro del handler que podría estar fuera?** Clientes, conexiones, configuración.
6. **¿Estás mirando p95 y p99, no solo el promedio?** El cold start vive en la cola de la distribución.
7. **Si aprovisionaste, ¿sigue justificado?** Revísalo cada tanto: el tráfico cambia y la factura no.

## Lo que me llevo

El cold start no se elimina. Se reduce y se esconde.

La próxima vez que montes algo en serverless, la pregunta no es "¿cómo quito el cold start?". Es:

> ¿La primera llamada lenta le cae a un robot, o a un cliente mirando la pantalla?

## Fuentes

- AWS Lambda — [Execution environment lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)
- AWS Lambda — [Provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html)
- AWS Lambda — [Monitoring with CloudWatch metrics](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html)
- Google Cloud Run — [Minimum instances](https://cloud.google.com/run/docs/configuring/min-instances)
- Azure Functions — [Hosting plans and cold start](https://learn.microsoft.com/azure/azure-functions/functions-scale)
