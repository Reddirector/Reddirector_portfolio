# Aditya Kumar Singh

### RED DIRECTOR

I build task systems and run model experiments. I’m interested in how software behaves under failure, whether state can be trusted, and what measurements can tell us about models.

## What I do

- **Build systems:** I’m developing a Python workflow engine for dependency scheduling, retries, timeouts, failure handling, and durable history in SQLite.
- **Study model internals:** I ran an independent sparse autoencoder experiment based on Anthropic’s work, tracking reconstruction quality and feature activity.
- **Make software:** I built ValtSky, a native Android app for backing up photos and videos through the Telegram Bot API, in three days with Kotlin and AI tools.

## Selected work

### Orchestration Engine

A first-principles workflow engine built with Python 3.12+, SQLite, and the standard library. Its current project notes report 58 passing tests. Task transitions are recorded in SQLite before live state changes, keeping the durable history aligned with the running system. The project is at v0.1.0, Stage 1 of a six-stage plan.

### SAE Reproduction

An independent reproduction experiment using a GELU-1L model and a sparse autoencoder with 2,048 input dimensions and 4,096 features. Project notes report a validation cosine similarity of 0.897562 and 0.10% dead features; the training configuration and evaluation procedure still need fuller documentation.

### ValtSky

A Kotlin native Android app for photo and video backup using the Telegram Bot API. I built it in three days with AI assistance, and keep it distinct from my systems and research work.

### Pentagon

A private project. I keep its public description brief until I can share verified details.

## How I work

I start by understanding how a system behaves, including when it fails. I test those paths before calling the work done, and I use AI tools while staying responsible for understanding the code I ship.

## Find me

[GitHub](https://github.com/Reddirector) · [LinkedIn](https://linkedin.com/in/aditya-kumar-singh-6131b82a4) · [X](https://x.com/KumarAditya6430)
