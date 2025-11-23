# AI-geletterdheid Check (AI voor Docenten)

Single-page React + Vite app die in 7 minuten de AI-geletterdheid van docenten test. De UI volgt de paarse huisstijl van AI voor Docenten en gebruikt Gemini 1.5 Flash om open vragen te scoren.

## Snel starten
1) Installeer dependencies:
```bash
npm install
```
2) Zet je Gemini key in `.env.local` (of `.env`) op basis van `.env.example`:
```bash
VITE_GEMINI_API_KEY=your-gemini-api-key
```
3) Start de dev-server:
```bash
npm run dev
```
4) Productie-build:
```bash
npm run build
```

## Belangrijk
- Gemini scoring draait client-side; bescherm je sleutel in productie (bijv. via server-proxy).
- Alle 7 vragen moeten zijn ingevuld voordat de analyse start.
- Resultaat: vrijwel iedereen krijgt het webinar-advies; alleen topscores krijgen het advanced aanbod.

## Structuur
- `src/data/questions.ts` - alle vragen en correcte MC-antwoorden.
- `src/api/gemini.ts` - masterprompt + parsing van Gemini-resultaat.
- `src/components/` - UI-componenten (welcome, flow, resultaten, knoppen).
- `src/App.tsx` - state-machine voor fases: welcome -> vragen -> loading -> resultaten.
- Model: `gemini-3-pro-preview` (kan aangepast worden in `src/api/gemini.ts`).
- Advieslogica: 1-3 punten = webinar-serie, 4-7 punten = gevorderd traject/modules. Resultaat toont spinnenweb per thema.
- Zelfscan: kies in het welkomstscherm; 7 stellingen (1-3), spinnenweb + advies zonder API-call.

## Styling
- Tailwind met merk-kleuren (`tailwind.config.js`).
- Dotted pattern en zachte paarse gradients voor sfeer.
- Focus-states en hoge contrast-knoppen voor toegankelijkheid.
