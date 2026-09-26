// Portfolio content: copy, links, and project details.
export const content = {
  name: 'Aditya Kumar Singh', handle: 'Red director', accent: '#B7FF00',
  entryCopy: 'OPEN THE WORK',
  riddles: ['I build software and study how models work.', 'Here are a few projects and the decisions behind them.'],
  intro: 'I build task systems and run model experiments. I care about what happens when work fails, whether saved state can be trusted, and what the measurements actually say.',
  philosophy: 'I start by figuring out how a system behaves, including when it fails. Then I test those paths before I call the work done. I use AI tools, but I still need to understand the code I ship.',
  links: { github: 'https://github.com/Reddirector/Orchestration_Engine', linkedin: 'https://linkedin.com/in/aditya-kumar-singh-6131b82a4', x: 'https://x.com/KumarAditya6430' },
  projects: [
    { id: '01', name: 'Orchestration Engine', tag: 'Python · SQLite · Systems', color: '#B7FF00', short: 'A Python task runner with explicit states, retries, dependencies, and SQLite persistence.', detail: 'All 56 tests pass. The event log is append-only SQLite. A failed database write does not leave the in-memory state ahead of the log. When a dependency fails, blocked tasks are cancelled while unrelated branches keep running. I also found and fixed a deadlock involving several tasks.', link: 'https://github.com/Reddirector/Orchestration_Engine' },
    { id: '02', name: 'SAE Reproduction', tag: 'Research paper reproduction · Interpretability', color: '#fff', short: 'An independent sparse autoencoder experiment based on Anthropic’s paper. The project notes report a 0.897562 validation cosine similarity and 0.10% dead features.', detail: 'The project notes list a GELU-1L model and an SAE with 2,048 input dimensions and 4,096 features. They report a validation cosine similarity of 0.897562 and 0.10% dead features. The training configuration and exact evaluation procedure still need documenting.' },
    { id: '03', name: 'Pentagon', tag: 'Private project · Case study', color: '#B7FF00', short: 'Pentagon is private, so I’m keeping its public description brief.', detail: 'I can’t share Pentagon’s implementation details or results yet. I’ll add them if and when they can be made public.' },
    { id: '04', name: 'ValtSky', tag: 'Kotlin · Native Android · Telegram API', color: '#fff', short: 'An Android app for backing up photos and videos, built in three days with Kotlin and the Telegram Bot API.', detail: 'I built ValtSky in three days with Kotlin and the Telegram Bot API. I used AI tools while building it, so I list it separately from my systems and research projects.' },
  ],
  metrics: [{ value: 56, suffix: '/56', label: 'orchestration tests passing' }, { value: 0.897562, suffix: '', label: 'SAE validation cosine similarity', decimals: 6 }, { value: 3, suffix: ' days', label: 'to build ValtSky' }, { value: 0.10, suffix: '%', label: 'SAE dead features', decimals: 2 }],
  now: [
    { name: 'Orchestration Engine', text: 'I’m building a task runner around explicit states, retries, dependencies, and SQLite persistence. All 56 tests pass.' },
    { name: 'Pentagon', text: 'Private project. I can share more when the details are cleared for release.' },
    { name: 'Shipped side work', text: 'Megit and ValtSky were built quickly with AI assistance. I keep them separate from my systems and research work.' },
  ],
}
