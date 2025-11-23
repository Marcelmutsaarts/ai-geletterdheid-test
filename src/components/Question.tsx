import type { Question } from '../data/questions';
import clsx from 'clsx';

interface QuestionProps {
  question: Question;
  value?: string;
  onChange: (value: string) => void;
}

const QuestionCard = ({ question, value, onChange }: QuestionProps) => {
  const isMc = question.type === 'mc';

  return (
    <div className="glass-card rounded-2xl border border-white/80 px-5 py-6 shadow-card sm:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-lightPurpleBg px-3 py-1 text-xs font-semibold text-primaryPurple">
          {question.theme}
        </span>
        <p className="text-xs text-grayText">1 minuut per thema</p>
      </div>
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{question.title}</h2>
      <p className="mt-2 text-sm text-grayText sm:text-base">{question.prompt}</p>
      <div className="mt-5 space-y-3">
        {isMc && question.options ? (
          <div className="grid gap-3">
            {question.options.map((option) => {
              const active = value === option.id;
              return (
                <button
                  key={option.id}
                  className={clsx(
                    'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all sm:text-base',
                    active
                      ? 'border-primaryPurple bg-primaryPurple/10 text-ink shadow-sm shadow-primaryPurple/20'
                      : 'border-slate-200 bg-white hover:border-primaryPurple/60 hover:shadow-sm'
                  )}
                  onClick={() => onChange(option.id)}
                  aria-pressed={active}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-ink transition focus:border-primaryPurple sm:text-base"
              rows={4}
              placeholder={question.placeholder}
              value={value ?? ''}
              onChange={(event) => onChange(event.target.value)}
              aria-label={question.prompt}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
