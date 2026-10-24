---
title: "Secret Rotation Without Downtime: The Step-by-Step Runbook"
description: "Rotating is not changing a key, it is changing it without anyone noticing. Overlap window with two valid credentials, hot reload, and how to confirm nobody uses the old one."
date: 2026-10-25
tags: ["security", "devops", "secrets", "infrastructure", "backend"]
draft: false
---

You rotated the database password for security. You followed the manual, you met the standard, and you still took production down.

It is not that rotating is wrong. It is that you changed the key in one place while half the system was still using the old one.

Rotating is not changing a value. It is changing it **without anyone noticing**.

## Why it breaks: your system is not one thing

You think changing a key is instant. It is not, because you do not have one process: you have many, on many machines.

And almost all of them read the credential **once, at start-up**, and hold it in memory. You stored the new value in the secrets manager, fine, but those processes will keep using the old one until they restart.

Two things happen at once, and both hurt:

1. **The ones that did not find out keep using the old key.** If the old key no longer works, they fail authentication immediately.
2. **There is always something that does not find out.** A worker, an hourly cron, a replica that took longer to boot, a container nobody remembered.

Rotating without reload is just changing a row in a database.

## The fix: let both keys live for a while

The core idea is to not flip from one to the other. **Leave both valid during a window.**

It is called dual-secret rotation, and the order matters:

![Phases of a zero-downtime rotation: accept both, propagate, verify and retire](/blog/secret-rotation-phases-en.svg)

### Phase 1 — Create the new one, do not touch the old one

You generate the new credential and make it available, but **you do not retire the previous one**. At this point the system accepts both.

For a database this usually means a second user with the same permissions:

```sql
-- PostgreSQL: new user with the same privileges, old one untouched
CREATE USER app_user_b WITH PASSWORD 'new-password';
GRANT app_role TO app_user_b;
```

For an API with its own keys, it means issuing a second active key. For JWT, it means publishing the new public key in the JWKS **while keeping the previous one** until the tokens in circulation expire.

### Phase 2 — Propagate calmly

You update the secret in the manager and let it reach every consumer. You have two paths:

- **Hot reload:** the service re-reads the secret every N minutes or on a notification. This is the ideal and the least painful.
- **Controlled restart:** a rolling deploy, replica by replica. If you cannot hot reload, at least restart on your own terms rather than waiting for the app to fall over.

A simple hot reload in Python:

```python
import time, boto3

_cache = {"value": None, "expires": 0}
_sm = boto3.client("secretsmanager")

def get_secret(name, ttl=300):
    now = time.time()
    if _cache["value"] is None or now > _cache["expires"]:
        resp = _sm.get_secret_value(SecretId=name)
        _cache["value"] = resp["SecretString"]
        _cache["expires"] = now + ttl
    return _cache["value"]
```

With a five-minute TTL, your whole fleet converges on its own in five minutes. No restarts.

On Kubernetes, secrets mounted as volumes update themselves inside the pod (with up to a minute of delay), but **the ones injected as environment variables do NOT**: those require a restart. It is one of the most common confusions.

### Phase 3 — Verify nobody uses the old one

This is the phase almost everyone skips, and the one that turns the runbook into something safe.

Do not disable the old credential because "enough time has passed". Disable it when **the data confirms** nobody is using it:

```sql
-- PostgreSQL: active connections per user
SELECT usename, count(*), max(backend_start) AS most_recent_connection
FROM pg_stat_activity
WHERE usename IN ('app_user_a', 'app_user_b')
GROUP BY usename;
```

If `app_user_a` still shows recent connections, something is still on the old key. Find it before moving on.

On AWS, Secrets Manager emits access events to CloudTrail. In Vault, every lease tells you who asked for what and when.

### Phase 4 — Retire the old one

Now you can. And reversibly first, if your engine allows it: disable before deleting, so you can roll back if something surfaces.

```sql
-- Disable without deleting: reversible in seconds
ALTER USER app_user_a NOLOGIN;
-- After a few days with no incidents:
DROP USER app_user_a;
```

## The runbook, condensed

1. **Confirm the system can accept two credentials at once.** If it cannot, that is the first thing to fix; do not rotate yet.
2. **Create the new credential** without touching the old one.
3. **Update the secrets manager.**
4. **Propagate:** wait out the reload TTL or trigger a rolling restart.
5. **Verify with metrics** that nobody uses the old one. Not with the clock.
6. **Disable the old one** (reversible).
7. **Wait a few days** and only then delete it.
8. **Document the window** you used, so the next rotation is not improvised.

## Checklist before rotating in production

1. **Does the system validate two secrets at once?** If not, zero-downtime rotation is not possible.
2. **Do services hot reload, or do they need a restart?** If they need a restart, plan it; do not discover it mid-rotation.
3. **Do you have an inventory of who uses this credential?** Workers and crons are always the forgotten ones.
4. **Is there a metric to see who is still on the old key?** Without it, disabling the old one is a bet.
5. **Can you roll back in under a minute?** Disable instead of delete.
6. **Are you doing this by hand?** Rotating manually at midnight is exactly how production goes down. Automate it.
7. **Did you start with a low-impact credential?** Do not debut the procedure on the production database key.

## What I take away

The problem is not the new key. It is the moment you kill the old one.

Next time you rotate something in production, ask the uncomfortable question:

> While it propagates, does the system still accept the old value? And how will I find out who is still using it?

## Sources

- AWS Secrets Manager — [Rotation strategies: single vs alternating user](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
- HashiCorp Vault — [Leases, renew and revoke](https://developer.hashicorp.com/vault/docs/concepts/lease)
- OWASP — [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- Kubernetes — [Secrets: mounted volumes vs environment variables](https://kubernetes.io/docs/concepts/configuration/secret/)
- Google Cloud — [Secret Manager rotation](https://cloud.google.com/secret-manager/docs/secret-rotation)
