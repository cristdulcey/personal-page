---
title: "Índices que no sabías que estabas pagando: write amplification explicada"
description: "Tus SELECT vuelan y tus INSERT se arrastran. Qué cobra realmente cada índice en una escritura, cómo medirlo y la consulta que te dice cuáles puedes borrar hoy."
date: 2026-10-24
tags: ["bases-de-datos", "postgresql", "mysql", "rendimiento", "backend"]
draft: false
---

Pusiste índices para que la base volara. Y las consultas vuelan: ese `SELECT` que tardaba ocho segundos ahora responde en veinte milisegundos. Hiciste bien.

Y aún así, meses después, los `INSERT` se arrastran. Nadie cambió el código de escritura. El servidor es el mismo. Pero algo se puso lento y no aparece en ningún log.

No es que los índices estén mal. Es que el mismo índice que acelera una lectura te cobra en cada escritura, y esa factura casi nadie la mide.

## Un índice no es "una ayudita"

Es una estructura de datos aparte. En PostgreSQL y en MySQL (InnoDB) suele ser un **B-tree**: un árbol ordenado que vive en disco, con sus propias páginas y su propio mantenimiento.

Cuando lees, eso es una maravilla. En vez de recorrer la tabla fila por fila, el motor baja por el árbol y llega directo. Pasas de *buscar* a *encontrar*.

Cuando escribes, es otra historia. Esa estructura hay que mantenerla **sincronizada con la tabla**, y eso cuesta.

## Lo primero: una escritura tuya son muchas por debajo

Insertas una fila. Para ti es una operación.

Para el motor no. Escribe en la tabla, y además **actualiza cada índice que esa fila toque**. Si la tabla tiene cinco índices, tu `INSERT` se convirtió en seis escrituras.

![Flujo de una escritura con índices: un INSERT se multiplica en escrituras físicas](/blog/write-amplification-flow.svg)

A eso se le llama **amplificación de escritura**. La forma más simple de pensarlo:

> escrituras reales ≈ 1 (la tabla) + N (los índices afectados)

Con `UPDATE` es peor y más sutil: solo se tocan los índices cuyas **columnas indexadas** cambian. Si actualizas `updated_at` y tienes un índice sobre `updated_at`, lo pagas. Si actualizas un campo sin indexar, no. Por eso dos `UPDATE` que se ven igual de inocentes pueden costar cosas muy distintas.

## Lo segundo: no es solo más, es desordenado

Esta es la parte que de verdad hunde el rendimiento y la que casi nunca se mide.

Los índices **no se llenan en orden**. Insertas un valor que va en la mitad del árbol y el motor tiene que acomodarlo ahí: buscar la página correcta, y si no cabe, **partirla en dos** y redistribuir las claves.

Eso se llama *page split*. No es escribir un poquito más: es escribir más, en sitios dispersos del disco, con reorganización de por medio.

Un índice sobre una columna autoincremental (`id`, `created_at`) casi siempre inserta al final del árbol: barato y ordenado. Un índice sobre un `UUID v4` o un `email` inserta en cualquier parte: caro y fragmentado.

Por eso una tabla con veinte índices hace los `INSERT` lentísimos, y al principio todo parecía perfecto: la degradación llega cuando el árbol crece y ya no cabe cómodo en memoria.

## La consulta que te dice qué borrar

Ambos motores llevan estadísticas de uso. Nunca vas a adivinar mejor que ellas.

**PostgreSQL** — índices con cero lecturas desde el último reinicio de estadísticas:

```sql
SELECT
  s.schemaname,
  s.relname  AS tabla,
  s.indexrelname AS indice,
  s.idx_scan AS veces_usado,
  pg_size_pretty(pg_relation_size(s.indexrelid)) AS peso
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.idx_scan = 0
  AND NOT i.indisunique
  AND NOT i.indisprimary
ORDER BY pg_relation_size(s.indexrelid) DESC;
```

**MySQL 8** — necesita `performance_schema` activo:

```sql
SELECT object_schema, object_name AS tabla, index_name AS indice
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL
  AND index_name <> 'PRIMARY'
  AND count_star = 0
  AND object_schema NOT IN ('mysql','performance_schema','sys')
ORDER BY object_schema, object_name;
```

Dos advertencias antes de que borres nada:

1. **`idx_scan = 0` significa "no se usó desde que se reiniciaron las estadísticas"**, no "no sirve". Si reiniciaste la base la semana pasada, el informe miente. Mira primero `stats_reset` en `pg_stat_database`.
2. **Un índice puede existir para un reporte mensual** que corre el día 1. Antes de borrar, pregunta.

La jugada segura en PostgreSQL es desactivarlo antes de borrarlo:

```sql
UPDATE pg_index SET indisvalid = false
WHERE indexrelid = 'nombre_del_indice'::regclass;
```

Lo dejas una semana, nadie se queja, y entonces sí: `DROP INDEX CONCURRENTLY nombre_del_indice;`.

## Checklist antes de agregar un índice

Esto es lo que yo me pregunto antes de meter uno nuevo, sobre todo en tablas que escriben mucho:

1. **¿Hay una consulta real y lenta que lo justifique?** Un `EXPLAIN ANALYZE` con el plan actual, no una corazonada.
2. **¿Cuántas escrituras por segundo recibe esta tabla?** En una tabla de auditoría con 2.000 `INSERT/s`, un índice más son 2.000 escrituras más por segundo.
3. **¿La columna es creciente o aleatoria?** Creciente (`id`, `created_at`) es barato. Aleatoria (`uuid`, `email`, `hash`) parte páginas.
4. **¿Ya existe un índice compuesto que lo cubra?** Un índice sobre `(a, b)` ya sirve para consultas por `a`. Uno nuevo sobre `a` solo sería duplicado.
5. **¿Puedo usar un índice parcial?** `WHERE estado = 'activo'` indexa el 5% de la tabla en vez del 100%.
6. **¿Lo voy a medir después?** Agenda revisar `idx_scan` en dos semanas. Si sigue en cero, sobra.

## Lo que me llevo

Los índices no son gratis. Son un préstamo: te adelantan velocidad de lectura y lo cobras en cada escritura, con intereses cuando los valores llegan desordenados.

La próxima vez que alguien en el equipo diga *"pongamos un índice por si acaso"*, la pregunta correcta no es "¿sirve?". Es:

> ¿Cuántas escrituras le acabo de sumar a cada `INSERT` de esta tabla?

## Fuentes

- PostgreSQL — [Indexes and their cost on writes](https://www.postgresql.org/docs/current/indexes-intro.html)
- PostgreSQL — [pg_stat_user_indexes / Monitoring stats](https://www.postgresql.org/docs/current/monitoring-stats.html)
- MySQL — [How indexes affect INSERT/UPDATE](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html)
- Use The Index, Luke — [The cost of indexes on INSERT](https://use-the-index-luke.com/sql/dml/insert)
