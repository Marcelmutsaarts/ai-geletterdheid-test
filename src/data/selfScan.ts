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
    statement: 'Ik kan helder uitleggen dat een LLM patronen voorspelt zonder echte begrip of broncontrole.',
  },
  {
    id: 2,
    theme: 'Prompting',
    statement: 'Ik schrijf prompts met rol, doel, context en duidelijke instructies (en voorbeelden).',
  },
  {
    id: 3,
    theme: 'Custom chatbots',
    statement: 'Ik weet hoe je een chatbot bouwt met eigen data (RAG/fine-tune) én onderwijsdoelen.',
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
    statement: 'Ik kan een verslag/toets AI-ready maken met processtappen en reflectie (AI als hulpmiddel).',
  },
  {
    id: 7,
    theme: 'Beperkingen & toekomst',
    statement: 'Ik ken meerdere beperkingen van AI (hallucinatie, bias, geen wereldmodel, etc.).',
  },
];
