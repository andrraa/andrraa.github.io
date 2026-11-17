export interface TechItem {
  name: string;
  code: string;
  category: 'Backend' | 'Frontend' | 'Database' | 'DevOps';
  note: string;
  span?: 'wide' | 'normal';
  tone: 'yellow' | 'coral' | 'sky' | 'mint' | 'paper';
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
    secondaryCta: 'Tech stack',
  },
  techStack: [
    {
      name: 'Go',
      code: 'GO',
      category: 'Backend',
      note: 'Concurrent services & fast APIs',
      span: 'wide',
      tone: 'sky',
    },
    {
      name: 'Laravel',
      code: 'LV',
      category: 'Backend',
      note: 'Full-featured web apps & queues',
      span: 'normal',
      tone: 'coral',
    },
    {
      name: 'PHP',
      code: 'PHP',
      category: 'Backend',
      note: 'Production web systems',
      span: 'normal',
      tone: 'paper',
    },
    {
      name: 'Next.js',
      code: 'NX',
      category: 'Frontend',
      note: 'React, SSR & static interfaces',
      span: 'wide',
      tone: 'yellow',
    },
    {
      name: 'PostgreSQL',
      code: 'PG',
      category: 'Database',
      note: 'Relational modeling & tuning',
      span: 'normal',
      tone: 'mint',
    },
    {
      name: 'MySQL',
      code: 'MY',
      category: 'Database',
      note: 'Transactional workloads',
      span: 'normal',
      tone: 'paper',
    },
    {
      name: 'SQL Server',
      code: 'MS',
      category: 'Database',
      note: 'Enterprise queries & procs',
      span: 'normal',
      tone: 'coral',
    },
    {
      name: 'Docker',
      code: 'DK',
      category: 'DevOps',
      note: 'Containers & local parity',
      span: 'normal',
      tone: 'sky',
    },
    {
      name: 'Git',
      code: 'GIT',
      category: 'DevOps',
      note: 'Clean commits & workflows',
      span: 'wide',
      tone: 'yellow',
    },
  ] satisfies TechItem[],
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
