// Portfolio content: copy, links, and project details.
export const content = {
  name: 'Aditya Kumar Singh', handle: 'Red director', accent: '#A40000',
  intro: 'I build task systems and run model experiments. I care about what happens when work fails, whether saved state can be trusted, and what the measurements actually say.',
  philosophy: 'I start by figuring out how a system behaves, including when it fails. Then I test those paths before I call the work done. I use AI tools, but I still need to understand the code I ship.',
  links: { github: 'https://github.com/Reddirector/Orchestration_Engine', linkedin: 'https://linkedin.com/in/aditya-kumar-singh-6131b82a4', x: 'https://x.com/KumarAditya6430' },
  projects: [
    {
      id: '01',
      name: 'Orchestration Engine',
      tag: 'Python 3.12+ · SQLite WAL · 0 Dependencies · v0.9.0 Beta',
      color: '#A40000',
      ink: 'light',
      short: 'A fault-tolerant, dependency-aware workflow orchestration engine for Python with zero external runtime dependencies.',
      detail: 'Engineered with 0 runtime dependencies, 162 automated tests (100% pass, 0 flakes across 20 runs), and 91.45% coverage. Delivers 627.23 µs scheduling latency (1,594 tasks/sec), single-writer SQLite WAL persistence (44,730 writes/sec), 7.86x concurrency speedup across 8 cores (98.2% efficiency), true SIGKILL process isolation, crash resumption, and complete CLI tooling.',
      link: 'https://github.com/Reddirector/Orchestration_Engine',
      pypi: 'https://pypi.org/project/orchestration-engine/',
      docs: 'https://reddirector.github.io/Orchestration_Engine/',
      release: 'https://github.com/Reddirector/Orchestration_Engine/releases/tag/v0.9.0',
      install: 'pip install orchestration-engine',
    },
    { id: '02', name: 'SAE Reproduction', tag: 'Research paper reproduction · Interpretability', color: '#A40000', ink: 'light', short: 'An independent sparse autoencoder experiment based on Anthropic’s paper. The project notes report a 0.897562 validation cosine similarity and 0.10% dead features.', detail: 'The project notes list a GELU-1L model and an SAE with 2,048 input dimensions and 4,096 features. They report a validation cosine similarity of 0.897562 and 0.10% dead features. The training configuration and exact evaluation procedure still need documenting.' },
    { id: '03', name: 'Pentagon', tag: 'FastAPI · LangGraph · Local RAG · BYOK Encryption', color: '#A40000', ink: 'light', short: 'An enterprise-grade, local-first multimodal AI workstation built with BYOK Fernet encryption, LangGraph state machine, local ChromaDB document RAG, and cross-platform native compilation.', detail: 'Pentagon is an enterprise-grade AI workstation engineered for private multimodal intelligence with a strict Bring Your Own Key (BYOK) architecture and local Fernet encryption (AES-128-CBC + HMAC) at rest. It features on-device ChromaDB document retrieval with fail-safe automatic migration to local CPU embeddings (all-MiniLM-L6-v2), hierarchical autonomy governance across 6 risk categories and 4 permission tiers, and multimodal vision/voice pipelines. Packaged simultaneously for Web (Vercel SPA), Mobile (Capacitor Android APK / iOS), Desktop (Electron Windows/Linux), and offline bootable ISO.', link: 'https://pentagon-bice.vercel.app' },
  ],
  metrics: [{ value: 162, suffix: '/162', label: 'orchestration tests passing (91.5% cov)' }, { value: 627, suffix: ' µs', label: 'coordinator scheduling latency per task' }, { value: 44730, suffix: '/s', label: 'SQLite WAL event write throughput' }, { value: 7.86, suffix: 'x', label: 'concurrency speedup (8 workers, 98.2% eff)' }],
  now: [
    { name: 'Orchestration Engine v0.9.0', text: 'Published v0.9.0 on PyPI: pure Python 3.12+ stdlib workflow engine with zero external runtime dependencies, 162 tests (100% pass), 627 µs scheduling latency, 44,730 writes/sec SQLite WAL throughput, 7.86x concurrency speedup, and dual MIT/Apache-2.0 licensing.' },
    { name: 'Pentagon AI Workstation', text: 'Developing an enterprise-grade local-first AI workstation featuring zero-leak BYOK Fernet encryption, LangGraph deterministic state orchestration, ChromaDB vector RAG with CPU failover, and multi-tier autonomy governance across Web, Android APK, Electron, and ISO.' },
  ],
}
