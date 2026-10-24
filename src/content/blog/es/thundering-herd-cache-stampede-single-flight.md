---
title: "Thundering herd: cuando el cache que protegía tu base es el que la tumba"
description: "Mil peticiones piden lo mismo en el segundo exacto en que expira la clave. Qué es una estampida de cache y el patrón single-flight con jitter, listo para copiar."
date: 2026-10-24
tags: ["cache", "redis", "rendimiento", "sistemas-distribuidos", "backend"]
draft: false
---

Tienes un cache que protege tu base de datos. Funciona perfecto. Hasta el segundo exacto en que expira.

En ese instante, lo que era un escudo se convierte en un ataque coordinado contra tu propia base. Y lo más incómodo: entre más tráfico tengas, peor te pega. El éxito es el que te tumba.

No es que el cache esté mal. Es que **expira para todos al mismo tiempo**.

## Cómo se arma la estampida

El cache hace una cosa bien: guardas un resultado costoso para no calcularlo cada vez. La primera petición lo calcula y lo guarda; las demás lo leen rapidísimo. Tu base descansa. Por eso lo pusiste, y funciona.

Le pusiste un tiempo de vida, digamos diez minutos. A los diez minutos exactos, el dato desaparece.

Y justo en ese segundo pueden estar llegando cientos de peticiones. Como el dato ya no está, **todas se van a la base a recalcularlo. Al tiempo.**

![Estampida de cache: cientos de peticiones golpeando la base cuando la clave expira](/blog/thundering-herd-flow.svg)

Eso es el **thundering herd** (o *cache stampede*): cientos de peticiones haciendo el mismo query pesado en el mismo instante. Ninguna sabe que las otras están haciendo exactamente lo mismo.

La base, que vivía tranquila atendiendo cinco consultas por segundo, recibe quinientas idénticas de golpe y se cae. Irónico: el cache que la protegía fue el que organizó el ataque.

Y después viene lo peor, el ciclo que se realimenta: la base se pone lenta, las peticiones se acumulan, los timeouts disparan reintentos, y los reintentos agrandan la manada.

## El patrón single-flight

La idea es simple de decir y fácil de equivocar: **que solo una petición recalcule y las demás esperen ese resultado**.

Se implementa con un lock de corta duración. La primera que llega lo toma y calcula; las demás ven el lock, esperan un momento y leen el valor ya fresco.

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

    # NX = solo si no existe. EX = el lock se suelta solo si el proceso muere.
    if r.set(lock_key, token, nx=True, ex=lock_ttl):
        try:
            value = loader()
            r.set(key, value, ex=ttl_con_jitter(ttl))
            return value
        finally:
            # Solo borra el lock si sigue siendo tuyo.
            if r.get(lock_key) == token.encode():
                r.delete(lock_key)

    # No conseguiste el lock: espera a que el otro termine.
    for _ in range(50):
        time.sleep(0.05)
        value = r.get(key)
        if value is not None:
            return value

    # El que tenía el lock no respondió a tiempo: calcula tú.
    return loader()
```

Dos detalles que no son opcionales:

- **El lock necesita expiración propia** (`ex=lock_ttl`). Si el proceso que lo tomó muere, sin TTL el lock queda para siempre y bloqueas la clave entera.
- **Borra el lock solo si sigue siendo tuyo** (el `token`). Si no, puedes borrar el lock que ya tomó otro proceso y abrir la puerta a dos cálculos simultáneos.

### Node

En Node no hace falta escribirlo a mano si el cálculo vive en un solo proceso:

```js
const pending = new Map();

async function getWithSingleFlight(key, loader) {
  const cached = await redis.get(key);
  if (cached !== null) return cached;

  if (pending.has(key)) return pending.get(key);

  const promise = loader()
    .then(async (value) => {
      await redis.set(key, value, 'EX', ttlConJitter(600));
      return value;
    })
    .finally(() => pending.delete(key));

  pending.set(key, promise);
  return promise;
}
```

Ojo con el alcance: este `Map` colapsa las peticiones **de un proceso**. Con cuatro réplicas pasas de 500 consultas a 4, que ya es otra vida. Si necesitas exactamente una, usa el lock en Redis.

En Go existe [`singleflight`](https://pkg.go.dev/golang.org/x/sync/singleflight) en la librería estándar extendida y resuelve lo mismo en tres líneas.

## El jitter: que no todo venza en el mismo segundo

El lock evita la estampida sobre **una** clave. El jitter evita que mil claves distintas venzan juntas.

Si tu proceso de calentamiento guardó 5.000 claves con TTL de 600 segundos a la misma hora, en diez minutos vencen las 5.000 a la vez. El lock no te salva: son claves diferentes.

La solución es meterle algo de azar al TTL:

```python
import random

def ttl_con_jitter(ttl, pct=0.2):
    # ±20% → un TTL de 600s queda entre 480s y 720s
    delta = int(ttl * pct)
    return ttl + random.randint(-delta, delta)
```

Un ±10% ya reparte bien la carga. Un ±20% es cómodo cuando el cálculo es caro. Más de eso y el dato empieza a envejecer de forma poco predecible.

## Y si puedes, refresca antes de que expire

La jugada más elegante es no llegar nunca a la expiración: cuando una petición ve que a la clave le queda poca vida, **devuelve el valor viejo y dispara el recálculo en segundo plano**.

Se llama *probabilistic early expiration* o refresco anticipado. Nadie espera, la base recibe una sola consulta y la estampida no existe porque la clave nunca llega a estar vacía.

El precio es servir un dato unos segundos más viejo. En la mayoría de casos es un negocio excelente.

## Checklist anti-estampida

1. **¿Qué claves de cache concentran más tráfico?** Esas son las únicas que de verdad importan.
2. **¿Cuántas peticiones por segundo llegan a esa clave?** Si son más de diez, ya tienes manada potencial.
3. **¿Hay single-flight o lock al recalcular?** Sin eso, cada expiración es una ruleta.
4. **¿El lock tiene TTL propio?** Un lock sin expiración es un bloqueo permanente esperando turno.
5. **¿Los TTL llevan jitter?** Sobre todo si hay un warm-up que llena el cache de golpe.
6. **¿Los reintentos tienen backoff?** Sin backoff, el reintento engorda la estampida en vez de aliviarla.
7. **¿Alguien lo probó?** Llena el cache, borra la clave caliente a mano y mira el gráfico de la base.

## Lo que me llevo

El problema no es que el cache expire. Es que todos corran al tiempo.

La próxima vez que le pongas tiempo de vida a una clave, hazte la pregunta:

> Cuando esto expire, ¿cuántas peticiones van a correr a la base al mismo tiempo?

Si la respuesta es "todas las que haya en ese segundo", ya tienes trabajo.

## Fuentes

- Wikipedia — [Cache stampede](https://en.wikipedia.org/wiki/Cache_stampede)
- Go — [singleflight package](https://pkg.go.dev/golang.org/x/sync/singleflight)
- Redis — [Distributed locks with Redis](https://redis.io/docs/latest/develop/use/patterns/distributed-locks/)
- Vattani, Chierichetti & Lowenstein (2015) — [Optimal Probabilistic Cache Stampede Prevention](https://cseweb.ucsd.edu/~avattani/papers/cache_stampede.pdf)
