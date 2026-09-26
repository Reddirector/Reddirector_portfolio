// Portfolio content: copy, links, and project details.
export const content = {
  name: 'Aditya Kumar Singh', handle: 'Red director', accent: '#B7FF00',
  entryCopy: 'OPEN THE WORK',
  riddles: ['I build software and study how models work.', 'Here are a few projects and the decisions behind them.'],
  intro: 'I build task systems and run model experiments. I care about what happens when work fails, whether saved state can be trusted, and what the measurements actually say.',
  philosophy: 'I start by figuring out how a system behaves, including when it fails. Then I test those paths before I call the work done. I use AI tools, but I still need to understand the code I ship.',
  links: { github: 'https://github.com/Reddirector/Orchestration_Engine', linkedin: 'https://linkedin.com/in/aditya-kumar-singh-6131b82a4', x: 'https://x.com/KumarAditya6430' },
  projects: [
    { id: '01', name: 'Orchestration Engine', tag: 'Python 3.12+ · SQLite · Standard library', color: '#B7FF00', short: 'A first-principles workflow engine for dependency scheduling, retries, timeouts, failure propagation, and durable SQLite history.', detail: 'The current project notes report 58 passing tests. Task transitions are appended to SQLite before live state changes, so a failed write cannot advance in-memory state ahead of its durable history. The v0.1.0 project is Stage 1 of a six-stage plan; a configurable database path and CLI remain planned.', link: 'https://github.com/Reddirector/Orchestration_Engine' },
    { id: '02', name: 'SAE Reproduction', tag: 'Research paper reproduction · Interpretability', color: '#fff', short: 'An independent sparse autoencoder experiment based on Anthropic’s paper. The project notes report a 0.897562 validation cosine similarity and 0.10% dead features.', detail: 'The project notes list a GELU-1L model and an SAE with 2,048 input dimensions and 4,096 features. They report a validation cosine similarity of 0.897562 and 0.10% dead features. The training configuration and exact evaluation procedure still need documenting.' },
    { id: '03', name: 'Pentagon', tag: 'Private project · Case study', color: '#B7FF00', short: 'Pentagon is private, so I’m keeping its public description brief.', detail: 'I can’t share Pentagon’s implementation details or results yet. I’ll add them if and when they can be made public.' },
    { id: '04', name: 'ValtSky', tag: 'Kotlin · Native Android · Telegram API', color: '#fff', short: 'An Android app for backing up photos and videos, built in three days with Kotlin and the Telegram Bot API.', detail: 'I built ValtSky in three days with Kotlin and the Telegram Bot API. I used AI tools while building it, so I list it separately from my systems and research projects.' },
  ],
  metrics: [{ value: 58, suffix: '/58', label: 'orchestration tests passing' }, { value: 0.897562, suffix: '', label: 'SAE validation cosine similarity', decimals: 6 }, { value: 3, suffix: ' days', label: 'to build ValtSky' }, { value: 0.10, suffix: '%', label: 'SAE dead features', decimals: 2 }],
  now: [
    { name: 'Orchestration Engine', text: 'I’m building a first-principles Python workflow engine. The current project notes report 58 passing tests, a durable SQLite event log, and a deliberately small public API.' },
    { name: 'Pentagon', text: 'Private project. I can share more when the details are cleared for release.' },
    { name: 'ValtSky', text: 'A Kotlin Android backup app built with the Telegram Bot API and AI assistance.' },
  ],
}
