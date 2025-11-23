export type QuestionType = 'mc' | 'open';

export interface Option {
  id: string;
  label: string;
  description?: string;
}

export interface Question {
  id: number;
  theme: string;
  title: string;
  prompt: string;
  type: QuestionType;
  options?: Option[];
  correctAnswer?: string;
  helperText?: string;
  placeholder?: string;
}

export const questions: Question[] = [
  {
    id: 1,
    theme: 'Hoe werkt generatieve AI?',
    title: 'Beperkingen van LLMs',
    prompt: 'Welke uitspraak klopt het meest over een Large Language Model zoals ChatGPT?',
    type: 'mc',
    options: [
      { id: 'A', label: 'A. Het redeneert als een mens en begrijpt context zoals wij dat doen' },
      { id: 'B', label: 'B. Het voorspelt tokens op basis van patronen, zonder echte begrip of bron-check' },
      { id: 'C', label: 'C. Het heeft altijd realtime internettoegang en checkt feiten automatisch' },
      { id: 'D', label: 'D. Het genereert alleen wat letterlijk in de trainingsdata stond' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 2,
    theme: 'Prompting',
    title: 'Essentiele prompt-elementen',
    prompt:
      'Je wilt ChatGPT gebruiken om feedback te geven op essays van leerlingen. Welke aspecten zet je in je prompt om goede feedback te krijgen?',
    type: 'open',
    placeholder: 'Schrijf je antwoord in 3-5 regels.',
  },
  {
    id: 3,
    theme: 'Custom chatbots',
    title: 'Techniek en didactiek',
    prompt:
      'Hoe en waarom zou je een custom chatbot bouwen voor je onderwijs? Leg uit welke technische stappen nodig zijn en welke onderwijskundige overwegingen je maakt.',
    type: 'open',
    placeholder: 'Schrijf je antwoord in 3-5 regels.',
  },
  {
    id: 4,
    theme: 'Vibecoden',
    title: 'Frontend, database en chatbot-integratie',
    prompt:
      'Leg kort uit wat de begrippen frontend, database en chatbot-integratie betekenen in een AI-gedreven onderwijsapp.',
    type: 'open',
    placeholder: 'Beschrijf in 3-5 regels wat elk onderdeel doet en hoe ze samenwerken.',
  },
  {
    id: 5,
    theme: 'Privacy, bias & hallucineren',
    title: 'Veilig omgaan met data',
    prompt:
      'Een collega wil ChatGPT gebruiken om persoonlijke ontwikkelplannen voor leerlingen te schrijven, inclusief namen en gevoelige informatie. Wat is je advies?',
    type: 'mc',
    options: [
      { id: 'A', label: 'A. Prima, ChatGPT is veilig en geeft goede adviezen' },
      { id: 'B', label: 'B. Kan wel, maar alleen met toestemming van leerlingen' },
      { id: 'C', label: 'C. Niet doen - gebruik geanonimiseerde voorbeelden of een lokale, privacyvriendelijke oplossing' },
      { id: 'D', label: 'D. Het mag, zolang je de school-licentie gebruikt' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 6,
    theme: 'AI-ready toetsing',
    title: 'Verslag ombouwen naar AI-ready toets',
    prompt:
      'Hoe zou je een traditioneel verslag ombouwen naar een AI-ready toets waarin AI een ondersteunende rol heeft, niet de hoofdrol?',
    type: 'open',
    placeholder:
      'Beschrijf een aanpak (bijv. eigen alinea vergelijken met AI-alinea, verschillen noteren, procesverantwoording).',
  },
  {
    id: 7,
    theme: 'Tools, beperkingen & toekomst',
    title: 'Grenzen van AI vandaag',
    prompt: 'Noem twee belangrijke beperkingen van huidige AI-systemen waar docenten rekening mee moeten houden.',
    type: 'open',
    placeholder: 'Beschrijf in je eigen woorden twee belangrijke beperkingen.',
  },
];
