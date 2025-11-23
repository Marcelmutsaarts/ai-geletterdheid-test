import Button from './Button';
import ProgressBar from './ProgressBar';
import { selfScanItems } from '../data/selfScan';
import clsx from 'clsx';

interface SelfScanFlowProps {
  currentIndex: number;
  scores: Record<number, number>;
  onSelect: (id: number, value: number) => void;
  onBack: () => void;
  onProceed: () => void;
  isLast: boolean;
  error?: string | null;
}

const ratingLabels = {
  1: 'Beginner',
  2: 'Redelijk',
  3: 'Sterk',
} as const;

const SelfScanFlow = ({
  currentIndex,
  scores,
  onSelect,
  onBack,
  onProceed,
  isLast,
  error,
}: SelfScanFlowProps) => {
  const item = selfScanItems[currentIndex];
  const currentScore = scores[item.id];
  const hasSelection = typeof currentScore === 'number';

  return (
    <section className="space-y-6">
      <ProgressBar current={currentIndex} total={selfScanItems.length} />
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}
      <div className="glass-card rounded-2xl border border-white/80 px-5 py-6 shadow-card sm:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-lightPurpleBg px-3 py-1 text-xs font-semibold text-primaryPurple">
            {item.theme}
          </span>
          <p className="text-xs text-grayText">Kies 1 (beginner) t/m 3 (sterk)</p>
        </div>
        <h2 className="text-xl font-bold text-ink sm:text-2xl">{item.statement}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((value) => {
            const active = currentScore === value;
            return (
              <button
                key={value}
                className={clsx(
                  'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all sm:text-base',
                  active
                    ? 'border-primaryPurple bg-primaryPurple/10 text-ink shadow-sm shadow-primaryPurple/20'
                    : 'border-slate-200 bg-white hover:border-primaryPurple/60 hover:shadow-sm'
                )}
                onClick={() => onSelect(item.id, value)}
                aria-pressed={active}
              >
                {value} — {ratingLabels[value as 1 | 2 | 3]}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack} disabled={currentIndex === 0} className="sm:w-auto">
          Vorige
        </Button>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button onClick={onProceed} disabled={!hasSelection} className="sm:w-auto">
            {isLast ? 'Afronden' : 'Volgende'}
          </Button>
          {!hasSelection && (
            <p className="text-center text-xs text-grayText sm:text-right">
              Kies 1 (beginner), 2 (redelijk) of 3 (sterk).
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SelfScanFlow;
