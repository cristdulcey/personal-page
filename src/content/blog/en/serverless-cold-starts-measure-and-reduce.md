---
title: "Serverless Cold Starts: How to Measure Them and Who You Let Them Fall On"
description: "A cold start is not removed, it is reduced and hidden. How to separate init time from execution time, what weighs in each runtime, and when provisioned concurrency is worth it."
date: 2026-10-25
tags: ["serverless", "aws-lambda", "performance", "architecture", "backend"]
draft: false
---

Your serverless function is fast, cheap and scales infinitely. Or at least that is what you were sold, right before you saw that three-second delay in production.

It is not that your code is slow. It is that before running, the cloud has to wake your function up from scratch.

And here is the part almost nobody frames correctly: **the cold is always going to exist**. What you actually decide is who it falls on.

## What happens before your first line

Serverless does not keep your code running. When there is no traffic, it shuts everything down. When a request arrives, it has to:

1. **Spin up the execution environment** — create the sandbox, mount your package. Tens of milliseconds.
2. **Load the runtime** — boot Node, Python, the JVM. Milliseconds to seconds depending on the language.
3. **Initialise your code** — the imports, opening connections, reading config, instantiating SDK clients.
4. **Run your handler** — finally, your logic.

![Cold start timeline: environment, runtime, init and finally your handler](/blog/cold-start-timeline-en.svg)

Steps 1 to 3 are the **cold start**. The first call pays for all of them. Subsequent calls, while the instance stays alive, go straight to step 4.

That is why your "forty millisecond" function can take three seconds: your forty milliseconds are real, but they are only step 4.

## What almost nobody measures: it is not one cold start, it is many

Here is the most expensive misunderstanding.

Many people assume a cold start is "the first user of the day". It is not. **Every concurrent instance is a start-up.**

If a hundred simultaneous requests arrive and you only had two warm instances, the platform spins up ninety-eight more. Ninety-eight users pay the full start-up, at the same time, in the middle of your traffic spike.

It is not a rare early-morning edge case. It is exactly the moment you care about most.

## How to actually measure it

The first step is to stop looking at total latency, which mixes start-up and execution together.

**On AWS Lambda**, the logs carry the number directly. Look for the `Init Duration` field, which only appears on cold invocations:

```sql
-- CloudWatch Logs Insights
filter @type = "REPORT"
| stats
    count(*) as invocations,
    sum(ispresent(@initDuration)) as cold,
    avg(@initDuration) as avg_init_ms,
    pct(@initDuration, 95) as p95_init_ms,
    avg(@duration) as avg_exec_ms
  by bin(1h)
```

That answers the two questions that matter:

- **What percentage of my calls are cold?** If it is 1%, you are probably worrying too much.
- **How much does start-up weigh against execution?** If `Init Duration` is 2,400 ms and `Duration` is 40 ms, your problem is not the code.

On **Cloud Run** you measure `container/startup_latency`. On **Azure Functions**, the gap between `FunctionExecutionTimeMs` and the latency the client sees.

One warning about the metric: a pretty p50 hides the problem. **Always look at p95 and p99**, because a cold start is by definition a tail event.

## What weighs in each runtime

The numbers move with package size, but the order of magnitude holds up fairly well:

| Runtime | Typical start-up | What makes it worse |
|---|---|---|
| **Go, Rust** | 100-300 ms | Almost nothing; the binary is already compiled |
| **Node.js** | 200-600 ms | Requiring full SDKs, large dependency trees |
| **Python** | 300-900 ms | Heavy imports (pandas, full boto3), packages with native binaries |
| **Java, .NET** | 1-5 s | JVM/CLR boot, classpath scanning, DI-heavy frameworks |

The practical rule: **what matters is not the language, it is how much work you do before the handler**.

## The three levers

### 1. Pack lighter

Import what you use, not the whole library. With the AWS SDK v3 for JavaScript:

```js
// bad: drags in the whole client
import AWS from 'aws-sdk';

// good: only what you need
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
```

And bundle it (`esbuild`, `webpack`). Going from 40 MB to 3 MB shows up directly in `Init Duration`.

### 2. Move everything request-independent out of the handler

Anything you initialise **outside** the handler is reused across invocations on the same instance:

```python
import boto3

# Outside the handler: runs once per instance, not per request.
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("orders")

def handler(event, context):
    # In here, only what genuinely depends on the event.
    return table.get_item(Key={"id": event["id"]})
```

This does not shrink the cold start, but it avoids paying initialisation **on every warm request**, which is usually the bigger win and the one most often missed.

### 3. If traffic is predictable, keep instances ready

**Provisioned concurrency** (AWS) or **minimum instances** (Cloud Run) keep already-initialised environments around.

This costs money: you pay to keep them on even with no traffic. It is only worth it when:

- The one waiting is a real user, not a background process.
- Traffic has a predictable window (business hours, a campaign, a launch).
- You already measured and start-up really is a meaningful share of latency.

If all three hold, provision only the window that matters with a scheduled scaling rule. If they do not, you are spending money on a problem you do not have.

## Cold start checklist

1. **Did you measure `Init Duration` separately from `Duration`?** Without that split, you are optimising blind.
2. **What percentage of invocations are cold?** Below 1%, it is probably not your bottleneck.
3. **Who pays the start-up: a user or a robot?** That answer decides how much effort it deserves.
4. **How big is your deployed package?** Above 10 MB it is worth a look.
5. **Is anything initialising inside the handler that could live outside?** Clients, connections, config.
6. **Are you looking at p95 and p99, not just the average?** Cold starts live in the tail.
7. **If you provisioned, is it still justified?** Review it periodically: traffic changes, the bill does not.

## What I take away

A cold start is not removed. It is reduced and hidden.

Next time you build something serverless, the question is not "how do I get rid of the cold start?". It is:

> Does the slow first call land on a robot, or on a customer staring at the screen?

## Sources

- AWS Lambda — [Execution environment lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)
- AWS Lambda — [Provisioned concurrency](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html)
- AWS Lambda — [Monitoring with CloudWatch metrics](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html)
- Google Cloud Run — [Minimum instances](https://cloud.google.com/run/docs/configuring/min-instances)
- Azure Functions — [Hosting plans and cold start](https://learn.microsoft.com/azure/azure-functions/functions-scale)
