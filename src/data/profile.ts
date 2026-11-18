/**
 * Single source of truth for everything the site says.
 * Edit this file to change copy, links, projects or skills.
 */

export type Tone = 'mint' | 'sky' | 'iris' | 'rose' | 'amber'

export const site = {
  name: 'Shlok Vaidya',
  firstName: 'Shlok',
  lastName: 'Vaidya',
  initials: 'SV',
  role: 'AI & Data Engineering undergrad, IIT Ropar',
  description:
    'Shlok Vaidya is a B.Tech student in Artificial Intelligence and Data Engineering at IIT Ropar, building RAG systems, AI agents, data pipelines and robotics software.',
  email: 'shlokvaidya11@gmail.com',
  location: 'Rupnagar, Punjab, India',
  /** IIT Ropar campus, used for the globe marker. */
  coords: { lat: 30.9686, lng: 76.4737 },
  timeZone: 'Asia/Kolkata',
  availability: 'Open to opportunities',
  classOf: "IIT Ropar '28",
  /** Drop your résumé at public/resume.pdf and the buttons appear automatically. */
  resume: './resume.pdf',
} as const

/** Leave a link empty ('') to hide it everywhere on the site. */
export const socials = {
  github: 'https://github.com/shlok165',
  linkedin: 'https://www.linkedin.com/in/shlok-vaidya-138803326/',
  leetcode: 'https://leetcode.com/u/SN_v/',
  codeforces: 'https://codeforces.com/profile/shlokvaidya11',
} as const

export const githubUser = 'shlok165'

export const hero = {
  rotating: ['RAG systems', 'AI agents', 'data pipelines', 'robotics software'],
  lead: 'Third-year AI & Data Engineering undergrad at IIT Ropar, working across AI systems, software engineering and robotics.',
}

export type Stat = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  note: string
}

export const stats: Stat[] = [
  { value: 8.63, decimals: 2, suffix: '/10', label: 'CGPA', note: 'B.Tech, IIT Ropar' },
  { value: 1656, prefix: 'AIR ', label: 'JEE Main', note: 'All India Rank · 99.9 percentile' },
  { value: 5636, prefix: 'AIR ', label: 'JEE Advanced', note: 'All India Rank' },
  { value: 6, suffix: 'th', label: 'Inter IIT Tech Meet', note: 'of 23 IITs, 2025' },
]

export const about = {
  paragraphs: [
    'I’m a third-year B.Tech student in Artificial Intelligence and Data Engineering at IIT Ropar. I build AI systems, backend software and robotics projects, and I solve competitive programming problems alongside.',
    'I’ve interned as a Robotics & ML engineer at Speedybyte, an IIT Ropar-incubated startup, and was part of the IIT Ropar team that placed 6th of 23 IITs at Inter IIT Tech Meet 14.0.',
  ],
  /** Short "right now" list under the bio. */
  now: [
    { label: 'Studying', value: 'B.Tech in AI & Data Engineering, IIT Ropar' },
    { label: 'Coordinating', value: 'SDE internships at CAPS, IIT Ropar' },
    { label: 'Exploring', value: 'Code-switched speech recognition and state-space models for medical video' },
  ],
}

export type ProfileLink = { label: string; href: string; icon: 'github' | 'linkedin' | 'leetcode' | 'codeforces' }

export type ProfileTile = {
  id: 'coding' | 'ai' | 'robotics'
  eyebrow: string
  /** Large headline value and the line beside it. */
  headline: string
  caption: string
  rows: { label: string; value: string }[]
  links: ProfileLink[]
  tone: Tone
}

/** The three tiles in the About section. A link with an empty href is hidden. */
export const profiles: ProfileTile[] = [
  {
    id: 'coding',
    eyebrow: 'Coding profile',
    headline: '1200+',
    caption: 'Codeforces · Pupil',
    rows: [
      { label: 'Codeforces', value: 'Rated contests as shlokvaidya11' },
      { label: 'LeetCode', value: 'Active problem solver as SN_v' },
      { label: 'Languages', value: 'C++, Python, C' },
      { label: 'Core', value: 'Data structures & algorithms' },
    ],
    links: [
      { label: 'Codeforces', href: socials.codeforces, icon: 'codeforces' },
      { label: 'LeetCode', href: socials.leetcode, icon: 'leetcode' },
    ],
    tone: 'mint',
  },
  {
    id: 'ai',
    eyebrow: 'AI & SDE profile',
    headline: '98%',
    caption: 'resolution accuracy · reconciliation agent',
    rows: [
      { label: 'RAG', value: 'Ask IIT Ropar: hybrid search over 1,900+ pages' },
      { label: 'Agents', value: 'Function-calling agent with 7 read-only tools' },
      { label: 'Backend', value: 'FastAPI, Docker, 46-test Pytest suite' },
      { label: 'Role', value: 'Asst. Internship Coordinator (SDE), CAPS' },
    ],
    links: [
      { label: 'GitHub', href: socials.github, icon: 'github' },
      { label: 'LinkedIn', href: socials.linkedin, icon: 'linkedin' },
    ],
    tone: 'sky',
  },
  {
    id: 'robotics',
    eyebrow: 'Robotics profile',
    headline: 'ROS',
    caption: 'Robotics & ML intern · Speedybyte',
    rows: [
      { label: 'Simulation', value: 'Bipedal RL training platform on Gazebo' },
      { label: 'Autonomy', value: 'ROS warehouse surveillance robot' },
      { label: 'Edge AI', value: 'ESP32-CAM + YOLOv8n intrusion detection' },
      { label: 'IoT', value: 'AquaIntegrity water-quality sensing' },
    ],
    links: [
      { label: 'Bipedal RL', href: 'https://github.com/shlok165/bipedal-roboticsXAi', icon: 'github' },
      {
        label: 'Warehouse',
        href: 'https://github.com/shlok165/autonomous_warehouse_surveillance',
        icon: 'github',
      },
    ],
    tone: 'iris',
  },
]

export const education = [
  {
    degree: 'B.Tech, Artificial Intelligence & Data Engineering',
    school: 'Indian Institute of Technology, Ropar',
    score: '8.63 / 10 CGPA',
    years: '2024 – 2028',
  },
  {
    degree: 'Senior Secondary',
    school: 'Maharashtra State Board',
    score: '85.83%',
    years: '2024',
  },
  {
    degree: 'Secondary',
    school: 'Central Board of Secondary Education',
    score: '94.33%',
    years: '2022',
  },
]

export const cgpa = { value: 8.63, max: 10 }

export const coursework = [
  'Data Structures & Algorithms',
  'Machine Learning',
  'Foundations of Computer Systems',
  'Object-Oriented Programming',
  'Probability & Discrete Mathematics',
  'AI Systems & Programming Labs',
  'Optimization Methods & Applications',
]

export type Experience = {
  role: string
  org: string
  orgNote?: string
  period: string
  place?: string
  current?: boolean
  points: string[]
  tags: string[]
  tone: Tone
}

/** The internship: shown as the large card in the Experience section. */
export const internship: Experience = {
  role: 'Robotics & Machine Learning Engineer Intern',
  org: 'Speedybyte Services',
  orgNote: 'Incubated at IIT Ropar TBIF',
  period: 'Feb 2025 – May 2025',
  place: 'Rupnagar, Punjab',
  points: [
    'Worked with the Robot Operating System (ROS) on the development and integration of robotic systems.',
    'Designed and built software components for data acquisition, processing and communication within those systems.',
    'Maintained production-grade components spanning data handling, control logic and performance tuning.',
    'Raised code quality and delivery speed through code reviews, clear documentation and disciplined version control.',
  ],
  tags: ['ROS', 'Robotics', 'Data acquisition', 'Code review', 'Version control'],
  tone: 'mint',
}

/** Smaller cards beside the internship. */
export const involvement: Experience[] = [
  {
    role: 'Assistant Internship Coordinator (SDE)',
    org: 'CAPS, IIT Ropar',
    period: 'Current',
    current: true,
    points: ['Helping coordinate software-engineering internship opportunities for IIT Ropar students.'],
    tags: ['Position of responsibility'],
    tone: 'sky',
  },
  {
    role: 'Inter IIT Tech Meet 14.0',
    org: 'Team IIT Ropar',
    orgNote: 'Problem statement by Eternal',
    period: '2025',
    points: ['Placed 6th out of 23 IITs on a national-level engineering problem.'],
    tags: ['6th of 23 IITs', 'National level'],
    tone: 'iris',
  },
]

export type Metric = { value: string; label: string }

export type Project = {
  slug: 'rag' | 'recon' | 'water'
  title: string
  kicker: string
  year: string
  summary: string
  points: string[]
  metrics: Metric[]
  stack: string[]
  repo: string
  tone: Tone
}

export const projects: Project[] = [
  {
    slug: 'rag',
    title: 'Ask IIT Ropar',
    kicker: 'RAG campus assistant',
    year: '2026',
    summary:
      'A chatbot that answers IIT Ropar students’ questions from the institute’s official information, and shows its sources.',
    points: [
      'Scraped 1,900+ institute pages and PDFs into about 7.9K overlapping chunks of roughly 350 words, embedded with BGE-small into ChromaDB.',
      'Hybrid retrieval merges embedding search with BM25 keyword ranking; GPT-5.4-mini answers from the top 6 chunks with numbered citations.',
      'A rule-based router, with no LLM, sends directory lookups to tables, time-sensitive questions to the live institute API, and everything else to document search.',
      'A 49-question evaluation set (hit@5, MRR) tunes the BM25/embedding weighting, chunk count and relevance threshold.',
    ],
    metrics: [
      { value: '1,900+', label: 'pages & PDFs' },
      { value: '7.9K', label: 'chunks indexed' },
      { value: '49', label: 'eval questions' },
    ],
    stack: ['Python', 'ChromaDB', 'BGE-small', 'BM25', 'Docker'],
    repo: 'https://github.com/shlok165/ask-iitropar',
    tone: 'sky',
  },
  {
    slug: 'recon',
    title: 'AI Reconciliation & Settlement Agent',
    kicker: 'Finance-ops agent',
    year: '2026',
    summary:
      'A deterministic-first engine that reconciles invoices, payments and bank transactions, then hands off the genuine exceptions instead of forcing a match.',
    points: [
      'Four passes: exact-ID links, RapidFuzz weighted fuzzy matching, an LLM tie-breaker and a final LLM evaluation. The LLM only touches the 3–12% of cases that are truly ambiguous.',
      '98% transaction resolution accuracy with 100% precision and 98% recall on a 200-case synthetic dataset, at about 818 records per second.',
      'A function-calling agent with 7 read-only tools answers settlement questions from live reconciliation state.',
      'Served through FastAPI with a React dashboard, backed by a 46-test Pytest suite.',
    ],
    metrics: [
      { value: '98%', label: 'resolution accuracy' },
      { value: '100%', label: 'precision' },
      { value: '818/s', label: 'records matched' },
    ],
    stack: ['Python', 'FastAPI', 'RapidFuzz', 'Pandas', 'React', 'Pytest'],
    repo: 'https://github.com/shlok165/AIReconciliation-SettlementQ-AAgent',
    tone: 'mint',
  },
  {
    slug: 'water',
    title: 'AquaIntegrity',
    kicker: 'IoT water quality monitoring',
    year: '2024',
    summary:
      'An end-to-end pipeline from sensors in the water to a live cloud dashboard that flags contamination.',
    points: [
      'Sensor acquisition, calibration and wireless transmission to a cloud dashboard.',
      'Tracks pH, turbidity, conductivity and temperature in real time.',
      'Long-term trend analysis and anomaly detection flag contamination early.',
    ],
    metrics: [
      { value: '4', label: 'live parameters' },
      { value: 'Real-time', label: 'cloud sync' },
    ],
    stack: ['IoT sensors', 'Firebase', 'Django', 'Python'],
    repo: 'https://github.com/shlok165/AquaIntegrity',
    tone: 'iris',
  },
]

export type Repo = {
  title: string
  blurb: string
  tags: string[]
  year: string
  url: string
  tone: Tone
}

export const moreWork: Repo[] = [
  {
    title: 'Hindi–English Code-Switched ASR',
    blurb:
      'wav2vec 2.0 with a CTC head and KenLM beam search on MUCS 2021. Final model: 20.44 WER on the blind set, confirmed with the organisers’ scoring script.',
    tags: ['Speech', 'wav2vec 2.0', 'KenLM'],
    year: '2026',
    url: 'https://github.com/shlok165/hindi-english-code-switching-asr',
    tone: 'rose',
  },
  {
    title: 'Temporal models for EchoNet-Dynamic',
    blurb:
      'Ejection-fraction estimation from echocardiography video: a frozen encoder with swappable temporal models, including a proposed state-space “sync” block at 3.96 validation MAE.',
    tags: ['Medical video', 'Mamba', 'State-space models'],
    year: '2026',
    url: 'https://github.com/shlok165/echonet_dynamic_mamba_temporal_model',
    tone: 'iris',
  },
  {
    title: 'Interval',
    blurb:
      'A quiz portal for the sAIDE website at IIT Ropar, built as a Human–Computer Interaction course project with role-based access for professors and students.',
    tags: ['HCI', 'Web app', 'SQLite'],
    year: '2026',
    url: 'https://github.com/shlok165/interval-quiz-platform-by-saide',
    tone: 'sky',
  },
  {
    title: 'Smart Farm Intrusion Detection',
    blurb:
      'Edge system that detects and deters wildlife on farmland: ultrasonic trigger, ESP32-CAM capture, YOLOv8n classification and a live web dashboard.',
    tags: ['Edge AI', 'YOLOv8n', 'Raspberry Pi'],
    year: '2025',
    url: 'https://github.com/shlok165/smart-farm-intrusion-detection',
    tone: 'mint',
  },
  {
    title: 'Bipedal RL Training Platform',
    blurb:
      'Simulation platform for training bipedal robots with custom reinforcement-learning algorithms and configurable robot dimensions, on Gazebo.',
    tags: ['Reinforcement learning', 'Gazebo', 'Python'],
    year: '2025',
    url: 'https://github.com/shlok165/bipedal-roboticsXAi',
    tone: 'amber',
  },
  {
    title: 'Autonomous Warehouse Surveillance',
    blurb:
      'ROS-based autonomous surveillance for warehouse environments, split into onboard control and offboard monitoring workspaces.',
    tags: ['ROS', 'Robotics', 'Autonomy'],
    year: '2025',
    url: 'https://github.com/shlok165/autonomous_warehouse_surveillance',
    tone: 'sky',
  },
]

export type SkillGroup = { title: string; note: string; items: string[]; tone: Tone }

export const skills: SkillGroup[] = [
  {
    title: 'Languages',
    note: 'What I write in',
    items: ['Python', 'C++', 'C'],
    tone: 'mint',
  },
  {
    title: 'AI & ML',
    note: 'Models and retrieval',
    items: [
      'Retrieval-Augmented Generation',
      'Transformers',
      'Embeddings (BGE)',
      'Hybrid search (BM25 + dense)',
      'LLM function calling',
      'Retrieval evals (hit@k, MRR)',
    ],
    tone: 'sky',
  },
  {
    title: 'Backend & data',
    note: 'Serving and testing',
    items: ['FastAPI', 'ChromaDB', 'Pandas', 'RapidFuzz', 'Pytest', 'Docker', 'Git'],
    tone: 'iris',
  },
  {
    title: 'Robotics & IoT',
    note: 'Hardware in the loop',
    items: ['ROS', 'Sensor data pipelines', 'Calibration', 'Firebase'],
    tone: 'rose',
  },
  {
    title: 'Foundations',
    note: 'Core computer science',
    items: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Operating Systems'],
    tone: 'amber',
  },
]

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof nav)[number]['id'] | 'top'

export const TONE_HEX: Record<Tone, string> = {
  mint: '#5eead4',
  sky: '#5cc8ff',
  iris: '#a495ff',
  rose: '#ff8fc7',
  amber: '#ffcf7a',
}
