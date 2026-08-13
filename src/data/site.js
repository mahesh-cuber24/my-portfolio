// Identity + contact. Sourced from the resume in `portfolio details/`.
export const site = {
  name: 'Umaa Maheswaran V',
  initials: 'UM',
  role: 'AI Engineer',
  // The hero headline is split so one phrase can be set in the serif accent face.
  headlineLead: 'Intelligent systems that go',
  headlineAccent: 'beyond the notebook',
  tagline:
    'Deep learning, computer vision and agentic AI — taking ideas from prototype to production. Currently making radar detection adaptive at a defence technology startup.',
  location: 'Bangalore, India',
  currentRole: 'AI/ML Intern @ Sanlayan Technologies',
  availability: 'Open to AI / ML Engineer roles',
  email: 'mahcubr24@gmail.com',
  // Deliberately not rendered on the page — a phone number in plain HTML is far
  // easier to scrape than one inside the linked résumé PDF. Wire it up if wanted.
  phone: '+91 8838271670',
  github: 'https://github.com/mahesh-cuber24',
  githubHandle: 'github.com/mahesh-cuber24',
  // TODO: confirm this resolves — the pre-rebuild site had a broken placeholder here.
  linkedin: 'https://www.linkedin.com/in/umaamaheswaran-v/',
  linkedinHandle: 'linkedin.com/in/umaamaheswaran-v',
  resume: `${import.meta.env.BASE_URL}resume.pdf`,
};

export const navLinks = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'experience', label: 'Experience', index: '02' },
  { id: 'projects', label: 'Work', index: '03' },
  { id: 'stack', label: 'Stack', index: '04' },
  { id: 'contact', label: 'Contact', index: '05' },
];

export const about = {
  paragraphs: [
    'I build intelligent systems that make it out of the notebook. My work spans deep learning, computer vision, agentic AI, and full-stack AI applications built on RAG, LangGraph and MCP.',
    'Right now I am at a defence technology startup, replacing a manually-configured radar detection step with a model that chooses per dwell — which has meant as much forensic pipeline debugging as it has model training.',
    'What I care about is the part after the prototype: the evaluation harness that proves it works, the bug that quietly poisons your labels, the compression pass that makes it fit on the device.',
  ],
  facts: [
    { label: 'Based in', value: 'Bangalore, India' },
    { label: 'Focus', value: 'Deep Learning · Computer Vision · Agentic AI' },
    { label: 'Degree', value: 'B.Tech ECE — Amrita Vishwa Vidyapeetham' },
    { label: 'Graduating', value: '2026 · CGPA 7.63 / 10' },
    { label: 'Open to', value: 'AI / ML Engineer roles' },
  ],
  certifications: [
    { title: 'AI on Jetson Nano', issuer: 'NVIDIA' },
    { title: 'Supervised Machine Learning', issuer: 'Stanford University · DeepLearning.AI' },
  ],
  achievements: [
    {
      title: 'ELCIA All India Sense2Scale Hackathon',
      detail: 'Finalist — top 10 of 200+ teams nationwide',
    },
    {
      title: 'Competitive speed cuber',
      detail: 'Rubik’s Cube solved in under 15 seconds',
    },
  ],
};
