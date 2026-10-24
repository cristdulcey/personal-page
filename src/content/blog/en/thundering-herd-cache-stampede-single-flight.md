---
title: "Thundering Herd: When the Cache That Protected Your Database Is the One That Takes It Down"
description: "A thousand requests ask for the same key at the exact second it expires. What a cache stampede is and the single-flight pattern with jitter, ready to copy."
date: 2026-10-24
tags: ["cache", "redis", "performance", "distributed-systems", "backend"]
draft: false
---

You have a cache protecting your database. It works perfectly. Until the exact second it expires.

In that instant, what was a shield turns into a coordinated attack on your own database. And the uncomfortable part: the more traffic you have, the harder it hits. Your success is what takes you down.

It is not that the cache is wrong. It is that it **expires for everyone at the same time**.

## How the stampede forms

The cache does one thing well: you store an expensive result so you do not compute it every time. The first request computes and stores it; the rest read it fast. Your database rests. That is why you added it, and it works.

You gave it a time to live, say ten minutes. Exactly ten minutes later, the value is gone.

And in that very second there may be hundreds of requests arriving. Since the value is no longer there, **they all go to the database to recompute it. At once.**

![Cache stampede: hundreds of requests hitting the database when the key expires](/blog/thundering-herd-flow-en.svg)

That is the **thundering herd** (or *cache stampede*): hundreds of requests running the same heavy query in the same instant. None of them knows the others are doing exactly the same thing.

The database, which was calmly serving five queries per second, takes five hundred identical ones at once and falls over. Ironic: the cache that protected it is what organised the attack.

And then comes the worse part, the self-reinforcing loop: the database gets slow, requests pile up, timeouts fire retries, and the retries grow the herd.

## The single-flight pattern

The idea is simple to state and easy to get wrong: **only one request recomputes, and the rest wait for that result**.

You implement it with a short-lived lock. The first one in takes it and computes; the others see the lock, wait a moment, and read the now-fresh value.

### Redis + Python

```python
import time, uuid, redis

r = redis.Redis()

def get_with_single_flight(key, loader, ttl=600, lock_ttl=10):
    value = r.get(key)
    if value is not None:
        return value

    lock_key = f"lock:{key}"
    token = uuid.uuid4().hex

    # NX = only if absent. EX = the lock releases itself if the process dies.
    if r.set(lock_key, token, nx=True, ex=lock_ttl):
        try:
            value = loader()
            r.set(key, value, ex=ttl_with_jitter(ttl))
            return value
        finally:
            # Only delete the lock if it is still yours.
            if r.get(lock_key) == token.encode():
                r.delete(lock_key)

    # You did not get the lock: wait for the other one to finish.
    for _ in range(50):
        time.sleep(0.05)
        value = r.get(key)
        if value is not None:
            return value

    # The lock holder did not answer in time: compute it yourself.
    return loader()
```

Two details that are not optional:

- **The lock needs its own expiry** (`ex=lock_ttl`). If the process holding it dies, a lock without TTL stays forever and you block the key entirely.
- **Delete the lock only if it is still yours** (the `token`). Otherwise you may delete a lock another process already took, opening the door to two simultaneous computations.

### Node

In Node you do not need to hand-roll it if the computation lives in a single process:

```js
const pending = new Map();

async function getWithSingleFlight(key, loader) {
  const cached = await redis.get(key);
  if (cached !== null) return cached;

  if (pending.has(key)) return pending.get(key);

  const promise = loader()
    .then(async (value) => {
      await redis.set(key, value, 'EX', ttlWithJitter(600));
      return value;
    })
    .finally(() => pending.delete(key));

  pending.set(key, promise);
  return promise;
}
```

Mind the scope: this `Map` collapses requests **within one process**. With four replicas you go from 500 queries to 4, which is already a different life. If you need exactly one, use the Redis lock.

In Go, [`singleflight`](https://pkg.go.dev/golang.org/x/sync/singleflight) in the extended standard library solves the same thing in three lines.

## Jitter: so not everything expires in the same second

The lock prevents a stampede on **one** key. Jitter prevents thousands of different keys from expiring together.

If your warm-up process stored 5,000 keys with a 600-second TTL at the same time, ten minutes later all 5,000 expire at once. The lock does not save you: they are different keys.

The fix is to add randomness to the TTL:

```python
import random

def ttl_with_jitter(ttl, pct=0.2):
    # ±20% → a 600s TTL lands between 480s and 720s
    delta = int(ttl * pct)
    return ttl + random.randint(-delta, delta)
```

±10% already spreads the load well. ±20% is comfortable when the computation is expensive. More than that and the data starts ageing unpredictably.

## And if you can, refresh before it expires

The most elegant play is to never reach expiry: when a request sees the key has little life left, **return the old value and fire the recomputation in the background**.

It is called *probabilistic early expiration* or early refresh. Nobody waits, the database gets a single query, and the stampede does not exist because the key is never empty.

The price is serving data a few seconds staler. In most cases that is an excellent trade.

## Anti-stampede checklist

1. **Which cache keys concentrate the most traffic?** Those are the only ones that really matter.
2. **How many requests per second hit that key?** More than ten and you already have a potential herd.
3. **Is there single-flight or a lock on recompute?** Without it, every expiry is a roll of the dice.
4. **Does the lock have its own TTL?** A lock without expiry is a permanent block waiting to happen.
5. **Do the TTLs carry jitter?** Especially if a warm-up fills the cache all at once.
6. **Do retries use backoff?** Without backoff, the retry fattens the stampede instead of easing it.
7. **Has anyone tested it?** Warm the cache, delete the hot key by hand, and watch the database graph.

## What I take away

The problem is not that the cache expires. It is that everyone runs at the same time.

Next time you set a time to live on a key, ask yourself:

> When this expires, how many requests are going to run to the database at the same time?

If the answer is "all of them in that second", you have work to do.

## Sources

- Wikipedia — [Cache stampede](https://en.wikipedia.org/wiki/Cache_stampede)
- Go — [singleflight package](https://pkg.go.dev/golang.org/x/sync/singleflight)
- Redis — [Distributed locks with Redis](https://redis.io/docs/latest/develop/use/patterns/distributed-locks/)
- Vattani, Chierichetti & Lowenstein (2015) — [Optimal Probabilistic Cache Stampede Prevention](https://cseweb.ucsd.edu/~avattani/papers/cache_stampede.pdf)
