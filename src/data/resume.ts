export const profile = {
  name: 'Ragul Athur Raghunath',
  heroName: 'Ragul A R',
  title: 'Full Stack Developer',
  location: 'Chennai, India',
  phone: '+91-7305005565',
  email: 'ragulraghunath310@gmail.com',
  github: 'https://github.com/Ar-Ragul',
  summary:
    'Full Stack Developer with around 4+ years of experience in development, enhancement, and technical support — across the full SDLC, from requirement analysis to implementation and maintenance, in both Agile and Waterfall settings.',
  tagline: 'I care as much about the pixel as I do about the API.',
};

export const highlights = [
  'Proficient across front-end technologies — HTML, CSS, JavaScript, and modern frameworks like React.',
  'Deep understanding of generative model architectures, loss functions, and evaluation metrics, applying GenAI with Python.',
  'Strong design sensibility and an eye for detail, focused on responsive, visually appealing web interfaces.',
  'Experience building responsive, interactive Single Page Applications (SPAs) with React JS.',
  'Backend experience with Java, J2EE, Servlets, Applets, and RESTful web services.',
  'Adept at collaborating with cross-functional teams to bring projects to life.',
  'Proficient with NoSQL (MongoDB) and relational databases — SQL Server, PostgreSQL, MySQL.',
];

export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { label: 'Languages', items: ['JavaScript', 'Python', 'Java', 'SQL'] },
  {
    label: 'Frameworks & Libraries',
    items: [
      'React.js',
      'Vue.js',
      'Next.js',
      'Node.js',
      'Bootstrap',
      'jQuery',
      'JSON',
      'XML',
      'REST API',
      'Redux',
      'AJAX',
      'SASS',
    ],
  },
  { label: 'IDEs', items: ['VS Code', 'Sublime Text', 'Notepad++'] },
  { label: 'Application Servers', items: ['Nginx', 'Apache', 'WebSphere'] },
  { label: 'Databases', items: ['MySQL', 'MongoDB', 'SQL Server', 'PostgreSQL'] },
  { label: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Jenkins', 'CI/CD'] },
  { label: 'Version Control', items: ['Git'] },
];

export type ExperienceEntry = {
  role: string;
  company: string;
  client?: string;
  location: string;
  period: string;
  bullets: string[];
  tech: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: 'Senior Software Developer II',
    company: 'Payoda Technologies',
    client: 'Sagent',
    location: 'India',
    period: 'Mar 2024 — Present',
    bullets: [
      'Involved in Agile methodologies and the SCRUM process.',
      'Leveraged and enhanced the company’s brand by delivering high-quality development work on FC/BK.',
      'Produced world-class solutions by building reusable components and implementing accessible front-end development.',
      'Ensured all software adhered to industry standards and best practices in accessibility.',
      'Created and updated advanced component documentation to keep design guidelines consistent across projects.',
      'Collaborated with cross-functional teams to enhance the shared component library.',
      'Participated in design and code reviews, iterating quickly in a fast-paced, startup-like environment.',
      'Implemented unit tests with Jest to ensure functionality and maintain code quality.',
      'Applied responsive web design principles across multiple devices and screen sizes.',
      'Advocated for and implemented web accessibility to improve usability for all users.',
    ],
    tech: ['ReactJs', 'Bit.Dev', 'Azure DevOps', 'MySQL', 'JSON', 'AJAX', 'GIT', 'HTML', 'CSS', 'JS', 'TypeScript'],
  },
  {
    role: 'Software Developer I',
    company: 'Maximus INC',
    location: 'USA, Remote',
    period: 'May 2023 — Feb 2024',
    bullets: [
      'Participated in developing web application UI using HTML, CSS, JavaScript, Bootstrap, and React JS.',
      'Built and trained basic generative models for tasks like text generation using Python.',
      'Utilized React to build dynamic, interactive frontend components, enhancing user engagement.',
      'Improved website performance via code optimization and lazy loading, reducing page load times by 20%.',
      'Built dynamic pages using AJAX, JSON, and jQuery; deployed on WebSphere and Apache Tomcat.',
      'Leveraged AWS services to build and deploy cloud-driven web applications at global scale.',
      'Integrated third-party APIs for payment processing and social media sharing.',
      'Implemented CRUD operations on MongoDB; tracked issues with GIT and JIRA.',
      'Built and deployed computer vision models for specific applications.',
      'Worked with TensorFlow, PyTorch, and Keras to implement basic deep learning models.',
    ],
    tech: ['ReactJs', 'Python', 'AWS', 'JSON', 'NodeJS', 'PyTorch', 'MongoDB'],
  },
  {
    role: 'Product Developer',
    company: 'Meta',
    location: 'Irvine, USA',
    period: 'May 2022 — Feb 2023',
    bullets: [
      'Designed and developed a key application UI for the Collimation Project using React JS.',
      'Documented 100% of technical specifications and dependencies for the application.',
      'Helped evolve the front-end and back-end stack in Java.',
      'Enhanced overall product performance by 40% using AWS cloud.',
      'Built the application to be fully responsive using Bootstrap (HTML5, SASS, JavaScript).',
      'Worked in scalable Agile/SCRUM environments with test-driven development (TDD).',
      'Applied TypeScript, ExtJS, Node.js, Bootstrap, Ember.js, and microservices in UI development.',
      'Ensured security patchwork was implemented at every step of the databases and APIs.',
      'Used Git and TortoiseGit for version control.',
      'Paired design reviews with automated tests as roadmap metrics.',
    ],
    tech: ['ReactJs', 'Python', 'Java', 'AWS', 'JSON', 'REST', 'GraphQL', 'GIT', 'MongoDB', 'NodeJS', 'PyTorch', 'TypeScript'],
  },
];

export type Project = {
  name: string;
  tagline: string;
  url: string;
  description: string[];
  tech: string[];
};

export const projects: Project[] = [
  {
    name: 'DreamShell',
    tagline: 'A conversational shell with soul',
    url: 'https://github.com/Ar-Ragul/DreamShell',
    description: [
      'Engineered a custom interactive shell in TypeScript that responds with context-aware personality traits — curiosity, wit, empathy.',
      'Built modular "trait engines" so the shell’s tone and behavior adapt dynamically.',
      'Designed memory and prediction modules for multi-step conversations with context recall across sessions.',
    ],
    tech: ['TypeScript'],
  },
  {
    name: 'Fluffy-Palm-Tree',
    tagline: 'Frontend for an AI agent that understands your office’s hierarchy',
    url: 'https://github.com/Ar-Ragul/fluffy-palm-tree',
    description: [
      'Designed an AI agent mirroring a workplace’s departments, roles, and reporting lines to assist with coordination and approvals.',
      'Modeled office "actors" with knowledge graphs / structured data so the agent can reason about relationships and permissions.',
      'Built intent recognition with NLP / transformer models for queries like "approve leave for X" or "what’s pending in my team".',
    ],
    tech: ['NLP', 'Knowledge Graphs', 'React'],
  },
  {
    name: 'Sturdy-Octo-Dollop',
    tagline: 'A resilient backend powering the octopus of features',
    url: 'https://github.com/Ar-Ragul/sturdy-octo-dollop',
    description: [
      'Created scalable, modular backend services in Node.js — routing, authentication, API design, and data management.',
      'Focused on error resilience, decoupling, and clean separation of concerns.',
      'Documented API endpoints and internal workflows for future maintenance and extension.',
    ],
    tech: ['Node.js', 'JavaScript'],
  },
  {
    name: 'To_Do',
    tagline: 'Your daily tasks, optimized',
    url: 'https://github.com/Ar-Ragul/to_do',
    description: [
      'Built a full-stack task manager in TypeScript with project grouping and task statuses.',
      'Enforced validations, edge-case handling, and a seamless UX across desktop and mobile.',
      'Persisted state and data reliably; tuned performance for minimal lag in large task lists.',
    ],
    tech: ['TypeScript', 'Full-stack'],
  },
  {
    name: 'PokemonReact',
    tagline: 'Catch ’em all — React style',
    url: 'https://github.com/Ar-Ragul/pokeMonReact',
    description: [
      'Built an interactive Pokémon catalog integrating public APIs for stats, images, and abilities.',
      'Implemented pagination, search, filtering, and lazy loading to manage performance and UX.',
      'Optimized component rendering and state management to reduce unnecessary updates.',
    ],
    tech: ['React', 'JavaScript'],
  },
  {
    name: 'DLAPP',
    tagline: 'Dynamic Leave & Approval App',
    url: 'https://github.com/Ar-Ragul/shamsalyushraq-website',
    description: [
      'Crafted a native Android + web client + backend system using Kotlin, Nuxt.js, Firebase Realtime DB, and FCM push notifications.',
      'Enabled dashboard-driven leave requests with real-time approve/deny updates.',
      'Ensured robust synchronization, offline resilience, and intuitive UI/UX flows.',
    ],
    tech: ['Kotlin', 'Nuxt.js', 'Firebase'],
  },
];

export const education = [
  {
    degree: 'Master of Science in Computer Engineering',
    school: 'University of North Texas, Denton',
    location: 'USA',
    period: 'Dec 2022',
  },
  {
    degree: 'Bachelor of Technology in Computer Engineering',
    school: 'B.S.A. Crescent Institute of Science & Technology',
    location: 'India',
    period: 'Mar 2022',
  },
];

export const certifications = [
  'Python Certification, Solo Learn (2018)',
  'Google Certification — Deep Learning with TensorFlow',
];

export const journals = [
  'Published in Seybold Report Journals: "Automated Smart Card Reading and Extraction System using Computational Analysis."',
];

export const patent = {
  title: 'AGBOT — 2019V8IS000209',
  description:
    'A multitasking agricultural robot powered by artificial intelligence, performing harvesting, weeding, culling, and plowing with the help of image processing and brain-wave technology.',
};
