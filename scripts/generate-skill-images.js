import fs from 'fs';
import path from 'path';

const skillsDir = path.resolve('public/images/skills');
if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });

const SKILLS_DATA = [
  {
    id: 'python',
    name: 'Python 3.12+',
    category: 'Core Language',
    color: '#387EB8',
    color2: '#FFE873',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#387EB8" d="M63.4 4c-32.4 0-30.5 14-30.5 14l.03 14.5h31v4.4H20S4 35 4 67.4c0 32.5 15.8 31.4 15.8 31.4h9.4V85.7s-.5-15.8 15.6-15.8h30.8s15 .3 15-14.7V18.7S92.4 4 63.4 4zm-17 9.8c3.1 0 5.6 2.5 5.6 5.6s-2.5 5.6-5.6 5.6-5.6-2.5-5.6-5.6 2.5-5.6 5.6-5.6z"/><path fill="#FFE873" d="M64.6 124c32.4 0 30.5-14 30.5-14l-.03-14.5h-31v-4.4H108s16 1.9 16-30.5c0-32.5-15.8-31.4-15.8-31.4h-9.4v13.1s.5 15.8-15.6 15.8H52.4s-15-.3-15 14.7v36.5s-1.8 14.7 27.2 14.7zm17-9.8c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6z"/></svg>`,
    desc: 'Primary language for systems, backend DAG orchestrators, ML models, and high-performance tooling.'
  },
  {
    id: 'javascript',
    name: 'JavaScript / ESNext',
    category: 'Web Engineering',
    color: '#F7DF1E',
    color2: '#E5A00D',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect width="128" height="128" rx="14" fill="#F7DF1E"/><path fill="#000" d="M37.6 101.4c3.4 5.5 8 9.3 15.6 9.3 7 0 11.5-3.5 11.5-8.4 0-5.8-4.6-7.9-12.4-11.3l-4.3-1.8c-12.2-5.2-20.3-11.8-20.3-25.7 0-13 10-22.9 25.6-22.9 11 0 19 4.3 24.6 14.2l-12.4 8c-2.7-5-6-7.2-12.2-7.2-5.5 0-9.2 3.5-9.2 7.8 0 5.2 3.6 7.3 11.8 10.8l4.3 1.9c14.3 6.1 21.2 12.6 21.2 26.6 0 15.2-11.9 23.9-28 23.9-15.8 0-25.5-7.7-29.6-17.2l13.9-8zm54.3-58.7h16.2v49.1c0 9.8 5.7 13.9 13.7 13.9 4.8 0 8.3-1 10.3-2.1v13.6c-3.7 1.8-9.4 3-16.7 3-17.5 0-23.5-10.4-23.5-26.6V42.7z"/></svg>`,
    desc: 'Interactive DOM engines, WebGL, custom canvas pipelines, and smooth UI orchestration.'
  },
  {
    id: 'sql',
    name: 'SQL & Relational Databases',
    category: 'Data Persistence',
    color: '#336791',
    color2: '#68B0E8',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#336791" d="M64 12C33.1 12 8 20.1 8 30v68c0 9.9 25.1 18 56 18s56-8.1 56-18V30c0-9.9-25.1-18-56-18zm0 10c26.5 0 46 6.3 46 8s-19.5 8-46 8-46-6.3-46-8 19.5-8 46-8zm46 28c0 1.7-19.5 8-46 8s-46-6.3-46-8V43.5c10.8 4.7 27.4 7.5 46 7.5s35.2-2.8 46-7.5V50zm0 24c0 1.7-19.5 8-46 8s-46-6.3-46-8V67.5c10.8 4.7 27.4 7.5 46 7.5s35.2-2.8 46-7.5V74zm0 24c0 1.7-19.5 8-46 8s-46-6.3-46-8V91.5c10.8 4.7 27.4 7.5 46 7.5s35.2-2.8 46-7.5V98z"/></svg>`,
    desc: 'Schema design, parameterized queries, SQLite WAL (44.7k writes/sec), indexing, and ACID transactions.'
  },
  {
    id: 'cpp',
    name: 'C++ & Systems Algorithms',
    category: 'Systems & DSA',
    color: '#00599C',
    color2: '#659AD2',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#00599C" d="M64 14l46 26.6v53.2L64 120.4 18 93.8V40.6L64 14zm-14.7 34c-11.8 0-21.3 9.5-21.3 21.3s9.5 21.3 21.3 21.3c8.5 0 15.8-5 19.1-12.2l-9.1-4.6c-1.8 4.2-6 7.1-10 7.1-6.4 0-11.6-5.2-11.6-11.6s5.2-11.6 11.6-11.6c4.1 0 8.2 2.9 10 7.1l9.1-4.6c-3.3-7.2-10.6-12.2-19.1-12.2zm38.7 15.3h-4v6h4v4h6v-4h4v-6h-4v-4h-6v4zm18 0h-4v6h4v4h6v-4h4v-6h-4v-4h-6v4z"/></svg>`,
    desc: 'Data structures, algorithm design, pointer semantics, memory optimization, and competitive LeetCode practice.'
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'Version Control',
    color: '#F05032',
    color2: '#FA7A60',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#F05032" d="M125.6 57.6L70.4 2.4c-3.2-3.2-8.3-3.2-11.5 0L42.5 18.8l14.7 14.7c3.4-1.1 7.4-.3 10.1 2.4 2.7 2.7 3.5 6.7 2.4 10.1l14.1 14.1c3.4-1.1 7.4-.3 10.1 2.4 3.8 3.8 3.8 10 0 13.8-3.8 3.8-10 3.8-13.8 0-2.9-2.9-3.7-7.2-2.2-10.7L67.1 52v33.4c.9.5 1.7 1.2 2.4 1.9 3.8 3.8 3.8 10 0 13.8-3.8 3.8-10 3.8-13.8 0-3.8-3.8-3.8-10 0-13.8.9-.9 1.9-1.6 3-2.1V51.7c-1.1-.5-2.1-1.2-3-2.1-2.9-2.9-3.7-7.3-2.2-10.8L38.9 24.2 2.4 60.7c-3.2 3.2-3.2 8.3 0 11.5l55.2 55.2c3.2 3.2 8.3 3.2 11.5 0l56.5-56.5c3.2-3.2 3.2-8.3 0-11.5v-1.8z"/></svg>`,
    desc: 'Trunk-based development, branch isolation, clean atomic commit histories, CI/CD, and release packaging.'
  },
  {
    id: 'linux',
    name: 'Linux Environment',
    category: 'Operating Systems',
    color: '#FCC624',
    color2: '#E5A808',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#FCC624" d="M64 4C45 4 38 18 38 34c0 9 2 22 5 30-10 14-23 32-23 48 0 7 14 10 44 10s44-3 44-10c0-16-13-34-23-48 3-8 5-21 5-30 0-16-7-30-26-30z"/><circle cx="52" cy="30" r="4" fill="#000"/><circle cx="76" cy="30" r="4" fill="#000"/><polygon points="64,36 56,48 72,48" fill="#F7761F"/><path fill="#FFF" d="M64 66c-18 0-28 16-28 36 0 12 12 18 28 18s28-6 28-18c0-20-10-36-28-36z"/></svg>`,
    desc: 'Bash scripting, POSIX signals, process executors, daemon orchestration, systemd, and terminal tooling.'
  },
  {
    id: 'docker',
    name: 'Docker & Containerization',
    category: 'DevOps & Packaging',
    color: '#2496ED',
    color2: '#68B8F6',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#2496ED" d="M124 55.5c-3.2-1.8-10.4-1.9-15.6.8-1.5-10.1-9.5-17.7-19.4-18.7l-4.2-.4-1.4 4c-3.7 10.4-.6 21.6 7.4 28.5-4.5 2.5-12.7 2.4-17.1.8l-3.3-1.2-1.9 3c-8.9 14.1-23.7 22.7-40 23.3-14.7.6-28.9-6.3-37.3-17.6L9 75.3 6 78c-4.4 3.9-6 10.4-3.8 15.9C8.3 108 26.3 118 47 118c44.8 0 79-24.8 80.8-62.5h-3.8zM45 28H31v14h14V28zm18 0H49v14h14V28zm18 0H67v14h14V28zm-36 18H31v14h14V46zm18 0H49v14h14V46zm18 0H67v14h14V46zm18 0H85v14h14V46zM27 46H13v14h14V46z"/></svg>`,
    desc: 'Multi-stage builds, container isolation, environment parity, minimal base images, and local orchestration.'
  },
  {
    id: 'uv-pip',
    name: 'uv, pip & Virtualenvs',
    category: 'Python Tooling',
    color: '#DE5FE9',
    color2: '#A828B4',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect width="128" height="128" rx="20" fill="#201A24"/><polygon points="28,24 64,104 100,24 82,24 64,68 46,24" fill="#DE5FE9"/><circle cx="64" cy="98" r="8" fill="#58E3A8"/></svg>`,
    desc: 'Blazing fast Python packaging with Astral uv, strict lockfiles, PEP 517/621, and zero-leak virtualenvs.'
  },
  {
    id: 'orchestration',
    name: 'Workflow Orchestration',
    category: 'Systems Engineering',
    color: '#E5484D',
    color2: '#FF757A',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="28" cy="38" r="14" fill="#E5484D"/><circle cx="28" cy="90" r="14" fill="#E5484D"/><circle cx="100" cy="64" r="16" fill="#58E3A8"/><path d="M42 38 C70 38 75 56 86 62 M42 90 C70 90 75 72 86 66" stroke="#FFF" stroke-width="4" fill="none"/></svg>`,
    desc: 'Deterministic DAG execution, topological scheduling, single-writer coordinator, and zero external runtime dependencies.'
  },
  {
    id: 'retries',
    name: 'Retries & Exponential Backoff',
    category: 'Fault Tolerance',
    color: '#E5484D',
    color2: '#F79009',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path d="M24 104 Q48 100 72 70 T112 24" stroke="#F79009" stroke-width="6" fill="none"/><circle cx="24" cy="104" r="6" fill="#FFF"/><circle cx="64" cy="80" r="6" fill="#FFF"/><circle cx="108" cy="28" r="7" fill="#58E3A8"/></svg>`,
    desc: 'Configurable RetryPolicy with linear/exponential backoff, full jitter, and persistent budget exhaustion guards.'
  },
  {
    id: 'failure',
    name: 'Transitive Cancellation',
    category: 'Graph Algorithms',
    color: '#E5484D',
    color2: '#9B1C1C',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="32" cy="64" r="14" fill="#E5484D"/><circle cx="96" cy="36" r="12" fill="#666"/><circle cx="96" cy="92" r="12" fill="#666"/><path d="M46 64 L84 36 M46 64 L84 92" stroke="#E5484D" stroke-width="4"/><line x1="24" y1="56" x2="40" y2="72" stroke="#FFF" stroke-width="4"/><line x1="40" y1="56" x2="24" y2="72" stroke="#FFF" stroke-width="4"/></svg>`,
    desc: 'Single-pass fixpoint cancellation across deep dependent branches without stalling parallel unaffected tasks.'
  },
  {
    id: 'timeouts',
    name: 'POSIX SIGKILL Timeouts',
    category: 'Process Isolation',
    color: '#E5484D',
    color2: '#F04438',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="64" cy="64" r="48" stroke="#E5484D" stroke-width="6" fill="none"/><line x1="64" y1="32" x2="64" y2="64" stroke="#FFF" stroke-width="6" stroke-linecap="round"/><line x1="64" y1="64" x2="88" y2="64" stroke="#FFF" stroke-width="6" stroke-linecap="round"/><circle cx="64" cy="64" r="6" fill="#E5484D"/></svg>`,
    desc: 'Enforcing hard timeouts via child process process-group SIGKILL termination, eliminating thread-stall zombie leaks.'
  },
  {
    id: 'state-machines',
    name: 'Formal State Machines',
    category: 'Concurrency Control',
    color: '#E5484D',
    color2: '#68B0E8',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect x="18" y="24" width="40" height="24" rx="4" fill="#387EB8"/><rect x="70" y="24" width="40" height="24" rx="4" fill="#FFE873"/><rect x="44" y="80" width="40" height="24" rx="4" fill="#58E3A8"/><path d="M38 48 L54 80 M90 48 L74 80" stroke="#FFF" stroke-width="3"/></svg>`,
    desc: 'Strict invariants across PENDING, READY, RUNNING, SUCCEEDED, FAILED, RETRY_WAIT, and CANCELLED.'
  },
  {
    id: 'event-logging',
    name: 'Append-Only Event Log',
    category: 'Durable Storage',
    color: '#E5484D',
    color2: '#58E3A8',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect x="24" y="16" width="80" height="96" rx="8" fill="#1C1819" stroke="#E5484D" stroke-width="4"/><line x1="38" y1="38" x2="90" y2="38" stroke="#58E3A8" stroke-width="4"/><line x1="38" y1="56" x2="90" y2="56" stroke="#FFF" stroke-width="4"/><line x1="38" y1="74" x2="75" y2="74" stroke="#FFF" stroke-width="4"/><line x1="38" y1="92" x2="85" y2="92" stroke="#E5484D" stroke-width="4"/></svg>`,
    desc: 'Write-ahead SQLite WAL persistence (44,730 writes/sec) committed to disk prior to in-memory state mutation.'
  },
  {
    id: 'api-design',
    name: 'API Surface & Packaging',
    category: 'Architecture',
    color: '#E5484D',
    color2: '#FFE873',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><polygon points="64,16 112,44 112,84 64,112 16,84 16,44" fill="none" stroke="#FFE873" stroke-width="5"/><polygon points="64,36 92,52 92,76 64,92 36,76 36,52" fill="#E5484D"/></svg>`,
    desc: '25 frozen public symbols, typed TaskResult payloads, fluent WorkflowBuilder, and Apache 2.0 wheel distribution.'
  },
  {
    id: 'pytest',
    name: 'Automated Testing (pytest)',
    category: 'Quality Assurance',
    color: '#0A9EDC',
    color2: '#24D68A',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="64" cy="64" r="48" fill="#0A9EDC"/><polyline points="40,64 56,80 88,48" stroke="#FFF" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`,
    desc: '162 automated tests, 100% pass rate, 0 flakes across 20 stress runs, and 91.45% line coverage.'
  },
  {
    id: 'concurrency',
    name: 'Multi-Worker Scaling',
    category: 'Performance',
    color: '#E5484D',
    color2: '#58E3A8',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect x="18" y="20" width="92" height="18" rx="4" fill="#387EB8"/><rect x="18" y="44" width="92" height="18" rx="4" fill="#E5484D"/><rect x="18" y="68" width="92" height="18" rx="4" fill="#F7DF1E"/><rect x="18" y="92" width="92" height="18" rx="4" fill="#58E3A8"/></svg>`,
    desc: '7.86x speedup on 8 workers (98.2% scaling efficiency) under ThreadExecutor and ProcessExecutor.'
  },
  {
    id: 'sae',
    name: 'Sparse Autoencoders (SAEs)',
    category: 'Mechanistic Interpretability',
    color: '#A40000',
    color2: '#F7761F',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="24" cy="64" r="10" fill="#387EB8"/><circle cx="104" cy="64" r="10" fill="#387EB8"/><circle cx="64" cy="24" r="8" fill="#FFE873"/><circle cx="64" cy="50" r="8" fill="#F7761F"/><circle cx="64" cy="78" r="8" fill="#E5484D"/><circle cx="64" cy="104" r="8" fill="#58E3A8"/><line x1="24" y1="64" x2="64" y2="24" stroke="#FFF" stroke-width="1.5"/><line x1="24" y1="64" x2="64" y2="50" stroke="#FFF" stroke-width="1.5"/><line x1="24" y1="64" x2="64" y2="78" stroke="#FFF" stroke-width="1.5"/><line x1="24" y1="64" x2="64" y2="104" stroke="#FFF" stroke-width="1.5"/><line x1="64" y1="24" x2="104" y2="64" stroke="#FFF" stroke-width="1.5"/><line x1="64" y1="50" x2="104" y2="64" stroke="#FFF" stroke-width="1.5"/><line x1="64" y1="78" x2="104" y2="64" stroke="#FFF" stroke-width="1.5"/><line x1="64" y1="104" x2="104" y2="64" stroke="#FFF" stroke-width="1.5"/></svg>`,
    desc: 'Anthropic monosemanticity reproduction on GELU-1L: 2,048 → 4,096 features, 0.897562 cosine similarity.'
  },
  {
    id: 'llm-internals',
    name: 'LLM Internals & Attention',
    category: 'Deep Learning',
    color: '#8B5CF6',
    color2: '#EC4899',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path d="M64 16 L108 40 L108 88 L64 112 L20 88 L20 40 Z" fill="none" stroke="#8B5CF6" stroke-width="4"/><circle cx="64" cy="64" r="16" fill="#EC4899"/><path d="M64 16 L64 48 M108 40 L80 56 M108 88 L80 72 M64 112 L64 80 M20 88 L48 72 M20 40 L48 56" stroke="#FFF" stroke-width="2"/></svg>`,
    desc: 'Self-attention matrices, multi-head projections, transformer architectures, and superposition analysis.'
  },
  {
    id: 'ollama',
    name: 'Ollama Local LLMs',
    category: 'Edge & Local AI',
    color: '#FFFFFF',
    color2: '#A3A3A3',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="64" cy="64" r="48" fill="#171717" stroke="#FFF" stroke-width="5"/><circle cx="48" cy="54" r="6" fill="#FFF"/><circle cx="80" cy="54" r="6" fill="#FFF"/><ellipse cx="64" cy="74" rx="14" ry="8" fill="#FFF"/></svg>`,
    desc: 'Deploying and orchestrating quantized Llama 3, Mistral, and Qwen models offline without cloud leakage.'
  },
  {
    id: 'rag',
    name: 'RAG with ChromaDB',
    category: 'Information Retrieval',
    color: '#F43F5E',
    color2: '#FB7185',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect x="20" y="24" width="88" height="80" rx="8" fill="#1C1417" stroke="#F43F5E" stroke-width="4"/><circle cx="46" cy="50" r="10" fill="#FB7185"/><circle cx="82" cy="78" r="10" fill="#58E3A8"/><line x1="46" y1="50" x2="82" y2="78" stroke="#FFF" stroke-dasharray="4" stroke-width="2"/></svg>`,
    desc: 'Document chunking, vector embeddings, cosine distance similarity search, and semantic grounding.'
  },
  {
    id: 'langchain',
    name: 'LangChain & LangSmith',
    category: 'LLM Orchestration',
    color: '#00A67E',
    color2: '#2FE4AB',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="42" cy="64" r="22" fill="none" stroke="#00A67E" stroke-width="8"/><circle cx="86" cy="64" r="22" fill="none" stroke="#2FE4AB" stroke-width="8"/></svg>`,
    desc: 'Chaining prompt templates, tool integration, telemetry logging, token tracking, and execution tracing.'
  },
  {
    id: 'langgraph',
    name: 'LangGraph State Graphs',
    category: 'Agent Workflows',
    color: '#E11D48',
    color2: '#F43F5E',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="30" cy="30" r="12" fill="#E11D48"/><circle cx="98" cy="30" r="12" fill="#387EB8"/><circle cx="64" cy="98" r="14" fill="#58E3A8"/><path d="M38 38 L58 86 M90 38 L70 86" stroke="#FFF" stroke-width="3"/></svg>`,
    desc: 'Cyclic state machines, conditional routing edges, persistent human-in-the-loop checkpoints, and agent coordination.'
  },
  {
    id: 'mediapipe',
    name: 'MediaPipe & OpenCV',
    category: 'Computer Vision',
    color: '#00C853',
    color2: '#00E676',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="64" cy="64" r="48" fill="#141E17" stroke="#00C853" stroke-width="4"/><circle cx="64" cy="64" r="14" fill="#00C853"/><circle cx="38" cy="42" r="6" fill="#FFF"/><circle cx="90" cy="42" r="6" fill="#FFF"/><circle cx="64" cy="94" r="6" fill="#FFF"/></svg>`,
    desc: 'Real-time 21-point hand skeleton tracking, landmark mesh estimation, frame buffer filtering, and gesture recognition.'
  },
  {
    id: 'pytorch',
    name: 'PyTorch Deep Learning',
    category: 'Neural Networks',
    color: '#EE4C2C',
    color2: '#FF7559',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#EE4C2C" d="M72 16a44 44 0 0 0-44 44c0 14.5 7.1 27.4 18 35.3V82c-6.2-5.7-10-13.8-10-22.9 0-17.7 14.3-32 32-32 8.4 0 16 3.2 21.7 8.5l9.2-9.2C90.2 19.8 81.6 16 72 16z"/><circle cx="90" cy="38" r="8" fill="#EE4C2C"/></svg>`,
    desc: 'Tensors, autograd backpropagation, custom loss modules, AdamW optimization, and model training pipelines.'
  },
  {
    id: 'qlora',
    name: 'QLoRA & Model Adaptation',
    category: 'LLM Fine-Tuning',
    color: '#F59E0B',
    color2: '#FBBF24',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect x="20" y="24" width="36" height="80" rx="4" fill="#3B82F6"/><rect x="72" y="24" width="36" height="80" rx="4" fill="#F59E0B"/><text x="48" y="70" fill="#FFF" font-size="24" font-family="sans-serif" font-weight="bold">×</text></svg>`,
    desc: '4-bit NormalFloat quantization, low-rank adapters (A & B matrices), parameter-efficient fine-tuning on consumer GPUs.'
  },
  {
    id: 'react',
    name: 'React 19 & Vite',
    category: 'Frontend Engineering',
    color: '#61DAFB',
    color2: '#00B4D8',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="64" cy="64" r="10" fill="#61DAFB"/><ellipse cx="64" cy="64" rx="44" ry="16" fill="none" stroke="#61DAFB" stroke-width="4"/><ellipse cx="64" cy="64" rx="44" ry="16" fill="none" stroke="#61DAFB" stroke-width="4" transform="rotate(60 64 64)"/><ellipse cx="64" cy="64" rx="44" ry="16" fill="none" stroke="#61DAFB" stroke-width="4" transform="rotate(120 64 64)"/></svg>`,
    desc: 'Component architecture, custom hooks, transitions, Portals, and instantaneous HMR dev tooling.'
  },
  {
    id: 'django',
    name: 'Django Web Framework',
    category: 'Backend Architecture',
    color: '#0C4B33',
    color2: '#2BA673',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect width="128" height="128" rx="16" fill="#0C4B33"/><path fill="#FFF" d="M52 24v50.2c-5.8 1.4-10.8 1.9-15.6 1.9-13.6 0-20.4-6.8-20.4-17.7 0-11.8 7.8-19.4 20.8-19.4 5 0 9.8 1.1 14.2 2.8v-17.8zm-16 29.8c-5.2 0-8.2 3.6-8.2 9.4 0 5.6 3 9.2 8.2 9.2 2.6 0 5.4-.5 8-1.5V52.8c-2.4-.6-5.4-1-8-1zM64 39.8h17.6V94H64V39.8zM64 22h17.6v12.8H64V22z"/></svg>`,
    desc: 'MTV architecture, ORM querysets, authentication middleware, REST APIs, and admin dashboard tooling.'
  },
  {
    id: 'firebase',
    name: 'Firebase & Cloud Firestore',
    category: 'Cloud Services',
    color: '#FFA000',
    color2: '#F57C00',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#FFA000" d="M22 98L44 14l20 38-42 46z"/><path fill="#F57C00" d="M22 98l42-46 22-42 20 88H22z"/><path fill="#FFCA28" d="M106 98L86 10l-22 42 42 46z"/></svg>`,
    desc: 'Real-time document databases, security rules authoring, Firebase Auth flows, and serverless hosting.'
  },
  {
    id: 'supabase',
    name: 'Supabase Hosted Postgres',
    category: 'Cloud Database',
    color: '#3ECF8E',
    color2: '#249B64',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#3ECF8E" d="M72 10L18 74h44l-6 44 54-64H66z"/></svg>`,
    desc: 'PostgreSQL row-level security (RLS), auto-generated REST/GraphQL APIs, edge functions, and database migrations.'
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages CI/CD',
    category: 'Static Deployment',
    color: '#22272E',
    color2: '#58A6FF',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect width="128" height="128" rx="16" fill="#161B22"/><circle cx="64" cy="64" r="36" fill="none" stroke="#58A6FF" stroke-width="8"/><polyline points="50,64 64,50 78,64" stroke="#58A6FF" stroke-width="8" fill="none"/></svg>`,
    desc: 'Automated GitHub Actions workflow deployments, artifact building, CDN edge routing, and custom domain setup.'
  },
  {
    id: 'firestore-rules',
    name: 'Firestore Security Rules',
    category: 'App Security',
    color: '#E5484D',
    color2: '#FFA000',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><path fill="#E5484D" d="M64 12L20 32v34c0 32 44 50 44 50s44-18 44-50V32L64 12z"/><path fill="#FFF" d="M64 36c-10 0-18 8-18 18v8h-4v24h44V62h-4v-8c0-10-8-18-18-18zm0 8c5.5 0 10 4.5 10 10v8H54v-8c0-5.5 4.5-10 10-10z"/></svg>`,
    desc: 'Testing privilege escalation, auth token claims, role verification, and access-control bypasses.'
  },
  {
    id: 'api-testing',
    name: 'API Testing & Profiling',
    category: 'Security & Quality',
    color: '#3B82F6',
    color2: '#60A5FA',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect x="20" y="24" width="88" height="80" rx="8" fill="#141B2D" stroke="#3B82F6" stroke-width="4"/><text x="32" y="60" fill="#3B82F6" font-size="20" font-family="monospace" font-weight="bold">POST</text><text x="32" y="86" fill="#58E3A8" font-size="16" font-family="monospace">200 OK</text></svg>`,
    desc: 'Request crafting, fuzzing edge cases, HTTP status code validation, response time profiling, and payload replay.'
  },
  {
    id: 'burp-suite',
    name: 'Burp Suite & Postman',
    category: 'Security Tooling',
    color: '#FF6633',
    color2: '#FF8855',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect width="128" height="128" rx="16" fill="#1E1715"/><circle cx="64" cy="64" r="40" fill="none" stroke="#FF6633" stroke-width="8"/><circle cx="64" cy="64" r="20" fill="#FF6633"/></svg>`,
    desc: 'Intercepting proxies, request inspection, parameter manipulation, session analysis, and automated test collections.'
  },
  {
    id: 'vulnerability',
    name: 'Vulnerability Reporting',
    category: 'Security Assurance',
    color: '#E5484D',
    color2: '#EF4444',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><polygon points="64,16 116,104 12,104" fill="#991B1B" stroke="#E5484D" stroke-width="6"/><rect x="60" y="48" width="8" height="28" fill="#FFF"/><circle cx="64" cy="88" r="5" fill="#FFF"/></svg>`,
    desc: 'Actionable security vulnerability write-ups, reproducible proof-of-concept steps, remediation guidance, and defense-in-depth.'
  },
  {
    id: 'spec-driven',
    name: 'Spec-Driven AI Development',
    category: 'Engineering Method',
    color: '#06B6D4',
    color2: '#22D3EE',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><rect x="20" y="16" width="88" height="96" rx="8" fill="#111827" stroke="#06B6D4" stroke-width="4"/><line x1="36" y1="36" x2="92" y2="36" stroke="#22D3EE" stroke-width="4"/><line x1="36" y1="54" x2="80" y2="54" stroke="#FFF" stroke-width="4"/><line x1="36" y1="72" x2="70" y2="72" stroke="#FFF" stroke-width="4"/><line x1="36" y1="90" x2="85" y2="90" stroke="#06B6D4" stroke-width="4"/></svg>`,
    desc: 'Formal Architectural Decision Records, characterization test contracts, and deterministic spec guardrails for AI coding agents.'
  },
  {
    id: 'ai-code-review',
    name: 'Reviewing AI-Written Code',
    category: 'Quality Control',
    color: '#10B981',
    color2: '#34D399',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="56" cy="56" r="36" fill="none" stroke="#10B981" stroke-width="8"/><line x1="82" y1="82" x2="114" y2="114" stroke="#34D399" stroke-width="10" stroke-linecap="round"/><polyline points="42,56 52,66 72,46" stroke="#FFF" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`,
    desc: 'Deep diff analysis, boundary condition inspection, thread-safety verification, and ownership of every production line shipped.'
  },
  {
    id: 'testing-failures',
    name: 'Testing Failure Paths',
    category: 'Resilience Engineering',
    color: '#F59E0B',
    color2: '#EF4444',
    icon: `<svg viewBox="0 0 128 128" width="56" height="56"><circle cx="64" cy="64" r="48" fill="#1C1819" stroke="#F59E0B" stroke-width="4"/><path d="M44 44 L84 84 M84 44 L44 84" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/><circle cx="64" cy="64" r="10" fill="#F59E0B"/></svg>`,
    desc: 'Adversarial fault injection, SIGKILL timeout validation, network partition simulation, and crash recovery drills.'
  }
];

function generateCardSvg(skill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 260" width="440" height="260">
  <defs>
    <linearGradient id="bg-${skill.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#140E10" />
      <stop offset="100%" stop-color="#080607" />
    </linearGradient>
    <radialGradient id="glow-${skill.id}" cx="20%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${skill.color}" stop-opacity="0.28" />
      <stop offset="100%" stop-color="${skill.color}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="border-${skill.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${skill.color}" stop-opacity="0.55" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.12" />
      <stop offset="100%" stop-color="${skill.color2}" stop-opacity="0.35" />
    </linearGradient>
    <pattern id="grid-${skill.id}" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="440" height="260" rx="16" fill="url(#bg-${skill.id})" />
  <rect width="440" height="260" rx="16" fill="url(#grid-${skill.id})" />
  <rect width="440" height="260" rx="16" fill="url(#glow-${skill.id})" />
  <rect width="438" height="258" x="1" y="1" rx="15" fill="none" stroke="url(#border-${skill.id})" stroke-width="1.5" />

  <!-- Category Tag -->
  <rect x="28" y="24" width="130" height="22" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <text x="38" y="39" fill="${skill.color2}" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600" letter-spacing="1">${skill.category.toUpperCase()}</text>

  <!-- Icon Graphic -->
  <g transform="translate(348, 24)">
    ${skill.icon}
  </g>

  <!-- Title -->
  <text x="28" y="92" fill="#F5F5F5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" letter-spacing="-0.5">${skill.name}</text>

  <!-- Accent line -->
  <rect x="28" y="112" width="48" height="2.5" rx="1" fill="${skill.color}" />

  <!-- Description -->
  <foreignObject x="28" y="126" width="384" height="96">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: rgba(255,255,255,0.72); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13.5px; line-height: 1.55; margin: 0; padding: 0;">
      ${skill.desc}
    </div>
  </foreignObject>

  <!-- Verification Pill -->
  <g transform="translate(28, 218)">
    <circle cx="5" cy="5" r="3.5" fill="${skill.color2}" />
    <text x="16" y="8.5" fill="rgba(255,255,255,0.5)" font-family="ui-monospace, monospace" font-size="10" letter-spacing="0.5">SHIPPED · APPLIED IN PROJECTS</text>
  </g>
</svg>`;
}

for (const skill of SKILLS_DATA) {
  const filePath = path.join(skillsDir, `${skill.id}.svg`);
  fs.writeFileSync(filePath, generateCardSvg(skill), 'utf8');
}

console.log(`Generated ${SKILLS_DATA.length} skill images in ${skillsDir}`);
