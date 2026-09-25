// Portfolio content — edit this file for copy, links, and future projects.
export const content = {
  name: 'Aditya Kumar Singh', handle: 'Red director', accent: '#B7FF00',
  entryCopy: 'OPEN THE WORK',
  riddles: ['Systems should fail loudly, not silently.', 'Build depth first. Ship the evidence.'],
  intro: 'I build systems where the details carry the claim: state machines, persistence guarantees, model evaluation, and security findings reproduced against the real thing.',
  philosophy: 'I work sequentially: understand the system, make failure modes explicit, then ship. AI is part of the toolkit—not a substitute for knowing what the code does.',
  links: { github: 'https://github.com/Reddirector/Orchestration_Engine', linkedin: 'https://linkedin.com/in/aditya-kumar-singh-6131b82a4', x: 'https://x.com/KumarAditya6430' },
  projects: [
    { id: '01', name: 'Orchestration Engine', tag: 'Python · SQLite · Systems', color: '#B7FF00', short: 'A hand-written task execution engine built for state machines, retries, persistence, and interview-legible systems depth.', detail: '56/56 tests passing. The event log is append-only SQLite; database writes happen before in-memory mutation so history cannot silently disagree with live state. Dependency failures cancel blocked branches without falsely failing independent work. A real multi-task deadlock was found and fixed in the execution path.', link: 'https://github.com/Reddirector/Orchestration_Engine' },
    { id: '02', name: 'SAE Reproduction', tag: 'Research paper reproduction · Interpretability', color: '#fff', short: 'An independent reproduction of a sparse-autoencoder interpretability paper result—research work, not a tutorial implementation.', detail: 'GELU-1L architecture, SAE expanded from 2048 to 4096 features, 0.897562 validation cosine similarity, and 0.10% dead features. Built without institutional affiliation as evidence of model-level research capability.' },
    { id: '03', name: 'Pentagon', tag: 'Private project · Case study', color: '#B7FF00', short: 'A private project in the portfolio. The public case study stays deliberately high-level until more detail is available.', detail: 'Pentagon is presented here as a private case study. Its implementation details, scope, and outcomes can be added when you are ready to make them public—without overstating work that is not documented here yet.' },
    { id: '04', name: 'ValtSky', tag: 'Kotlin · Native Android · Telegram API', color: '#fff', short: 'A native Android photo and video backup app built in three days using Kotlin and the Telegram Bot API.', detail: 'ValtSky is a shipped-fast, AI-assisted side project. It uses Kotlin for a native Android experience and the Telegram Bot API for backup workflows. It is shown separately from the systems-depth work above so the scope remains honest.' },
  ],
  metrics: [{ value: 56, suffix: '/56', label: 'orchestration tests passing' }, { value: 0.897562, suffix: '', label: 'SAE validation cosine similarity', decimals: 6 }, { value: 3, suffix: ' days', label: 'to build ValtSky' }, { value: 0.10, suffix: '%', label: 'SAE dead features', decimals: 2 }],
  now: [
    { name: 'Orchestration Engine', text: 'Task execution engine built around state machines, retries, and SQLite-backed persistence; 56/56 tests passing.' },
    { name: 'Pentagon', text: 'A private project presented as a high-level case study; implementation details and scope are kept private until they can be shared.' },
    { name: 'Shipped side work', text: 'Megit and ValtSky are AI-assisted, shipped-fast projects. They are kept separate from the systems-depth work above.' },
  ],
}
