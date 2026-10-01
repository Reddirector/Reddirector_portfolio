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
export const ROLE = 'Systems & ML. B.Tech CSE.'
export const HEADLINE = 'Systems first, then the models.'

export const TABS = [
  { id: 'story', label: 'Story' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'education', label: 'Education' },
]

export const STORY = {
  lead: 'I’m Aditya Kumar Singh, a B.Tech Computer Science student at KCC Institute of Technology & Management. I build software independently across systems, ML, and the web.',
  body: 'Before software, I worked in documentary filmmaking as a researcher, scriptwriter, and director. I use AI tools, and I stay responsible for understanding the code I ship.',
  note: 'Figures from project notes.',
  stats: [
    { value: 'v0.1.0', label: 'Orchestration Engine published' },
    { value: 58, label: 'passing tests' },
    { value: '0.10%', label: 'dead features in my SAE run' },
  ],
}

export const SKILL_FILTERS = ['All', 'Built with', 'Learning']
export const SKILLS_CAPTION = 'Everything here is in a shipped project or an active experiment.'

// Skills inventory — six balanced groups. tier: 'built' | 'learning'.
// learned/why/can feed the chip tooltips; a null field omits that tooltip line.
export const SKILLS = [
  {
    title: 'Languages & Tooling',
    items: [
      { name: 'Python', tier: 'built', learned: 'Telusko (YouTube)', why: 'My main language for everything I build', can: 'Write backends, tools, and ML experiments' },
      { name: 'JavaScript', tier: 'built', learned: 'Apna College (YouTube)', why: 'To build for the web', can: 'Build interactive front ends' },
      { name: 'SQL', tier: 'built', learned: 'Apna College, Chai aur Code, college curriculum', why: 'To store and query data', can: 'Design schemas and write queries' },
      { name: 'C++', tier: 'built', learned: 'Apna College (YouTube)', why: 'Data structures and problem solving', can: 'Solve DSA problems; practice on LeetCode' },
      { name: 'Git & GitHub', tier: 'built', learned: 'Apna College (YouTube)', why: 'To version and publish my work', can: 'Branch, commit, and publish repos' },
      { name: 'Linux', tier: 'built', learned: 'A free bootcamp video, plus my own practice and research', why: 'A terminal-based dev environment', can: 'Work in the terminal and manage packages' },
      { name: 'Docker', tier: 'built', learned: 'Apna College (YouTube)', why: 'To package projects reproducibly', can: 'Containerize apps; used in some projects' },
      { name: 'uv / pip / venv', tier: 'built', learned: 'Chai aur Code (YouTube)', why: 'Python environments and packaging', can: 'Manage dependencies and build packages' },
    ],
  },
  {
    title: 'Systems & Backend',
    items: [
      { name: 'Workflow orchestration', tier: 'built', learned: 'Trial and error while building, with AI help', why: 'Built into my Orchestration Engine', can: 'Run dependent tasks in the right order' },
      { name: 'Retries & backoff', tier: 'built', learned: 'Trial and error while building, with AI help', why: 'Handle flaky tasks', can: 'Retry failed steps with growing delays' },
      { name: 'Failure propagation', tier: 'built', learned: 'Trial and error while building, with AI help', why: 'Stop dependent work when a task fails', can: 'Cancel downstream tasks cleanly' },
      { name: 'Timeouts', tier: 'built', learned: 'Trial and error while building, with AI help', why: 'Keep tasks from hanging', can: 'Enforce per-task limits' },
      { name: 'State machines', tier: 'built', learned: 'Trial and error while building, with AI help', why: 'Keep task states valid', can: 'Validate state transitions' },
      { name: 'Append-only event logging', tier: 'built', learned: 'Trial and error while building, with AI help', why: 'Make runs auditable', can: 'Record every state change in SQLite' },
      { name: 'API design & packaging', tier: 'built', learned: 'Trial and error while building, with AI help', why: 'Publish the engine as a library', can: 'Ship a versioned wheel (v0.1.0, Apache 2.0)' },
      { name: 'pytest', tier: 'built', learned: null, why: 'Verify the engine works', can: 'Write unit and end-to-end tests' },
      { name: 'Concurrent execution', tier: 'learning', learned: 'Currently learning it as the engine’s next stage', why: 'Run independent tasks in parallel', can: null },
    ],
  },
  {
    title: 'ML & LLM',
    items: [
      { name: 'Sparse autoencoders', tier: 'built', learned: 'ChatGPT (self-study)', why: 'To reproduce a monosemanticity experiment', can: 'Train and evaluate SAEs on a small model' },
      { name: 'LLM internals', tier: 'built', learned: 'Vizuara: Building LLMs from Scratch', why: 'To understand how models work underneath', can: 'Reason about how LLMs are built and trained' },
      { name: 'Ollama', tier: 'built', learned: 'CampusX playlist (YouTube)', why: 'To run models locally', can: 'Run and call local LLMs' },
      { name: 'RAG with ChromaDB', tier: 'built', learned: 'CampusX playlist (YouTube)', why: 'To ground answers in documents', can: 'Build retrieval over a document set' },
      { name: 'LangChain & LangSmith', tier: 'built', learned: 'CampusX playlist (YouTube)', why: 'To build LLM apps', can: 'Chain prompts and tools; trace and debug runs' },
      { name: 'LangGraph', tier: 'built', learned: 'CampusX playlist (YouTube)', why: 'To build stateful agent workflows', can: 'Build graph-based agent workflows' },
      { name: 'MediaPipe & OpenCV', tier: 'built', learned: 'ChatGPT (self-study) for MediaPipe; null for OpenCV', why: 'For a hand-tracking project', can: 'Track hands from a webcam' },
      { name: 'PyTorch', tier: 'learning', learned: 'A free bootcamp video (YouTube)', why: 'To train models directly', can: 'Early stage; building my first project' },
      { name: 'QLoRA fine-tuning', tier: 'learning', learned: 'A free bootcamp video (YouTube)', why: 'To adapt small open models on limited hardware', can: 'Early stage; still learning' },
    ],
  },
  {
    title: 'Web & Cloud',
    items: [
      { name: 'React + Vite', tier: 'built', learned: 'Apna College (YouTube)', why: 'To build this portfolio', can: 'Build component-based front ends' },
      { name: 'Django', tier: 'built', learned: 'Chai aur Code (YouTube)', why: 'To build Python web backends', can: 'Used in some projects' },
      { name: 'Firebase', tier: 'built', learned: 'ChatGPT (self-study)', why: 'Auth and database for apps', can: 'Set up auth and Firestore data' },
      { name: 'Supabase', tier: 'built', learned: 'ChatGPT (self-study)', why: 'A hosted Postgres backend', can: 'Use a hosted database and auth' },
      { name: 'GitHub Pages', tier: 'built', learned: 'Self-taught', why: 'To host this portfolio', can: 'Deploy static sites from a repo' },
    ],
  },
  {
    title: 'Security',
    items: [
      { name: 'Firestore rules & authentication testing', tier: 'built', learned: 'Self-taught, with help from my college professor', why: 'To find real access-control gaps', can: 'Test Firestore rules and auth flows on a live backend' },
      { name: 'API testing', tier: 'built', learned: 'Self-taught, with help from my college professor', why: 'To check what a backend actually exposes', can: 'Craft and replay requests' },
      { name: 'curl / Postman / Burp Suite', tier: 'built', learned: 'Self-taught, with help from my college professor', why: 'To inspect and manipulate requests', can: 'Capture, edit, and replay traffic' },
      { name: 'Vulnerability reporting', tier: 'built', learned: null, why: 'To make findings actionable', can: 'Write findings with fixes' },
    ],
  },
  {
    title: 'Working Method',
    items: [
      { name: 'Spec-driven AI-assisted development', tier: 'built', learned: 'Self-taught by building with Claude Code and Kimi Code', why: 'To keep AI output controlled', can: 'Write specs that agents implement' },
      { name: 'Reviewing AI-written code', tier: 'built', learned: 'Self-taught by building with AI agents', why: 'I stay responsible for what ships', can: 'Read and verify code before merging' },
      { name: 'Testing failure paths', tier: 'built', learned: null, why: 'Catch bugs where systems actually break', can: 'Write tests for retries, timeouts, and failures' },
    ],
  },
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
