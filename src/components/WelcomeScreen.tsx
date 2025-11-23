import { motion } from 'framer-motion';
import Button from './Button';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl bg-lightPurpleBg px-6 py-10 shadow-card sm:px-12"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-primaryPurple/10 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-6 h-32 w-32 rounded-full dotted-pattern" />
      <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-darkPurple">AI voor Docenten</p>
          <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Check je AI-geletterdheid in 7 minuten
          </h1>
          <p className="text-base text-grayText">
            Zeven korte vragen over AI in het onderwijs. Je krijgt direct een advies: de webinarserie
            of een advanced aanbod voor echte high-performers.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-grayText">
            <span className="rounded-full bg-white px-3 py-2 font-semibold text-primaryPurple shadow-sm">
              7 vragen
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-semibold text-primaryPurple shadow-sm">
              1 minuut per thema
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-semibold text-primaryPurple shadow-sm">
              Direct feedback
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={onStart}>Start de check</Button>
            <p className="text-sm text-darkPurple">Super dat je deze stap zet!</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl border border-white/70 p-6 shadow-card">
          <p className="text-sm font-semibold text-darkPurple">Wat kun je verwachten?</p>
          <ul className="mt-3 space-y-2 text-sm text-grayText">
            <li>- Heldere vragen die passen bij je onderwijspraktijk.</li>
            <li>- Subtiele begeleiding, geen stressvolle timer.</li>
            <li>- Gemini analyseert je open antwoorden.</li>
            <li>- Warm, duidelijk advies: webinarserie of advanced aanbod.</li>
          </ul>
          <div className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-ink shadow-sm">
            Tip: beantwoord in je eigen woorden. Concreet en praktijkgericht werkt het best.
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WelcomeScreen;
