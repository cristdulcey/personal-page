---
title: "AI Does Not Think: Architecture Guide & Anti-Hallucination Checklist"
description: "Why LLMs sound like senior engineers while inventing APIs, the 4-level architectural decision map, and a practical checklist for code reviews."
date: 2026-10-24
tags: ["artificial-intelligence", "architecture", "software-development", "llm", "code-review"]
draft: false
---

You ask a technical question to an AI model. It responds with disarming confidence, pristine syntax, clean variable names, and clear documentation.

You copy the snippet, paste it into your project... and it crashes immediately. It turns out the function it recommended doesn\'t exist in your library version—or worse: it invented a perfectly plausible parameter name that was never part of the API.

Sounds familiar?

This is the most common pitfall when building with AI: **confusing eloquence with comprehension**. The model doesn\'t reason the way software engineers do when designing architecture. It has no mental model of your codebase, feels no friction when a build breaks, and doesn\'t know what a bug is.

To build production-grade software with these tools, we must demystify them. In this article, I break down what is mathematically happening under the hood, provide an architectural decision framework for when to use each tier of technology, and share the exact checklist I use to audit AI-generated Pull Requests.

---

## 1. Demystifying the Math: What an LLM Actually Does

In academic papers, autoregressive language models are formally described with equations like:

$$$\\arg\\max_{w_t} P(w_t \\mid w_1, w_2, \\dots, w_{t-1})$$

Stripping away the academic notation, here is what this means in plain software engineering terms:

* **w_1, w_2, \\dots, w_{t-1}**: The accumulated context window (your prompt, system instructions, and previous generated tokens).
* **P(w_t \\mid \\dots)**: The probability distribution over the model\'s vocabulary: *\"Given everything written so far, what is the probability of each token being next?*"
* **\\arg\\max**: Selecting the token with the highest probability (or sampling within top candidates based on temperature).

Simply put: **the model is a statistical engine predicting the next fragment of text**.

![How an LLM generates code step by step](/blog/token-generation-flow-en.svg)

The model does not consult a live database or run an interpreter while typing. It matches activation patterns across high-dimensional vector spaces. If an invented API method looks statistically plausible given your prompt, the model will output it without hesitation.

---

## 2. The Four Tiers: When to Use What

One of the most expensive architectural mistakes today is reaching for an LLM to solve problems that traditional, deterministic code handles faster, cheaper, and reliably. Here is the 4-tier decision framework:

![Architectural Decision Map](/blog/decision-map-4-levels-en.svg)

If your requirements are governed by deterministic business logic, **use traditional code**. You save latency, eliminate token costs, and avoid non-deterministic anomalies in production.

---

## 3. Three Silent Failure Modes in Production

When engineering teams roll out AI coding assistants across large repos, three failure modes consistently emerge:

### 1. Syntactically Valid Hallucinations
The code passes TypeScript compilation, passes the linter, and reads like clean production code. Yet it invokes a method deprecated two years ago or assumes a third-party webhook returns fields it never sent. This is dangerous because it easily slips past human code reviewers.

### 2. Context Blindness in Large Repositories
Even with 1M+ token context windows, attention mechanisms are not uniform. Models exhibit "needle in a haystack" degradation, heavily weighting the beginning and end of the prompt while missing subtle edge cases in the middle.

### 3. Premature Delegation
Prompting an autonomous agent with *{Fix the checkout bug** without providing telemetry, stack traces, or reproduction boundaries. The agent will flounder, refactoring unrelated files. The human engineer must remain the architect who frames the hypothesis.

---

## 4. Anti-Hallucination Checklist for Code Reviews

Use this checklist before merging any Pull Request containing AI-assisted code:

* [ ] **1. External API & Package Verification:** Do the methods, parameters, and signatures exist in the exact package version locked in `package.json` or `requirements.txt`?
* [ ] **2. Deterministic Validation:** Does the PR include reproducible unit or integration tests that failed before the fix and pass after?
* [ ] **3. Zero Unintended Cide Effects:** Is the diff strictly scoped to the task, or did the model take the liberty of "cleaning up" adjacent methods?
* [ ] **4. Error Handling & Timeouts:** What happens on 5xx responses, rate limits, or network timeouts? LLMs default heavily to the happy path.
* [ ] **5. Security & Authorization:** Does the code enforce RBAC and sanitize inputs, or does it naively assume callers are trusted?
* [ ] **6. Architectural Integrity:** Does this change resolve the root cause, or is it merely silencing the symptom with a superficial patch?

---

## What\'s Next?

In **Episode 2** of our YouTube series, we will unpack where all of this started: 70 years of milestones, the AI winters, and the seminal 2017 Google paper (*Attention Is All You Need*) that transformed modern computing.

If you have a personal rule or review check that saved you from an outage, share it in the comments below. See you in the next one!
