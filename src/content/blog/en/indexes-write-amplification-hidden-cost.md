---
title: "Indexes You Did Not Know You Were Paying For: Write Amplification Explained"
description: "Your SELECTs fly and your INSERTs crawl. What each index really charges you on every write, how to measure it, and the query that tells you which ones you can drop today."
date: 2026-10-24
tags: ["databases", "postgresql", "mysql", "performance", "backend"]
draft: false
---

You added indexes so the database would fly. And the reads do fly: that `SELECT` that took eight seconds now answers in twenty milliseconds. You did the right thing.

And still, months later, the `INSERT`s crawl. Nobody changed the write path. Same server. But something got slow and it shows up in no log.

It is not that indexes are wrong. It is that the same index that speeds up a read charges you on every write, and almost nobody measures that bill.

## An index is not "a little help"

It is a separate data structure. In PostgreSQL and MySQL (InnoDB) it is usually a **B-tree**: an ordered tree living on disk, with its own pages and its own maintenance.

When you read, that is wonderful. Instead of walking the table row by row, the engine descends the tree and lands directly on the answer. You go from *searching* to *finding*.

When you write, it is another story. That structure has to stay **in sync with the table**, and that costs.

![How a write with indexes multiplies into physical writes](/blog/write-amplification-flow-en.svg)

## First: one write of yours is many underneath

You insert a row. To you it is one operation.

Not to the engine. It writes to the table, and it also **updates every index that row touches**. If the table has five indexes, your `INSERT` just became six writes.

The simplest way to think about it:

> actual writes ≈ 1 (the table) + N (the affected indexes)

With `UPDATE` it gets worse and subtler: only the indexes whose **indexed columns** change get touched. If you update `updated_at` and you have an index on `updated_at`, you pay for it. If you update a non-indexed field, you do not. That is why two `UPDATE`s that look equally innocent can cost wildly different amounts.

## Second: it is not just more, it is disordered

This is the part that really sinks performance and the one that almost never gets measured.

Indexes **do not fill in order**. You insert a value that belongs in the middle of the tree and the engine has to place it there: find the right page, and if it does not fit, **split it in two** and redistribute the keys.

That is a *page split*. It is not writing a bit more: it is writing more, in scattered places on disk, with reorganisation in between.

An index on an auto-incrementing column (`id`, `created_at`) almost always inserts at the end of the tree: cheap and ordered. An index on a `UUID v4` or an `email` inserts anywhere: expensive and fragmented.

That is why a table with twenty indexes makes `INSERT`s painfully slow, and why everything looked perfect at first: the degradation arrives once the tree grows past comfortable memory residency.

## The query that tells you what to drop

Both engines track usage statistics. You are never going to guess better than they do.

**PostgreSQL** — indexes with zero scans since stats were last reset:

```sql
SELECT
  s.schemaname,
  s.relname  AS table_name,
  s.indexrelname AS index_name,
  s.idx_scan AS times_used,
  pg_size_pretty(pg_relation_size(s.indexrelid)) AS size
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.idx_scan = 0
  AND NOT i.indisunique
  AND NOT i.indisprimary
ORDER BY pg_relation_size(s.indexrelid) DESC;
```

**MySQL 8** — requires `performance_schema` enabled:

```sql
SELECT object_schema, object_name AS table_name, index_name
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL
  AND index_name <> 'PRIMARY'
  AND count_star = 0
  AND object_schema NOT IN ('mysql','performance_schema','sys')
ORDER BY object_schema, object_name;
```

Two warnings before you drop anything:

1. **`idx_scan = 0` means "unused since stats were reset"**, not "useless". If you restarted the database last week, the report lies. Check `stats_reset` in `pg_stat_database` first.
2. **An index may exist for a monthly report** that runs on the 1st. Before dropping, ask.

The safe play in PostgreSQL is to disable it before dropping it:

```sql
UPDATE pg_index SET indisvalid = false
WHERE indexrelid = 'index_name'::regclass;
```

Leave it a week, nobody complains, and then yes: `DROP INDEX CONCURRENTLY index_name;`.

## Checklist before adding an index

This is what I ask myself before adding a new one, especially on write-heavy tables:

1. **Is there a real, slow query that justifies it?** An `EXPLAIN ANALYZE` with the current plan, not a hunch.
2. **How many writes per second does this table take?** On an audit table doing 2,000 `INSERT/s`, one more index is 2,000 more writes per second.
3. **Is the column increasing or random?** Increasing (`id`, `created_at`) is cheap. Random (`uuid`, `email`, `hash`) splits pages.
4. **Does a composite index already cover it?** An index on `(a, b)` already serves queries on `a`. A new one on `a` alone would be redundant.
5. **Can I use a partial index?** `WHERE status = 'active'` indexes 5% of the table instead of 100%.
6. **Am I going to measure it afterwards?** Put a reminder to check `idx_scan` in two weeks. If it is still zero, it is dead weight.

## What I take away

Indexes are not free. They are a loan: they advance you read speed and charge it back on every write, with interest when the values arrive out of order.

Next time someone on the team says *"let's add an index just in case"*, the right question is not "does it help?". It is:

> How many writes did I just add to every `INSERT` on this table?

## Sources

- PostgreSQL — [Indexes and their cost on writes](https://www.postgresql.org/docs/current/indexes-intro.html)
- PostgreSQL — [Monitoring stats / pg_stat_user_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html)
- MySQL — [How indexes affect INSERT/UPDATE](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html)
- Use The Index, Luke — [The cost of indexes on INSERT](https://use-the-index-luke.com/sql/dml/insert)
