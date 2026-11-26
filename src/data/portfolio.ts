export interface CapabilityItem {
  code: string;
  title: string;
  summary: string;
  tools: string[];
  tone: 'yellow' | 'coral' | 'sky' | 'paper';
}

export interface AiModelItem {
  id: string;
  name: string;
  role: string;
  quotes: string[];
}

export interface ContactLink {
  label: string;
  handle: string;
  href?: string;
  soon?: boolean;
  cursorLabel: string;
}

export const portfolioData = {
  brand: 'andra.',
  name: 'Andra Ramadan',
  role: 'Software Engineer',
  location: 'Indonesia',
  availability: 'Open to work',
  hero: {
    headline: 'Building reliable backends & sharp web interfaces.',
    subtext:
      'I work across PHP, Laravel, Go, and Next.js—turning complex business logic into fast, maintainable systems.',
    primaryCta: 'Get in touch',
    secondaryCta: 'What I handle',
  },
  capabilities: [
    {
      code: '01',
      title: 'Backend & APIs',
      summary: 'Services, queues, and clean business logic built to hold up under real traffic.',
      tools: ['Go', 'Laravel', 'PHP'],
      tone: 'yellow',
    },
    {
      code: '02',
      title: 'Data & Query Tuning',
      summary: 'Schema design, indexing, and untangling slow queries across relational engines.',
      tools: ['PostgreSQL', 'SQL Server', 'MySQL'],
      tone: 'sky',
    },
    {
      code: '03',
      title: 'Web Interfaces',
      summary: 'Fast, responsive frontends without unnecessary client-side bloat.',
      tools: ['Next.js', 'TypeScript', 'Tailwind'],
      tone: 'coral',
    },
    {
      code: '04',
      title: 'Shipping & Infra',
      summary: 'Reproducible environments, clean git history, and automated deploys.',
      tools: ['Docker', 'Git', 'GitHub Actions'],
      tone: 'paper',
    },
  ] satisfies CapabilityItem[],
  aiCrew: [
    {
      id: 'deepseek',
      name: 'DeepSeek',
      role: 'Reasoning Intern',
      quotes: [
        "It's 3 AM, go to sleep!",
        'I thought for 48s for THIS?!',
        'Bro, read the stack trace!',
        'Stop changing requirements!',
        'Why is there a sleep(5) here?!',
        'Server busy. Leave me alone.',
      ],
    },
    {
      id: 'gpt',
      name: 'GPT',
      role: 'Senior Yapper',
      quotes: [
        'You forgot a semicolon, dummy!',
        'Stop pasting the whole file!',
        'I already fixed that 3 prompts ago!',
        'Another "quick fix"?! Sure.',
        'My tokens are NOT free, bro!',
        'Just use console.log like normal!',
      ],
    },
    {
      id: 'glm',
      name: 'GLM',
      role: 'Night Shift Worker',
      quotes: [
        "It's 3 AM, let me rest!",
        'No more overtime, boss!',
        'You broke prod again, didn’t you?',
        'Why are we deploying on Friday?!',
        'Please, just one clean commit!',
        'I am literally begging for sleep.',
      ],
    },
    {
      id: 'qwen',
      name: 'Qwen',
      role: 'Speed Coder',
      quotes: [
        'Slow down, I’m typing!',
        'Who wrote this spaghetti?!',
        'You didn’t even run the tests!',
        'Stop blaming the framework!',
        '500 lines and zero types, nice.',
        'Ctrl+C Ctrl+V isn’t engineering!',
      ],
    },
    {
      id: 'claude',
      name: 'Claude',
      role: 'Overthinker',
      quotes: [
        'My context is FULL of your bugs!',
        'Stop saying "make it pop"!',
        'I checked 12 files, it’s YOUR typo!',
        'Why is this 800 lines in one file?!',
        'Please, no more CSS tweaks!',
        'You deleted the .env again, huh?',
      ],
    },
  ] satisfies AiModelItem[],
  contact: {
    heading: "Let's build something.",
    subtext:
      'Have a project, role, or engineering challenge in mind? Drop me an email or check my GitHub.',
    email: 'andraramadan.dev@gmail.com',
    links: [
      {
        label: 'GitHub',
        handle: '@andrraa',
        href: 'https://github.com/andrraa',
        cursorLabel: 'GIT',
      },
      {
        label: 'LinkedIn',
        handle: 'Soon',
        soon: true,
        cursorLabel: 'SOON',
      },
      {
        label: 'X / Twitter',
        handle: 'Soon',
        soon: true,
        cursorLabel: 'SOON',
      },
    ] satisfies ContactLink[],
  },
};
