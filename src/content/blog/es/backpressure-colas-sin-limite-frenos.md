---
title: "Backpressure: por qué tu servicio no muere de tráfico, muere sin frenos"
description: "Una cola sin límite no es una cola, es una fuga de memoria con buenos modales. Cómo funciona backpressure y la configuración exacta en Kafka, RabbitMQ, SQS y Celery."
date: 2026-10-24
tags: ["arquitectura", "sistemas-distribuidos", "colas", "backend", "resiliencia"]
draft: false
---

Tu sistema puede estar bien diseñado y aún así morirse por una cola sin freno.

El patrón se repite siempre igual: el servicio funciona meses sin problema, llega un pico de tráfico, y en vez de ponerse lento se **muere de golpe**. Sin excepción útil, sin log que explique nada. Solo un `OOMKilled` o un proceso que ya no está.

No es que le llegue demasiado tráfico. Es que nadie le enseñó a decir *"espérame, estoy lleno"*.

## El problema no es la carga, es que nadie avisa

Un productor manda trabajo. Un consumidor lo procesa. Mientras el consumidor aguante el ritmo, todo fluye.

El problema aparece cuando el productor manda más rápido de lo que el consumidor puede procesar. Y aquí está lo importante: **lo que no procesas no desaparece. Se acumula.**

Cada mensaje que llega y no alcanzas a procesar se queda esperando en una cola. Si esa cola vive en memoria y no tiene techo, crece. Y crece. Y sigue creciendo hasta que el proceso muere.

![Flujo de backpressure: productor, cola sin límite y señal de freno hacia atrás](/blog/backpressure-flow.svg)

**Backpressure** es exactamente eso que falta: empujar la señal hacia atrás. Que el consumidor, cuando ve que su capacidad se agota, le diga al productor *"frena, no me mandes más por ahora"*.

Si esa señal no existe, el productor sigue mandando a ciegas, feliz, directo al precipicio.

## Por qué cuesta tanto verlo venir

Tres razones por las que este fallo se esconde tan bien:

1. **En desarrollo nunca pasa.** Con diez mensajes de prueba la cola nunca crece. El bug solo existe bajo carga sostenida.
2. **Los defaults mienten.** Muchas librerías traen cola ilimitada por defecto, que en la práctica significa "limitada por tu RAM".
3. **El síntoma aparece lejos de la causa.** El que se cae es el consumidor, pero el que está mal configurado es el productor, o el buffer de en medio.

## La salida tiene tres partes

### 1. Ponle un límite a la cola

Que nunca sea infinita. Un número concreto, aunque al principio sea arbitrario. Una cola con techo te da un error temprano y claro; una cola infinita te da un `OOM` a las tres de la mañana.

### 2. Decide qué pasa cuando se llena

Cuando la cola llega al tope hay que elegir, y la elección depende del dato:

- **Bloquear al productor** (`block`): correcto cuando no puedes perder nada — pagos, eventos contables.
- **Descartar lo más viejo** (`drop-oldest`): correcto cuando solo importa el último valor — telemetría, posiciones, precios.
- **Descartar lo nuevo** (`drop-newest` / rechazar): correcto cuando prefieres fallar rápido y que el cliente reintente.

Lo grave no es elegir mal. Lo grave es no elegir, porque entonces decide la memoria.

### 3. Usa lo que ya trae freno

No te inventes el freno a mano si ya existe el ABS:

| Herramienta | Qué configurar | Comportamiento |
|---|---|---|
| **Kafka** | `max.poll.records`, `max.partition.fetch.bytes` | El consumidor controla cuánto pide; el lag es visible y medible |
| **RabbitMQ** | `basic.qos` (prefetch) + `x-max-length` | Prefetch limita mensajes sin ack; `x-max-length` corta la cola |
| **SQS** | `maxReceiveCount` + DLQ + `VisibilityTimeout` | Los mensajes problemáticos salen a la dead-letter queue |
| **Celery** | `worker_prefetch_multiplier=1` + `task_acks_late=True` | Evita que un worker acapare tareas que no va a procesar |
| **Node streams** | `pipeline()` / `highWaterMark` | El stream pausa solo al productor cuando el buffer se llena |

Una nota sobre Kafka que confunde a mucha gente: Kafka **no empuja**, el consumidor **pide**. El backpressure es casi natural. El riesgo real ahí no es la memoria, es el **lag** creciendo hasta que los mensajes expiran por retención.

## Checklist para auditar un servicio con colas

1. **¿Cada cola de este servicio tiene un tamaño máximo explícito?** Si la respuesta es "creo que sí", es que no.
2. **¿Qué pasa exactamente cuando se llena?** Debe estar escrito en el código, no implícito en un default.
3. **¿Hay métrica de profundidad de cola?** Sin `queue_depth` o `consumer_lag` en el dashboard, estás ciego.
4. **¿Hay alerta antes del tope, no en el tope?** Al 70% ya quieres saberlo.
5. **¿El productor puede recibir la señal de freno?** Un productor HTTP sí (429). Un productor fire-and-forget no.
6. **¿Hay DLQ para lo que no se pudo procesar?** Sin eso, un mensaje envenenado bloquea la cola entera.
7. **¿Alguien probó esto bajo carga?** Un test de carga de diez minutos revela en el minuto tres lo que producción revela en el mes tres.

## Lo que me llevo

Una cola sin límite no es una cola. Es una fuga de memoria con buenos modales.

La próxima vez que conectes dos servicios, hazte la pregunta incómoda:

> Si el que recibe se atrasa, ¿a dónde va a parar todo lo que se acumula?

Si la respuesta es "a la memoria", ya sabes cómo termina.

## Fuentes

- Reactive Streams — [Especificación de backpressure](https://www.reactive-streams.org/)
- Node.js — [Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- Apache Kafka — [Consumer configuration](https://kafka.apache.org/documentation/#consumerconfigs)
- RabbitMQ — [Consumer prefetch](https://www.rabbitmq.com/consumer-prefetch.html)
- AWS — [SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
- Celery — [Prefetch limits](https://docs.celeryq.dev/en/stable/userguide/optimizing.html)
