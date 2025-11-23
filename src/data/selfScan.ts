export type SelfScanItem = {
  id: number;
  theme: string;
  statement: string;
  hint?: string;
};

export const selfScanItems: SelfScanItem[] = [
  {
    id: 1,
    theme: 'Hoe werkt generatieve AI?',
    statement: 'Ik weet hoe een LLM werkt en kan dat helder aan een collega uitleggen.',
  },
  {
    id: 2,
    theme: 'Prompting',
    statement: 'Ik weet hoe ik een goede prompt moet opbouwen.',
  },
  {
    id: 3,
    theme: 'Custom chatbots',
    statement: 'Ik weet hoe ik een custom chatbot bouw en hoe ik custom instructions vormgeef.',
  },
  {
    id: 4,
    theme: 'Vibecoden',
    statement: 'Ik begrijp hoe frontend, database en chatbot-integratie samenwerken in een AI-app.',
  },
  {
    id: 5,
    theme: 'Privacy & bias',
    statement: 'Ik kan risico’s rond privacy/bias inschatten en passende maatregelen nemen.',
  },
  {
    id: 6,
    theme: 'AI-ready toetsing',
    statement: 'Ik kan een toets AI-ready maken.',
  },
  {
    id: 7,
    theme: 'Beperkingen & toekomst',
    statement:
      'Ik kan de beperkingen/nadelen van generatieve AI uitleggen: bias, hallucineren, cognitive offloading, privacy.',
  },
];
