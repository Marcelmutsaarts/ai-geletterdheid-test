import { motion } from 'framer-motion';
import Button from './Button';

type QuestionFeedback = {
  id: number;
  title: string;
  score: number;
  feedback: string;
  displayLabel?: string;
};

interface ResultsScreenProps {
  totalScore: number;
  recommendation: 'webinar' | 'advanced';
  feedback: QuestionFeedback[];
  mode: 'assessment' | 'selfscan';
  onRestart: () => void;
}

const SpiderChart = ({ feedback }: { feedback: QuestionFeedback[] }) => {
  const size = 260;
  const center = size / 2;
  const radius = size / 2 - 22;
  const total = feedback.length || 1;

  const pointFor = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = radius * Math.max(0, Math.min(1, value));
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const ringPath = (level: number) =>
    feedback
      .map((_, i) => pointFor(level, i))
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x},${p.y}`)
      .join(' ') + ' Z';

  const valuePath =
    feedback
      .map((item, i) => pointFor(item.score, i))
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x},${p.y}`)
      .join(' ') + ' Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm">
      <g stroke="#d9c8ff" fill="none" strokeWidth="1">
        <path d={ringPath(0.5)} />
        <path d={ringPath(1)} />
      </g>
      {feedback.map((item, i) => {
        const end = pointFor(1, i);
        return <line key={item.id} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#e6ddff" strokeWidth="1" />;
      })}
      <path d={valuePath} fill="url(#grad)" stroke="#a15df5" strokeWidth="2" fillOpacity="0.2" />
      {feedback.map((item, i) => {
        const p = pointFor(item.score, i);
        return <circle key={item.id} cx={p.x} cy={p.y} r={5} fill="#a15df5" stroke="#fff" strokeWidth="2" />;
      })}
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#a15df5" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#7947ba" stopOpacity="0.32" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const ResultsScreen = ({ totalScore, recommendation, feedback, mode, onRestart }: ResultsScreenProps) => {
  const advanced = totalScore >= 4 || recommendation === 'advanced';
  const title = advanced ? 'Op naar verdieping!' : 'Aan de slag met de basis';
  const message =
    mode === 'assessment'
      ? advanced
        ? 'Mooi werk. Je AI-analyse laat 4 of meer sterke onderdelen zien. Kijk naar de gevorderde cursus of losse verdiepingsmodules.'
        : 'Je AI-analyse laat 0-3 sterke onderdelen zien. De webinar-serie helpt je snel op alle thema’s op niveau te komen.'
      : advanced
        ? 'Sterke zelfinschatting: 4 of meer thema’s scoor je hoog. Bekijk de gevorderde cursus of losse modules.'
        : 'Je zelfscan laat 0-3 sterke thema’s zien. De webinar-serie geeft je een stevig fundament.';
  const cta = advanced
    ? { text: 'Bekijk gevorderde cursus', href: '/advanced' }
    : { text: 'Volg de webinar-serie', href: 'https://aivoordocenten.nl/webinarserie-ai-in-het-onderwijs/' };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="rounded-3xl bg-white/90 px-6 py-8 shadow-card sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-darkPurple">Advies</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">{title}</h2>
        <p className="mt-3 max-w-3xl text-base text-grayText sm:text-lg">
          {message} Totale score: {totalScore}/7.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button as="a" href={cta.href} target="_blank" rel="noreferrer">
            {cta.text}
          </Button>
          <Button variant="ghost" onClick={onRestart}>
            Doe de check opnieuw
          </Button>
        </div>
      </div>

      <div className="grid gap-6 rounded-3xl bg-lightPurpleBg/60 px-6 py-6 shadow-inner sm:grid-cols-[1.1fr_0.9fr] sm:px-8">
        <div>
          <h3 className="text-lg font-semibold text-ink">Spinnenweb per thema</h3>
          <p className="text-sm text-grayText">1 punt = as volledig gevuld, 0 punt = leeg.</p>
          <div className="mt-4 flex items-center justify-center">
            <SpiderChart feedback={feedback} />
          </div>
        </div>
        <div className="space-y-2 rounded-2xl bg-white/70 p-4 shadow-inner">
          <p className="text-sm font-semibold text-darkPurple">Legenda</p>
          <ul className="space-y-1 text-sm text-grayText">
            {feedback.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>{item.title}</span>
                <span className="rounded-full bg-lightPurpleBg px-2 py-1 text-xs font-semibold text-primaryPurple">
                  {item.displayLabel ?? `Score: ${Math.round(item.score * 100)}%`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="glass-card h-full rounded-2xl border border-white/60 px-4 py-4 shadow-card"
          >
            <p className="text-sm font-semibold text-darkPurple">{item.title}</p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-lightPurpleBg px-3 py-1 text-xs font-semibold text-primaryPurple">
              {item.displayLabel ?? `Score: ${Math.round(item.score * 100)}%`}
            </p>
            <p className="mt-2 text-sm text-grayText">{item.feedback}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default ResultsScreen;
