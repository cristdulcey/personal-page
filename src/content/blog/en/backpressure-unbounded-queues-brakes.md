---
title: "Backpressure: Your Service Does Not Die of Traffic, It Dies Without Brakes"
description: "An unbounded queue is not a queue, it is a memory leak with good manners. How backpressure works and the exact configuration in Kafka, RabbitMQ, SQS and Celery."
date: 2026-10-24
tags: ["architecture", "distributed-systems", "queues", "backend", "resilience"]
draft: false
---

Your system can be well designed and still die from a queue with no brakes.

The pattern always plays out the same way: the service runs fine for months, a traffic spike arrives, and instead of getting slow it **dies outright**. No useful exception, no log that explains anything. Just an `OOMKilled` or a process that is no longer there.

It is not that too much traffic arrived. It is that nobody taught it to say *"hold on, I am full"*.

## The problem is not the load, it is that nobody signals

A producer sends work. A consumer processes it. As long as the consumer keeps up, everything flows.

The problem shows up when the producer sends faster than the consumer can process. And here is the key part: **what you do not process does not disappear. It piles up.**

Every message that arrives and does not get processed waits in a queue. If that queue lives in memory and has no ceiling, it grows. And grows. And keeps growing until the process dies.

![Backpressure flow: producer, unbounded queue and the brake signal pushed back](/blog/backpressure-flow-en.svg)

**Backpressure** is exactly what is missing: pushing the signal backwards. The consumer, when it sees its capacity running out, tells the producer *"slow down, do not send me more for now"*.

If that signal does not exist, the producer keeps sending blindly, happily, straight off the cliff.

## Why it hides so well

Three reasons this failure is so hard to see coming:

1. **It never happens in development.** With ten test messages the queue never grows. The bug only exists under sustained load.
2. **The defaults lie.** Many libraries ship with an unbounded queue by default, which in practice means "bounded by your RAM".
3. **The symptom appears far from the cause.** The one that falls over is the consumer, but the one misconfigured is the producer, or the buffer in between.

## The way out has three parts

### 1. Put a bound on the queue

Never infinite. A concrete number, even if it starts out arbitrary. A bounded queue gives you an early, clear error; an unbounded queue gives you an `OOM` at three in the morning.

### 2. Decide what happens when it fills

When the queue hits the cap you have to choose, and the choice depends on the data:

- **Block the producer** (`block`): right when you cannot lose anything — payments, accounting events.
- **Drop the oldest** (`drop-oldest`): right when only the latest value matters — telemetry, positions, prices.
- **Drop the newest** (`drop-newest` / reject): right when you prefer to fail fast and let the client retry.

Choosing badly is not the serious problem. Not choosing is, because then memory decides for you.

### 3. Use what already has brakes

Do not build the brake by hand if the ABS already exists:

| Tool | What to configure | Behaviour |
|---|---|---|
| **Kafka** | `max.poll.records`, `max.partition.fetch.bytes` | The consumer controls how much it pulls; lag is visible and measurable |
| **RabbitMQ** | `basic.qos` (prefetch) + `x-max-length` | Prefetch caps unacked messages; `x-max-length` caps the queue |
| **SQS** | `maxReceiveCount` + DLQ + `VisibilityTimeout` | Problem messages move to the dead-letter queue |
| **Celery** | `worker_prefetch_multiplier=1` + `task_acks_late=True` | Stops a worker hoarding tasks it will not process |
| **Node streams** | `pipeline()` / `highWaterMark` | The stream pauses the producer on its own when the buffer fills |

One note about Kafka that trips a lot of people: Kafka **does not push, the consumer pulls**. Backpressure is almost natural there. The real risk is not memory, it is **lag** growing until messages expire by retention.

## Checklist to audit a service with queues

1. **Does every queue in this service have an explicit maximum size?** If the answer is "I think so", it does not.
2. **What exactly happens when it fills?** It must be written in the code, not implicit in a default.
3. **Is there a queue depth metric?** Without `queue_depth` or `consumer_lag` on the dashboard, you are blind.
4. **Is there an alert before the cap, not at the cap?** At 70% you already want to know.
5. **Can the producer receive the brake signal?** An HTTP producer can (429). A fire-and-forget producer cannot.
6. **Is there a DLQ for what could not be processed?** Without one, a poison message blocks the whole queue.
7. **Has anyone tested this under load?** A ten-minute load test reveals in minute three what production reveals in month three.

## What I take away

An unbounded queue is not a queue. It is a memory leak with good manners.

Next time you connect two services, ask the uncomfortable question:

> If the receiver falls behind, where does everything that piles up actually go?

If the answer is "into memory", you already know how this ends.

## Sources

- Reactive Streams — [Backpressure specification](https://www.reactive-streams.org/)
- Node.js — [Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- Apache Kafka — [Consumer configuration](https://kafka.apache.org/documentation/#consumerconfigs)
- RabbitMQ — [Consumer prefetch](https://www.rabbitmq.com/consumer-prefetch.html)
- AWS — [SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
- Celery — [Prefetch limits](https://docs.celeryq.dev/en/stable/userguide/optimizing.html)
