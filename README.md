# Aditya Kumar Singh

### RED DIRECTOR

I build task systems and run model experiments. I’m interested in how software behaves under failure, whether state can be trusted, and what measurements can tell us about models.

## What I do

- **Build systems:** I’m developing a Python workflow engine for dependency scheduling, retries, timeouts, failure handling, and durable history in SQLite.
- **Study model internals:** I ran an independent sparse autoencoder experiment based on Anthropic’s work, tracking reconstruction quality and feature activity.

## Selected work

### Orchestration Engine

A fault-tolerant, zero-dependency distributed workflow and agentic graph orchestration engine built entirely in the Python 3.10+ standard library. Features cyclic reflection graphs with SQLite thread checkpointing, distributed Sagas with backward compensating rollback, O(1) constant-memory streaming with SQLite disk spooling, multi-node Change Data Capture (CDC) replication, content-addressable incremental task evaluation, distributed work-stealing, multi-tenant fair-share quotas, and self-healing watchdog supervision without Redis, RabbitMQ, or Celery. Verified across 298 passing automated tests (92.60% coverage) and 158 frozen public API symbols.

### SAE Reproduction

An independent reproduction experiment using a GELU-1L model and a sparse autoencoder with 2,048 input dimensions and 4,096 features. Project notes report a validation cosine similarity of 0.897562 and 0.10% dead features; the training configuration and evaluation procedure still need fuller documentation.

## How I work

I start by understanding how a system behaves, including when it fails. I test those paths before calling the work done, and I use AI tools while staying responsible for understanding the code I ship.

## Find me

[GitHub](https://github.com/Reddirector) · [LinkedIn](https://linkedin.com/in/aditya-kumar-singh-6131b82a4) · [X](https://x.com/KumarAditya6430)
