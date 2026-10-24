---
title: "Rotación de secretos sin downtime: el runbook paso a paso"
description: "Rotar no es cambiar una clave, es cambiarla sin que nadie se dé cuenta. Ventana de convivencia con dos credenciales, recarga en caliente y cómo confirmar que nadie usa la vieja."
date: 2026-10-25
tags: ["seguridad", "devops", "secretos", "infraestructura", "backend"]
draft: false
---

Rotaste la contraseña de la base de datos por seguridad. Seguiste el manual, cumpliste el estándar, y aun así tumbaste producción.

No es que rotar esté mal. Es que cambiaste la clave en un lado mientras medio sistema todavía usaba la vieja.

Rotar no es cambiar un valor. Es cambiarlo **sin que nadie se dé cuenta**.

## Por qué se cae: tu sistema no es uno solo

Crees que cambiar una clave es instantáneo. No lo es, porque no tienes un proceso: tienes muchos, en muchas máquinas.

Y casi todos leyeron la credencial **una sola vez, al arrancar**, y la tienen en memoria. Guardaste el valor nuevo en el gestor de secretos, perfecto, pero esos procesos van a seguir usando el viejo hasta que reinicien.

Dos cosas pasan al mismo tiempo, y las dos duelen:

1. **Los que no se enteraron siguen con la vieja.** Si la vieja ya no sirve, fallan la autenticación de inmediato.
2. **Siempre hay algo que no se entera.** Un worker, un cron que corre cada hora, una réplica que tardó más en arrancar, un contenedor que nadie recordaba.

Rotar sin recarga es solo cambiar un dato en una base de datos.

## La solución: que las dos claves vivan un rato

La idea central es no pasar de una a otra. **Deja las dos válidas durante una ventana.**

Se llama rotación con doble secreto, y la secuencia importa:

![Fases de una rotación sin downtime: aceptar ambas, propagar, verificar y retirar](/blog/secret-rotation-phases.svg)

### Fase 1 — Crear la nueva, sin tocar la vieja

Generas la credencial nueva y la dejas disponible, pero **no retiras la anterior**. En este punto el sistema acepta las dos.

Para una base de datos esto suele significar un segundo usuario con los mismos permisos:

```sql
-- PostgreSQL: usuario nuevo con los mismos privilegios, sin tocar el viejo
CREATE USER app_user_b WITH PASSWORD 'nueva-clave';
GRANT app_role TO app_user_b;
```

Para una API con claves propias, es emitir una segunda clave activa. Para JWT, es publicar la nueva clave pública en el JWKS **manteniendo la anterior** hasta que expiren los tokens en circulación.

### Fase 2 — Propagar con calma

Actualizas el secreto en el gestor y dejas que llegue a todos los consumidores. Aquí tienes dos caminos:

- **Recarga en caliente:** el servicio relee el secreto cada N minutos o al recibir una notificación. Es lo ideal y lo que menos duele.
- **Reinicio controlado:** un despliegue rolling, réplica por réplica. Si no puedes recargar en caliente, al menos reinicia tú, de forma ordenada, en lugar de esperar a que la aplicación se caiga sola.

Un ejemplo simple de recarga en caliente en Python:

```python
import time, boto3

_cache = {"valor": None, "expira": 0}
_sm = boto3.client("secretsmanager")

def get_secret(nombre, ttl=300):
    ahora = time.time()
    if _cache["valor"] is None or ahora > _cache["expira"]:
        resp = _sm.get_secret_value(SecretId=nombre)
        _cache["valor"] = resp["SecretString"]
        _cache["expira"] = ahora + ttl
    return _cache["valor"]
```

Con un TTL de cinco minutos, toda tu flota converge sola en cinco minutos. Sin reiniciar nada.

En Kubernetes, los secretos montados como volumen se actualizan solos en el pod (con retraso de hasta un minuto), pero **los inyectados como variables de entorno NO**: esos requieren reinicio. Es una de las confusiones más comunes.

### Fase 3 — Verificar que nadie usa la vieja

Esta es la fase que casi todo el mundo se salta, y es la que convierte el runbook en algo seguro.

No apagues la credencial vieja porque "ya pasó suficiente tiempo". Apágala cuando **los datos te confirmen** que nadie la usa:

```sql
-- PostgreSQL: conexiones activas por usuario
SELECT usename, count(*), max(backend_start) AS conexion_mas_reciente
FROM pg_stat_activity
WHERE usename IN ('app_user_a', 'app_user_b')
GROUP BY usename;
```

Si `app_user_a` sigue apareciendo con conexiones recientes, todavía hay algo usando la vieja. Encuéntralo antes de seguir.

En AWS, `Secrets Manager` emite métricas de acceso en CloudTrail. En Vault, cada lease te dice quién pidió qué y cuándo.

### Fase 4 — Retirar la vieja

Ahora sí. Y de forma reversible primero, si el motor te lo permite: desactívala antes de borrarla, para poder volver atrás si algo aparece.

```sql
-- Desactivar sin borrar: puedes revertirlo en segundos
ALTER USER app_user_a NOLOGIN;
-- Pasados unos días sin incidentes:
DROP USER app_user_a;
```

## Runbook resumido

1. **Confirma que el sistema puede aceptar dos credenciales a la vez.** Si no puede, eso es lo primero que hay que arreglar; no rotes todavía.
2. **Crea la credencial nueva** sin tocar la vieja.
3. **Actualiza el gestor de secretos.**
4. **Propaga:** espera el TTL de recarga o lanza un reinicio rolling.
5. **Verifica con métricas** que nadie usa la vieja. No con el reloj.
6. **Desactiva la vieja** (reversible).
7. **Espera unos días** y recién ahí bórrala.
8. **Documenta la ventana** que usaste, para que la próxima no se improvise.

## Checklist antes de rotar en producción

1. **¿El sistema valida dos secretos a la vez?** Si no, no hay rotación sin downtime posible.
2. **¿Los servicios recargan en caliente o hay que reiniciarlos?** Si hay que reiniciar, planéalo, no lo descubras en el momento.
3. **¿Tienes inventario de quién usa esta credencial?** Los workers y crons son los que siempre se olvidan.
4. **¿Hay métrica para ver quién sigue usando la vieja?** Sin eso, apagar la vieja es apostar.
5. **¿Puedes revertir en menos de un minuto?** Desactivar en vez de borrar.
6. **¿Lo estás haciendo a mano?** Rotar a mano a medianoche es justo como se cae producción. Automatízalo.
7. **¿Empezaste por una credencial de bajo impacto?** No estrenes el procedimiento con la clave de la base de producción.

## Lo que me llevo

El problema no es la clave nueva. Es el momento en que matas la vieja.

La próxima vez que vayas a rotar algo en producción, hazte la pregunta incómoda:

> Mientras se propaga, ¿el sistema todavía acepta el valor viejo? ¿Y cómo me voy a enterar de quién lo sigue usando?

## Fuentes

- AWS Secrets Manager — [Rotation strategies: single vs alternating user](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
- HashiCorp Vault — [Leases, renew and revoke](https://developer.hashicorp.com/vault/docs/concepts/lease)
- OWASP — [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- Kubernetes — [Secrets: mounted volumes vs environment variables](https://kubernetes.io/docs/concepts/configuration/secret/)
- Google Cloud — [Secret Manager rotation](https://cloud.google.com/secret-manager/docs/secret-rotation)
