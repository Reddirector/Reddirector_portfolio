// About section copy and data. Edit text here — no JSX changes needed.
// Voice: plain, first-person, evidence-hedged. No hype words.

export const PROFILE_IMAGE = null
// To swap in a portrait: put the file at src/assets/profile.jpg, then
//   import portrait from '../assets/profile.jpg'
//   export const PROFILE_IMAGE = portrait
// (or use a public/ path like '/profile.jpg'). It renders 300px, object-fit: cover,
// alt "Aditya Kumar Singh".

export const AVAILABILITY = null // e.g. 'Open to AI/ML roles' renders a status chip.

export const NAME = 'Aditya Kumar Singh'
export const ROLE = 'Systems, ML & Android. B.Tech CSE.'
export const HEADLINE = 'Systems first, then the models.'

export const LINKS = [
  { label: 'GitHub', href: 'https://github.com/Reddirector', glyph: 'GH' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/aditya-kumar-singh-6131b82a4', glyph: 'in' },
  { label: 'X', href: 'https://x.com/KumarAditya6430', glyph: 'X' },
]

export const TABS = [
  { id: 'story', label: 'Story' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'education', label: 'Education' },
]

export const STORY = {
  lead: 'I’m Aditya Kumar Singh, a B.Tech Computer Science student at KCC Institute of Technology & Management. I build software independently across systems, ML, and Android.',
  body: 'Before software, I worked in documentary filmmaking as a researcher, scriptwriter, and director. I use AI tools, and I stay responsible for understanding the code I ship.',
  note: 'Figures from project notes.',
  stats: [
    { value: 'v0.1.0', label: 'Orchestration Engine published' },
    { value: 58, label: 'passing tests' },
    { value: '0.10%', label: 'dead features in my SAE run' },
  ],
}

export const SKILLS = [
  { area: 'Systems', items: ['Python', 'SQLite', 'pytest', 'packaging', 'workflow orchestration'] },
  { area: 'ML / LLM', items: ['sparse autoencoders', 'LangChain', 'LangSmith', 'Ollama', 'ChromaDB', 'building LLMs from scratch'] },
  { area: 'Mobile / Web', items: ['Kotlin (Android)', 'React', 'Firebase', 'Supabase'] },
  { area: 'Security', items: ['Firestore and mobile app testing', 'curl', 'Postman', 'Burp Suite'] },
  { area: 'Currently learning', items: ['LangGraph', 'QLoRA fine-tuning'] },
]

export const ACHIEVEMENTS = [
  { title: 'Orchestration Engine v0.1.0 published', detail: 'Apache 2.0, 58 passing tests, wheel build verified in a clean environment.' },
  { title: 'Sparse autoencoder reproduction', detail: 'Validation cosine similarity 0.897562, 0.10% dead features (per project notes).' },
  { title: 'Harvard CS50 Introduction to AI with Python', detail: 'Course certificate.', date: 'July 2026' },
  { title: 'Vizuara “Building LLMs from Scratch”', detail: 'Course certificate.', date: 'July to August 2026' },
  { title: 'Anthropic courses', detail: 'Claude 101; AI Fluency: Framework and Foundations; Claude with Google Vertex AI.' },
]

export const EDUCATION = [
  { title: 'B.Tech, Computer Science and Engineering', detail: 'KCC Institute of Technology & Management (AKTU-affiliated).' },
  { title: 'Earlier schooling', detail: 'PM SHRI Kendriya Vidyalaya No. 1, AFS Hindan.' },
]
