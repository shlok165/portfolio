/**
 * Everything the site says, in one typed file.
 *
 * Source: Shlok's off-campus CV, plus edits he approved for the earlier
 * version of the site (JEE Main rank, the internship title from the
 * certificate, location and the "More work" repositories).
 * The main page, the command menu and the printable résumé all read from here.
 */

export const site = {
  name: 'Shlok Vaidya',
  firstName: 'Shlok',
  lastName: 'Vaidya',
  initials: 'SV',
  degree: 'B.Tech, Artificial Intelligence and Data Engineering',
  degreeShort: 'B.Tech, AI & Data Engineering',
  institute: 'Indian Institute of Technology, Ropar',
  instituteShort: 'IIT Ropar',
  years: '2024 – 2028',
  email: 'shlokvaidya11@gmail.com',
  phone: '+91 72491 58371',
  phoneHref: 'tel:+917249158371',
  location: 'Rupnagar, Punjab, India',
  timeZone: 'Asia/Kolkata',
  /** Shown in the hero. Edit or set to '' to hide. */
  status: 'Open to internships',
  /** Put the PDF at public/resume.pdf; the download buttons appear when it exists. */
  resumePdf: './resume.pdf',
  /** The printable résumé page generated from this file. */
  resumePage: './resume.html',
  /** Deployed address, used for canonical / Open Graph / sitemap. */
  url: 'https://shlok165.github.io/portfolio',
} as const

export type SocialId = 'github' | 'linkedin' | 'leetcode' | 'codeforces'
export type Social = { id: SocialId; label: string; handle: string; href: string }

/** Profile links, in the order the CV lists them. */
export const socials: Social[] = [
  { id: 'github', label: 'GitHub', handle: 'shlok165', href: 'https://github.com/shlok165' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'shlok-vaidya', href: 'https://www.linkedin.com/in/shlok-vaidya-138803326/' },
  { id: 'leetcode', label: 'LeetCode', handle: 'SN_v', href: 'https://leetcode.com/u/SN_v/' },
  { id: 'codeforces', label: 'Codeforces', handle: 'shlokvaidya11', href: 'https://codeforces.com/profile/shlokvaidya11' },
]

/** CV summary, lightly trimmed for the hero and kept whole for About. */
export const summary = {
  hero: 'Third-year B.Tech student in AI and Data Engineering at IIT Ropar, with hands-on experience building production software, data pipelines and tested, reliable systems.',
  full: [
    'Third-year B.Tech student in AI and Data Engineering at IIT Ropar with a strong quantitative and problem-solving record (JEE Advanced AIR 5636, JEE Main 99.9 percentile).',
    'Hands-on experience building production software, data pipelines and tested, reliable systems; led teams in national-level competitions.',
  ],
}

export type Stat = {
  id: string
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  note: string
}

export const stats: Stat[] = [
  { id: 'cgpa', value: 8.63, decimals: 2, suffix: ' / 10', label: 'CGPA', note: 'B.Tech, IIT Ropar' },
  { id: 'jee-main', value: 1656, prefix: 'AIR ', label: 'JEE Main', note: '99.9 percentile' },
  { id: 'jee-adv', value: 5636, prefix: 'AIR ', label: 'JEE Advanced', note: 'All India Rank' },
  { id: 'inter-iit', value: 6, suffix: 'th', label: 'Inter IIT Tech Meet', note: 'of 23 IITs · 2025' },
  { id: 'codeforces', value: 1200, suffix: '+', label: 'Codeforces', note: 'Pupil' },
]

export type EducationItem = { degree: string; school: string; score: string; years: string }

export const education: EducationItem[] = [
  { degree: 'B.Tech, Artificial Intelligence & Data Engineering', school: 'Indian Institute of Technology, Ropar', score: '8.63 / 10 CGPA', years: '2024 – 2028' },
  { degree: 'Senior Secondary', school: 'Maharashtra State Board', score: '85.83%', years: '2024' },
  { degree: 'Secondary', school: 'Central Board of Secondary Education', score: '94.33%', years: '2022' },
]

/** "Relevant Coursework" and "Key Courses Taken" from the CV, grouped as the CV groups them. */
export const coursework: { area: string; courses: string[] }[] = [
  { area: 'Computer Science', courses: ['Data Structures & Algorithms', 'Foundations of Computer Systems', 'Object-Oriented Programming'] },
  { area: 'AI & Machine Learning', courses: ['Probability & Discrete Mathematics', 'Machine Learning', 'AI Systems and Programming Labs'] },
  { area: 'Mathematics & Optimization', courses: ['Optimization Methods and Applications'] },
]

export type TimelineKind = 'Work' | 'Responsibility' | 'Competition' | 'Education'

export type TimelineItem = {
  id: string
  kind: TimelineKind
  title: string
  org: string
  orgNote?: string
  period: string
  /** Large marker shown in the pinned column while this entry is active. */
  marker: string
  place?: string
  current?: boolean
  points: string[]
  tags: string[]
}

/** Experience and education, newest first, as one timeline. */
export const timeline: TimelineItem[] = [
  {
    id: 'caps',
    kind: 'Responsibility',
    title: 'Assistant Internship Coordinator (SDE)',
    org: 'CAPS, IIT Ropar',
    period: 'Current',
    marker: 'Now',
    current: true,
    points: ['Helping coordinate software-engineering internship opportunities for IIT Ropar students.'],
    tags: ['Position of responsibility'],
  },
  {
    id: 'inter-iit',
    kind: 'Competition',
    title: 'Inter IIT Tech Meet 14.0',
    org: 'Team IIT Ropar',
    orgNote: 'Problem statement by Eternal',
    period: '2025',
    marker: '2025',
    points: ['Placed 6th out of 23 IITs on a national-level engineering problem.'],
    tags: ['6th of 23 IITs', 'National level'],
  },
  {
    id: 'speedybyte',
    kind: 'Work',
    title: 'Robotics & Machine Learning Engineer Intern',
    org: 'Speedybyte Services',
    orgNote: 'Incubated at IIT Ropar TBIF',
    period: 'Feb 2025 – May 2025',
    marker: 'Feb ’25',
    place: 'Rupnagar, Punjab',
    points: [
      'Worked with the Robot Operating System (ROS) on the development and integration of robotic systems.',
      'Built and maintained production-grade software components spanning data handling, business/control logic and performance tuning.',
      'Improved code quality and delivery speed through code reviews, clear documentation and disciplined version control.',
      'Worked with teammates to ship features against deadlines in a real-world development workflow.',
    ],
    tags: ['ROS', 'Data handling', 'Code review', 'Version control'],
  },
  {
    id: 'btech',
    kind: 'Education',
    title: 'B.Tech, Artificial Intelligence & Data Engineering',
    org: 'Indian Institute of Technology, Ropar',
    period: '2024 – 2028',
    marker: '2024',
    current: true,
    points: ['CGPA 8.63 / 10.'],
    tags: ['DSA', 'Machine Learning', 'Optimization'],
  },
  {
    id: 'hsc',
    kind: 'Education',
    title: 'Senior Secondary',
    org: 'Maharashtra State Board',
    period: '2024',
    marker: '2024',
    points: ['85.83%. JEE Main AIR 1656 (99.9 percentile), JEE Advanced AIR 5636.'],
    tags: [],
  },
  {
    id: 'ssc',
    kind: 'Education',
    title: 'Secondary',
    org: 'Central Board of Secondary Education',
    period: '2022',
    marker: '2022',
    points: ['94.33%.'],
    tags: [],
  },
]

export type Metric = { value: number; decimals?: number; prefix?: string; suffix?: string; label: string }

export type TrackId = 'software' | 'robotics'

/** The two tracks the Projects section is split into, in display order. */
export const tracks: { id: TrackId; title: string; blurb: string }[] = [
  { id: 'software', title: 'Software', blurb: 'Development and AI: retrieval systems, agents, speech and vision models, web apps.' },
  { id: 'robotics', title: 'Robotics', blurb: 'ROS, simulation, edge devices and sensor pipelines.' },
]

export type ProjectSlug = 'rag' | 'recon' | 'water'

export type Project = {
  slug: ProjectSlug
  track: TrackId
  index: string
  title: string
  kicker: string
  year: string
  role: string
  summary: string
  points: string[]
  metrics: Metric[]
  /** Technologies; a skill highlights this project when its name appears here. */
  stack: string[]
  repo: string
}

export const projects: Project[] = [
  {
    slug: 'rag',
    track: 'software',
    index: '01',
    title: 'Ask IIT Ropar',
    kicker: 'RAG campus assistant',
    year: '2026',
    role: 'Independent project',
    summary: 'A RAG assistant over the institute’s own pages and PDFs that answers with source citations.',
    points: [
      'Built a RAG assistant over 1,900+ scraped IIT Ropar pages and PDFs, split into ~350-word overlapping chunks (7.9K) and embedded with BGE-small into ChromaDB.',
      'Hybrid retrieval combines cosine-similarity search with BM25 keyword ranking, and GPT-5.4-mini answers from the top-6 chunks with source citations.',
      'Added a rule-based query router (directory lookups, live institute API, document search).',
      'Built a 49-question evaluation set (hit@5, MRR) to tune the BM25/embedding weighting, chunk count and relevance threshold.',
    ],
    metrics: [
      { value: 1900, suffix: '+', label: 'pages & PDFs' },
      { value: 7.9, decimals: 1, suffix: 'K', label: 'chunks' },
      { value: 49, label: 'eval questions' },
    ],
    stack: ['Python', 'Retrieval-Augmented Generation', 'Embeddings (BGE)', 'Hybrid search (BM25 + dense)', 'Retrieval evals (hit@k, MRR)', 'ChromaDB', 'Docker'],
    repo: 'https://github.com/shlok165/ask-iitropar',
  },
  {
    slug: 'recon',
    track: 'software',
    index: '02',
    title: 'AI Reconciliation & Settlement Agent',
    kicker: 'Deterministic-first matching engine',
    year: '2026',
    role: 'Independent project',
    summary: 'Reconciles invoices, payments and bank transactions, and escalates what it can’t resolve instead of forcing a match.',
    points: [
      'Built a 4-pass, deterministic-first engine (exact-ID, RapidFuzz weighted fuzzy matching, LLM tie-breaker) to reconcile invoices, payments and bank transactions; LLM calls limited to ~3–12% of ambiguous cases.',
      'Reached 98% transaction resolution accuracy, 100% precision and 98% recall on a 200-case synthetic dataset at ~818 records/sec, escalating unresolved cases as exceptions instead of forcing matches.',
      'Added a function-calling agent (7 read-only tools) for settlement Q&A, served via FastAPI with a React dashboard and a 46-test Pytest suite.',
    ],
    metrics: [
      { value: 98, suffix: '%', label: 'resolution accuracy' },
      { value: 100, suffix: '%', label: 'precision' },
      { value: 818, prefix: '~', suffix: '/s', label: 'records' },
    ],
    stack: ['Python', 'LLM function calling', 'RapidFuzz', 'FastAPI', 'React', 'Pandas', 'Pytest'],
    repo: 'https://github.com/shlok165/AIReconciliation-SettlementQ-AAgent',
  },
  {
    slug: 'water',
    track: 'robotics',
    index: '03',
    title: 'AquaIntegrity',
    kicker: 'IoT water quality monitoring',
    year: '2024',
    role: 'Independent project',
    summary: 'An end-to-end pipeline from sensors in the water to a cloud dashboard that flags contamination.',
    points: [
      'Designed an end-to-end data pipeline: sensor acquisition, calibration and wireless transmission to a cloud dashboard.',
      'Monitored pH, turbidity and conductivity in real time, with long-term trend analysis and anomaly detection to flag contamination.',
    ],
    metrics: [{ value: 3, label: 'water parameters, real time' }],
    stack: ['Python', 'Sensor data pipelines', 'Calibration', 'Firebase', 'Django'],
    repo: 'https://github.com/shlok165/AquaIntegrity',
  },
]

export type Repo = { title: string; track: TrackId; blurb: string; stack: string[]; year: string; url: string }

/** Smaller repositories, shown as a compact list under the featured projects. */
export const moreWork: Repo[] = [
  {
    title: 'Hindi–English Code-Switched ASR',
    track: 'software',
    blurb: 'wav2vec 2.0 with a CTC head and KenLM beam search on MUCS 2021. Final model: 20.44 WER on the blind set.',
    stack: ['Transformers', 'wav2vec 2.0', 'KenLM'],
    year: '2026',
    url: 'https://github.com/shlok165/hindi-english-code-switching-asr',
  },
  {
    title: 'Temporal models for EchoNet-Dynamic',
    track: 'software',
    blurb: 'Ejection-fraction estimation from echocardiography video with swappable temporal models, including a state-space block at 3.96 validation MAE.',
    stack: ['State-space models', 'Mamba', 'Medical video'],
    year: '2026',
    url: 'https://github.com/shlok165/echonet_dynamic_mamba_temporal_model',
  },
  {
    title: 'Interval',
    track: 'software',
    blurb: 'Quiz portal for the sAIDE website at IIT Ropar, built as a Human–Computer Interaction course project with role-based access.',
    stack: ['HCI', 'SQLite'],
    year: '2026',
    url: 'https://github.com/shlok165/interval-quiz-platform-by-saide',
  },
  {
    title: 'Smart Farm Intrusion Detection',
    track: 'robotics',
    blurb: 'Ultrasonic trigger, ESP32-CAM capture and YOLOv8n classification to detect and deter wildlife, with a live web dashboard.',
    stack: ['YOLOv8n', 'ESP32-CAM', 'Raspberry Pi'],
    year: '2025',
    url: 'https://github.com/shlok165/smart-farm-intrusion-detection',
  },
  {
    title: 'Bipedal RL Training Platform',
    track: 'robotics',
    blurb: 'Simulation platform for training bipedal robots with custom reinforcement-learning algorithms and configurable robot dimensions.',
    stack: ['Python', 'Reinforcement learning', 'Gazebo'],
    year: '2025',
    url: 'https://github.com/shlok165/bipedal-roboticsXAi',
  },
  {
    title: 'Autonomous Warehouse Surveillance',
    track: 'robotics',
    blurb: 'ROS-based autonomous surveillance for warehouses, split into onboard control and offboard monitoring workspaces.',
    stack: ['ROS', 'Robotics'],
    year: '2025',
    url: 'https://github.com/shlok165/autonomous_warehouse_surveillance',
  },
]

export type SkillGroupId = 'languages' | 'ai' | 'engineering' | 'robotics' | 'foundations'
export type SkillGroup = { id: SkillGroupId; title: string; items: string[] }

/**
 * Skills. The CV's "Technical Skills" plus the tools named in its project
 * bullets. A skill links to every project whose `stack` contains the same name.
 */
export const skillGroups: SkillGroup[] = [
  { id: 'languages', title: 'Languages', items: ['Python', 'C++', 'C'] },
  {
    id: 'ai',
    title: 'AI & ML',
    items: [
      'Retrieval-Augmented Generation',
      'Transformers',
      'Embeddings (BGE)',
      'Hybrid search (BM25 + dense)',
      'Retrieval evals (hit@k, MRR)',
      'LLM function calling',
      'Reinforcement learning',
    ],
  },
  { id: 'engineering', title: 'Engineering', items: ['FastAPI', 'React', 'ChromaDB', 'Pandas', 'RapidFuzz', 'Pytest', 'Docker', 'Git'] },
  { id: 'robotics', title: 'Robotics & IoT', items: ['ROS', 'Gazebo', 'Raspberry Pi', 'Sensor data pipelines', 'Calibration', 'Firebase'] },
  { id: 'foundations', title: 'Foundations', items: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Operating Systems'] },
]

export type Achievement = { title: string; detail: string; year: string }

export const achievements: Achievement[] = [
  { title: 'Inter IIT Tech Meet (Company: Eternal)', detail: '6th rank out of 23 IITs in a national-level engineering problem', year: '2025' },
  { title: 'Competitive Programming', detail: 'Pupil on Codeforces (rating 1200+); active problem solver on LeetCode', year: '' },
]

export const responsibilities = [{ title: 'Assistant Internship Coordinator (SDE)', org: 'CAPS, IIT Ropar', period: 'Current' }]

export const nav = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'experience', label: 'Experience', index: '02' },
  { id: 'projects', label: 'Projects', index: '03' },
  { id: 'skills', label: 'Skills', index: '04' },
  { id: 'contact', label: 'Contact', index: '05' },
] as const

export type SectionId = (typeof nav)[number]['id']
