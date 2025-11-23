import { motion } from 'framer-motion';
import type { Question } from '../data/questions';
import Button from './Button';
import ProgressBar from './ProgressBar';
import QuestionCard from './Question';

interface QuestionFlowProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string>;
  onAnswer: (questionId: number, value: string) => void;
  onBack: () => void;
  onProceed: () => void;
  isLast: boolean;
  error?: string | null;
}

const QuestionFlow = ({
  questions,
  currentIndex,
  answers,
  onAnswer,
  onBack,
  onProceed,
  isLast,
  error,
}: QuestionFlowProps) => {
  const current = questions[currentIndex];
  const hasAnswer = Boolean(answers[current.id]?.trim());

  return (
    <motion.section
      key={current.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <ProgressBar current={currentIndex} total={questions.length} />
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}
      <QuestionCard
        question={current}
        value={answers[current.id]}
        onChange={(value) => onAnswer(current.id, value)}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack} disabled={currentIndex === 0} className="sm:w-auto">
          Vorige
        </Button>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            onClick={onProceed}
            disabled={!hasAnswer}
            className="sm:w-auto"
          >
            {isLast ? 'Afronden' : 'Volgende'}
          </Button>
          {!hasAnswer && (
            <p className="text-center text-xs text-grayText sm:text-right">
              Vul een antwoord in om door te gaan.
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default QuestionFlow;
